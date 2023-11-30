import 'package:flutter/material.dart';
import 'package:fyptest1/home_page.dart';
import 'package:fyptest1/profile_page.dart';
import 'package:fyptest1/report_model.dart';
import 'package:fyptest1/report_viewModel_page.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'dart:math';

class ReportPage extends StatefulWidget {
  final String userId;

  const ReportPage({Key? key, required this.userId}) : super(key: key);

  @override
  _ReportPageState createState() => _ReportPageState();
}

class _ReportPageState extends State<ReportPage> {
  List<File> selectedImages = [];
  final picker = ImagePicker();
  final FirebaseStorage _storage = FirebaseStorage.instance;

  late ReportViewModel _reportViewModel;
  @override
  void initState() {
    // Initializes the viewModel variable
    super.initState();
    _reportViewModel = ReportViewModel();
  }

  String emergencyStatus = "No"; // Initialize as "No" when the toggle is off

//images
  Future<String?> uploadImageToFirebase(File imageFile) async {
    try {
      String fileName = DateTime.now().millisecondsSinceEpoch.toString();
      final Reference reference = _storage.ref().child('images/$fileName');
      await reference.putFile(imageFile);

      // Get the URL of the uploaded image
      final String imageUrl = await reference.getDownloadURL();

      return imageUrl; // Return the image URL
      // Do something with the imageUrl, such as storing it in a database or displaying it
      print('Image URL: $imageUrl');
    } catch (e) {
      print('Error uploading image: $e');
    }
  }

  Future<void> getImages() async {
    final pickedFiles = await picker.pickMultiImage(
      imageQuality: 100,
      maxHeight: 1000,
      maxWidth: 1000,
    );

    if (pickedFiles == null || pickedFiles.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nothing is selected')),
      );
      return;
    }

    for (var pickedFile in pickedFiles) {
      File imageFile = File(pickedFile.path);
      selectedImages.add(imageFile);
    }

    setState(() {});
  }

  void removeImage(int index) {
    setState(() {
      selectedImages.removeAt(index);
    });
  }

  void submitImagesToFirebase() async {
    // Check for missing fields
    if (selectedDate == null ||
        titleController.text.isEmpty ||
        locationController.text.isEmpty) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('Missing Fields'),
            content: Text('Please fill in all required fields before submitting.'),
            actions: [
              TextButton(
                child: Text('OK'),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        },
      );
    } else {
      // All required fields are filled, proceed to upload images
      List<String> imageUrls = [];
      for (var imageFile in selectedImages) {
        String? imageUrl = await uploadImageToFirebase(imageFile);
        if (imageUrl != null) {
          imageUrls.add(imageUrl);
        }
      }

      // Continue with report submission if image upload was successful
      if (imageUrls.isNotEmpty) {
        String formattedDate = "${selectedDate!.year}-${selectedDate!.month.toString().padLeft(2, '0')}-${selectedDate!.day.toString().padLeft(2, '0')}";
        ReportModel report = ReportModel(
          location: locationController.text,
          category: categoryController.text,
          title: titleController.text,
          desc: descriptionController.text,
          reportId: DateTime.now().millisecondsSinceEpoch.toString(),
          imageUrls: imageUrls,
          userId: widget.userId,
          reportStatus: "Pending",
          emergencyStatus: emergencyStatus,
          date: formattedDate,
          time: selectedTime?.format(context) ?? '',
        );

        await _reportViewModel.submitReport(report, context, widget.userId);
      } else {
        print("Image upload failed");
      }
    }
  }

  // images
  Future<bool> _onWillPop() async {
    final shouldExit = await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Exit App'),
        content: Text('Do you want to cancel this report?'),
        actions: <Widget>[
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text('No'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop(true);
              // Navigate back to home page
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                    builder: (context) => HomePage(
                          title: 'Home',
                          userId: widget.userId,
                        )),
              );
            },
            child: Text('Yes'),
          ),
        ],
      ),
    );

    return shouldExit ?? false;
  }

  int _selectedIndex = 1; // Add this variable to track the selected tab

  void _onItemTapped(int index) {
    // Handle navigation based on the index
    if (index == 0) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
            builder: (context) => HomePage(
                  title: 'Home',
                  userId: widget.userId,
                )),
      );
    } else if (index == 1) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
            builder: (context) => ReportPage(userId: widget.userId)),
      );
    } else if (index == 2) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
            builder: (context) => ProfilePage(userId: widget.userId)),
      );
    }
  }

  DateTime? selectedDate;
  TimeOfDay? selectedTime;
  TextEditingController titleController = TextEditingController();
  TextEditingController locationController = TextEditingController();
  TextEditingController categoryController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
  File? selectedImage; // Add this field to store the selected image.

  List<String> locationSuggestions = [];
  List<String> categorySuggestions = [];

  bool isLocationFieldFocused = false;
  bool isCategoryFieldFocused = false;

  FocusNode locationFocusNode = FocusNode();
  FocusNode categoryFocusNode = FocusNode();

  void getLocationSuggestions(String query) {
    setState(() {
      locationSuggestions = [
        'Room 101',
        'Room 201',
        'Hall',
        'Canteen',
        'Library',
        'Lobby',
      ]
          .where((location) =>
              location.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  void getCategorySuggestions(String query) {
    setState(() {
      categorySuggestions = [
        'Electrical',
        'Water',
        'Structure',
        'Furniture',
      ]
          .where((category) =>
              category.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (picked != null && picked != selectedDate)
      setState(() {
        selectedDate = picked;
      });
  }

  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: selectedTime ?? TimeOfDay.now(),
    );
    if (picked != null && picked != selectedTime)
      setState(() {
        selectedTime = picked;
      });
  }

  // Define a variable to store the current word count
  int currentWordCount = 0;

  int countWords(String text) {
    if (text.isEmpty) {
      return 0;
    }
    final words = text.split(' ');
    return words.length;
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: _onWillPop,
      child: Scaffold(
        backgroundColor: Color(0xFFE9EDF6), // Set the background color here
        appBar: AppBar(
          backgroundColor: Color(0xFF3E5B7A),
          title: Text(
            'Report Page',
            style: TextStyle(
              color: Colors.black, // Set the text color to black
            ),
          ),
          centerTitle: true,
        ),
        body: GestureDetector(
          onTap: () {
            // Dismiss suggestion lists when tapping outside of the text fields
            setState(() {
              isLocationFieldFocused = false;
              isCategoryFieldFocused = false;
            });
          },
          child: Stack(
            children: [
              SingleChildScrollView(
                child: Column(
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Container(
                            height: 84,
                            decoration: BoxDecoration(
                              color: Colors
                                  .white, // Set the background color to white
                              border: Border.all(color: Colors.black),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text(
                                    'Date',
                                    style:
                                        TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                ),
                                Row(
                                  children: [
                                    Expanded(
                                      child: Padding(
                                        padding:
                                            const EdgeInsets.only(left: 8.0),
                                        child: TextFormField(
                                          readOnly: true,
                                          decoration: InputDecoration(
                                            hintText: 'Pick a date',
                                            border: InputBorder.none,
                                          ),
                                          controller: TextEditingController(
                                            text: selectedDate != null
                                                ? "${selectedDate!.toLocal()}"
                                                    .split(' ')[0]
                                                : '',
                                          ),
                                        ),
                                      ),
                                    ),
                                    IconButton(
                                      icon: Icon(Icons.calendar_today),
                                      onPressed: () {
                                        _selectDate(context);
                                      },
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        SizedBox(width: 16),
                        Expanded(
                          child: Container(
                            height: 84,
                            decoration: BoxDecoration(
                              color: Colors
                                  .white, // Set the background color to white
                              border: Border.all(color: Colors.black),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text(
                                    'Time',
                                    style:
                                        TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                ),
                                Row(
                                  children: [
                                    Expanded(
                                      child: Padding(
                                        padding:
                                            const EdgeInsets.only(left: 8.0),
                                        child: TextFormField(
                                          readOnly: true,
                                          decoration: InputDecoration(
                                            hintText: 'Pick a time',
                                            border: InputBorder.none,
                                          ),
                                          controller: TextEditingController(
                                            text: selectedTime != null
                                                ? "${selectedTime!.format(context)}"
                                                : '',
                                          ),
                                        ),
                                      ),
                                    ),
                                    IconButton(
                                      icon: Icon(Icons.access_time),
                                      onPressed: () {
                                        _selectTime(context);
                                      },
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 1),

                    // Location Container
                    Container(
                      height: 50,
                      decoration: BoxDecoration(
                        color:
                            Colors.white, // Set the background color to white
                        border: Border.all(color: Colors.black),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          TextFormField(
                            decoration: InputDecoration(
                              hintText: 'Location',
                              contentPadding: EdgeInsets.only(left: 10),
                              border: InputBorder.none,
                            ),
                            controller: locationController,
                            onChanged: (query) {
                              isLocationFieldFocused = true;
                              getLocationSuggestions(query);
                            },
                            focusNode: locationFocusNode,
                            onTap: () {
                              // Close category suggestions when tapping on location field
                              if (!isLocationFieldFocused) {
                                setState(() {
                                  isCategoryFieldFocused = false;
                                  categorySuggestions = [];
                                });
                              }
                            },
                          ),
                        ],
                      ),
                    ),

                    // Category Container
                    SizedBox(height: 1),
                    Container(
                      height: 50,
                      decoration: BoxDecoration(
                        color:
                            Colors.white, // Set the background color to white
                        border: Border.all(color: Colors.black),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          TextFormField(
                            decoration: InputDecoration(
                              hintText: 'Category',
                              contentPadding: EdgeInsets.only(left: 10),
                              border: InputBorder.none,
                            ),
                            controller: categoryController,
                            onChanged: (query) {
                              isCategoryFieldFocused = true;
                              getCategorySuggestions(query);
                            },
                            focusNode: categoryFocusNode,
                            onTap: () {
                              // Close location suggestions when tapping on category field
                              if (!isCategoryFieldFocused) {
                                setState(() {
                                  isLocationFieldFocused = false;
                                  locationSuggestions = [];
                                });
                              }
                            },
                          ),
                        ],
                      ),
                    ),

                    // Title Container
                    SizedBox(height: 1),
                    Container(
                      height: 50,
                      decoration: BoxDecoration(
                        color:
                            Colors.white, // Set the background color to white
                        border: Border.all(color: Colors.black),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          TextFormField(
                            controller:
                                titleController, // Bind the controller here
                            decoration: InputDecoration(
                              hintText: 'Enter a title',
                              contentPadding: EdgeInsets.only(left: 10),
                              border: InputBorder.none,
                            ),
                            onTap: () {
                              // Close both suggestion lists when tapping on the title field
                              setState(() {
                                isLocationFieldFocused = false;
                                isCategoryFieldFocused = false;
                                locationSuggestions = [];
                                categorySuggestions = [];
                              });
                            },
                          ),
                        ],
                      ),
                    ),

                    // Description Container
                    SizedBox(height: 1),
                    Container(
                      height:
                          80, // Increased the height to accommodate the word count indicator
                      decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border.all(color: Colors.black),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          TextFormField(
                            // Use a TextEditingController to track the input text
                            controller: descriptionController,
                            decoration: InputDecoration(
                              hintText: 'Description',
                              contentPadding: EdgeInsets.only(left: 10),
                              border: InputBorder.none,
                            ),
                            onTap: () {
                              // Close both suggestion lists when tapping on the description field
                              setState(() {
                                isLocationFieldFocused = false;
                                isCategoryFieldFocused = false;
                                locationSuggestions = [];
                                categorySuggestions = [];
                              });
                            },
                            onChanged: (text) {
                              // Check and limit the word count
                              final wordCount = countWords(text);
                              if (wordCount > 100) {
                                // Remove excess words
                                final words = text
                                    .split(RegExp(r'\s+'))
                                    .take(100)
                                    .join(' ');
                                descriptionController.text = words;
                              }

                              // Update the current word count
                              setState(() {
                                currentWordCount = wordCount;
                              });
                            },
                          ),
                          SizedBox(height: 10), // Add some spacing
                          Padding(
                            padding: const EdgeInsets.only(left: 10),
                            child: Text(
                              'Word Count: $currentWordCount/100', // Display the current word count
                              style:
                                  TextStyle(fontSize: 14, color: Colors.grey),
                            ),
                          ),
                        ],
                      ),
                    ),

                    SizedBox(height: 1),
                    ElevatedButton(
                      style: ButtonStyle(
                          backgroundColor:
                              MaterialStateProperty.all(Colors.green)),
                      child: const Text('Select Images from Gallery'),
                      onPressed: () {
                        getImages();
                      },
                    ),

                    Container(
                      height: 100, // Set the desired height
                      decoration: BoxDecoration(
                        color: Colors.white, // White background color
                        border: Border.all(
                          color: Colors.black, // Black border color
                          width: 2.0, // Border width
                        ),
                      ),

                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: selectedImages.length,
                        itemBuilder: (BuildContext context, int index) {
                          return Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Container(
                              width: 100,
                              height: 100,
                              child: Stack(
                                children: [
                                  Image.file(selectedImages[index]),
                                  Positioned(
                                    top: 0,
                                    right: 0,
                                    child: Container(
                                      width: 40,
                                      height: 40,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color:
                                            Colors.red, // Red background color
                                      ),
                                      child: IconButton(
                                        icon: Icon(
                                          Icons.close,
                                          color: Colors
                                              .white, // White 'X' icon color
                                        ),
                                        onPressed: () {
                                          removeImage(index);
                                        },
                                      ),
                                    ),
                                  )
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),

                    SizedBox(height: 1),
                    Container(
                      height: 50,
                      color: Color(0xFF708498), // Background color
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.only(left: 16),
                              child: Text(
                                'Emergency? Will be attended in a prioritized manner.',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.only(right: 16),
                            child: Switch(
                              value: emergencyStatus ==
                                  "Yes", // Check if emergencyStatus is "Yes"
                              onChanged: (newValue) {
                                setState(() {
                                  if (newValue) {
                                    emergencyStatus =
                                        "Yes"; // Set to "Yes" when the toggle is on
                                  } else {
                                    emergencyStatus =
                                        "No"; // Set to "No" when the toggle is off
                                  }
                                });
                              },
                              activeTrackColor: Colors.white,
                              activeColor: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: 10),
                    SizedBox(
                      width: 150,
                      child: FloatingActionButton(
                        onPressed: () {
                          // Call the submitImagesToFirebase function
                          submitImagesToFirebase();

                          // Navigate back to the homepage
                          //MaterialPageRoute(builder: (context) => HomePage(userId: widget.userId, title: '',),);
                        },
                        backgroundColor: Color(0xFFFF705A),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(5.0),
                        ),
                        child: Text(
                          'Submit',
                          style: TextStyle(
                            fontSize: 20,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // ListView for category suggestions
              if (categorySuggestions.isNotEmpty && isCategoryFieldFocused)
                Positioned(
                  top: 134,
                  left: 150,
                  right: 10,
                  child: Container(
                    height: 202, // Adjust the height as needed
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: Colors.black),
                    ),
                    child: ListView.builder(
                      itemCount: categorySuggestions.length,
                      itemBuilder: (context, index) {
                        return ListTile(
                          title: Text(categorySuggestions[index]),
                          onTap: () {
                            categoryController.text =
                                categorySuggestions[index];
                            setState(() {
                              categorySuggestions = [];
                            });
                          },
                        );
                      },
                    ),
                  ),
                ),

              // ListView for location suggestions
              if (locationSuggestions.isNotEmpty && isLocationFieldFocused)
                Positioned(
                  top: 85,
                  left: 150,
                  right: 10,
                  child: Container(
                    height: 202, // Adjust the height as needed
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: Colors.black),
                    ),
                    child: ListView.builder(
                      itemCount: locationSuggestions.length,
                      itemBuilder: (context, index) {
                        return ListTile(
                          title: Text(locationSuggestions[index]),
                          onTap: () {
                            locationController.text =
                                locationSuggestions[index];
                            setState(() {
                              locationSuggestions = [];
                            });
                          },
                        );
                      },
                    ),
                  ),
                ),
            ],
          ),
        ),

        // Bottom navigation bar
        bottomNavigationBar: BottomNavigationBar(
          selectedItemColor: Colors.blue,
          // Set selected icon color to blue
          unselectedItemColor: Colors.black,
          // Set unselected icon color to black
          currentIndex: _selectedIndex,
          items: [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: "Home",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.report_problem),
              label: "Report",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: "Profile",
            ),
          ],
          onTap: _onItemTapped,
        ),
      ),
    );
  }
}
