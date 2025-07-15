import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './ProgressSync.css';

const ProgressSync = ({ onSyncComplete }) => {
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
      
      console.log('Syncing progress for instructor:');
      console.log('- ObjectId:', objectId);
      console.log('- Formatted ID:', formattedId);
      
      // Send instructor info to filter appointments by instructor
      const response = await axios.post('http://localhost:5000/api/progress/sync-from-appointments', {
        instructorObjectId: objectId,
        instructorFormattedId: formattedId,
        filterByInstructor: !!user?.role && user.role === 'instructor'
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
    <div className="progress-sync-container">
      <h2>Progress Tracking Initialization</h2>
      <p>
        This tool will create progress tracking records for all confirmed appointments.
        {user?.role === 'instructor' ? ' Only your appointments will be processed.' : ''}
        Each student will start with "Not Started" progress status.
      </p>
      
      <button 
        className="sync-button" 
        onClick={handleSync} 
        disabled={syncing}
      >
        {syncing ? 'Syncing...' : 'Sync Appointments to Progress'}
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

export default ProgressSync; 