import 'package:flutter/material.dart';
import 'package:fyptest1/CompletedDetailsPage.dart';
import 'package:fyptest1/rating_page.dart';
import 'package:image_picker/image_picker.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';

class CompletedPage extends StatefulWidget {
  final String userId;

  const CompletedPage({Key? key, required this.userId}) : super(key: key);

  @override
  State<CompletedPage> createState() => _CompletedPageState();
}

class _CompletedPageState extends State<CompletedPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFE9EDF6),
      appBar: AppBar(
        title: Text(
          "Completed",
          style: TextStyle(
            color: Colors.black,
            fontSize: 24,
            fontFamily: "Roboto",
          ),
        ),
        centerTitle: true,
        backgroundColor: Color(0xFF3E5B7A),
      ),
      body: Container(
        color: Color(0xFF769EFC),
        child: StreamBuilder(
          stream: FirebaseFirestore.instance
              .collection('report_submissions')
              .where('userId', isEqualTo: widget.userId)
              .where('reportStatus', isEqualTo: "Completed")
              .snapshots(),
          builder: (context, snapshot) {
            if (!snapshot.hasData) {
              return CircularProgressIndicator();
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

              return bDateTime.compareTo(aDateTime);
            });

            // final pendingReportDocuments = reportDocuments.where((document) {
            //   return document['reportStatus'] == 'Pending';
            // }).toList();

            return ListView.builder(
              itemCount: reportDocuments.length,
              itemBuilder: (context, index) {
                final document = reportDocuments[index].data();
                final title = document['title'];
                final category = document['category'];
                final reportStatus = document['reportStatus'];
                final date = document['dateCompleted'];
                final time = document['timeCompleted'];
                final imageUrl = document['imageUrls'][0];


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
                              CompletedDetailsPage(data: document),
                        ),
                      );
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
                                        color: Color(0xFF00B01B),
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
                            bottom: 20,
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
                          Positioned(
                            bottom: 20, // Adjust the position as needed
                            right: 16,
                            child: InkWell(
                              onTap: () {
                                // Navigate to the rating page here
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        RatingPage(data: document),
                                  ),
                                );
                              },
                              child: Container(
                                padding: EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: Colors.orange,
                                  borderRadius: BorderRadius.circular(10.0),
                                  border: Border.all(
                                    color: Colors.orange,
                                    width: 4,
                                  ),
                                ),
                                child: Text(
                                  "Rate",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                  ),
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
