import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Appointments.css';
import Nav2 from '../Nav/Nav2';

const API_BASE_URL = 'http://localhost:5000/api/appointments';

const Appointments = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courseName, setCourseName] = useState('');

    const instructor = location.state?.instructor;

    useEffect(() => {
        if (!instructor) {
            navigate('/courses');
            return;
        }
        fetchCourseName();
        fetchAvailableTimeSlots();
    }, [selectedDate, instructor]);

    const fetchCourseName = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/payments/student/${user.studentId}`);
            const completedPayments = response.data.payments.filter(
                payment => payment.status === 'Completed'
            );
            
            if (completedPayments.length > 0) {
                setCourseName(completedPayments[0].courseName);
            }
        } catch (error) {
            console.error('Error fetching course name:', error);
            setError('Failed to fetch course details');
        }
    };

    // ✅ FIXED: Ensures correct date even with time zone offsets
    const formatDate = (date) => {
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().split('T')[0];
    };

    const fetchAvailableTimeSlots = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const formattedDate = formatDate(selectedDate);

            const response = await axios.get(
                `${API_BASE_URL}/available-slots/${instructor._id}/${formattedDate}`
            );

            if (response.data.success) {
                setBookedTimeSlots(response.data.bookedTimeSlots);
            } else {
                setError(response.data.message || 'Failed to fetch time slots');
            }
        } catch (error) {
            console.error('Error fetching time slots:', error);
            setError(error.response?.data?.message || 'Failed to fetch available time slots');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate || !selectedTime) {
            setError('Please select both date and time');
            return;
        }

        if (!courseName) {
            setError('Course information not found. Please try again.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const formattedDate = formatDate(selectedDate);

            const response = await axios.post(`${API_BASE_URL}/create`, {
                studentId: user.studentId,
                studentName: user.name,
                instructorId: instructor._id,
                instructorName: instructor.name,
                courseName: courseName,
                date: formattedDate,
                time: selectedTime
            });

            if (response.data.success) {
                navigate('/student-dashboard');
            } else {
                setError(response.data.message || 'Failed to book appointment');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            setError(error.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00'
    ];

    if (!instructor) {
        return null;
    }

    return (
        <div className="appointments-container">
            <Nav2 />
            <div className="appointments-content">
                <h1>Book Appointment with {instructor.name}</h1>
                
                {error && <div className="error-message">{error}</div>}

                <div className="appointment-booking">
                    <div className="calendar-section">
                        <h2>Select Date</h2>
                        <div className="calendar-wrapper">
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                minDate={new Date()}
                                maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)}
                            />
                        </div>
                    </div>

                    <div className="time-slots-section">
                        <h2>Select Time</h2>
                        {loading ? (
                            <div className="loading">Loading time slots...</div>
                        ) : (
                            <div className="time-slots-grid">
                                {timeSlots.map((time) => (
                                    <button
                                        key={time}
                                        className={`time-slot ${
                                            bookedTimeSlots.includes(time)
                                                ? 'booked'
                                                : selectedTime === time
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onClick={() => handleTimeSelect(time)}
                                        disabled={bookedTimeSlots.includes(time)}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="appointment-summary">
                    <h2>Appointment Summary</h2>
                    <p>Date: {selectedDate.toLocaleDateString()}</p>
                    <p>Time: {selectedTime || 'Not selected'}</p>
                    <p>Instructor: {instructor.name}</p>
                    <p>Course: {courseName}</p>
                </div>

                <button
                    className="book-appointment-btn"
                    onClick={handleSubmit}
                    disabled={!selectedTime || loading || !courseName}
                >
                    {loading ? 'Booking...' : 'Book Appointment'}
                </button>
            </div>
        </div>
    );
};

export default Appointments;
