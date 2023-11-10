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
import './report.css';
import { Link } from 'react-router-dom';

function UserManagement() {
  const [userDetails, setUserDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term
  const [searchField, setSearchField] = useState('name'); // State for the search field choice

  async function fetchDataFromFirestore() {
    const collectionRef = firestore().collection("users");
    const snapshot = await collectionRef.get();
    const data = [];
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
    setUserDetails(data);
  }

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  // Function to filter user data based on search term and field choice
  const filteredUsers = userDetails.filter((user) => {
    const fieldValue = user[searchField] || ''; // Ensure the field exists
    return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>User Management</h3>
      </div>

      {/* Search bar and choice of search field */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="userId">User ID</option>
          <option value="role">Role</option>
          <option value="department">Department</option>
        </select>
      </div>

      <div className="report-row">
        <p>#</p>
        <p className="reportId">User ID</p>
        <p className="report-title">Name</p>
        <p className="hide-mobile">Role</p>
        <p className="hide-mobile">Department</p>
      </div>

      <div className="max-w-screen-lg m-auto">
        <div>
          {filteredUsers.map((user, index) => (
            <Link to={`/UserDetails/${user.userId}`} key={index}>
              <div className="report-row">
                <p>{index + 1}</p>
                <p className="reportId">{user.userId}</p>
                <p className="report-title">{user.name}</p>
                <p className="hide-mobile">{user.role}</p>
                <p className="hide-mobile">{user.department}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default UserManagement;


