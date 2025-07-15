import React from 'react';

const DebugInfo = ({ user, courseInfo }) => {
  // Check if debug mode is enabled via URL
  const isDebugMode = new URLSearchParams(window.location.search).get('debug') === 'true';
  
  if (!isDebugMode) return null;
  
  return (
    <div style={{ 
      background: '#333', 
      color: '#fff', 
      padding: '10px', 
      borderRadius: '5px',
      margin: '10px 0',
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Debug Information</h4>
      
      <div>
        <strong>User ID:</strong> {user?._id || 'Not available'}
      </div>
      <div>
        <strong>User Role:</strong> {user?.role || 'Not available'}
      </div>
      <div>
        <strong>Course Name:</strong> {courseInfo?.courseName || 'Not available'}
      </div>
      <div>
        <strong>Instructor Name:</strong> {courseInfo?.instructorName || 'Not available'}
      </div>
      <div>
        <strong>Instructor ID:</strong> {courseInfo?.instructorId || 'Not available'}
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <strong>Note:</strong> Add <code>?debug=true</code> to URL to see this panel
      </div>
    </div>
  );
};

export default DebugInfo; 