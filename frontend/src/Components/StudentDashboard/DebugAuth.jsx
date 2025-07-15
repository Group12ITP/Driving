import React from 'react';
import { useAuth } from '../../context/AuthContext';

const DebugAuth = () => {
  const { user } = useAuth();

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px',
      padding: '10px',
      background: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      zIndex: 9999
    }}>
      <h3>Auth Debug</h3>
      {user ? (
        <div>
          <p><strong>Logged in:</strong> Yes</p>
          <p><strong>Name:</strong> {user.name || 'N/A'}</p>
          <p><strong>Email:</strong> {user.gmail || user.email || 'N/A'}</p>
          <p><strong>Student ID:</strong> {user.studentId || 'N/A'}</p>
          <p><strong>User ID (_id):</strong> {user._id || 'N/A'}</p>
          <p><strong>User Object:</strong> {JSON.stringify(user)}</p>
        </div>
      ) : (
        <p><strong>Logged in:</strong> No</p>
      )}
    </div>
  );
};

export default DebugAuth; 