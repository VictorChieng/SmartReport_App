import React, { useEffect, useState } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
  BsMenuButtonWideFill,
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
  Label,
} from "recharts";
import { AiOutlineFileDone } from "react-icons/ai";
import "firebase/firestore";
import firebase from "firebase/app";

function Report2() {
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [inProgressReportsCount, setInProgressReportsCount] = useState(0);
  const [completedReportsCount, setCompletedReportsCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    // Initialize Firestore directly in your component.
    const db = firebase.firestore();

    // Fetch counts for different report statuses.
    const fetchReportCounts = async () => {
      const reportsRef = db.collection("report_submissions");

      // Fetch pending reports count
      const pendingQuerySnapshot = await reportsRef
        .where("reportStatus", "==", "Pending")
        .get();
      setPendingReportsCount(pendingQuerySnapshot.size);

      // Fetch in-progress reports count
      const inProgressQuerySnapshot = await reportsRef
        .where("reportStatus", "==", "In Progress")
        .get();
      setInProgressReportsCount(inProgressQuerySnapshot.size);

      // Fetch completed reports count
      const completedQuerySnapshot = await reportsRef
        .where("reportStatus", "==", "Completed by agent")
        .get();
      setCompletedReportsCount(completedQuerySnapshot.size);
    };

    fetchReportCounts();

    // Fetch all report data
    const allReportsRef = db.collection("report_submissions");
    allReportsRef.onSnapshot((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        const report = doc.data();
        data.push(report);
      });
      setReportData(data);
    });
  }, []);

  const cardData = [
    {
      name: "Pending",
      count: pendingReportsCount,
      icon: <BsFillArchiveFill className="card_icon" />,
    },
    {
      name: "In Progress",
      count: inProgressReportsCount,
      icon: <BsMenuButtonWideFill className="card_icon" />,
    },
    {
      name: "Completed",
      count: completedReportsCount,
      icon: <AiOutlineFileDone className="card_icon" />,
    },
  ];

  // Calculate the count of reports for each month
  const chartData = reportData.reduce((acc, report) => {
    const reportDate = new Date(report.date);
    const monthKey = `${reportDate.getFullYear()}-${(reportDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    // Initialize the count for the month if it doesn't exist in the accumulator
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, count: 0 };
    }

    // Increment the count for the month
    acc[monthKey].count++;

    return acc;
  }, {});

  const chartDataArray = Object.values(chartData);

  const filteredData = selectedMonth
    ? chartDataArray.filter((item) => item.month.startsWith(selectedMonth))
    : chartDataArray;

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Agent Dashboard</h3>
      </div>
      <div className="main-cards">
        {cardData.map((item) => (
          <div className="card" key={item.name}>
            <div className="card-inner">
              <h3>{item.name}</h3>
              {item.icon}
            </div>
            <h1>{item.count}</h1>
          </div>
        ))}
        <div className="card">
          <label>Select Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {chartDataArray.map((month) => (
              <option key={month.month} value={month.month}>
                {new Date(`${month.month}-01`).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="charts">
        <div className="chart-container">
          <h2 style={{ color: "black" }}>Frequency of Report Submissions</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={filteredData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8">
                {filteredData.map((entry, index) => (
                  <Label
                    key={index}
                    position="top"
                    content={entry.count}
                    offset={0}
                    fill="#000"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default Report2;
