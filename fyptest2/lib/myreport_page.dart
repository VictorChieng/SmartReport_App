import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:fyptest1/completed_page.dart';
import 'package:fyptest1/inprogress_page.dart';
import 'package:fyptest1/main.dart';
import 'package:fyptest1/pending_page.dart';
import 'package:fyptest1/reportdetails_page.dart';
import 'package:intl/intl.dart';


class MyReportPage extends StatefulWidget {
  final String userId;

  const MyReportPage({Key? key, required this.userId}) : super(key: key);

  @override
  _MyReportPageState createState() => _MyReportPageState();
}
//State state for My Report page
class _MyReportPageState extends State<MyReportPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFE9EDF6), // Set the background color here
      appBar: AppBar(
        backgroundColor: Color(0xFF3E5B7A),
        actions: [
          PopupMenuButton<String>(
            onSelected: (selectedOption) {
              // Navigate to a relevant page based on the selected option
              if (selectedOption == 'Pending') {
                // Navigate to the "Pending" page
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => PendingPage(userId: widget.userId),
                  ),
                );
              } else if (selectedOption == 'In Progress') {
                // Navigate to the "In Progress" page
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => InProgressPage(userId: widget.userId),
                  ),
                );
              } else if (selectedOption == 'Completed') {
                // Navigate to the "Completed" page
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => CompletedPage(userId: widget.userId),
                  ),
                );
              }
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              PopupMenuItem<String>(
                value: 'Pending',
                child: Text('Pending'),
              ),
              PopupMenuItem<String>(
                value: 'In Progress',
                child: Text('In Progress'),
              ),
              PopupMenuItem<String>(
                value: 'Completed',
                child: Text('Completed'),
              ),
            ],
          )
        ],
        title: Text(
          "My Reports",
          style: TextStyle(
            color: Colors.black,
            fontSize: 24,
            fontFamily: "Roboto",
          ),
        ),
        centerTitle: true, // Center the title horizontally
      ),
      body: Container(
        color: Color(0xFFE9EDF6), // Set the background color here
        child: StreamBuilder(
          stream: FirebaseFirestore.instance
              .collection('report_submissions')
              .where('userId', isEqualTo: widget.userId, )
              .where('reportStatus', whereIn: ['Pending', 'In Progress', 'Completed'])
          // .where('reportStatus', isNotEqualTo: 'Rated')
              // .where('reportStatus', isNotEqualTo: 'Completed by agent')
              .snapshots(),
          builder: (context, snapshot) {
            if (!snapshot.hasData) {
              return CircularProgressIndicator(); // Loading indicator while data is being fetched.
            }
            if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
              return Center(
                child: Text('No subjects available! ${widget.userId}'),
              );
            }

            final reportDocuments = snapshot.data!.docs;

            reportDocuments.sort((a, b) {
              final aDate = a['date'];
              final aTime = a['time'];
              final bDate = b['date'];
              final bTime = b['time'];

              final dateFormatter = DateFormat('yyyy-MM-dd');
              final timeFormatter = DateFormat('h:mm a');

              final aDateDateTime = dateFormatter.parse(aDate);
              final aTimeDateTime = timeFormatter.parse(aTime);
              final bDateDateTime = dateFormatter.parse(bDate);
              final bTimeDateTime = timeFormatter.parse(bTime);

              // Combine date and time into DateTime objects
              final aDateTime = DateTime(
                aDateDateTime.year,
                aDateDateTime.month,
                aDateDateTime.day,
                aTimeDateTime.hour,
                aTimeDateTime.minute,
              );

              final bDateTime = DateTime(
                bDateDateTime.year,
                bDateDateTime.month,
                bDateDateTime.day,
                bTimeDateTime.hour,
                bTimeDateTime.minute,
              );

              // Sort in descending order (latest to oldest)
              return bDateTime.compareTo(aDateTime);
            });
            return ListView.builder(
              itemCount: reportDocuments.length,
              itemBuilder: (context, index) {
                // Extract the relevant fields from the document
                final document = reportDocuments[index].data();
                final title = document['title'];
                final category = document['category'];
                final reportStatus = document['reportStatus'];
                final date = document['date'];
                final time = document['time'];
                final imageUrl = document['imageUrls']
                    [0]; //  the first image URL

                final dateTimeFormatter = DateFormat('yyyy-MM-dd h:mm a');
                final reportDateTime = dateTimeFormatter.parse('$date $time');

                return Container(
                  width: 390,
                  height: 250.6,
                  child: GestureDetector(
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) =>
                                  ReportDetailsPage(data: document,)));
                    },
                    child: Card(
                      child: Stack(
                        children: [
                          Padding(
                            padding: EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      title,
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      reportStatus,
                                      style: TextStyle(
                                        color: Colors.green,
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(height: 8),
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      category,
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      '$date $time',
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
                                  image: NetworkImage(imageUrl),
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },

            );

          },
        ),
      ),
    );
  }
}
