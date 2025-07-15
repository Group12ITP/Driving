import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './feedbackDisplay.css';
import Nav2 from '../Nav/Nav2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faComments, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const URL = "http://localhost:5000/feedback";

const fetchHandler = async () => {
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const addFeedback = async (feedbackData) => {
    try {
        const response = await axios.post(URL, feedbackData);
        return response.data;
    } catch (error) {
        console.error('Error adding feedback:', error);
        throw error;
    }
}

const updateFeedback = async (id, feedbackData) => {
    try {
        const response = await axios.put(`${URL}/${id}`, feedbackData);
        return response.data;
    } catch (error) {
        console.error('Error updating feedback:', error);
        throw error;
    }
}

const deleteFeedback = async (id) => {
    try {
        const response = await axios.delete(`${URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting feedback:', error);
        throw error;
    }
}

function FeedbackDisplay() {
    const [feedback, setFeedback] = useState([]);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [success, setSuccess] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    useEffect(() => {
        fetchHandler()
            .then((data) => {
                if (data.feedbacks) {
                    setFeedback(data.feedbacks);
                } else {
                    setFeedback(data);
                }
            })
            .catch((err) => {
                setError('Error fetching data from server');
                console.error('Error:', err);
            });
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateFeedback(editingId, formData);
                setSuccess(true);
                setFormData({ name: '', email: '', message: '' });
                setEditingId(null);
            } else {
                await addFeedback(formData);
                setSuccess(true);
                setFormData({ name: '', email: '', message: '' });
            }
            // Refresh feedback list
            const data = await fetchHandler();
            if (data.feedbacks) {
                setFeedback(data.feedbacks);
            } else {
                setFeedback(data);
            }
            // Hide form after successful submission
            setTimeout(() => {
                setIsFormVisible(false);
                setSuccess(false);
            }, 2000);
        } catch (err) {
            setError('Error saving feedback');
            console.error('Error:', err);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            email: item.email,
            message: item.message
        });
        setEditingId(item._id);
        setIsFormVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteFeedback(id);
            setSuccess(true);
            // Refresh feedback list
            const data = await fetchHandler();
            if (data.feedbacks) {
                setFeedback(data.feedbacks);
            } else {
                setFeedback(data);
            }
            setTimeout(() => {
                setSuccess(false);
            }, 2000);
        } catch (err) {
            setError('Error deleting feedback');
            console.error('Error:', err);
        }
    };

    return (
        <div className="feedback-page">
            <Nav2 />
            
            <div className="feedback-container3">
                <h1>User Feedback</h1>
                
                <div className="feedback-layout3">
                    {/* Display Feedback */}
                    <div className="feedback-grid3">
                        {error ? (
                            <div className="error3">{error}</div>
                        ) : feedback && feedback.length > 0 ? (
                            feedback.map((item) => (
                                <div key={item._id} className="feedback-item3">
                                    <h2>{item.name}</h2>
                                    <h2>{item.email}</h2>
                                    <h2>{item.message}</h2>
                                    <div className="feedback-actions3">
                                        <button 
                                            className="edit-btn3"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="delete-btn3"
                                            onClick={() => setDeleteConfirmId(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    {deleteConfirmId === item._id && (
                                        <div className="delete-confirm3">
                                            <p>Are you sure you want to delete this feedback?</p>
                                            <div className="confirm-buttons3">
                                                <button 
                                                    className="confirm-btn3"
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    Yes
                                                </button>
                                                <button 
                                                    className="cancel-btn3"
                                                    onClick={() => setDeleteConfirmId(null)}
                                                >
                                                    No
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-data3">No feedback data available</div>
                        )}
                    </div>

                    {/* Compact Feedback Form */}
                    <div className="feedback-form-wrapper3">
                        <button 
                            className="add-feedback-btn3"
                            onClick={() => {
                                setIsFormVisible(!isFormVisible);
                                setEditingId(null);
                                setFormData({ name: '', email: '', message: '' });
                            }}
                        >
                            {isFormVisible ? 'Close Form' : '+ Add Feedback'}
                        </button>
                        
                        {isFormVisible && (
                            <div className="feedback-form-container3">
                                <h3>{editingId ? 'Edit Feedback' : 'Add New Feedback'}</h3>
                                <form onSubmit={handleSubmit} className="feedback-form3">
                                    <div className="form-group3">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group3">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Your Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group3">
                                        <textarea
                                            name="message"
                                            placeholder="Your Message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="submit-btn3">
                                        {editingId ? 'Update' : 'Submit'}
                                    </button>
                                </form>
                                {success && <div className="success-message3">
                                    {editingId ? 'Feedback updated successfully!' : 'Feedback submitted successfully!'}
                                </div>}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="driving-footer">
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
                                <li><a href="#">International Drivers</a></li>
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
                                <li><a href="#">Press</a></li>
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
                                <li><a href="#">Affiliate Program</a></li>
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

export default FeedbackDisplay;