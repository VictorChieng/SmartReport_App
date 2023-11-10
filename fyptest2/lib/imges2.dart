// import 'dart:io';
//
// import 'package:flutter/foundation.dart';
// import 'package:flutter/material.dart';
// import 'package:image_picker/image_picker.dart';
// import 'package:firebase_core/firebase_core.dart';
// import 'package:firebase_storage/firebase_storage.dart';
//
// class MyApp extends StatelessWidget {
//   const MyApp({Key? key}) : super(key: key);
//
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       theme: ThemeData(primaryColor: Colors.green),
//       home: const MultipleImageSelector(),
//       debugShowCheckedModeBanner: false,
//     );
//   }
// }
//
// class MultipleImageSelector extends StatefulWidget {
//   const MultipleImageSelector({Key? key}) : super(key: key);
//
//   @override
//   State<MultipleImageSelector> createState() => _MultipleImageSelectorState();
// }
//
// class _MultipleImageSelectorState extends State<MultipleImageSelector> {
//   List<File> selectedImages = [];
//   final picker = ImagePicker();
//   final FirebaseStorage _storage = FirebaseStorage.instance;
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Multiple Images Select'),
//         backgroundColor: Colors.green,
//       ),
//       body: Center(
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             const SizedBox(height: 20),
//             ElevatedButton(
//               style: ButtonStyle(
//                   backgroundColor: MaterialStateProperty.all(Colors.green)),
//               child: const Text('Select Image from Gallery and Camera'),
//               onPressed: () {
//                 getImages();
//               },
//             ),
//             const Padding(
//               padding: EdgeInsets.symmetric(vertical: 18.0),
//               child: Text(
//                 "GFG",
//                 textScaleFactor: 3,
//                 style: TextStyle(color: Colors.green),
//               ),
//             ),
//             Expanded(
//                 child: ListView.builder(
//               scrollDirection: Axis.horizontal,
//               itemCount: selectedImages.length,
//               itemBuilder: (BuildContext context, int index) {
//                 return Padding(
//                   padding: const EdgeInsets.all(8.0),
//                   child: Container(
//                     width: 100,
//                     height: 100,
//                     child: Stack(
//                       children: [
//                         Image.file(selectedImages[index]),
//                         Positioned(
//                           top: 0,
//                           right: 0,
//                           child: Container(
//                             width: 40,
//                             height: 40,
//                             decoration: BoxDecoration(
//                               shape: BoxShape.circle,
//                               color: Colors.red, // Red background color
//                             ),
//                             child: IconButton(
//                               icon: Icon(
//                                 Icons.close,
//                                 color: Colors.white, // White 'X' icon color
//                               ),
//                               onPressed: () {
//                                 removeImage(index);
//                               },
//                             ),
//                           ),
//                         )
//                       ],
//                     ),
//                   ),
//                 );
//               },
//             )),
//             ElevatedButton(
//               style: ButtonStyle(
//                   backgroundColor: MaterialStateProperty.all(Colors.green)),
//               child: const Text('Submit to Firebase'),
//               onPressed: () {
//                 submitImagesToFirebase();
//               },
//             ),
//           ],
//         ),
//       ),
//     );
//   }
//
//   Future<void> uploadImageToFirebase(File imageFile) async {
//     try {
//       String fileName = DateTime.now().millisecondsSinceEpoch.toString();
//       final Reference reference = _storage.ref().child('images/$fileName');
//       await reference.putFile(imageFile);
//
//       // Get the URL of the uploaded image
//       final String imageUrl = await reference.getDownloadURL();
//
//       // Do something with the imageUrl, such as storing it in a database or displaying it
//       print('Image URL: $imageUrl');
//     } catch (e) {
//       print('Error uploading image: $e');
//     }
//   }
//
//   Future<void> getImages() async {
//     final pickedFiles = await picker.pickMultiImage(
//       imageQuality: 100,
//       maxHeight: 1000,
//       maxWidth: 1000,
//     );
//
//     if (pickedFiles == null || pickedFiles.isEmpty) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(content: Text('Nothing is selected')),
//       );
//       return;
//     }
//
//     for (var pickedFile in pickedFiles) {
//       File imageFile = File(pickedFile.path);
//       selectedImages.add(imageFile);
//     }
//
//     setState(() {});
//   }
//
//   void removeImage(int index) {
//     setState(() {
//       selectedImages.removeAt(index);
//     });
//   }
//
//   void submitImagesToFirebase() {
//     for (var imageFile in selectedImages) {
//       // Upload each image to Firebase Storage
//       uploadImageToFirebase(imageFile);
//     }
//   }
// }
