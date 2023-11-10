import React, { useEffect, useState } from "react";
import { firestore } from "firebase";
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from "react-icons/bs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import './report.css'
import { Link } from 'react-router-dom';

function Reportm2() {
  const [reportSubmissions, setReportSubmissions] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [monthSearchValue, setMonthSearchValue] = useState('');

  async function fetchDataFromFirestore() {
    const collectionRef = firestore().collection("report_submissions");
    const snapshot = await collectionRef.where("reportStatus", "==", "Pending").get();
    const data = [];
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
    setReportSubmissions(data);
  }

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  function handleSearchInputChange(event) {
    setSearchValue(event.target.value);
  }

  function handleMonthSearchInputChange(event) {
    setMonthSearchValue(event.target.value);
  }

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Report Management</h3>
      </div>
      <input
        type="text"
        placeholder="Search by Report ID"
        value={searchValue}
        onChange={handleSearchInputChange}
      />
      <input
        type="text"
        placeholder="Search by Month eg00-12"
        value={monthSearchValue}
        onChange={handleMonthSearchInputChange}
      />
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
          {reportSubmissions
            .filter((report) =>
              report.reportId.toLowerCase().includes(searchValue.toLowerCase()) &&
              report.date.includes(monthSearchValue)
            )
            .map((report, index) => (
              <Link to={`/report2/${report.reportId}`} key={index}>
                <div className="report-row">
                  <p> {index + 1}</p>
                  <p className="reportId">{report.reportId}</p>
                  <p className="report-title">{report.title}</p>
                  <p className="hide-mobile">{report.date}</p>
                  <p className="hide-mobile">{report.time}</p>
                  <p className="hide-mobile">{report.emergencyStatus}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}

export default Reportm2;
