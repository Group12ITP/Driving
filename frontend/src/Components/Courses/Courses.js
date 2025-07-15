import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav2 from '../Nav/Nav2';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faComments, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './Courses.css';

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    const fetchCourseAndInstructors = async () => {
      try {
        // Get the latest completed payment to get course name
        const paymentResponse = await axios.get(`http://localhost:5000/payments/student/${user.studentId}`);
        const completedPayments = paymentResponse.data.payments.filter(
          payment => payment.status === 'Completed'
        );
        
        if (completedPayments.length === 0) {
          navigate('/payment');
          return;
        }

        const latestPayment = completedPayments[0];
        setCourseName(latestPayment.courseName);

        // Determine course type from course name
        let courseType;
        const courseNameLower = latestPayment.courseName.toLowerCase();
        
        if (courseNameLower.includes('bike') && !courseNameLower.includes('car')) {
          // Bike only course - fetch from BikeInstructorModel
          courseType = 'bike';
        } else if (courseNameLower.includes('car') || 
                  (courseNameLower.includes('bike') && courseNameLower.includes('car'))) {
          // Car or Bike+Car course - fetch from BikeCarInstructorModel
          courseType = 'bikecar';
        } else if (courseNameLower.includes('heavy') || 
                  courseNameLower.includes('truck') ||
                  courseNameLower.includes('bus')) {
          // Heavy vehicle course - fetch from HeavyVehicleInstructorModel
          courseType = 'heavy';
        }

        if (!courseType) {
          setError('Could not determine course type from course name');
          setLoading(false);
          return;
        }

        // Fetch instructors using the robust backend route
        const instructorResponse = await axios.get(`http://localhost:5000/instructors/course/${courseType}`);
        if (instructorResponse.data && instructorResponse.data.instructors) {
          setInstructors(instructorResponse.data.instructors);
          setError(null);
        } else {
          setError('No instructors found for this course type');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch course data: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    if (user && user.studentId) {
      fetchCourseAndInstructors();
    }
  }, [user, navigate]);

  const handleInstructorSelect = (instructor) => {
    navigate('/appointments', { state: { instructor } });
  };

  return (
    <div className="course-container">
      <Nav2 />
      
      <div className="course-content">
        <h1>Select Your Instructor for {courseName}</h1>
        
        {error && <div className="course-error-message">{error}</div>}

        {loading ? (
          <div className="course-loading">Loading instructors...</div>
        ) : instructors.length === 0 ? (
          <div className="course-error-message">No instructors available for this course type</div>
        ) : (
          <div className="course-instructors-grid">
            {instructors.map((instructor) => (
              <div key={instructor._id} className="course-instructor-card">
                <img src={instructor.image} alt={instructor.name} className="course-instructor-image" />
                <div className="course-instructor-info">
                  <h3>{instructor.name}</h3>
                  <p className="course-specialization">{instructor.specialization}</p>
                  <p className="course-experience">{instructor.experience} years experience</p>
                  <div className="course-rating">
                    <span>★</span> {instructor.ratings} ({instructor.reviewCount} reviews)
                  </div>
                  <p className="course-description">{instructor.description}</p>
                  <button 
                    className="course-select-instructor-btn"
                    onClick={() => handleInstructorSelect(instructor)}
                  >
                    Select Instructor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <footer className="course-footer">
        <div className="course-footer-container">
          {/* Contact Section */}
          <div className="course-footer-contact">
            <div className="course-contact-item">
              <FontAwesomeIcon icon={faComments} />
              <span>Chat With Us</span>
            </div>
            
            <div className="course-contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <span>1 (555) 123-4567</span>
            </div>
            
            <div className="course-contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>info@drivemaster.com</span>
            </div>
          </div>

          {/* Footer Columns */}
          <div className="course-footer-columns">
            {/* Services Column */}
            <div className="course-footer-column">
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
            <div className="course-footer-column">
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
            <div className="course-footer-column">
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
            <div className="course-footer-social">
              <a href="#" className="course-social-icon"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#" className="course-social-icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
              <a href="#" className="course-social-icon"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#" className="course-social-icon"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#" className="course-social-icon"><FontAwesomeIcon icon={faYoutube} /></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="course-footer-bottom">
          <div className="course-footer-copyright">
            <img src="/logo-small.png" alt="Drive Master" className="course-footer-logo" />
            <span>Powered by Drive Master Academy</span>
          </div>
          <div className="course-footer-legal">
            <a href="#">Book Your Lesson Today</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Courses;
