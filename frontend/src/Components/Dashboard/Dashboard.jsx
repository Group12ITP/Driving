import React from "react";
import "./Dashboard.css";
import { FaChalkboardTeacher, FaUserGraduate, FaMoneyBillWave, FaTachometerAlt, FaUser, FaCalendarAlt, FaClipboardList, FaCreditCard } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "January", income: 70000 },
  { name: "March", income: 85000 },
  { name: "May", income: 110000 },
  { name: "July", income: 130000 },
  { name: "September", income: 120000 },
  { name: "November", income: 160000 },
];

export default function Dashboard() {
  return (
    <div className="dashboard-root">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <img src="https://i.ibb.co/6bQ7Q8d/driving-logo.png" alt="Driving School Logo" />
          <div className="dashboard-logo-title">
            <span>Driving School</span>
            <span>Management System</span>
          </div>
        </div>
        <div className="dashboard-user">
          <img src="https://i.ibb.co/6WZ8g7Q/user.png" alt="User" />
          <span>John Doe</span>
        </div>
        <nav className="dashboard-menu">
          <ul>
            <li className="active"><FaTachometerAlt /> Dashboard</li>
            <li><FaUserGraduate /> Student</li>
            <li><FaChalkboardTeacher /> Instructor</li>
            <li><FaCalendarAlt /> Schedule</li>
            <li><FaClipboardList /> Enrollment</li>
            <li><FaCreditCard /> Payment</li>
          </ul>
        </nav>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h2><FaTachometerAlt /> Dashboard</h2>
          <div className="dashboard-breadcrumb">
            Home <span>/</span> Dashboard
          </div>
        </div>
        <div className="dashboard-cards">
          <div className="dashboard-card card-green">
            <div className="card-content">
              <div className="card-value">8</div>
              <div className="card-label">Instructors</div>
            </div>
            <FaChalkboardTeacher className="card-icon" />
            <button className="card-more">More info &rarr;</button>
          </div>
          <div className="dashboard-card card-yellow">
            <div className="card-content">
              <div className="card-value">20</div>
              <div className="card-label">Students</div>
            </div>
            <FaUserGraduate className="card-icon" />
            <button className="card-more">More info &rarr;</button>
          </div>
          <div className="dashboard-card card-red">
            <div className="card-content">
              <div className="card-value">20,000</div>
              <div className="card-label">Income</div>
            </div>
            <FaMoneyBillWave className="card-icon" />
            <button className="card-more">More info &rarr;</button>
          </div>
        </div>
        <div className="dashboard-chart-section">
          <h3>Monthly Sales</h3>
          <div className="dashboard-chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}