import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import MessageService from '../../services/MessageService';
import Nav from '../Nav/Nav';
import './AdminMessages.css';

const AdminMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAllMessages();
    }
  }, [user]);

  const fetchAllMessages = async () => {
    setLoading(true);
    try {
      const fetchedMessages = await MessageService.getAllMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async () => {
    if (!selectedMessage || !responseText.trim()) return;
    
    try {
      await MessageService.respondToMessage(selectedMessage._id, responseText);
      setResponseText('');
      fetchAllMessages();
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error responding to message:', error);
      alert('Failed to send response. Please try again.');
    }
  };

  return (
    <div>
      <Nav />
      <div className="admin-messages-container">
        <h2>Student Messages</h2>
        
        <div className="messages-layout">
          <div className="messages-list">
            {loading ? (
              <div className="loading">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="empty">No messages yet</div>
            ) : (
              messages.map(msg => (
                <div 
                  key={msg._id} 
                  className={`message-item ${selectedMessage?._id === msg._id ? 'active' : ''}`}
                  onClick={() => setSelectedMessage(msg)}
                >
                  <div className="message-header">
                    <span className="student-name">{msg.name}</span>
                    <span className="student-id">{msg.studentId}</span>
                    <span className={`status ${msg.status.toLowerCase()}`}>{msg.status}</span>
                  </div>
                  <div className="message-content">{msg.message}</div>
                  {msg.response && (
                    <div className="admin-response">
                      <strong>Your response:</strong> {msg.response}
                    </div>
                  )}
                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {selectedMessage && (
            <div className="response-panel">
              <h3>Respond to {selectedMessage.name}</h3>
              <div className="original-message">
                <strong>Student's message:</strong>
                <p>{selectedMessage.message}</p>
              </div>
              
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
              />
              
              <div className="response-actions">
                <button onClick={() => setSelectedMessage(null)}>Cancel</button>
                <button onClick={handleRespond} className="primary">
                  Send Response
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;