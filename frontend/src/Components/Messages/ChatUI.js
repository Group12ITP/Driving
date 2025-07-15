import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import MessageService from '../../services/MessageService';
import Nav2 from '../Nav/Nav2';
import './ChatUI.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner, faComments, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faLinkedinIn, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

const ChatUI = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Only fetch messages if user is logged in
    if (user && user.studentId) {
      fetchMessages();
    } else {
      setLoading(false);
    }
    
    // Set up a timer to refresh messages every 30 seconds
    const interval = setInterval(() => {
      if (user && user.studentId) {
        fetchMessages(false); // Fetch without setting loading state
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    
    try {
      if (!user || !user.studentId) {
        console.error('No student ID available');
        setLoading(false);
        return;
      }
      
      const fetchedMessages = await MessageService.getMessagesByStudentId(user.studentId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;
    
    setSending(true);
    
    try {
      const messageData = {
        message: newMessage.trim(),
        studentId: user.studentId,
        name: user.name,
        email: user.gmail
      };
      
      await MessageService.createMessage(messageData);
      setNewMessage('');
      fetchMessages(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div>
        <Nav2 />
        <div className="chat-container">
          <div className="chat-login-message">
            <h2>Please log in to use the chat feature</h2>
            <button onClick={() => window.location.href = '/login'}>Log In</button>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="driving-footer chat-footer">
          <div className="footer-container">
            {/* Contact Section */}
            <div className="footer-contact">
              <div className="contact-item">
                <FontAwesomeIcon icon={faComments} />
                <span>Chat With Us</span>
              </div>
              
              <div className="contact-item">
                <FontAwesomeIcon icon={faPhone} />
                <span>1 (555) 123-4567</span>
              </div>
              
              <div className="contact-item">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>info@drivemaster.com</span>
              </div>
            </div>

            {/* Footer Columns */}
            <div className="footer-columns">
              {/* Services Column */}
              <div className="footer-column">
                <h3>Services</h3>
                <ul>
                  <li><a href="#">Beginner Lessons</a></li>
                  <li><a href="#">Advanced Training</a></li>
                  <li><a href="#">Defensive Driving</a></li>
                  <li><a href="#">Senior Refreshers</a></li>
                  <li><a href="#">License Test Prep</a></li>
                </ul>
              </div>

              {/* Company Column */}
              <div className="footer-column">
                <h3>Company</h3>
                <ul>
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Our Instructors</a></li>
                  <li><a href="#">Student Stories</a></li>
                  <li><a href="#">Contact</a></li>
                  <li><a href="#">Terms & Conditions</a></li>
                </ul>
              </div>

              {/* Resources Column */}
              <div className="footer-column">
                <h3>Resources</h3>
                <ul>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Driving Tips</a></li>
                  <li><a href="#">Road Rules</a></li>
                  <li><a href="#">Student Reviews</a></li>
                  <li><a href="#">School Partners</a></li>
                </ul>
              </div>

              {/* Social Media Icons */}
              <div className="footer-social">
                <a href="#" className="social-icon"><FontAwesomeIcon icon={faFacebookF} /></a>
                <a href="#" className="social-icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                <a href="#" className="social-icon"><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="#" className="social-icon"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="#" className="social-icon"><FontAwesomeIcon icon={faYoutube} /></a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              <img src="/logo-small.png" alt="Drive Master" className="footer-logo" />
              <span>Powered by Drive Master Academy</span>
            </div>
            <div className="footer-legal">
              <a href="#">Book Your Lesson Today</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div>
      <Nav2 />
      <div className="chat-container">
        <div className="chat-header">
          <h2>Chat with Drive Master Admin</h2>
          <p>
            Ask questions about driving lessons, courses, or any other inquiries you have.
            Our team will respond as soon as possible.
          </p>
        </div>
        
        <div className="chat-messages">
          {loading ? (
            <div className="chat-loading">
              <FontAwesomeIcon icon={faSpinner} spin />
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="chat-empty">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="messages-list1">
              {messages.map(msg => (
                <div key={msg._id} className="message-wrapper">
                  <div className="message student-message">
                    <div className="message-content">
                      {msg.message}
                    </div>
                    <div className="message-timestamp">
                      {formatDate(msg.createdAt)}
                    </div>
                  </div>
                  
                  {msg.response && (
                    <div className="message admin-message">
                      <div className="message-content">
                        {msg.response}
                      </div>
                      <div className="message-timestamp">
                        {formatDate(msg.updatedAt)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
          <button type="submit" disabled={sending || !newMessage.trim()}>
            {sending ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPaperPlane} />}
          </button>
        </form>
        
        <div className="chat-notes">
          <p>Responses typically arrive within 24 hours during business days.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="driving-footer chat-footer">
        <div className="footer-container">
          {/* Contact Section */}
          <div className="footer-contact">
            <div className="contact-item">
              <FontAwesomeIcon icon={faComments} />
              <span>Chat With Us</span>
            </div>
            
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <span>1 (555) 123-4567</span>
            </div>
            
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>info@drivemaster.com</span>
            </div>
          </div>

          {/* Footer Columns */}
          <div className="footer-columns">
            {/* Services Column */}
            <div className="footer-column">
              <h3>Services</h3>
              <ul>
                <li><a href="#">Beginner Lessons</a></li>
                <li><a href="#">Advanced Training</a></li>
                <li><a href="#">Defensive Driving</a></li>
                <li><a href="#">Senior Refreshers</a></li>
                <li><a href="#">License Test Prep</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="footer-column">
              <h3>Company</h3>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Our Instructors</a></li>
                <li><a href="#">Student Stories</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Terms & Conditions</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="footer-column">
              <h3>Resources</h3>
              <ul>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Driving Tips</a></li>
                <li><a href="#">Road Rules</a></li>
                <li><a href="#">Student Reviews</a></li>
                <li><a href="#">School Partners</a></li>
              </ul>
            </div>

            {/* Social Media Icons */}
            <div className="footer-social">
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faYoutube} /></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <img src="/logo-small.png" alt="Drive Master" className="footer-logo" />
            <span>Powered by Drive Master Academy</span>
          </div>
          <div className="footer-legal">
            <a href="#">Book Your Lesson Today</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatUI; 