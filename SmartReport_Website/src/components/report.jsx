import React, { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsMenuButtonWideFill } from 'react-icons/bs';
import { AiOutlineFileDone } from 'react-icons/ai';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

function Report() {
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [inProgressReportsCount, setInProgressReportsCount] = useState(0);
  const [completedReportsCount, setCompletedReportsCount] = useState(0);
  const [completedAgentReportsCount, setCompletedAgentReportsCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [reportData, setReportData] = useState([]);
  const [customerSatisfactionData, setCustomerSatisfactionData] = useState([]);
  const [totalRatingsCount, setTotalRatingsCount] = useState({});

  useEffect(() => {
    const db = firebase.firestore();

    const fetchReportCounts = async () => {
      const reportsRef = db.collection("report_submissions");

      const pendingQuerySnapshot = await reportsRef.where("reportStatus", "==", "Pending").get();
      setPendingReportsCount(pendingQuerySnapshot.size);

      const inProgressQuerySnapshot = await reportsRef.where("reportStatus", "==", "In Progress").get();
      setInProgressReportsCount(inProgressQuerySnapshot.size);

      const completedQuerySnapshot = await reportsRef.where("reportStatus", "==", "Completed").get();
      setCompletedReportsCount(completedQuerySnapshot.size);

      const completedAQuerySnapshot = await reportsRef.where("reportStatus", "==", "Completed by agent").get();
      setCompletedAgentReportsCount(completedAQuerySnapshot.size);
    };

    const fetchCustomerSatisfactionData = async () => {
      const ratingsRef = db.collection("report_submissions");
      const ratedQuerySnapshot = await ratingsRef.where("reportStatus", "==", "Rated").get();

      const monthlyRatingsCount = {};
      ratedQuerySnapshot.forEach((doc) => {
        const ratingData = doc.data();
        const submissionDate = ratingData.date;
        const monthKey = submissionDate.substr(0, 7);

        if (!monthlyRatingsCount[monthKey]) {
          monthlyRatingsCount[monthKey] = 0;
        }

        monthlyRatingsCount[monthKey]++;
      });

      setTotalRatingsCount(monthlyRatingsCount);

      const satisfactionData = {};
      ratedQuerySnapshot.forEach((doc) => {
        const ratingData = doc.data();
        const submissionDate = ratingData.date;
        const monthKey = submissionDate.substr(0, 7);

        if (!satisfactionData[monthKey]) {
          satisfactionData[monthKey] = { month: monthKey, satisfiedCount: 0 };
        }

        if (ratingData.Rating >= 3.5) {
          satisfactionData[monthKey].satisfiedCount++;
        }
      });

      const satisfactionIndexData = Object.values(satisfactionData).map((entry) => {
        const { month, satisfiedCount } = entry;
        const totalCount = monthlyRatingsCount[month] || 0;

        const satisfactionIndex = totalCount !== 0 ? (satisfiedCount / totalCount) * 100 : 0;

        return { month, satisfactionIndex };
      });

      setCustomerSatisfactionData(satisfactionIndexData);
    };

    fetchReportCounts();
    fetchCustomerSatisfactionData();

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
      name: 'Pending',
      count: pendingReportsCount,
      icon: <BsFillArchiveFill className='card_icon' />,
    },
    {
      name: 'In Progress',
      count: inProgressReportsCount,
      icon: <BsMenuButtonWideFill className='card_icon' />,
    },
    {
      name: 'Completed by Agent',
      count: completedAgentReportsCount,
      icon: <AiOutlineFileDone className='card_icon' />,
    },
    {
      name: 'Completed',
      count: completedReportsCount,
      icon: <AiOutlineFileDone className='card_icon' />,
    },
  ];

  const chartData = reportData.reduce((acc, report) => {
    const reportDate = report.date;
    const monthKey = reportDate.substr(0, 7);

    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, count: 0 };
    }

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
        <h3>Manager Dashboard</h3>
      </div>
      <div className='main-cards'>
        {cardData.map((item) => (
          <div className='card' key={item.name}>
            <div className='card-inner'>
              <h3>{item.name}</h3>
              {item.icon}
            </div>
            <h1>{item.count}</h1>
          </div>
        ))}
        <div className='card'>
          <label>Select Month</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="">All Months</option>
            {chartDataArray.map((month) => (
              <option key={month.month} value={month.month}>
                {new Date(`${month.month}-01`).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='charts'>
        <div className="chart-container">
        <h2 style={{ color: 'black' }}>Frequency of Report Submissions</h2>        
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
        <div className="chart-container">
        <h2 style={{ color: 'black' }}>Customer Satisfactory Index</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={customerSatisfactionData}
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
              <Bar dataKey="satisfactionIndex" fill="#82ca9d">
                {customerSatisfactionData.map((entry, index) => (
                  <Label
                    key={index}
                    position="top"
                    content={`${entry.satisfactionIndex.toFixed(2)}%`}
                    offset={0}
                    fill="#000"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
        <h2 style={{ color: 'black' }}>Number of Rated Report</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={Object.keys(totalRatingsCount).map(month => ({
                month,
                count: totalRatingsCount[month]
              }))}
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
                {Object.keys(totalRatingsCount).map((month, index) => (
                  <Label
                    key={index}
                    position="top"
                    content={totalRatingsCount[month]}
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

export default Report;
