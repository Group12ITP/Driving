import React from 'react'
import Nav from '../Nav/Nav';
import Nav2 from '../Nav/Nav2';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faComments, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function Home() {
  return (
    <div className="home-container">
      <Nav2/>
      <div className="hero-section">
        <div className="hero-content">
          <span className="subtitle">DRIVING LESSONS</span>
          <h1>Learn to drive.<br/>Get your license!</h1>
          <div className="cta-buttons">
            <button className="book-btn">BOOK ONLINE</button>
            <button className="payment-btn">PAYMENT PLANS</button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <h2>First day<br/>free training</h2>
          <p>Start your driving journey with confidence! At DriveMaster, we offer a First Day Free Training session to help you get comfortable behind the wheel </p>
        </div>

        <div className="feature-card">
          <h2>Well trained<br/>instructors</h2>
          <p>At DriveMaster, our expert instructors provide patient, professional guidance to help you master driving with ease</p>
        </div>

        <div className="feature-card">
          <h2>Safety tips &<br/>theory test</h2>
          <p>Drive smart with DriveMaster! We provide essential safety tips and thorough preparation for your theory test, ensuring you understand road rules and safe driving practices</p>
        </div>
      </div>
      
      {/* New Services Banner - wrapped in a div with overflow control */}
      <div className="services-banner-container">
        <div className="services-banner">
          <div className="services-content">
            <h2>Creative & Quality</h2>
            <h3>Is Our Services</h3>
            <p>
              We provide premium driving instruction with experienced instructors dedicated to your success.
              Our program offers comprehensive training, flexible scheduling, and personalized learning
              to ensure you become a confident, skilled driver.
            </p>
            
            <div className="services-icons">
              <div className="service-item">
                <div className="service-icon">
                  <i className="fas fa-car"></i>
                </div>
                <p>Driving Lessons</p>
              </div>
              
              <div className="service-item">
                <div className="service-icon">
                  <i className="fas fa-id-card"></i>
                </div>
                <p>License Training</p>
              </div>
              
              <div className="service-item">
                <div className="service-icon">
                  <i className="fas fa-road"></i>
                </div>
                <p>Road Skills</p>
              </div>
            </div>
            
            <div className="services-website">www.drivingschool.com</div>
          </div>
          
          <div className="services-image">
            {/* The image is added via CSS */}
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
  )
}

export default Home
