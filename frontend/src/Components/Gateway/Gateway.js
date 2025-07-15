import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import Nav2 from '../Nav/Nav2';
import './Gateway.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheck, faCreditCard, faCalendarAlt, faShieldAlt, faComments, faPhone, faEnvelope, faIdCard, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faLinkedinIn, faTwitter, faInstagram, faYoutube, faCcVisa, faCcMastercard, faCcAmex, faCcDiscover } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51OxN7CJEfyOBrRmEJq35RrYGrhYn2oEJiRYLykJ3Ub1j1QdShYFMPxF5gKs1saSLz34kkWAe8GqBLkpLKcLAafIv00RxIFNw6Q');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const savePaymentToDatabase = async (paymentData) => {
  try {
    console.log('Saving payment to database with ID:', paymentData.paymentId);
    const response = await axios.post('http://localhost:5000/payments', paymentData);
    console.log('Payment saved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving payment to database:', error);
    throw error;
  }
};

const CheckoutForm = () => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0,
    currency: 'USD',
    description: 'Driving Course',
    itemName: 'Driving Course Package'
  });
  
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the logged-in user from AuthContext

  useEffect(() => {
    // Retrieve payment data from localStorage
    const storedName = localStorage.getItem('paymentName');
    const storedEmail = localStorage.getItem('paymentEmail');
    const storedAmount = localStorage.getItem('paymentAmount');
    const storedCourse = localStorage.getItem('paymentCourse');
    
    // Set the values if available
    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
    if (storedAmount && storedCourse) {
      setPaymentDetails({
        amount: parseFloat(storedAmount),
        currency: 'USD',
        description: storedCourse,
        itemName: storedCourse
      });
    }
    
    // In a real implementation, fetch the client secret from your server
    // This is just for demo purposes
    setTimeout(() => {
      setClientSecret('demo_secret_key_123456789');
    }, 1000);
  }, []);

  const handleChange = (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);

    // In a real implementation, you would confirm the payment with Stripe here
    // For demo purposes, we'll simulate a successful payment
    setTimeout(async () => {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      
      // Generate a unique payment ID
      const storedPaymentId = localStorage.getItem('paymentId');
      console.log('Retrieved payment ID from localStorage:', storedPaymentId);
      const paymentId = storedPaymentId || ('PAY-' + Math.floor(100000 + Math.random() * 900000));
      
      // If no stored payment ID exists, store the new one
      if (!storedPaymentId) {
        console.log('No stored payment ID found, generating new one:', paymentId);
        localStorage.setItem('paymentId', paymentId);
      }
      
      // Store current payment date in localStorage
      localStorage.setItem('paymentDate', new Date().toISOString());
      
      // Save payment to database
      try {
        // Get user ID from AuthContext
        const userId = user?.id || user?.studentId;
        
        if (!userId) {
          throw new Error('No user ID found. Please log in to make a payment.');
        }
        
        // Create payment object
        const paymentData = {
          paymentId: paymentId,
          studentId: userId,
          studentName: name,
          email: email,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          paymentDate: new Date(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Due date 30 days from now
          paymentMethod: 'Credit Card',
          status: 'Completed',
          courseId: 'C' + Math.floor(1000 + Math.random() * 9000),
          courseName: paymentDetails.itemName,
          paymentDescription: 'Payment for ' + paymentDetails.itemName,
          transactionId: 'TXN' + Math.floor(100000 + Math.random() * 900000),
          receiptNumber: 'RCP' + Math.floor(100000 + Math.random() * 900000),
          paymentPeriod: 'One-time',
          discountApplied: 0,
          taxAmount: 0,
          totalAmount: paymentDetails.amount
        };
        
        // Save to database
        await savePaymentToDatabase(paymentData);
        
        // Store all payment details in localStorage for fallback
        localStorage.setItem('paymentStatus', 'Completed');
        localStorage.setItem('paymentCourse', paymentDetails.itemName);
        localStorage.setItem('paymentItemName', paymentDetails.itemName);
        localStorage.setItem('paymentTransactionId', paymentData.transactionId);
        
        // Redirect to success page
        setTimeout(() => {
          navigate('/payment-success');
        }, 2000);
      } catch (error) {
        console.error('Failed to save payment data:', error);
        setError(error.message);
        setProcessing(false);
        setSucceeded(false);
      }
    }, 2000);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="gw-form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>
      
      <div className="gw-form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john.doe@example.com"
          required
        />
      </div>
      
      <div className="gw-form-group gw-card-group">
        <label>
          <FontAwesomeIcon icon={faCreditCard} className="gw-icon" /> 
          Card Information
        </label>
        <div className="gw-card-element-container">
          <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} onChange={handleChange} />
        </div>
      </div>
      
      {error && (
        <div className="gw-card-error" role="alert">
          {error}
        </div>
      )}
      
      <div className="gw-payment-summary">
        <h3>Payment Summary</h3>
        <div className="gw-summary-item">
          <span>{paymentDetails.itemName}</span>
          <span>${paymentDetails.amount}</span>
        </div>
        <div className="gw-summary-item">
          <span>Tax</span>
          <span>$0.00</span>
        </div>
        <div className="gw-summary-total">
          <span>Total</span>
          <span>${paymentDetails.amount}</span>
        </div>
      </div>
      
      <button
        disabled={processing || disabled || succeeded}
        id="submit"
        className={`gw-payment-button ${succeeded ? 'gw-succeeded' : ''}`}
      >
        <span id="button-text">
          {processing ? (
            <div className="gw-spinner"></div>
          ) : succeeded ? (
            <><FontAwesomeIcon icon={faCheck} /> Payment Successful</>
          ) : (
            <>Pay ${paymentDetails.amount}</>
          )}
        </span>
      </button>
      
      <div className="gw-secure-badge">
        <FontAwesomeIcon icon={faLock} />
        <span>Secure Payment</span>
      </div>
      
      <div className="gw-payment-info">
        <p>
          <FontAwesomeIcon icon={faShieldAlt} className="gw-info-icon" />
          Your payment information is encrypted and secure
        </p>
      </div>
    </form>
  );
};

function Gateway() {
  const [orderSummary, setOrderSummary] = useState({
    amount: 0,
    currency: 'USD',
    description: 'Driving Course',
    itemName: 'Driving Course Package'
  });

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const storedAmount = localStorage.getItem('paymentAmount');
    const storedCourse = localStorage.getItem('paymentCourse');
    
    if (storedAmount && storedCourse) {
      setOrderSummary({
        amount: parseFloat(storedAmount),
        currency: 'USD',
        description: storedCourse,
        itemName: storedCourse
      });
    }
  }, []);

  return (
    <div>
      <Nav2 />
      <div className="gw-gateway-container">
        <div className="gw-gateway-content">
          <div className="gw-gateway-left">
            <div className="gw-gateway-header">
              <h1>Secure Checkout</h1>
              <p>Complete your payment to finalize your booking</p>
            </div>
            
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
          
          <div className="gw-gateway-right">
            <div className="gw-order-summary">
              <h2>Order Summary</h2>
              <div className="gw-order-item">
                <div className="gw-item-icon">
                  <FontAwesomeIcon icon={faIdCard} />
                </div>
                <div className="gw-item-details">
                  <h3>{orderSummary.itemName}</h3>
                  <p>{orderSummary.description}</p>
                  <span className="gw-item-price">${orderSummary.amount}</span>
                </div>
              </div>
              
              <div className="gw-order-features">
                <div className="gw-feature">
                  <FontAwesomeIcon icon={faCheck} className="gw-feature-icon" />
                  <span>Experienced instructors</span>
                </div>
                <div className="gw-feature">
                  <FontAwesomeIcon icon={faCheck} className="gw-feature-icon" />
                  <span>Flexible scheduling</span>
                </div>
                <div className="gw-feature">
                  <FontAwesomeIcon icon={faCheck} className="gw-feature-icon" />
                  <span>Practice test included</span>
                </div>
                <div className="gw-feature">
                  <FontAwesomeIcon icon={faCheck} className="gw-feature-icon" />
                  <span>Certificate upon completion</span>
                </div>
              </div>
              
              <div className="gw-payment-methods">
                <p>We accept:</p>
                <div className="gw-card-icons">
                  <div className="gw-card-icon-fa">
                    <FontAwesomeIcon icon={faCcVisa} className="gw-cc-icon" />
                  </div>
                  <div className="gw-card-icon-fa">
                    <FontAwesomeIcon icon={faCcMastercard} className="gw-cc-icon" />
                  </div>
                  <div className="gw-card-icon-fa">
                    <FontAwesomeIcon icon={faCcAmex} className="gw-cc-icon" />
                  </div>
                  <div className="gw-card-icon-fa">
                    <FontAwesomeIcon icon={faCcDiscover} className="gw-cc-icon" />
                  </div>
                </div>
              </div>
            </div>
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

export default Gateway;