import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { FaQuoteRight, FaStar } from 'react-icons/fa';
import Nav2 from '../Nav/Nav2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faComments, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './Testimonial.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const Testimonial = () => {
  // Add fade-in animation to elements on page load
  useEffect(() => {
    const elements = document.querySelectorAll('.testimonial-header, .testimonial-subtitle, .testimonial-card');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('fade-in');
      }, 100 * index);
    });
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'James Wilson',
      designation: 'Marketing Director',
      rating: 5,
      content: 'The service was exceptional. Our website experience with Sidekick Interactive has been nothing short of transformative. The team truly understands our brand and exceeded all our expectations.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      name: 'Douglas Walker',
      designation: 'Tech Startup Founder',
      rating: 5,
      content: 'Sidekick Interactive completely transformed our online presence. Their team was extremely professional throughout the entire process. I highly recommend their services to anyone looking for quality web development.',
      image: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    {
      id: 3,
      name: 'Lauren Grad',
      designation: 'E-commerce Owner',
      rating: 5,
      content: "I've worked with several developers, but Sidekick's team is truly exceptional. They're responsive, creative, and understood exactly what my business needed. A complete and professional experience.",
      image: 'https://randomuser.me/api/portraits/women/36.jpg'
    },
    {
      id: 4,
      name: 'Sara Garcia',
      designation: 'Digital Marketer',
      rating: 5,
      content: "It's been an incredible journey working with Sidekick Interactive. They're not just developers, they're strategic partners who understand business objectives. Pleased with the exceptional work!",
      image: 'https://randomuser.me/api/portraits/women/62.jpg'
    },
    {
      id: 5,
      name: 'Peter Kim',
      designation: 'Product Manager',
      rating: 5,
      content: "Outstanding service and attention to detail! Sidekick's team delivered beyond expectations and on time. The website perfectly captures our brand identity and provides an excellent user experience.",
      image: 'https://randomuser.me/api/portraits/men/28.jpg'
    },
    {
      id: 6,
      name: 'John Haris',
      designation: 'Small Business Owner',
      rating: 5,
      content: "I've worked with several developers, but Sidekick's team is truly exceptional. They're responsive, creative, and understood exactly what my business needed. A complete and professional experience.",
      image: 'https://randomuser.me/api/portraits/men/54.jpg'
    }
  ];

  // Function to render stars based on rating
  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, i) => (
      <FaStar key={i} className="star" />
    ));
  };

  return (
    <div className="testimonial-wrapper">
      <Nav2 />
      
      <div className="testimonial-section">
        <div className="testimonial-container">
          <div className="testimonial-header">
            <h2>Testimonial</h2>
            <p>What Our Clients Say</p>
          </div>
          
          <div className="testimonial-subtitle">
            <p>Discover what our valued clients have to say about their experience with Drive Master Academy. 
            Real stories from real people who have transformed their driving journey with us.</p>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            spaceBetween={30}
            navigation={true}
            pagination={{ 
              clickable: true,
              dynamicBullets: true
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            loop={true}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30
              }
            }}
            className="testimonial-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="testimonial-card">
                  <div className="rating">
                    {renderStars(testimonial.rating)}
                  </div>
                  <div className="testimonial-content">
                    <p>{testimonial.content}</p>
                  </div>
                  <div className="testimonial-author">
                    <img src={testimonial.image} alt={testimonial.name} />
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.designation}</p>
                    </div>
                    <div className="quote-icon">
                      <FaQuoteRight />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="testimonial-cta">
          <div className="cta-content">
            <h2>We Always Make The Best</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse et porttitor risus. Cras mattis sem at augue condimentum, ac consectetur turpis lacinia. Mauris sed enim eget orci fringilla accumsan. Nulla facilisis dui ut eros vel fringilla.</p>
            <button className="cta-button">Contact Us</button>
          </div>
          <div className="cta-image">
            {/* Image of developer working at desk */}
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
};

export default Testimonial;
