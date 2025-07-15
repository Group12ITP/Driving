import React, { useState } from 'react';
import AttendanceForm from '../AttendanceForm/AttendanceForm';
import AttendanceList from '../AttendanceList/AttendanceList';
import AttendanceSync from '../AttendanceSync/AttendanceSync';
import './AttendanceManagement.css';

const AttendanceManagement = () => {
  const [refreshList, setRefreshList] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  
  const handleAttendanceAdded = () => {
    // Force the list to refresh
    setRefreshList(prev => !prev);
    // Switch to the list tab after adding a record
    setActiveTab('list');
  };
  
  return (
    <div className="attendance-management-container">
      <h1>Attendance Management</h1>
      
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Attendance Records
        </button>
        <button 
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Record
        </button>
        <button 
          className={`tab-button ${activeTab === 'sync' ? 'active' : ''}`}
          onClick={() => setActiveTab('sync')}
        >
          Sync from Appointments
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'list' && (
          <div className="tab-pane">
            <AttendanceList key={refreshList ? 'refresh' : 'normal'} />
          </div>
        )}
        
        {activeTab === 'add' && (
          <div className="tab-pane">
            <AttendanceForm onAttendanceAdded={handleAttendanceAdded} />
          </div>
        )}
        
        {activeTab === 'sync' && (
          <div className="tab-pane">
            <AttendanceSync />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagement; 