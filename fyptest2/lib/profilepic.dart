import 'package:image_picker/image_picker.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'dart:io';

// Class to handle image selection and upload for user profile
class ImageHandler {
  final String userId;
  // Constructor that requires the userId
  ImageHandler({required this.userId});

  // Method to select an image from the gallery and upload it to Firebase Storage
  Future<void> selectAndUploadImage() async {
    final picker = ImagePicker();
    // Pick an image from the gallery
    final pickedFile = await picker.getImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      String imagePath = pickedFile.path;
      File imageFile = File(imagePath);

      // Once confirmed, upload the image to Firebase Storage
      Reference storageReference = FirebaseStorage.instance
          .ref()
          .child('profile_images/$userId.jpg');

      // Upload the image file
      UploadTask uploadTask = storageReference.putFile(imageFile);

      // Wait for the upload to complete
      await uploadTask.whenComplete(() async {
        // Get the URL of the uploaded image
        String imageUrl = await storageReference.getDownloadURL();

        // Update the user's profileImageUrl in Firestore
        await FirebaseFirestore.instance
            .collection('users')
            .doc(userId)
            .update({'profileImageUrl': imageUrl});
      });
    }
  }
}
