import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:fyptest1/home_page.dart';
import 'package:fyptest1/report_page.dart';
import 'package:fyptest1/setting_page.dart';
import 'package:fyptest1/pending_page.dart';
import 'package:fyptest1/inprogress_page.dart';
import 'package:fyptest1/completed_page.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fyptest1/profilepic.dart';

class ProfilePage extends StatefulWidget {
  final String userId;
  const ProfilePage({Key? key, required this.userId}) : super(key: key);
  @override
  _ProfilePageState createState() => _ProfilePageState();
}
class _ProfilePageState extends State<ProfilePage> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  String? userUserId;
  String? phoneNumber;
  String? email;
  String? department;
  String? userName;
  String? userProfileImageUrl; //  user profile image URL

  @override
  void initState() {
    super.initState();
    _fetchUserData();// Fetch user data when the widget initializes
  }
  // Fetch user data from Firestore
  Future<void> _fetchUserData() async {
    try {
      DocumentSnapshot userSnapshot =
          await _firestore.collection('users').doc(widget.userId).get();
      Map<String, dynamic> userData =
          userSnapshot.data() as Map<String, dynamic>;
      setState(() {
        phoneNumber = userData['phoneNumber'];
        email = userData['email'];
        department = userData['department'];
        userName = userData['name'];
        userProfileImageUrl =
            userData['profileImageUrl']; // Fetch user profile image URL
      });
    } catch (e) {
      print('Error fetching user data: $e');
    }
  }

  // Build user details as a column
  Widget _buildUserDetail(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 16,
          ),
        ),
        SizedBox(height: 8),
      ],
    );
  }

  // Build user profile header with profile picture
  Widget _buildProfileHeader() {
    return Column(
      children: [
        Center(
          child: Stack(
            alignment: Alignment.bottomRight,
            children: [
              userProfileImageUrl != null
                  ? CircleAvatar(
                      radius: 50,
                      backgroundImage: NetworkImage(userProfileImageUrl ??
                          'https://example.com/placeholder.jpg'),
                    )
                  : CircleAvatar(
                      radius: 50,
                      // provide a default placeholder image here
                      backgroundColor: Colors.grey,
                      child: Icon(Icons.person, size: 60, color: Colors.white),
                    ),
              Positioned(
                bottom: 0,
                right: 0,
                child: GestureDetector(
                  onTap: () {
                    ImageHandler(userId: widget.userId).selectAndUploadImage();
                  },
                  child: Container(
                    width: 30, // Adjust the width to preference
                    height: 30, // Adjust the height to preference
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.blue,
                    ),
                    child: Center(
                      child: Icon(
                        Icons.edit,
                        color: Colors.white,
                        size: 16, // Adjust the size of the edit icon
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        SizedBox(height: 8),
        Text(
          userName ?? 'Loading...',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        Divider(
          color: Colors.grey, // To customize the color of the line
          thickness: 2, // Adjust the thickness of the line
        ),
      ],
    );
  }

  // Build clickable card for navigation
  Widget _buildClickableCard(
      BuildContext context, IconData icon, String text, Widget pageToNavigate) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => pageToNavigate),
        );
      },
      child: Card(
        elevation: 3,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: Container(
          width: 80,
          height: 80,
          padding: EdgeInsets.all(8),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 32),
              SizedBox(height: 4),
              Expanded(
                child: Text(
                  text,
                  style: TextStyle(fontSize: 12),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Handle the user pressing the back button
  Future<bool> _onWillPop() async {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Logout'),
        content: Text('Do you want to logout?'),
        actions: <Widget>[
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text('No'),
          ),
          ElevatedButton(
            onPressed: () async {
              await FirebaseAuth.instance.signOut(); // Sign out the user
              Navigator.of(context)
                  .pop(true); // Close the dialog and return true
            },
            child: Text('Yes'),
          ),
        ],
      ),
    ).then((value) => value ?? false);
  }

  Future<void> _refreshProfileData() async {
    await _fetchUserData(); // Fetch user data when pulled to refresh
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
            'Profile',
            style: TextStyle(
              color: Colors.black,
            ),
          ),
          centerTitle: true,
          automaticallyImplyLeading: false,
          actions: [
            IconButton(
              icon: Icon(Icons.settings),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => SettingPage(userId: widget.userId),
                  ),
                );
              },
            ),
          ],
        ),
        body: RefreshIndicator(
          onRefresh: _refreshProfileData,
          child: ListView(
            children: [
              Container(
                width: double.infinity,
                child: Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  color: Colors.white,
                  elevation: 3,
                  margin: EdgeInsets.all(16),
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildProfileHeader(),
                        _buildUserDetail('User Id', widget.userId),
                        _buildUserDetail(
                            'Phone Number', phoneNumber ?? 'loading..'),
                        _buildUserDetail('Email', email ?? 'loading..'),
                        _buildUserDetail(
                            'Department', department ?? 'loading..'),
                      ],
                    ),
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildClickableCard(
                    context,
                    Icons.pending_actions,
                    'Pending',
                    PendingPage(userId: widget.userId),
                  ),
                  _buildClickableCard(
                    context,
                    Icons.construction,
                    'In Progress',
                    InProgressPage(userId: widget.userId),
                  ),
                  _buildClickableCard(
                    context,
                    Icons.task_alt,
                    'Completed',
                    CompletedPage(userId: widget.userId),
                  ),
                ],
              ),
            ],
          ),
        ),
        bottomNavigationBar: BottomNavigationBar(
          selectedItemColor: Colors.blue,
          unselectedItemColor: Colors.black,
          currentIndex: 2,
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
          onTap: (index) {
            if (index == 0)
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => HomePage(
                    title: 'Home',
                    userId: widget.userId,
                  ),
                ),
              );
            else if (index == 1)
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => ReportPage(userId: widget.userId),
                ),
              );
            else if (index == 2) {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => ProfilePage(userId: widget.userId),
                ),
              );
            }
          },
        ),
      ),
    );
  }
}
