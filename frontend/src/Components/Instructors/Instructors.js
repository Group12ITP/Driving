import React, { useEffect, useRef, useState } from 'react'
import Nav from '../Nav/Nav';
import axios from 'axios';
import { FaSearch, FaSort, FaPlus } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import InstructorForm from './InstructorForm';
import '../UserDetails/users.css';
import '../Instructor/Instructor.css';
import './Instructors.css';

const URL = "http://localhost:5000/instructors";

function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const componentRef = useRef();

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(URL);
      console.log('API Response:', response.data); // Debug log
      if (response.data && Array.isArray(response.data)) {
        setInstructors(response.data);
      } else if (response.data && response.data.instructors) {
        setInstructors(response.data.instructors);
      } else {
        setInstructors([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching instructors:', err);
      setError('Failed to fetch instructor data. Please try again later.');
      setLoading(false);
    }
  };

  const handleEdit = (instructor) => {
    setSelectedInstructor(instructor);
    setIsModalOpen(true);
  };

  const handleDelete = async (instructorId) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await axios.delete(`${URL}/${instructorId}`);
        await fetchInstructors();
        setError(null);
      } catch (err) {
        setError('Failed to delete instructor. Please try again later.');
        console.error(err);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedInstructor) {
        await axios.put(`${URL}/${selectedInstructor._id}`, formData);
      } else {
        await axios.post(URL, formData);
      }
      await fetchInstructors();
      setIsModalOpen(false);
      setSelectedInstructor(null);
      setError(null);
    } catch (err) {
      setError('Failed to save instructor. Please try again later.');
      console.error(err);
    }
  };

  const handleSearch = () => {
    if (!instructors) return;
    
    const filteredInstructors = instructors.filter((instructor) =>
      Object.values(instructor).some((field) =>
        field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    
    setInstructors(filteredInstructors);
    setNoResults(filteredInstructors.length === 0);
  };

  const handlePrint = () => {
    const input = componentRef.current;
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
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('instructor-report.pdf');
    });
  };

  const handleSendReport = () => {
    const phoneNumber = "+94766324158";
    const message = `Instructor Reports`;
    const WhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    window.open(WhatsAppUrl, "_blank");
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="users-page">
      <Nav/>
      <div className="content-wrapper">
        <div className="search-container">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            name="search"
            placeholder="Search Instructors"
          />
          <button onClick={handleSearch}>Search</button>
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> Add Instructor
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {noResults ? (
          <div className="no-results">
            <p>No Instructors Found</p>
          </div>
        ) : (
          <div ref={componentRef} className="instructor-container">
            <table className="instructor-table">
              <thead>
                <tr>
                  <th onClick={() => {
                    setSortField('name');
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  }}>
                    Name {sortField === 'name' && <FaSort className={`sort-icon ${sortDirection}`} />}
                  </th>
                  <th onClick={() => {
                    setSortField('gmail');
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  }}>
                    Email {sortField === 'gmail' && <FaSort className={`sort-icon ${sortDirection}`} />}
                  </th>
                  <th onClick={() => {
                    setSortField('phone');
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  }}>
                    Phone {sortField === 'phone' && <FaSort className={`sort-icon ${sortDirection}`} />}
                  </th>
                  <th onClick={() => {
                    setSortField('gender');
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  }}>
                    Gender {sortField === 'gender' && <FaSort className={`sort-icon ${sortDirection}`} />}
                  </th>
                  <th onClick={() => {
                    setSortField('age');
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  }}>
                    Age {sortField === 'age' && <FaSort className={`sort-icon ${sortDirection}`} />}
                  </th>
                  <th onClick={() => {
                    setSortField('experience');
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  }}>
                    Experience {sortField === 'experience' && <FaSort className={`sort-icon ${sortDirection}`} />}
                  </th>
                  <th onClick={() => {
                    setSortField('hiredate');
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  }}>
                    Hire Date {sortField === 'hiredate' && <FaSort className={`sort-icon ${sortDirection}`} />}
                  </th>
                  <th onClick={() => {
                    setSortField('salary');
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  }}>
                    Salary {sortField === 'salary' && <FaSort className={`sort-icon ${sortDirection}`} />}
                  </th>
                  <th onClick={() => {
                    setSortField('workinghours');
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  }}>
                    Working Hours {sortField === 'workinghours' && <FaSort className={`sort-icon ${sortDirection}`} />}
                  </th>
                  <th onClick={() => {
                    setSortField('licenseNumber');
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  }}>
                    License Number {sortField === 'licenseNumber' && <FaSort className={`sort-icon ${sortDirection}`} />}
                  </th>
                  <th onClick={() => {
                    setSortField('vehcleId');
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  }}>
                    Vehicle ID {sortField === 'vehcleId' && <FaSort className={`sort-icon ${sortDirection}`} />}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructors && instructors.length > 0 ? (
                  instructors.map((instructor) => (
                    <tr key={instructor._id}>
                      <td>{instructor.name || 'N/A'}</td>
                      <td>{instructor.gmail || 'N/A'}</td>
                      <td>{instructor.phone || 'N/A'}</td>
                      <td>{instructor.gender || 'N/A'}</td>
                      <td>{instructor.age || 'N/A'}</td>
                      <td>{instructor.experience ? `${instructor.experience} years` : 'N/A'}</td>
                      <td>{formatDate(instructor.hiredate)}</td>
                      <td>{instructor.salary ? `$${instructor.salary}` : 'N/A'}</td>
                      <td>{instructor.workinghours || 'N/A'}</td>
                      <td>{instructor.licenseNumber || 'N/A'}</td>
                      <td>{instructor.vehcleId || 'N/A'}</td>
                      <td className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEdit(instructor)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(instructor._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="no-data">No instructor data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="button-container">
          <button className="button-1" onClick={handlePrint}>Download Report</button>
          <button className="button-2" onClick={handleSendReport}>Send WhatsApp Message</button>
        </div>

        <InstructorForm
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedInstructor(null);
          }}
          onSubmit={handleSubmit}
          instructor={selectedInstructor}
        />
      </div>
    </div>
  );
}

export default Instructors;
