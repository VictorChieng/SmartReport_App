import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class PersonalDetailsPage extends StatefulWidget {
  const PersonalDetailsPage({Key? key}) : super(key: key);

  @override
  State<PersonalDetailsPage> createState() => _PersonalDetailsPageState();
}

class _PersonalDetailsPageState extends State<PersonalDetailsPage> {
  final ImagePicker _imagePicker = ImagePicker();

  Future<void> _changeProfilePicture() async {
    final XFile? pickedFile = await _imagePicker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      // Handle the selected image here (e.g., upload it to a server or display it).
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFE9EDF6),
      appBar: AppBar(
        title: Text(
          "Personal Details",
          style: TextStyle(
            color: Colors.black,
            fontSize: 24,
            fontFamily: "Roboto",
          ),
        ),
        centerTitle: true,
        backgroundColor: Color(0xFF3E5B7A),
      ),
      body: Column(
        children: [
          Container(
            width: 390,
            height: 400.6,
            child: Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10.0),
              ),
              color: Colors.white,
              elevation: 3,
              margin: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  GestureDetector(
                    onTap: _changeProfilePicture,
                    child: Padding(
                      padding: EdgeInsets.only(top: 6, left: 18),
                      child: Row(
                        children: [
                          Container(
                            width: 35,
                            height: 33,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors
                                  .grey, //set the profile picture here
                            ),
                            // Replace the color with an actual profile picture
                          ),
                          SizedBox(width: 16),
                          Text(
                            "Change your Profile Picture",
                            style: TextStyle(
                              fontSize: 20,
                              color: Colors.black,
                              fontFamily: "Roboto",
                            ),
                          ),
                          Spacer(),
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
                  SizedBox(height: 20), // Add spacing between the sections
                  _buildUserInfo("Name", "John Doe"),
                  _buildUserInfo("User ID", "12345"),
                  _buildUserInfo("Email", "johndoe@example.com"),
                  _buildUserInfo("Department", "Engineering"),
                  _buildUserInfo("Role", "Software Engineer"),
                ],
              ),
            ),
          ),
          SizedBox(height: 85),

          SizedBox(
            width: 150,
            child: FloatingActionButton(
              onPressed: () {
                // String email = viewModel.loginModel.email;
                // String password = viewModel.loginModel.password;
                // viewModel.login(context);
              },
              backgroundColor: Color(0xFFFF705A),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(5.0),
              ),
              child: Text(
                'Save',
                style: TextStyle(
                  fontSize: 20,
                  color: Colors.white,
                ),
              ),
            ),
          ),

        ],
      ),
    );
  }

  Widget _buildUserInfo(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 18,
              color: Colors.black,
              fontFamily: "Roboto",
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey,
              fontFamily: "Roboto",
            ),
          ),
        ],
      ),
    );
  }
}
