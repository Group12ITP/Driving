import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaSave, FaUser, FaBook, FaDollarSign, FaCalendarAlt, FaCreditCard, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import Nav from '../Nav/Nav';
import './Payments.css';

const AddPayment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Generate a random payment ID
  const generatePaymentId = () => {
    return `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  };
  
  // Sample data for courses only
  const courses = [
    { id: 'course1', name: 'Bike Only' },
    { id: 'course2', name: 'Bike and Car Only' },
    { id: 'course3', name: 'Heavy Vehicles' },

  ];
  
  // Form data state
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    email: '',
    amount: '',
    dueDate: '',
    paymentMethod: '',
    courseId: '',
    courseName: '',
    status: 'Pending',
    totalAmount: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Auto-calculate total amount when amount changes
    if (name === 'amount') {
      const amount = parseFloat(value) || 0;
      setFormData(prev => ({
        ...prev,
        totalAmount: amount.toFixed(2)
      }));
    }
  };
  
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const selectedCourse = courses.find(course => course.id === courseId);
    
    if (selectedCourse) {
      setFormData({
        ...formData,
        courseId: selectedCourse.id,
        courseName: selectedCourse.name
      });
    } else {
      setFormData({
        ...formData,
        courseId: '',
        courseName: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.studentId || !formData.studentName || !formData.courseId || 
        !formData.amount || !formData.dueDate || !formData.paymentMethod) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Create a complete payment object with all required fields
      const paymentData = {
        ...formData,
        paymentId: generatePaymentId(),
        // We need to handle studentId differently since the backend expects an ObjectId
        // For now, we'll keep it as a string and let the server handle validation
        currency: 'USD',
        paymentDescription: 'Regular payment',
        // Convert string values to numbers for numeric fields
        amount: parseFloat(formData.amount),
        totalAmount: parseFloat(formData.totalAmount),
        discountApplied: 0,
        taxAmount: 0,
        paymentDate: new Date().toISOString().split('T')[0], // Always use current date for payment date
        receiptNumber: `RCPT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      };
      
      console.log('Sending payment data:', paymentData);
      
      // Create a modified version of the data for our API call
      // The backend expects studentId to be a MongoDB ObjectId, but we're sending a string
      // We'll handle the validation in the backend
      const response = await axios.post('http://localhost:5000/payments', paymentData);
      console.log('API response:', response);
      
      if (response.status === 201) {
        navigate('/payments'); // Redirect to payments list
      }
    } catch (err) {
      console.error('API error details:', err.response?.data);
      
      // If we get a specific error about studentId format, we can handle it here
      if (err.response?.data?.error && err.response?.data?.error.includes('studentId')) {
        setError('Invalid Student ID format. Please use a valid ID format.');
      } else {
        setError(err.response?.data?.message || 'Failed to add payment. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate("/payments");
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="payments-page">
      <Nav />
      
      <div className="add-payment-container">
        <div className="add-payment-header">
          <h2>Add New Payment</h2>
          <button className="back-button" onClick={handleBackClick}>
            <FaArrowLeft /> Back to Payments
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button className="clear-error" onClick={clearError}>
              ×
            </button>
          </div>
        )}

        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-section">
              <h3><FaUser /> Student Information</h3>
              
              <div className="form-group2">
                <label htmlFor="studentName">Student Name</label>
                <div className="input-with-icon">
                  <FaUser className="field-icon" />
                  <input 
                    type="text" 
                    id="studentName" 
                    name="studentName" 
                    value={formData.studentName} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group2">
                <label htmlFor="studentId">Student ID</label>
                <div className="input-with-icon">
                  <FaUser className="field-icon" />
                  <input 
                    type="text" 
                    id="studentId" 
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group2">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <FaEnvelope className="field-icon" />
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group2">
                <label htmlFor="courseId">Course</label>
                <div className="input-with-icon">
                  <FaBook className="field-icon" />
                  <select 
                    id="courseId" 
                    name="courseId" 
                    value={formData.courseId} 
                    onChange={handleCourseChange}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3><FaDollarSign /> Payment Details</h3>
              
              <div className="form-group2">
                <label htmlFor="amount">Amount ($)</label>
                <div className="input-with-icon">
                  <FaDollarSign className="field-icon" />
                  <input 
                    type="number" 
                    id="amount" 
                    name="amount" 
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group2">
                <label htmlFor="dueDate">Date</label>
                <div className="input-with-icon">
                  <FaCalendarAlt className="field-icon" />
                  <input 
                    type="date" 
                    id="dueDate" 
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group2">
                <label htmlFor="paymentMethod">Payment Method</label>
                <div className="input-with-icon">
                  <FaCreditCard className="field-icon" />
                  <select 
                    id="paymentMethod" 
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Credit Card">Deposit</option>
                    <option value="Debit Card">Credit/Debit Card</option>

                  </select>
                </div>
              </div>

              <div className="form-group2">
                <label htmlFor="status">Status</label>
                <div className="input-with-icon">
                  <FaInfoCircle className="field-icon" />
                  <select 
                    id="status" 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Partially Paid">Partially Paid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="save-payment-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : <><FaSave /> Save Payment</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPayment;