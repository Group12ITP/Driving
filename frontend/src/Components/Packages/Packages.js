import React, { useState, useEffect } from 'react';
import './Packages.css';
import Nav2 from '../Nav/Nav2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faStar, faTimes, faCheckCircle, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faLinkedinIn, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faComments, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PaymentService from '../../services/PaymentService';

const packages = [
  { name: 'Basic', price: '99', referralBonus: '50' },
  { name: 'Standard', price: '350', referralBonus: '100' },
  { name: 'Premium', price: '750', referralBonus: '150' }
];

const Packages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [packageStatus, setPackageStatus] = useState({
    hasAnyActive: false,
    packages: {
      Basic: { isPaid: false, expiryDate: null },
      Standard: { isPaid: false, expiryDate: null },
      Premium: { isPaid: false, expiryDate: null }
    }
  });
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);
  
  // For debugging - log user on component mount
  useEffect(() => {
    console.log("Auth context user:", user);
    
    // Check if we have a user in localStorage but not in context
    const savedUser = localStorage.getItem('user');
    const userId = user?._id || localStorage.getItem('userId');
    
    console.log("User ID to check payments for:", userId);
    
    if (savedUser && !user) {
      console.log("Warning: User found in localStorage but not in context");
    }
    
    // Check payment status when user info is available
    if (userId) {
      checkPaymentStatus(userId);
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkPaymentStatus = async (userId) => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Retrieve all payments for debugging
      const allPayments = await PaymentService.getPaymentsByStudentId(userId);
      
      console.log(`Found ${allPayments.length} payment(s) for user ID ${userId}`);
      
      setDebugInfo({
        userId: userId,
        paymentsFound: allPayments.length,
        payments: allPayments.map(p => ({
          id: p._id || p.paymentId,
          status: p.status,
          course: p.courseName,
          date: p.paymentDate,
          amount: p.amount
        }))
      });
      
      // Get all active packages for this user
      const activePackages = await PaymentService.getActivePackages(userId);
      setPackageStatus(activePackages);
      
      console.log("Payment status checked:", activePackages);
    } catch (error) {
      console.error("Error checking payment status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (packageName, packagePrice) => {
    // Debug log
    console.log("Buy Now clicked, user:", user);
    
    // Check if user is logged in - also check if user object is empty
    if (!user || Object.keys(user).length === 0) {
      console.log("User not logged in, showing popup");
      // Show login message
      setShowLoginMessage(true);
      return;
    }
    
    console.log("User is logged in, proceeding to next step");
    // Store selected package info in localStorage
    localStorage.setItem('selectedPackage', packageName);
    localStorage.setItem('packagePrice', packagePrice);
    navigate('/selectcourse');
  };

  const handleCloseMessage = () => {
    setShowLoginMessage(false);
  };

  const handleGoToLogin = () => {
    setShowLoginMessage(false);
    navigate('/login');
  };

  // Force payment check
  const handleForceCheck = () => {
    const userId = user?._id || localStorage.getItem('userId');
    if (userId) {
      checkPaymentStatus(userId);
    } else {
      alert("No user ID found. Please log in first.");
    }
  };

  // Helper function to format expiry date
  const formatExpiryDate = (dateObj) => {
    if (!dateObj) return '';
    return new Date(dateObj).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to render the correct button based on payment status
  const renderActionButton = (packageName, packagePrice) => {
    if (loading) {
      return <button className="loading-btn" disabled>Loading...</button>;
    }
    
    // If this package is paid
    if (packageStatus.packages[packageName]?.isPaid) {
      return (
        <div className="paid-indicator">
          <FontAwesomeIcon icon={faCheckCircle} className="paid-icon" />
          <span>Paid</span>
          {packageStatus.packages[packageName]?.expiryDate && (
            <div className="expiry-date">
              <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
              <span>Expires: {formatExpiryDate(packageStatus.packages[packageName].expiryDate)}</span>
            </div>
          )}

          

          
        </div>
      );
    }

    
    
    // Default: show buy now button
    return (
      <button className="buy-now-btn" onClick={() => handleBuyNow(packageName, packagePrice)}>
        Buy Now
      </button>
    );
  };

  // Render the popup whenever showLoginMessage is true
  console.log("Render state - showLoginMessage:", showLoginMessage);

  return (
    <div className="packages-page">
      {/* Navigation */}
      <Nav2 />

      

      {/* Login Message Popup */}
      {showLoginMessage && (
        <div className="login-message-overlay">
          <div className="login-message-popup">
            <div className="login-message-icon">
              <FontAwesomeIcon icon={faCheck} />
            </div>
            <h3>Please Login</h3>
            <p>Please log in to book packages</p>
            <div className="login-message-buttons">
              <button className="login-message-cancel" onClick={handleCloseMessage}>Cancel</button>
              <button className="login-message-dashboard" onClick={handleGoToLogin}>Login</button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Header */}
      <header className="pricing-header">
        <h1>The Perfect Plan for Your Driving Journey</h1>
        <p>Our transparent pricing makes it easy to find a plan that works within your financial constraints.</p>
      </header>

      {/* Pricing Cards Container */}
      <div className="pricing-container11">
        {/* Basic Package */}
        <div className="pricing-card11">
          <div className="card-header11">
            <h3>Basic</h3>
            <div className="price11">
              <span className="amount11">$99</span>
              <span className="period11">/course</span>
            </div>
            <p className="referral11">Up to $50 referral bonus</p>
          </div>
          
          <div className="card-content11">
            <p className="includes11">Includes:</p>
            <ul className="features-list11">
              <li>
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                <span>5 Hours of driving lessons</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                <span>Basic theory materials</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                <span>Core platform features</span>
              </li>
            </ul>
            {renderActionButton('Basic', '99')}
          </div>
        </div>

        {/* Standard Package - Recommended */}
        <div className="pricing1-card recommended">
          <div className="card-header11">
            <h3>Standard</h3>
            <div className="price11">
              <span className="amount11">$350</span>
              <span className="period11">/course</span>
            </div>
            <p className="referral11">Up to $100 referral bonus</p>
          </div>
          
          <div className="card-content11">
            <p className="package-intro11">Everything in Basic, Plus:</p>
            <ul className="features-list11">
              <li>
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                <span>10 Hours of driving lessons</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                <span>Advanced theory training</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                <span>Mock driving tests</span>
              </li>
            </ul>
            {renderActionButton('Standard', '350')}
          </div>
          
          <div className="recommend-badge11">Recommended</div>
        </div>

        {/* Premium Package */}
        <div className="pricing-card11">
          <div className="card-header11">
            <h3>Premium</h3>
            <div className="price11">
              <span className="amount11">$750</span>
              <span className="period11">/course</span>
            </div>
            <p className="referral11">Up to $150 referral bonus</p>
          </div>
          
          <div className="card-content11">
            <p className="package-intro11">Everything in Standard, Plus:</p>
            <ul className="features-list11">
              <li>
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                <span>20 Hours of driving lessons</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                <span>Guranteed progress</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                <span>Guaranteed test booking</span>
              </li>
            </ul>
            {renderActionButton('Premium', '750')}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="pricing-cta11">
        <div className="cta-left">
          <h3>Get It Fast to Lock In Special Price</h3>
        </div>
        <div className="cta-right">
          <button className="book-demo-btn">Book Demo Lesson Now!</button>
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
};

export default Packages;