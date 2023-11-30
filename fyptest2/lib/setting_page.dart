import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:fyptest1/login_page_view.dart';
import 'changepassword_page.dart';

// SettingPage StatefulWidget class
class SettingPage extends StatefulWidget {
  final String userId;

  const SettingPage({Key? key, required this.userId}) : super(key: key);

  @override
  _SettingPageState createState() => _SettingPageState();
}
// Function to handle the logout process
void LogOut(BuildContext context) async {
  await FirebaseAuth.instance.signOut();
  Navigator.pop(context);
  Navigator.pop(context);
}
// State class for the SettingPagex
class _SettingPageState extends State<SettingPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFE9EDF6),
      appBar: AppBar(
        backgroundColor: Color(0xFF3E5B7A),
        title: Text(
          "Setting",
          style: TextStyle(
            color: Colors.black,
            fontSize: 24,
            fontFamily: "Roboto",
          ),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          SizedBox(height: 4),
          buildSettingItem(context, "Change my Password", ChangePasswordPage(userId: widget.userId,)),
          SizedBox(height: 4),
          buildSettingItem(context, "Logout", LoginPageView()),
        ],
      ),
    );
  }
  // Widget to build individual setting items
  Widget buildSettingItem(BuildContext context, String text, Widget nextPage) {
    return GestureDetector(
      onTap: () {
        if (text == "Logout") {
          // Use Navigator.pushReplacement for the Logout button
          LogOut(context);


        } else {
          // Use Navigator.push for other settings items
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => nextPage),
          );
        }
      },
      child: Container(
        width: 390,
        height: 90.6,
        child: Card(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10.0),
          ),
          color: Colors.white,
          elevation: 3,
          margin: EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Padding(
                padding: EdgeInsets.all(16),
                child: Text(
                  text,
                  style: TextStyle(
                    fontFamily: "InriaSans",
                    fontSize: 18,
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsets.only(right: 16),
                child: Icon(
                  Icons.arrow_forward_ios,
                  color: Colors.black,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
