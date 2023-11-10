import 'package:flutter/material.dart';
import 'package:fyptest1/imges2.dart';
import 'package:fyptest1/login_page_view.dart';
import 'package:fyptest1/myreport_page.dart';
import 'package:fyptest1/profile_page.dart';
import 'package:fyptest1/report_page.dart';
import 'package:fyptest1/reset_page_view.dart';
import 'package:fyptest1/setting_page.dart';
import 'package:firebase_app_check/firebase_app_check.dart';

import 'home_page.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
final navigatorKey = GlobalKey<NavigatorState>();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: FirebaseOptions(
      apiKey: 'AIzaSyB3CUq6DRQTMFQw_CSU-P2PoYFr8UX4a8A',
      authDomain: 'YOUR_AUTH_DOMAIN',
      projectId: 'smartreport-272fa',
      storageBucket: 'gs://smartreport-272fa.appspot.com',
      messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
      appId: '1:769752664985:android:5bba5d276010d459b5e108',
      measurementId: 'YOUR_MEASUREMENT_ID', // Optional
    ),

  );
  runApp(SmartReport());
}


class SmartReport extends StatelessWidget {
  const SmartReport({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: navigatorKey,
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: Color.fromARGB(255, 225, 229, 130),
      ),
      initialRoute: '/login',
      onGenerateRoute: (settings) {
        if (settings.name == '/login') {
          return MaterialPageRoute(
            builder: (context) => LoginPageView(),
            settings: settings,
          );
        }
        return null;
      },
      routes: {
        '/home': (context) => HomePage(title: 'Home', userId: '',),
        '/report': (context) => ReportPage(userId: '',),
        '/profile': (context) => ProfilePage(userId:'',),
        '/reset': (context) => ResetView(),
        '/login': (context) => LoginPageView(),
      },
    );
  }
}