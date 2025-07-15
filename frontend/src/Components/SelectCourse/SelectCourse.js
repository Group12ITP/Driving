import React, { useState } from 'react';
import Nav2 from '../Nav/Nav2';
import './SelectCourse.css';
import staticImage from './static-image.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle, faCar, faTruck, faComments, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faLinkedinIn, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';

const courseOptions = [
  { label: 'Bike Only', value: 'bike', icon: <FontAwesomeIcon icon={faMotorcycle} /> },
  { label: 'Bike and Car Only', value: 'bikecar', icon: <><FontAwesomeIcon icon={faMotorcycle} /> <FontAwesomeIcon icon={faCar} /></> },
  { label: 'Heavy Vehicles', value: 'heavy', icon: <FontAwesomeIcon icon={faTruck} /> },
];

export default function SelectCourse() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selected) {
      // Store selected course in localStorage
      localStorage.setItem('selectedCourse', selected);
      navigate('/paymethod');
    }
  };

  const handleBack = () => {
    navigate('/packages');
  };

  return (
    <>
      <Nav2 />
      <div className="select-course-outer">
        <div className="select-course-container">
          <div className="select-course-left">
          <div className="progress-bar">
              <div className="progress-dot"></div>
              <div className="progress-dot active1"></div>
            </div>
            <div className="step-info">1 of 3</div>
            <h2 className="question-title">What kind of course do you want?</h2>
            <div className="course-options">
              {courseOptions.map((option) => (
                <div
                  key={option.value}
                  className={`course-card${selected === option.value ? ' selected' : ''}`}
                  onClick={() => setSelected(option.value)}
                >
                  <span className="course-icon">{option.icon}</span>
                  {option.label}
                </div>
              ))}
            </div>
            <div className="navigation-buttons">
              <button className="back-btn1" onClick={handleBack}>Back</button>
              <button className="continue-btn" disabled={!selected} onClick={handleContinue}>Continue</button>
            </div>
          </div>
          <div className="select-course-right">
            <img src={staticImage} alt="Course selection" className="static-image" />
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
    </>
  );
}
