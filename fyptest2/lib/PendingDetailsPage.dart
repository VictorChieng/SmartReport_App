import 'package:flutter/material.dart';
import 'package:card_swiper/card_swiper.dart';
import 'package:photo_view/photo_view.dart';


class PendingDetailsPage extends StatefulWidget {
  final Map<String, dynamic> data;

  const PendingDetailsPage({Key? key, required this.data}) : super(key: key);

  @override
  State<PendingDetailsPage> createState() => _PendingDetailsPageState();
}

class _PendingDetailsPageState extends State<PendingDetailsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFE9EDF6),
      appBar: AppBar(
        title: Text(
          "Report ID ${widget.data['reportId']}",
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
                          child: Text("${widget.data['title']}",
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
                          child: Text("${widget.data['desc']}",
                          ),
                        ),
                      ),
                    )],
                ),
              )),
          SizedBox(height: 23),
          Row(
            children: <Widget>[
              Icon(Icons.category),
              SizedBox(width: 8),
              Text(
                "${widget.data['category']}",
                style: TextStyle(
                  fontSize: 18,
                ),
              ),
            ],
          ),
          SizedBox(height: 23),
          Row(
            children: <Widget>[
              Icon(Icons.image),
              SizedBox(width: 8),
              Expanded(
                child: widget.data['imageUrls'] != null && widget.data['imageUrls'].isNotEmpty
                    ? Container(
                    height: 200.0, // Set a specific height here
                    child: Swiper(
                      itemCount: widget.data['imageUrls'].length,
                      itemBuilder: (BuildContext context, int index) {
                        return GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => PhotoView(
                                  imageProvider: NetworkImage(
                                      widget.data['imageUrls'][index]),
                                  backgroundDecoration: BoxDecoration(
                                    color: Colors.black,
                                  ),
                                ),
                              ),
                            );
                          },
                          child: Card(
                            child: Image.network(
                              widget.data['imageUrls'][index],
                              width: 100.0,
                              height: 100.0,
                              fit: BoxFit.cover,
                            ),
                          ),
                        );
                      },
                      pagination: SwiperCustomPagination(// its also find using one line<-
                        builder: (BuildContext context, SwiperPluginConfig config) {
                          return Align(
                            alignment: Alignment.bottomCenter, // Align to the middle bottom
                            child: DotSwiperPaginationBuilder(
                              color: Colors.grey, // Dot color
                              activeColor: Colors.blue, // Active dot color
                              size: 10, // Dot size
                              activeSize: 12, // Active dot size
                              space: 5, // Space between dots
                            ).build(context, config),
                          );
                        },
                      ),
                    ))
                    : Text(
                  "No images available",
                  style: TextStyle(
                    fontSize: 18,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 23),
          Row(
            children: <Widget>[
              Icon(Icons.room),
              SizedBox(width: 8),
              Text(
                "${widget.data['location']}",
                style: TextStyle(
                  fontSize: 18,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
