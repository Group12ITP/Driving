import React from 'react';
import './AboutUs.css';
import Nav2 from '../Nav/Nav2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faComments, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import instructorImg from './123.jpg';
import carImage from './456.jpg';

const AboutUs = () => {
  // Using local instructor image and online images for other elements
  
  const headerBgUrl = "https://images.pexels.com/photos/3422964/pexels-photo-3422964.jpeg?auto=compress&cs=tinysrgb&w=1920";

  return (
    <div className="about-us-page">
      {/* Nav2 component is already included in the file */}
      <Nav2/>

      {/* Header Section */}
      <header className="about-header" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${headerBgUrl}')` }}>
        <h1>About Us</h1>
        <div className="breadcrumb">
          <span>Home</span> / <span>About Us</span>
        </div>
      </header>

      {/* Main Content Section */}
      <section className="container">
        <div className="about-intro">
          <div className="image-container">
            <img src={instructorImg} alt="Professional driving instructor" className="about-image" />
          </div>
          <div className="content-text">
            <div className="about-title">About Us</div>
            <h2>We Always Make The Best Drivers</h2>
            <p>
            Driving is the act of operating a motor vehicle to travel from one place to another. It involves controlling a car’s speed, direction, and movement while following road signs, traffic laws, and safety rules. Driving is not just a skill—it’s a responsibility that requires focus, awareness, and decision-making. Whether it's commuting to work, running errands, or going on a road trip, safe driving ensures not only your safety but also the well-being of others on the road. At a driving school, learners are taught both the practical skills and theoretical knowledge needed to become confident, responsible drivers.
            </p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>

        {/* Skills Section */}
        <div className="our-skills">
          <h3>Our Skills</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
          
          <div className="skills-container">
            <div className="skill-bar">
              <span className="skill-label">Defensive Driving</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: '85%' }}></div>
                <span>85%</span>
              </div>
            </div>
            <div className="skill-bar">
              <span className="skill-label">Road Safety</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: '90%' }}></div>
                <span>90%</span>
              </div>
            </div>
            <div className="skill-bar">
              <span className="skill-label">Vehicle Control</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: '77%' }}></div>
                <span>77%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="statistics">
          <div className="stat-item">
            <h3>20+</h3>
            <p>Year Of Experience</p>
          </div>
          <div className="stat-item">
            <h3>1,000+</h3>
            <p>Students Trained</p>
          </div>
          <div className="stat-item">
            <h3>300+</h3>
            <p>Satisfied Clients</p>
          </div>
          <div className="stat-item">
            <h3>64</h3>
            <p>Certified Instructors</p>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="cta-section">
          <div className="overlay-text">
            <div className="hire-label">Book A Lesson Now</div>
            <h2>We Are Always Ready To Help You Become A Great Driver</h2>
            <button className="get-started-btn">Get Started</button>
          </div>
          <img src={carImage} alt="Training vehicle" className="cta-image" />
        </div>
      </section>

      {/* Footer Section - Added from the Home component */}
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

export default AboutUs;
