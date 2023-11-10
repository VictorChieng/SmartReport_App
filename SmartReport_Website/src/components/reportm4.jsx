import React, { useEffect, useState } from "react";
import { firestore } from "firebase";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import './report.css'
import { Link } from 'react-router-dom'; // Import Link from React Router

function Reportm4() {
  const [reportSubmissions, setReportSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

  async function fetchDataFromFirestore() {
    const collectionRef = firestore().collection("report_submissions");
    const snapshot = await collectionRef.where("reportStatus", "==", "Completed by agent").get();
  
    // Process snapshot data
    const data = [];
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
  
    setReportSubmissions(data);
  }

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  // Filter the reports based on the search query
  const filteredReports = reportSubmissions.filter(report => report.reportId.includes(searchQuery));

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Report Completed by Agent</h3>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Report ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
            <Link to={`/report4/${report.reportId}`} key={index}>
              <div className="report-row" >
                <p> {index + 1}</p>
                <p className="reportId">{report.reportId}</p>
                <p className="report-title">{report.title}</p>
                <p className="hide-mobile">{report.dateCompleted}</p>
                <p className="hide-mobile">{report.timeCompleted}</p>
                <p className="hide-mobile">{report.emergencyStatus}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Reportm4;
