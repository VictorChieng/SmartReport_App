import 'package:flutter/material.dart';
import 'reset_viewmodel.dart';
class ResetView extends StatelessWidget {
  final ResetViewModel viewModel = ResetViewModel();

  final TextEditingController emailController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF3E5B7A),
      body: SingleChildScrollView(
        child: Center(
          child: Padding(
            padding: EdgeInsets.only(top: 118.0),
            child: Column(
              children: [
                Image.asset(
                  'assets/SmartReportLogo.png',
                  width: 270.0,
                  height: 92.0,
                ),
                SizedBox(height: 8.0),
                Text(
                  'Reset',
                  style: TextStyle(
                    fontSize: 24.0,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 15.0),
                Text(
                  'Reset Password',
                  style: TextStyle(
                    fontSize: 18.0,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 20.0),
                Container(
                  width: 309.0,
                  height: 43.0,
                  decoration: BoxDecoration(
                    color: Color(0xFFEAEAEA),
                    border: Border.all(color: Colors.black),
                  ),
                  child: Row(
                    children: [
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 10.0),
                        child: Icon(
                          Icons.email,
                          color: Color(0xFF757575),
                        ),
                      ),
                      Expanded(
                        child: TextField(
                          controller: emailController,
                          decoration: InputDecoration(
                            hintText: 'Email',
                            hintStyle: TextStyle(
                              color: Color(0xFF757575),
                            ),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 27.0),
                InkWell(
                  onTap: () {
                    Navigator.pushNamed(context, '/login');
                  },
                  child: Text(
                    'I have an account. Click here to sign in',
                    style: TextStyle(
                      fontSize: 18.0,
                      color: Colors.white,
                    ),
                  ),
                ),
                SizedBox(height: 27.0),
                SizedBox(
                  width: 140,
                  child: FloatingActionButton(
                    onPressed: () async {
                      String email = emailController.text;
                      await viewModel.resetPassword(email, context);
                    },
                    backgroundColor: Color(0xFF7DB9B3),
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(5.0),
                    ),
                    child: Text(
                      'Done',
                      style: TextStyle(
                        fontSize: 20.0,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
