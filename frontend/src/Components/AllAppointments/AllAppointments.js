import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './AllAppointments.css';

const URL = 'http://localhost:5000/api/appointments/';

const fetchAppointments = async () => {
  return await axios.get(URL).then((res) => res.data);
};

// Format instructor ID based on course type
const formatInstructorId = (courseName, instructorId) => {
  if (!courseName) return instructorId;
  
  const courseNameLower = courseName.toLowerCase();
  
  if (courseNameLower.includes('bike') && !courseNameLower.includes('car')) {
    return `BO${instructorId.toString().padStart(3, '0')}`;
  } else if (courseNameLower.includes('bike') && courseNameLower.includes('car')) {
    return `BC${instructorId.toString().padStart(3, '0')}`;
  } else if (courseNameLower.includes('heavy')) {
    return `HV${instructorId.toString().padStart(3, '0')}`;
  }
  
  return instructorId;
};

function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    instructorId: '',
    instructorName: '',
    courseName: '',
    date: '',
    time: '',
    status: ''
  });
  const tableRef = useRef(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    fetchAppointments().then((data) => setAppointments(data.appointments));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`${URL}${id}`);
        loadAppointments(); // Refresh the list
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment');
      }
    }
  };

  const handleUpdate = (appointment) => {
    const formattedDate = appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '';
    
    setCurrentAppointment(appointment);
    setFormData({
      studentId: appointment.studentId || '',
      studentName: appointment.studentName || '',
      instructorId: appointment.instructorId || '',
      instructorName: appointment.instructorName || '',
      courseName: appointment.courseName || '',
      date: formattedDate,
      time: appointment.time || '',
      status: appointment.status || 'pending'
    });
    setIsEditModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating appointment:', currentAppointment._id, formData);
      const response = await axios.put(`${URL}${currentAppointment._id}`, formData);
      console.log('Update response:', response);
      setIsEditModalOpen(false);
      loadAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle PDF report generation
  const handlePrintReport = () => {
    if (!tableRef.current || appointments.length === 0) {
      alert('No appointment data to download');
      return;
    }

    const input = tableRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      // Add title and date
      pdf.setFontSize(18);
      pdf.text('Appointments Report', pdfWidth / 2, 15, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 22, { align: 'center' });

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('appointments-report.pdf');
    });
  };

  // WhatsApp report sharing
  const handleSendReport = () => {
    const phoneNumber = "+94766324158"; // Update with appropriate phone number
    const message = `Appointments Report - ${new Date().toLocaleDateString()}\n${appointments.length} appointments found.`;
    const whatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsAppUrl, "_blank");
  };

  return (
    <div className="apt-container">
      <h2 className="atd-filter-title">Appointment Records</h2>
      <div ref={tableRef} className="apt-table-container">
        <table className="apt-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Instructor ID</th>
              <th>Instructor Name</th>
              <th>Course Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments && appointments.map((apt, i) => (
              <tr key={i}>
                <td>{apt.studentId}</td>
                <td>{apt.studentName}</td>
                <td>
                  {apt.formattedInstructorId || formatInstructorId(apt.courseName, apt.instructorId)}
                </td>
                <td>{apt.instructorName}</td>
                <td>{apt.courseName}</td>
                <td>{apt.date ? new Date(apt.date).toLocaleDateString() : ''}</td>
                <td>{apt.time}</td>
                <td>{apt.status}</td>
                <td>{apt.createdAt ? new Date(apt.createdAt).toLocaleString() : ''}</td>
                <td className="apt-action-buttons">
                  <button 
                    type="button"
                    className="apt-update-btn"
                    onClick={() => handleUpdate(apt)}
                  >
                    Update
                  </button>
                  <button 
                    type="button"
                    className="apt-delete-btn"
                    onClick={() => handleDelete(apt._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="apt-report-actions">
        <button className="apt-download-btn" onClick={handlePrintReport}>
          Download Report
        </button>
        
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && currentAppointment && (
        <div className="apt-modal-backdrop">
          <div className="apt-modal">
            <div className="apt-modal-header">
              <h3>Update Appointment</h3>
              <button 
                type="button"
                className="apt-close-btn"
                onClick={() => setIsEditModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input 
                type="hidden" 
                name="instructorId" 
                value={formData.instructorId}
              />
              <div className="apt-form-group">
                <label htmlFor="studentId">Student ID:</label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="apt-form-group">
                <label htmlFor="studentName">Student Name:</label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="apt-form-group">
                <label htmlFor="instructorName">Instructor Name:</label>
                <input
                  type="text"
                  id="instructorName"
                  name="instructorName"
                  value={formData.instructorName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="apt-form-group">
                <label htmlFor="courseName">Course Name:</label>
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="apt-form-group">
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="apt-form-group">
                <label htmlFor="time">Time:</label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Time</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                </select>
              </div>
              <div className="apt-form-group">
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="apt-form-actions">
                <button type="submit" className="apt-save-btn">Update Appointment</button>
                <button 
                  type="button" 
                  className="apt-cancel-btn"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllAppointments;
