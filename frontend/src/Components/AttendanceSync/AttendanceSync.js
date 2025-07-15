import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AttendanceSync.css';

const AttendanceSync = ({ onSyncComplete }) => {
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [error, setError] = useState(null);

  // Get instructor IDs for syncing
  const getInstructorIds = () => {
    if (!user) return { objectId: '', formattedId: '' };
    
    const objectId = user.instructorId || '';
    
    // Format instructor ID
    let formattedId = '';
    if (user.instructorId) {
      const instructorType = user.instructorType || '';
      const instructorId = user.instructorId.toString();
      
      // Check if ID already has a prefix
      if (instructorId.startsWith('BO') || instructorId.startsWith('BC') || instructorId.startsWith('HV')) {
        formattedId = instructorId;
      } else {
        // Add prefix based on instructor type
        if (instructorType === 'Bike') {
          formattedId = `BO${instructorId.padStart(3, '0')}`;
        } else if (instructorType === 'BikeCar') {
          formattedId = `BC${instructorId.padStart(3, '0')}`;
        } else if (instructorType === 'HeavyVehicle') {
          formattedId = `HV${instructorId.padStart(3, '0')}`;
        } else {
          formattedId = instructorId;
        }
      }
    }
    
    return { objectId, formattedId };
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    setError(null);
    
    try {
      // Get both instructor IDs
      const { objectId, formattedId } = getInstructorIds();
      
      console.log('Syncing attendance for instructor:');
      console.log('- ObjectId:', objectId);
      console.log('- Formatted ID:', formattedId);
      
      // Use a different approach - fetch all appointments and filter in the backend
      // Avoid sending ObjectId directly since that's causing the issue
      const response = await axios.post('http://localhost:5000/api/attendance/sync-from-appointments', {
        // Don't send objectId since it's causing issues with type conversion
        // instructorObjectId: objectId,
        instructorFormattedId: formattedId,
        filterByInstructor: !!user?.role && user.role === 'instructor',
        instructorName: user?.name || '' // Add instructor name as an additional filter option
      });
      
      setSyncResult(response.data);
      
      // Call the onSyncComplete callback if provided
      if (onSyncComplete && typeof onSyncComplete === 'function') {
        onSyncComplete();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during synchronization');
      console.error('Sync error:', err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="attendance-sync-container">
      <h2>Attendance Records Initialization</h2>
      <p>
        This tool will create attendance records for all confirmed appointments regardless of date.
        {user?.role === 'instructor' ? ' Only your appointments will be processed.' : ''}
        Each student will be marked as 'Present' by default.
      </p>
      
      <button 
        className="sync-button" 
        onClick={handleSync} 
        disabled={syncing}
      >
        {syncing ? 'Syncing...' : 'Sync Appointments to Attendance'}
      </button>
      
      {syncResult && (
        <div className="sync-result success">
          <h3>Sync Completed</h3>
          <p>{syncResult.message}</p>
        </div>
      )}
      
      {error && (
        <div className="sync-result error">
          <h3>Sync Failed</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceSync;