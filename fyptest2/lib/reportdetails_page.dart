import 'package:flutter/material.dart';
import 'package:photo_view/photo_view.dart';
import 'package:card_swiper/card_swiper.dart';

class ReportDetailsPage extends StatelessWidget {
  final Map<String, dynamic> data;

  const ReportDetailsPage({Key? key, required this.data}) : super(key: key);

  List<Map<String, dynamic>> parseAgentAssign(Map<String, dynamic> data) {
    // Check if the 'agentAssign' field exists and is a list
    if (data.containsKey('agentAssign') && data['agentAssign'] is List) {
      return List<Map<String, dynamic>>.from(data['agentAssign']);
    } else {
      return [];
    }
  }


  @override
  Widget build(BuildContext context) {
    List<Map<String, dynamic>> agentAssignList = parseAgentAssign(data);
    return Scaffold(
      backgroundColor: Color(0xFFE9EDF6),
      appBar: AppBar(
        title: Text(
          "Report ID ${data['reportId']}",
          style: TextStyle(
            color: Colors.black,
            fontSize: 24,
            fontFamily: "Roboto",
          ),
        ),
        centerTitle: true,
        backgroundColor: Color(0xFF3E5B7A),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: <Widget>[

          Container(
              width: double.infinity, // Match parent width
              height: 60, // Set a specific height for the container
              decoration: BoxDecoration(
                border: Border.all(color: Colors.blue), // Border style
                borderRadius: BorderRadius.circular(10.0), // Border radius
                color: Colors.grey[300], // Background color
              ),
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Project Title:',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    SizedBox(
                      height: 5,
                    ),
                    Expanded(
                      child: SingleChildScrollView(
                        child: Container(
                          child: Text("${data['title']}",
                          ),
                        ),
                      ),
                    )],
                ),
              )),
          SizedBox(height: 23),
          Container(
              width: double.infinity, // Match parent width
              height: 100, // Set a specific height for the container
              decoration: BoxDecoration(
                border: Border.all(color: Colors.blue), // Border style
                borderRadius: BorderRadius.circular(10.0), // Border radius
                color: Colors.grey[300], // Background color
              ),
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Project Description:',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    SizedBox(
                      height: 5,
                    ),
                    Expanded(
                      child: SingleChildScrollView(
                        child: Container(
                          child: Text("${data['desc']}",
                          ),
                        ),
                      ),
                    )],
                ),
              )),
          SizedBox(height: 23),
          Container(
            width: double.infinity, // Match parent width
            height: 60, // Set a specific height for the container
            decoration: BoxDecoration(
              border: Border.all(color: Colors.blue), // Border style
              borderRadius: BorderRadius.circular(10.0), // Border radius
              color: Colors.grey[300], // Background color
            ),
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: <Widget>[
                  Icon(Icons.category),
                  SizedBox(width: 8),
                  Text(
                    "${data['category']}",
                    style: TextStyle(
                      fontSize: 18,
                    ),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 23),
          Container(
            width: double.infinity, // Match parent width
            height: 200, // Set a specific height for the container
            decoration: BoxDecoration(
              border: Border.all(color: Colors.blue), // Border style
              borderRadius: BorderRadius.circular(10.0), // Border radius
              color: Colors.grey[300], // Background color
            ),
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: <Widget>[
                  Icon(Icons.image),
                  SizedBox(width: 8),
                  Expanded(
                    child: data['imageUrls'] != null && data['imageUrls'].isNotEmpty
                        ? Swiper(
                      itemCount: data['imageUrls'].length,
                      itemBuilder: (BuildContext context, int index) {
                        return GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => PhotoView(
                                  imageProvider: NetworkImage(data['imageUrls'][index]),
                                  backgroundDecoration: BoxDecoration(
                                    color: Colors.black,
                                  ),
                                ),
                              ),
                            );
                          },
                          child: Card(
                            child: Image.network(
                              data['imageUrls'][index],
                              width: 100.0,
                              height: 100.0,
                              fit: BoxFit.cover,
                            ),
                          ),
                        );
                      },
                      pagination: SwiperCustomPagination(
                        builder: (BuildContext context, SwiperPluginConfig config) {
                          return Align(
                            alignment: Alignment.bottomCenter,
                            child: DotSwiperPaginationBuilder(
                              color: Colors.grey,
                              activeColor: Colors.blue,
                              size: 10,
                              activeSize: 12,
                              space: 5,
                            ).build(context, config),
                          );
                        },
                      ),
                    )
                        : Text(
                      "No images available",
                      style: TextStyle(
                        fontSize: 18,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 23),
          Container(
            width: double.infinity, // Match parent width
            height: 60, // Set a specific height for the container
            decoration: BoxDecoration(
              border: Border.all(color: Colors.blue), // Border style
              borderRadius: BorderRadius.circular(10.0), // Border radius
              color: Colors.grey[300], // Background color
            ),
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: <Widget>[
                  Icon(Icons.room),
                  SizedBox(width: 8),
                  Text(
                    "${data['location']}",
                    style: TextStyle(
                      fontSize: 18,
                    ),
                  ),
                ],
              ),
            ),
          ),

          SizedBox(height: 23),
          Container(
            width: double.infinity, // Match parent width
            height: 130, // Set a specific height for the container
            decoration: BoxDecoration(
              border: Border.all(color: Colors.blue), // Border style
              borderRadius: BorderRadius.circular(10.0), // Border radius
              color: Colors.grey[300], // Background color
            ),
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Agent Assign:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  SizedBox(
                    height: 5,
                  ),
                  Expanded(
                    child: SingleChildScrollView(
                      child: Column(
                        children: agentAssignList.map((agentData) {
                          // Extract the 'name' and 'agentPhone' fields from each agent map
                          String agentName = agentData['name'] ?? 'Unknown';
                          String agentPhone = agentData['agentPhone'] ?? 'N/A';

                          return Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Name: $agentName',
                                style: TextStyle(
                                  fontSize: 18,
                                ),
                              ),
                              Text(
                                'Phone: $agentPhone',
                                style: TextStyle(
                                  fontSize: 18,
                                ),
                              ),
                              SizedBox(width: 10), // Add some spacing between name and phone
                            ],
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
