import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:fyptest1/report_page.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RatingPage extends StatefulWidget {
  final Map<String, dynamic> data;

  const RatingPage({Key? key, required this.data}) : super(key: key);

  @override
  State<RatingPage> createState() => _RatingPageState();
}

class _RatingPageState extends State<RatingPage> {
  final TextEditingController feedbackController = TextEditingController();
  int wordCount = 0;
  String feedback = "";
  double rating = 0;

  final CollectionReference reportSubmissionsCollection =
  FirebaseFirestore.instance.collection('report_submissions');

  // Method to submit the rating and handle the flow based on the rating value
  Future<void> submitRating() async {
    if (rating == 0) {
      // Show an alert dialog if the rating is null
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text("Please provide a star rating to submit."),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: Text("OK"),
              ),
            ],
          );
        },
      );
    } else {
      // Construct the data to update in Firestore
      final Map<String, dynamic> dataToUpdate = {
        'serviceFeedback': feedback,
        'Rating': rating,
        'reportStatus': 'Rated',
      };
      // Print the rating for debugging
      print("Rating: $rating");

      // URL for external server to handle additional rating submission logic
      final url = Uri.parse('http://192.168.218.106:3001/submitRating'); //192.168.100.8, 192.168.114.106

      try {
        // Send a POST request to the external server with report-related data
        final response = await http.post(
          url,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'userId': widget.data['userId'],
            'reportId': widget.data['reportId'],
            'title': widget.data['title'],
            // Add other necessary report data here
          }),
        );
        // Check if the response status code is successful (200)
        if (response.statusCode == 200) {
          // Successful response
          print("Rating submitted successfully.");
        } else {
          // Handle other status codes or errors
          print("Error: ${response.reasonPhrase}");
        }
      } catch (e) {
        // Handle network or other exceptions
        print("Error: $e");
      }

      try {
        // Update the document in Firestore with the new rating data
        await reportSubmissionsCollection
            .doc(widget.data['reportId'])
            .set(dataToUpdate, SetOptions(merge: true));
        print("Document updated successfully.");
      } catch (e) {
        print("Error updating document: $e");
      }

      // Show different dialogs based on the submitted rating
      if (rating >= 3.0) {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text("Thanks for your rating!"),
              content: Text("We appreciate your feedback."),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  child: Text("OK"),
                ),
              ],
            );
          },
        );
      } else {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text("Your Low Rating Has Our Full Attention"),
              content: Text("Would you like to resubmit a new report?"),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                    Navigator.pop(
                        context); // Close the current RatingPage// Close the current RatingPage
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            ReportPage(userId: widget.data['userId']),
                      ),
                    );
                  },
                  child: Text("Yes"),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  child: Text("No"),
                ),
              ],
            );
          },
        );
      }
    }
  }

  @override
  void dispose() {
    feedbackController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFF3E5B7A),
        title: Text(
          "Service Rating",
          style: TextStyle(
            color: Colors.black,
            fontSize: 24,
            fontFamily: "Roboto",
          ),
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: <Widget>[
          Positioned(
            top: 10,
            left: 16,
            right: 16,
            child: Container(
              width: 390,
              height: 250.6,
              child: Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
                color: Colors.white,
                elevation: 3,
                child: Stack(
                  children: [
                    Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                "${widget.data['title']}",
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                "${widget.data['reportStatus']}",
                                style: TextStyle(
                                  color: Colors.green,
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                "${widget.data['category']}",
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                "${widget.data['dateCompleted']} ${widget.data['timeCompleted']}",
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Positioned(
                      bottom: 16,
                      right: 16,
                      child: Container(
                        width: 326,
                        height: 127.28,
                        decoration: BoxDecoration(
                          color: Colors.grey,
                          borderRadius: BorderRadius.circular(10),
                          image: DecorationImage(
                            image: NetworkImage(widget.data['imageUrls'][0]),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            top: 220,
            left: 16,
            right: 16,
            child: SizedBox(
              height: 10,
            ),
          ),
          Positioned(
            top: 230,
            left: 16,
            right: 16,
            child: Card(
              elevation: 4,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    TextFormField(
                      controller: feedbackController,
                      decoration: InputDecoration(
                        hintText: "Write your feedback/review (optional)",
                        border: OutlineInputBorder(),
                      ),
                      maxLines: 3,
                      onChanged: (value) {
                        setState(() {
                          feedback = value;
                          wordCount = value.split(' ').length;
                        });
                      },
                    ),
                    Text(
                      '$wordCount words',
                      style: TextStyle(
                        color: Colors.grey,
                      ),
                    ),

                    // Add the RatingBar.builder here
                    RatingBar.builder(
                      // Remove initialRating property
                      minRating: 1,
                      direction: Axis.horizontal,
                      allowHalfRating: true,
                      itemCount: 5,
                      itemPadding: EdgeInsets.symmetric(horizontal: 4.0),
                      itemBuilder: (context, _) => Icon(
                        Icons.star,
                        color: Colors.amber,
                      ),
                      onRatingUpdate: (newRating) {
                        setState(() {
                          rating =
                              newRating; // Update the rating when the user interacts with the RatingBar
                        });
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            top: 450, // Adjust the position as needed
            left: 16,
            right: 16,
            child: ElevatedButton(
              onPressed: submitRating,
              style: ElevatedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(
                      10), // Adjust the border radius as needed
                ),
                backgroundColor:
                Color(0xFFFF705A), // Set the background color to orange
              ),
              child: Text(
                "Submit",
                style: TextStyle(
                  fontSize: 20, // Adjust the font size as needed
                  color: Colors
                      .white, // Set the text color to white for better visibility
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
