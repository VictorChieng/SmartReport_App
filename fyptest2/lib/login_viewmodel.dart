import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:crypto/crypto.dart';
import 'package:fyptest1/home_page.dart';
import 'dart:convert';

import 'login_model.dart';

class LoginViewModel extends ChangeNotifier {
  LoginModel loginModel = LoginModel(email: '', password: '');

  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  void updateEmail(String value) {
    loginModel.email = value;
    notifyListeners();
  }

  void updatePassword(String value) {
    loginModel.password = value;
    notifyListeners();
  }

  String hashPassword(String password) {
    var bytes = utf8.encode(password); // Convert password to bytes
    var hashed = sha256.convert(bytes); // Hash the bytes using SHA-256
    return hashed.toString();
  }

  Future<void> login(BuildContext context) async {
    try {
      String email = loginModel.email.trim();
      String password = loginModel.password.trim();

      if (email.isEmpty || password.isEmpty) {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text('Login Failed'),
              content: Text('Please enter both email and password.'),
              actions: [
                ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context); // Close the dialog
                  },
                  child: Text('OK'),
                ),
              ],
            );
          },
        );
        return;
      }

      UserCredential userCredential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      User? currentUser = userCredential.user;

      if (currentUser != null) {
        loginModel.email = "";
        loginModel.password = "";

        // Successfully logged in
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => HomePage(
              title: 'Home',
              userId: currentUser.uid,
            ),
          ),
        );
      } else {
        // Incorrect email or password
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text('Login Failed'),
              content: Text('Incorrect email or password.'),
              actions: [
                ElevatedButton(
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
    } on FirebaseAuthException catch (e) {
      if (e.code == 'wrong-password') {
        // Incorrect password
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text('Login Failed'),
              content: Text('Incorrect password.'),
              actions: [
                ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context); // Close the dialog
                  },
                  child: Text('OK'),
                ),
              ],
            );
          },
        );
      } else {
        // Other FirebaseAuthException errors
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text('Login Failed'),
              content: Text('An error occurred during login.'),
              actions: [
                ElevatedButton(
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
    } catch (e) {
      print('Error logging in: $e');
    }
  }
}
