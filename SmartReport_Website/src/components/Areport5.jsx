import React, { useEffect, useState } from "react";
import { firestore } from "firebase";
import "firebase/auth";
import firebase from "firebase/app";
import "firebase/firestore";

import "./report.css";
import { Link } from "react-router-dom";
  
function AReport5() {
  // State variables for storing report data, search query, and emergency reports count
  const [reportSubmissions, setReportSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [emergencyReportsCount, setEmergencyReportsCount] = useState(0);

  // Function to fetch data from Firestore based on the current user's ID
  async function fetchDataFromFirestore(currentUserUid) {
    const collectionRef = firestore().collection("report_submissions");
    const snapshot = await collectionRef
      .where("reportStatus", "==", "In Progress")
      .get();

    const data = [];
    let count = 0;

    // Iterate through the Firestore snapshot and filter relevant data
    snapshot.forEach((doc) => {
      const reportData = doc.data();
      const isUserAssigned = reportData.agentAssign.some(
        (agent) => agent.userId === currentUserUid
      );

      if (isUserAssigned) {
        data.push(reportData);

        if (reportData.emergencyStatus === "Yes") {
          count++;
        }
      }
    });

    // Update state with the filtered report data and emergency reports count
    setReportSubmissions(data);
    setEmergencyReportsCount(count);
  }
  // Effect hook to trigger data fetching when the component mounts
  useEffect(() => {
    const auth = firebase.auth();

    auth.onAuthStateChanged((user) => {
      if (user) {
        const currentUserUid = user.uid;
        fetchDataFromFirestore(currentUserUid);
      } else {
        // Handle the case when the user is not logged in
      }
    });
  }, []);

  // Filter reports based on the search query
  const filteredReports = reportSubmissions.filter((report) =>
    report.reportId.includes(searchQuery)
  );

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Task Assigned</h3>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Report ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <p style={{ color: "black" }}>
          Emergency Reports: {emergencyReportsCount}
        </p>
      </div>
      <div className="report-row">
        <p>#</p>
        <p className="reportId">Report ID</p>
        <p className="report-title">Title</p>
        <p className="hide-mobile">Date</p>
        <p className="hide-mobile">Time</p>
        <p className="hide-mobile">Emergency?</p>
      </div>

      <div className="max-w-screen-lg m-auto">
        <div>
          {filteredReports.map((report, index) => (
            <Link to={`/report5/${report.reportId}`} key={index}>
              <div className="report-row">
                <p> {index + 1}</p>
                <p className="reportId">{report.reportId}</p>
                <p className="report-title">{report.title}</p>
                <p className="hide-mobile">{report.dateAssigned}</p>
                <p className="hide-mobile">{report.timeAssigned}</p>
                <p className="hide-mobile">{report.emergencyStatus}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default AReport5;

