import React, { useRef } from 'react';
import Nav2 from '../Nav/Nav2';
import emailjs from '@emailjs/browser';
import './ContactUs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function ContactUs() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_3lciqid', 'template_3bpjw8m', form.current, {
        publicKey: 'GrbkYUTTLEDZSy4SQ',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          alert('Email Sent Successfully!');
          form.current.reset(); 
        },
        (error) => {
          console.error('FAILED...', error);
          alert('Failed to send email. Please try again.');
        }
      );
  };

  return (
    <div className="contact-page">
      <Nav2 />
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We are here to help you with any questions or concerns you may have. Please use the form below to send us a message and we will get back to you as soon as possible.</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-info-item">
            <div className="contact-icon-circle">📍</div>
            <div className="contact-info-text">
              <h3>Address</h3>
              <p>4671 Castle Lane, Kandy, Sri Lanka, 20005</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-icon-circle">📞</div>
            <div className="contact-info-text">
              <h3>Phone</h3>
              <p>081-2462801</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-icon-circle">✉️</div>
            <div className="contact-info-text">
              <h3>Email</h3>
              <p>DriveMaster@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h2 className="contact-form-heading">Send a Message</h2>
          <form ref={form} onSubmit={sendEmail}>
            <div className="contact-form-group">
              <input type="text" name="user_name" required />
              <label>Full Name</label>
            </div>
            
            <div className="contact-form-group">
              <input type="email" name="user_email" required />
              <label>Email</label>
            </div>
            
            <div className="contact-form-group contact-textarea">
              <textarea name="message" required />
              <label>Type your Message...</label>
            </div>
            
            <button type="submit" className="contact-submit-btn">
              <FontAwesomeIcon icon={faPaperPlane} className="contact-send-icon" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
