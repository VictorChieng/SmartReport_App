import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class NotificationPage extends StatefulWidget {
  const NotificationPage({Key? key}) : super(key: key);

  @override
  State<NotificationPage> createState() => _NotificationPageState();
}

class NotificationModel {
  final String message;
  final DateTime timestamp;

  NotificationModel({
    required this.message,
    required this.timestamp,
  });
}

class _NotificationPageState extends State<NotificationPage> {
  List<NotificationModel> notifications = [];

  // Inside your _NotificationPageState class
  void handleReportSubmission() {
    // Perform report submission logic here

    // After submission, add a notification to the list
    final newNotification = NotificationModel(
      message: 'Report submitted successfully!',
      timestamp: DateTime.now(),
    );

    // Update the notifications list
    setState(() {
      notifications.add(newNotification);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFE9EDF6),
      appBar: AppBar(
        title: Text(
          "Notification",
          style: TextStyle(
            color: Colors.black,
            fontSize: 24,
            fontFamily: "Roboto",
          ),
        ),
        centerTitle: true,
        backgroundColor: Color(0xFF3E5B7A),
      ),
      body: notifications.isEmpty
          ? Center(
        child: Text(
          'No notifications',
          style: TextStyle(
            fontSize: 18,
          ),
        ),
      )
          : ListView.builder(
        itemCount: notifications.length,
        itemBuilder: (BuildContext context, int index) {
          final notification = notifications[index];
          return ListTile(
            title: Text(notification.message),
            subtitle: Text(
              'Received on ${notification.timestamp.toLocal()}',
            ),
          );
        },
      ),
    );
  }
}
