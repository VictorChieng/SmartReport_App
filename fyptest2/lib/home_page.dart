import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:fyptest1/myreport_page.dart';
import 'package:fyptest1/notification_page.dart';
import 'package:fyptest1/profile_page.dart';
import 'package:fyptest1/report_page.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class HomePage extends StatefulWidget {
  final String title;
  final String userId;

  const HomePage({Key? key, required this.title, required this.userId})
      : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int pendingCount = 0;
  int inProgressCount = 0;
  int completedCount = 0;
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    FirebaseFirestore.instance
        .collection('report_submissions')
        .where('userId', isEqualTo: widget.userId)
        .get()
        .then((QuerySnapshot snapshot) {
      snapshot.docs.forEach((DocumentSnapshot document) {
        final reportStatus = document['reportStatus'];
        if (reportStatus == 'Pending') {
          setState(() {
            pendingCount++;
          });
        } else if (reportStatus == 'In Progress') {
          setState(() {
            inProgressCount++;
          });
        } else if (reportStatus == 'Completed') {
          setState(() {
            completedCount++;
          });
        }
      });
    });
  }

  void _onItemTapped(int index) {
    if (index == 0) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
            builder: (context) => HomePage(
              title: 'Home',
              userId: widget.userId,
            )),
      );
    } else if (index == 1) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => ReportPage(userId: widget.userId)),
      );
    } else if (index == 2) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => ProfilePage(userId: widget.userId)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: _onWillPop,
      child: Scaffold(
        backgroundColor: Color(0xFFE9EDF6),
        appBar: AppBar(
          backgroundColor: Color(0xFF3E5B7A),
          title: Text(
            'Home',
            style: TextStyle(
              color: Colors.black,
              fontSize: 24,
              fontFamily: "Roboto",
            ),
          ),
          centerTitle: true,
          automaticallyImplyLeading: false,
        ),
        body: Stack(
          children: <Widget>[
            Positioned(
              top: 10,
              left: 10,
              child: Text(
                "My Reports status",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            Positioned(
              top: 10,
              right: 11,
              child: InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => MyReportPage(userId: widget.userId)),
                  );
                },
                child: Container(
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Color(0xFF463FD6),
                    borderRadius: BorderRadius.circular(5),
                  ),
                  child: Text(
                    "View All Reports",
                    style: TextStyle(
                      fontSize: 14,
                      fontFamily: "InriaSans",
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              top: 70,
              left: 0,
              right: 0, // Center horizontally
              child: Center(
                child: Card(
                  color: Colors.green, // Color for Pending reports
                  elevation: 5,
                  child: Padding(
                    padding: const EdgeInsets.all(10.0),
                    child: Column(
                      children: <Widget>[
                        Text(
                          "Pending Reports",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          "$pendingCount",
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            Positioned(
              top: 240,
              left: 0,
              right: 0, // Center horizontally
              child: Center(
                child: Card(
                  color: Colors.orange, // Color for In Progress reports
                  elevation: 5,
                  child: Padding(
                    padding: const EdgeInsets.all(10.0),
                    child: Column(
                      children: <Widget>[
                        Text(
                          "In Progress",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          "$inProgressCount",
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            Positioned(
              top: 400,
              left: 0,
              right: 0, // Center horizontally
              child: Center(
                child: Card(
                  color: Colors.blue, // Color for Completed reports
                  elevation: 5,
                  child: Padding(
                    padding: const EdgeInsets.all(10.0),
                    child: Column(
                      children: <Widget>[
                        Text(
                          "Completed Reports",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          "$completedCount",
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

          ],
        ),
        bottomNavigationBar: BottomNavigationBar(
          selectedItemColor: Colors.blue,
          unselectedItemColor: Colors.black,
          currentIndex: _selectedIndex,
          items: [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: "Home",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.report_problem),
              label: "Report",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: "Profile",
            ),
          ],
          onTap: _onItemTapped,
        ),
      ),
    );
  }

  Future<bool> _onWillPop() async {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Logout'),
        content: Text('Do you want to logout ?'),
        actions: <Widget>[
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text('No'),
          ),
          ElevatedButton(
            onPressed: () async {
              await FirebaseAuth.instance.signOut(); // Sign out the user
              Navigator.of(context).pop(true);

            },
            child: Text('Yes'),
          ),
        ],
      ),
    ).then((value) => value ?? false);
  }
}
