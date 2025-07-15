import React, { useState, useEffect } from 'react';
import Nav2 from '../Nav/Nav2';
import './PayDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faPhone, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faLinkedinIn, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PayDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Get user from AuthContext
  
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    courseName: 'Bike and Car Only',
    amount: '99',
    paymentDate: '07/05/2023',
    paymentMethod: 'Credit/Debit Card',
    email: '',
    mobile: ''
  });

  useEffect(() => {
    if (!user) {
      // Redirect to login if no user is logged in
      navigate('/login');
      return;
    }
    
    // Get data from localStorage that was set in previous steps
    const selectedCourse = localStorage.getItem('selectedCourse');
    const selectedPackage = localStorage.getItem('selectedPackage');
    const packagePrice = localStorage.getItem('packagePrice');
    const paymentMethod = localStorage.getItem('paymentMethod');
    
    // Map course values to display names
    const courseNameMap = {
      'bike': 'Bike Only',
      'bikecar': 'Bike and Car Only',
      'heavy': 'Heavy Vehicles'
    };

    // For debugging - log the user object to see what's available
    console.log("User data from session:", user);

    setFormData({
      studentId: user.studentId || user.id || 'DS0001',
      studentName: user.name || user.username || 'Kanchana',
      email: user.gmail || user.email || 'www@gmail.com',
      mobile: user.phoneNumber || '+01 9876 4321',
      courseName: courseNameMap[selectedCourse] || 'Bike and Car Only',
      amount: packagePrice || '99',
      paymentDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '/'),
      paymentMethod: paymentMethod === 'deposit' ? 'Deposit' : 'Credit/Debit Card'
    });
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a payment ID to be used consistently
    const paymentId = 'PAY-' + Math.floor(100000 + Math.random() * 900000);
    
    // Store payment details in localStorage for Stripe to access
    localStorage.setItem('paymentName', formData.studentName);
    localStorage.setItem('paymentEmail', formData.email);
    localStorage.setItem('paymentAmount', formData.amount);
    localStorage.setItem('paymentCourse', formData.courseName);
    localStorage.setItem('paymentStudentId', formData.studentId);
    localStorage.setItem('paymentId', paymentId);
    
    // Redirect to Stripe payment gateway
    navigate('/stripe-payment');
  };

  const handleCancel = () => {
    navigate('/paymethod'); // Go back to payment method selection
  };

  return (
    <>
      <Nav2 />
      <div className="pay-details-container1">
        <div className="pay-details-card1">
          <div className="pay-details-left1">
            <div className="avatar-section1">
              <div className="avatar-container1">
                <FontAwesomeIcon icon={faUser} className="user-icon1" />
              </div>
              <h2>Let's get you set up</h2>
              <p>It should only take a couple of minutes to pair with your watch</p>
              <div className="next-button1">
                <button className="circle-button1">
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>
          <div className="pay-details-right1">
            <form onSubmit={handleSubmit}>
              <div className="form-group1">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={formData.studentName} 
                  readOnly 
                />
              </div>

              <div className="form-group1">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  readOnly 
                />
              </div>
              
              <div className="form-group1">
                <label htmlFor="mobile">Mobile</label>
                <input 
                  type="text" 
                  id="mobile" 
                  value={formData.mobile}
                  readOnly 
                />
              </div>
              
              <div className="form-group1">
                <label htmlFor="customerId">Customer ID</label>
                <input 
                  type="text" 
                  id="customerId" 
                  value={formData.studentId}
                  readOnly 
                />
              </div>
              
              <div className="membership-group1">
                <label className='membership-label1'>Membership</label>
                <div className="membership-options1">
                  <div className="membership-option1">
                    <input type="radio" id="classic" name="membership1" checked readOnly />
                    <label htmlFor="classic">Classic</label>
                  </div>
                  <div className="membership-option1">
                    <input type="radio" id="silver" name="membership1" readOnly />
                    <label htmlFor="silver">Silver</label>
                  </div>
                  <div className="membership-option1">
                    <input type="radio" id="gold" name="membership1" readOnly />
                    <label htmlFor="gold">Gold</label>
                  </div>
                </div>
              </div>
              
              <div className="form-group1">
                <label htmlFor="courseName">Course Name</label>
                <input 
                  type="text" 
                  id="courseName" 
                  value={formData.courseName}
                  readOnly 
                />
              </div>
              
              <div className="form-group1">
                <label htmlFor="amount">Amount <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="amount" 
                  value={`$${formData.amount}`}
                  readOnly 
                />
              </div>
              
              <div className="form-group1">
                <label htmlFor="paymentDate">Payment Date</label>
                <input 
                  type="text" 
                  id="paymentDate" 
                  value={formData.paymentDate}
                  readOnly 
                />
              </div>
              
              <div className="form-group1">
                <label htmlFor="paymentMethod">Payment Method</label>
                <input 
                  type="text" 
                  id="paymentMethod" 
                  value={formData.paymentMethod}
                  readOnly 
                />
              </div>
              
              <div className="form-actions1">
                <button type="button" className="cancel-btn1" onClick={handleCancel}>CANCEL</button>
                <button type="submit" className="save-btn1">SAVE</button>
              </div>
            </form>
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
