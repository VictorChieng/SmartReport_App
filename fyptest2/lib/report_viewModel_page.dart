import 'dart:convert';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:fyptest1/home_page.dart';
import 'package:fyptest1/report_model.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;  // Add this import for HTTP requests


class ReportViewModel extends ChangeNotifier {

  ReportModel reportModel = ReportModel(date: null, time: null, imageUrls: []);

  Future<void> submitReport(
    ReportModel report,
    BuildContext context,
    String userId

  ) async {
    try {
      // Check if any of the details are missing
      if (report.date == null ||
          report.date?.isEmpty == true ||
          report.time == null ||
          report.time?.isEmpty == true ||
          report.title == null ||
          report.title?.isEmpty == true ||
          report.location == null ||
          report.location?.isEmpty == true ||
          report.emergencyStatus == null ||
          report.category == null ||
          report.userId == null ||
          report.imageUrls == null ||
          report.imageUrls?.isEmpty == true) {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text('Incomplete Details'),
              content: Text('Please enter all details before submitting.'),
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
        return;
      }

      final url = Uri.parse('http://192.168.100.8:3001/submitReport');

      try {
        final response = await http.post(
          url,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'userId': userId,
            'reportId': report.reportId,
            'title': report.title,
            // Add other necessary report data here
          }),
        );

        if (response.statusCode == 200) {
          // Successful response
          print("Report submitted successfully.");
        } else {
          // Handle other status codes or errors
          print("Error: ${response.reasonPhrase}");
        }
      } catch (e) {
        // Handle network or other exceptions
        print("Error: $e");
      }

      // Access the Firestore collection
      final CollectionReference reportsCollection =
          FirebaseFirestore.instance.collection('report_submissions');

      // Convert the report model to a map
      Map<String, dynamic> reportData = report.toMap();

      // Add the report to Firestore
      await reportsCollection.doc(report.reportId).set(reportData);

      // Show a dialog indicating successful submission
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('Submission Successful'),
            content: Text('Report submitted successfully to Firestore.'),
            actions: [
              TextButton(
                child: Text('OK'),
                onPressed: () {
                  reportModel.imageUrls == null;

                  Navigator.pop(context);


                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context)=>HomePage(userId:userId, title: 'Home',),),);
                },
              ),
            ],
          );
        },
      );

      // Notify listeners that the operation is complete
      notifyListeners();
    } catch (error) {
      // Handle any errors that occur during the process
      print('Error submitting report: $error');
    }
  }

  Future<XFile?> uploadImage() async {
    ImagePicker imagePicker = ImagePicker();
    XFile? selectedImage =
        await imagePicker.pickImage(source: ImageSource.camera);
    return selectedImage;
  }
}
