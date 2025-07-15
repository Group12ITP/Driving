import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faDownload, faHome, faComments, faPhone, faEnvelope, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faLinkedinIn, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import Nav2 from '../Nav/Nav2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function PaymentSuccess() {
  const navigate = useNavigate();
  const receiptRef = useRef(null);
  const [paymentInfo, setPaymentInfo] = useState({
    amount: '799.99',
    course: 'Premium Driving Course',
    name: 'Customer',
    paymentId: ''
  });
  
  // Use the stored payment ID directly
  const paymentId = localStorage.getItem('paymentId') || '';

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const storedAmount = localStorage.getItem('paymentAmount');
    const storedCourse = localStorage.getItem('paymentCourse');
    const storedName = localStorage.getItem('paymentName');
    const storedPaymentId = localStorage.getItem('paymentId');
    
    // Make sure we have a payment date stored
    if (!localStorage.getItem('paymentDate')) {
      localStorage.setItem('paymentDate', new Date().toISOString());
    }
    
    // Make sure payment status is set to Completed
    localStorage.setItem('paymentStatus', 'Completed');
    
    if (storedAmount || storedCourse || storedName || storedPaymentId) {
      setPaymentInfo({
        amount: storedAmount || '799.99',
        course: storedCourse || 'Premium Driving Course',
        name: storedName || 'Customer',
        paymentId: storedPaymentId || ''
      });
    }
  }, []);

  const handleViewReceipt = () => {
    navigate('/payments');
  };

  const handleDownloadReceipt = () => {
    const receipt = receiptRef.current;
    
    html2canvas(receipt, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add Drive Master logo and header
      pdf.setFontSize(20);
      pdf.setTextColor(50, 50, 93);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DRIVE MASTER ACADEMY', pdfWidth/2, 20, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setTextColor(100, 116, 139);
      pdf.setFont('helvetica', 'normal');
      pdf.text('PAYMENT RECEIPT', pdfWidth/2, 30, { align: 'center' });
      
      // Add receipt image
      const imgWidth = canvas.width * 0.7;
      const imgHeight = canvas.height * 0.7;
      const ratio = Math.min(pdfWidth / imgWidth, (pdfHeight - 60) / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 40;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Thank you for choosing Drive Master Academy', pdfWidth/2, pdfHeight - 20, { align: 'center' });
      pdf.text('For any questions, please contact support@drivemaster.com', pdfWidth/2, pdfHeight - 15, { align: 'center' });
      pdf.text(new Date().toLocaleDateString(), pdfWidth/2, pdfHeight - 10, { align: 'center' });
      
      // Save the PDF
      pdf.save(`DriveMaster_Receipt_${paymentInfo.paymentId}.pdf`);
    });
  };

  return (
    <div>
      <Nav2 />
      <div className="dm-payment-success-container">
        <div className="dm-success-card">
          <div className="dm-success-icon">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          
          <h1>Payment Successful!</h1>
          <p className="dm-success-message">
            Thank you for your payment, {paymentInfo.name}. Your transaction has been completed successfully.
          </p>
          
          <div ref={receiptRef} className="dm-order-details">
            <div className="dm-order-detail-item">
              <span>Payment Number:</span>
              <span>{paymentInfo.paymentId}</span>
            </div>
            <div className="dm-order-detail-item">
              <span>Date:</span>
              <span>{new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="dm-order-detail-item">
              <span>Course:</span>
              <span>{paymentInfo.course}</span>
            </div>
            <div className="dm-order-detail-item">
              <span>Amount Paid:</span>
              <span>${paymentInfo.amount}</span>
            </div>
            <div className="dm-order-detail-item">
              <span>Payment Method:</span>
              <span>Credit Card (**** 3456)</span>
            </div>
            <div className="dm-order-detail-item">
              <span>Status:</span>
              <span className="dm-status-completed">Completed</span>
            </div>
          </div>
          
          <div className="dm-success-message-details">
            <p>We've sent all the details to your email. You'll receive your course details within 24 hours.</p>
          </div>
          
          <div className="dm-success-actions">
            <button className="dm-receipt-button" onClick={handleDownloadReceipt}>
              <FontAwesomeIcon icon={faDownload} /> Download Receipt
            </button>
            <button className="dm-home-button" onClick={() => navigate('/')}>
              <FontAwesomeIcon icon={faHome} /> Back to Home
            </button>
           
          </div>
        </div>
        
        <div className="dm-customer-support">
          <p>Having questions? Our support team is here to help <a href="mailto:support@drivemaster.com">support@drivemaster.com</a></p>
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

export default PaymentSuccess;