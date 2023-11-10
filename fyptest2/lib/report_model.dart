
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:fyptest1/report_page.dart';


class ReportModel {
  String? title;
  String? desc;
  String? location;
  String? category;
  String? reportId;
  List<String> imageUrls = [];
  String? userId;
  String? reportStatus;
  String? date;
  String? time;
  String? emergencyStatus;
  String? formattedDate;

  ReportModel({
    this.title,
    this.desc,
    this.location,
    this.category,
    this.reportId,
    required this.imageUrls,
    this.userId,
    this.reportStatus,
    this.emergencyStatus,
    this.date,
    this.formattedDate,
    this.time,
  });

  Map<String, dynamic> toMap() {
    return {
      'date': date,
      'time': time,
      'title': title,
      'desc': desc,
      'location': location,
      'category': category,
      'reportId': reportId,
      'imageUrls' : imageUrls,
      'userId' : userId,
      'reportStatus' : reportStatus,
      'emergencyStatus' : emergencyStatus
    };
  }

  factory ReportModel.fromSnapshot(DocumentSnapshot snapshot) {
    final data = snapshot.data() as Map<String, dynamic>;
    return ReportModel(
      date: data['date'],
      time: data['time'],
      title: data['title'],
      desc: data['desc'],
      location: data['location'],
      category: data['category'],
      reportId: data['reportId'],
      imageUrls: List<String>.from(['imageUrls']),
      userId: data['userId'],
      reportStatus: data['reportStatus'],
      emergencyStatus: data['emergencyStatus']
    );
  }
}