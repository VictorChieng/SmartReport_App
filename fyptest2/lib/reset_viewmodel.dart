import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

// ViewModel class responsible for handling password reset
class ResetViewModel {
  // Function to reset the password for the provided email
  Future<void> resetPassword(String email, BuildContext context) async {
    try {
      // Send a password reset email using FirebaseAuth
      await FirebaseAuth.instance.sendPasswordResetEmail(email: email);
      // Show success dialog upon successful password reset request
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('Password Reset'),
            content: Text('Please check your email to reset your password.'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context); // Close the dialog
                  Navigator.pop(context); // Navigate back to the previous page (login page)
                },
                child: Text('OK'),
              ),
            ],
          );
        },
      );
    } catch (error) {
      print('Error resetting password: $error');
      // Show an error dialog if an error occurs during the password reset process
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('Error'),
            content: Text('An error occurred while resetting your password.'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context); // Close the dialog
                },
                child: Text('OK'),
              ),
            ],
          );
        },
      );
    }
  }
}
