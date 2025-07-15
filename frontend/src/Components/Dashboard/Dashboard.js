import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import { FaChalkboardTeacher, FaUserGraduate, FaTachometerAlt, FaUser, FaCalendarAlt, FaClipboardList, FaCreditCard, FaChartBar, FaClock, FaStar, FaGraduationCap, FaIdCard, FaEdit, FaMoneyBillWave, FaPlus, FaTrash } from "react-icons/fa";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const URL = "http://localhost:5000/Users";
const INSTRUCTOR_URL = "http://localhost:5000/instructors";
const EVENT_URL = "http://localhost:5000/events";

function Dashboard() {
  const [studentsCount, setStudentsCount] = useState(0);
  const [instructors, setInstructors] = useState([]);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [editForm, setEditForm] = useState({
    specialization: '',
    experience: '',
    licenseNumber: '',
    qualification: '',
    hourlyRate: '',
    status: 'Active'
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date(),
    type: 'general'
  });
  const location = useLocation();
  const navigate = useNavigate();
  const isProgress = location.pathname === '/progress';
  const isAttendance = location.pathname === '/attendance';
  const isInstructorAvailability = location.pathname.includes('instructor-availability');
  const isExtraPractice = location.pathname.includes('extra-practice');
  const isSchedule = location.pathname.includes('schedule');

  const getBreadcrumb = () => {
    if (isProgress) return 'Progress';
    if (isAttendance) return 'Attendance';
    if (isInstructorAvailability) return 'Instructor Availability';
    if (isExtraPractice) return 'Extra Practice';
    if (isSchedule) return 'Schedule';
    return 'Dashboard';
  };

  useEffect(() => {
    fetchStudents();
    fetchInstructors();
    fetchEvents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(URL);
      if (response.data && response.data.Users) {
        setStudentsCount(response.data.Users.length);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(INSTRUCTOR_URL);
      console.log('Instructors response:', response.data); // Debug log
      // Filter for specific instructor
      const currentInstructor = response.data.filter(instructor => instructor.userId === 'it23396418');
      setInstructors(currentInstructor);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setInstructors([]); // Set empty array on error
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${EVENT_URL}/instructor/it23396418`);
      console.log('Fetched events:', response.data); // Debug log
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]); // Set empty array on error
    }
  };

  const handleEdit = (instructor) => {
    setEditingInstructor(instructor);
    setEditForm({
      specialization: instructor.specialization,
      experience: instructor.experience,
      licenseNumber: instructor.licenseNumber,
      qualification: instructor.qualification,
      hourlyRate: instructor.hourlyRate,
      status: instructor.status
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${INSTRUCTOR_URL}/${editingInstructor.userId}`, editForm);
      
      if (response.data.instructor) {
        await fetchInstructors();
        setEditingInstructor(null);
        alert('Instructor updated successfully!');
      }
    } catch (error) {
      console.error('Error updating instructor:', error);
      alert(error.response?.data?.message || 'Failed to update instructor. Please try again.');
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#4CAF50';
      case 'Inactive': return '#F44336';
      case 'On Leave': return '#FFC107';
      default: return '#9E9E9E';
    }
  };

  const handleStudentMoreInfo = () => {
    navigate('/students');
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewEvent(prev => ({ ...prev, date }));
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      type: event.type
    });
    setShowEventModal(true);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) {
      alert('Please enter an event title');
      return;
    }

    try {
      const eventData = {
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        date: newEvent.date.toISOString(),
        type: newEvent.type,
        instructorId: 'it23396418'
      };

      console.log('Sending event data:', eventData);

      let response;
      if (editingEvent) {
        response = await axios.put(`${EVENT_URL}/${editingEvent._id}`, eventData);
        console.log('Updated event response:', response.data);
      } else {
        response = await axios.post(EVENT_URL, eventData);
        console.log('Created event response:', response.data);
      }

      if (response.data) {
        await fetchEvents();
        setShowEventModal(false);
        setNewEvent({
          title: '',
          description: '',
          date: new Date(),
          type: 'general'
        });
        setEditingEvent(null);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to save event. Please try again.';
      alert(errorMessage);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`${EVENT_URL}/${eventId}`);
      console.log('Deleted event:', eventId); // Debug log
      await fetchEvents(); // Refresh events after deleting
    } catch (error) {
      console.error('Error deleting event:', error);
      alert(error.response?.data?.message || 'Failed to delete event. Please try again.');
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'exam': return '#ff4444';
      case 'practice': return '#4CAF50';
      case 'meeting': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const tileContent = ({ date }) => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
    
    return dayEvents.length > 0 ? (
      <div className="ds-event-dots">
        {dayEvents.map((event, index) => (
          <div 
            key={index}
            className="ds-event-dot"
            style={{ backgroundColor: getEventTypeColor(event.type) }}
          />
        ))}
      </div>
    ) : null;
  };

  return (
    <div className="ds-dashboard-root">
      <aside className="ds-dashboard-sidebar">
        <div className="ds-dashboard-logo">
          <img src="https://i.ibb.co/6bQ7Q8d/driving-logo.png" alt="Driving School Logo" />
          <div className="ds-dashboard-logo-title">
            <span>Driving School</span>
            <span>Management System</span>
          </div>
        </div>
        <div className="ds-dashboard-user">
          <img src="https://i.ibb.co/6WZ8g7Q/user.png" alt="User" />
          <span>John Doe</span>
        </div>
        <nav className="ds-dashboard-menu">
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/" className="ds-progress-link"><FaTachometerAlt /> Dashboard</Link>
            </li>
            <li className={isExtraPractice ? 'active' : ''}>
              <Link to="/extra-practice" className="ds-progress-link"><FaUserGraduate /> Extra Practice</Link>
            </li>
            <li className={isAttendance ? 'active' : ''}>
              <Link to="/attendance" className="ds-progress-link"><FaChalkboardTeacher /> Attendance</Link>
            </li>
            <li className={isSchedule ? 'active' : ''}>
              <Link to="/schedule" className="ds-progress-link"><FaCalendarAlt /> Schedule</Link>
            </li>
            <li className={isInstructorAvailability ? 'active' : ''}>
              <Link to="/instructor-availability" className="ds-progress-link"><FaClock /> Instructor Availability</Link>
            </li>
            <li className={isProgress ? 'active' : ''}>
              <Link to="/progress" className="ds-progress-link"><FaChartBar /> Progress</Link>
            </li>
            <li><FaClipboardList /> Enrollment</li>
            <li><FaCreditCard /> Payment</li>
          </ul>
        </nav>
      </aside>
      <main className="ds-dashboard-main">
        <div className="ds-dashboard-topbar">
          <h2><FaTachometerAlt /> {getBreadcrumb()}</h2>
          <div className="ds-dashboard-breadcrumb">
            Home <span>/</span> {getBreadcrumb()}
          </div>
        </div>
        <Outlet />
        {!isProgress && !isAttendance && !isInstructorAvailability && !isExtraPractice && !isSchedule && (
          <>
            <div className="ds-dashboard-cards">
              <div className="ds-dashboard-card ds-card-yellow">
                <div className="ds-card-content">
                  <div className="ds-card-value">{studentsCount}</div>
                  <div className="ds-card-label">Students</div>
                </div>
                <FaUserGraduate className="ds-card-icon" />
                <button className="ds-card-more" onClick={handleStudentMoreInfo}>More info &rarr;</button>
              </div>
            </div>

            <div className="ds-dashboard-grid">
              <div className="ds-instructor-details-section">
                <h3>Current Instructor</h3>
                <div className="ds-instructor-grid">
                  {instructors.map((instructor) => (
                    <div key={instructor._id} className="ds-instructor-card">
                      <div className="ds-instructor-header">
                        <div className="ds-instructor-avatar">
                          <FaUser />
                        </div>
                        <div className="ds-instructor-status" style={{ backgroundColor: getStatusColor(instructor.status) }}>
                          {instructor.status}
                        </div>
                      </div>
                      <div className="ds-instructor-info">
                        <h4>{instructor.userId}</h4>
                        <div className="ds-instructor-details">
                          <div className="ds-instructor-detail-item">
                            <FaGraduationCap />
                            <span>{instructor.qualification}</span>
                          </div>
                          <div className="ds-instructor-detail-item">
                            <FaIdCard />
                            <span>{instructor.licenseNumber}</span>
                          </div>
                          <div className="ds-instructor-detail-item">
                            <FaStar />
                            <span>Rating: {instructor.rating}/5</span>
                          </div>
                          <div className="ds-instructor-detail-item">
                            <FaMoneyBillWave />
                            <span>Hourly Rate: ${instructor.hourlyRate}</span>
                          </div>
                          <div className="ds-instructor-detail-item">
                            <FaChalkboardTeacher />
                            <span>Specialization: {instructor.specialization}</span>
                          </div>
                        </div>
                        <div className="ds-instructor-stats">
                          <div className="ds-stat-item">
                            <span className="ds-stat-value">{instructor.experience}</span>
                            <span className="ds-stat-label">Years Exp.</span>
                          </div>
                          <div className="ds-stat-item">
                            <span className="ds-stat-value">{instructor.totalStudents}</span>
                            <span className="ds-stat-label">Students</span>
                          </div>
                          <div className="ds-stat-item">
                            <span className="ds-stat-value">{instructor.successRate}%</span>
                            <span className="ds-stat-label">Success</span>
                          </div>
                        </div>
                        <button 
                          className="ds-edit-instructor-button"
                          onClick={() => handleEdit(instructor)}
                        >
                          <FaEdit /> Edit Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ds-calendar-section">
                <h3>Calendar</h3>
                <div className="ds-calendar-container">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    onClickDay={handleDateClick}
                    tileContent={tileContent}
                    className="ds-dashboard-calendar"
                  />
                  <div className="ds-calendar-events">
                    <h4>Events for {selectedDate.toDateString()}</h4>
                    <div className="ds-events-list">
                      {events
                        .filter(event => new Date(event.date).toDateString() === selectedDate.toDateString())
                        .map(event => (
                          <div 
                            key={event._id} 
                            className="ds-event-item"
                            style={{ borderLeftColor: getEventTypeColor(event.type) }}
                          >
                            <div className="ds-event-header">
                              <h5>{event.title}</h5>
                              <div className="ds-event-actions">
                                <button 
                                  className="ds-edit-event-button"
                                  onClick={() => handleEventClick(event)}
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  className="ds-delete-event-button"
                                  onClick={() => handleDeleteEvent(event._id)}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                            <p>{event.description}</p>
                            <span className="ds-event-type">{event.type}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showEventModal && (
              <div className="ds-modal-overlay">
                <div className="ds-modal-content">
                  <h3>{editingEvent ? 'Edit Event' : 'Add Event'}</h3>
                  <div className="ds-form-group">
                    <label>Event Title</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="ds-form-group">
                    <label>Description</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter event description"
                    />
                  </div>
                  <div className="ds-form-group">
                    <label>Event Type</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="general">General</option>
                      <option value="exam">Exam</option>
                      <option value="practice">Practice</option>
                      <option value="meeting">Meeting</option>
                    </select>
                  </div>
                  <div className="ds-modal-buttons">
                    <button onClick={handleAddEvent} className="ds-save-button">
                      <FaPlus /> {editingEvent ? 'Update Event' : 'Add Event'}
                    </button>
                    <button 
                      onClick={() => {
                        setShowEventModal(false);
                        setEditingEvent(null);
                        setNewEvent({
                          title: '',
                          description: '',
                          date: new Date(),
                          type: 'general'
                        });
                      }} 
                      className="ds-cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {editingInstructor && (
              <div className="ds-edit-modal-overlay">
                <div className="ds-edit-modal">
                  <h3>Edit Instructor Details</h3>
                  <form onSubmit={handleEditSubmit}>
                    <div className="ds-form-group">
                      <label>Specialization</label>
                      <select
                        name="specialization"
                        value={editForm.specialization}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="Theory">Theory</option>
                        <option value="Practical">Practical</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div className="ds-form-group">
                      <label>Experience (years)</label>
                      <input
                        type="number"
                        name="experience"
                        value={editForm.experience}
                        onChange={handleEditChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="ds-form-group">
                      <label>License Number</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={editForm.licenseNumber}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="ds-form-group">
                      <label>Qualification</label>
                      <input
                        type="text"
                        name="qualification"
                        value={editForm.qualification}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="ds-form-group">
                      <label>Hourly Rate</label>
                      <input
                        type="number"
                        name="hourlyRate"
                        value={editForm.hourlyRate}
                        onChange={handleEditChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="ds-form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                    <div className="ds-modal-buttons">
                      <button type="submit" className="ds-save-button">Save Changes</button>
                      <button 
                        type="button" 
                        className="ds-cancel-button"
                        onClick={() => setEditingInstructor(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;