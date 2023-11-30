import 'package:flutter/material.dart';
import 'package:fyptest1/home_page.dart';
import 'package:fyptest1/main.dart';
import 'login_viewmodel.dart';

class LoginPageView extends StatefulWidget {
  @override
  State<LoginPageView> createState() => _LoginPageViewState();
}

class _LoginPageViewState extends State<LoginPageView> {
  // Create an instance of LoginViewModel to manage login-related functionality
  final LoginViewModel viewModel = LoginViewModel();
  // Controllers for handling user input in email and password fields
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  @override
  void initState() {
    // Initializes the viewModel variable
    super.initState();

  }

  @override
  void dispose() {
    // Clean up the controllers when the widget is disposed.
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF3E5B7A),
      body: Center(
        child: Padding(
          padding: EdgeInsets.only(top: 0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                'assets/SmartReportLogo.png',
                width: 270.0,
                height: 92.0,
              ),
              SizedBox(height: 63.0),
              Text(
                'Sign in to your account',
                style: TextStyle(
                  fontSize: 20,
                  color: Colors.white,
                ),
              ),
              SizedBox(height: 35.0),
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
                       onChanged: (value) => viewModel.updateEmail(value),
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
              SizedBox(height: 15.0),
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
                        Icons.lock,
                        color: Color(0xFF757575),
                      ),
                    ),
                    Expanded(
                      child: TextField(
                        controller: passwordController,
                       onChanged: (value) => viewModel.updatePassword(value),
                        decoration: InputDecoration(
                          hintText: 'Password',
                          hintStyle: TextStyle(
                            color: Color(0xFF757575),
                          ),
                          border: InputBorder.none,
                        ),
                        obscureText: true,
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 15.0),
              SizedBox(
                width: 150,
                child: FloatingActionButton(
                  onPressed: () {
                    String email = viewModel.loginModel.email;
                    String password = viewModel.loginModel.password;
                    emailController.clear();
                    passwordController.clear();
                    viewModel.login(context);
                  },
                  backgroundColor: Color(0xFF7DB9B3),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5.0),
                  ),
                  child: Text(
                    'Login',
                    style: TextStyle(
                      fontSize: 20,
                      color: Colors.black,
                    ),
                  ),
                ),
              ),
              SizedBox(height: 9.0),
              InkWell(
                onTap: () {
                  Navigator.pushNamed(context, '/reset');
                },
                child: Text(
                  'I forgot my password. Click here to reset',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white,
                  ),
                ),
              ),
              SizedBox(height: 38.0),
            ],
          ),
        ),
      ),
    );
  }
}
