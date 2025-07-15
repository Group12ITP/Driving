import React from 'react';
import './Team.css';
import Nav2 from '../Nav/Nav2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Lead Instructor',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
      color: '#ffffff',
      bio: 'Sarah brings years of experience and leadership to the team. She oversees all training programs and ensures the highest quality of instruction for every student.'
    },
    {
      id: 2,
      name: 'Michael Reynolds',
      position: 'Senior Instructor',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
      color: '#8BC34A',
      bio: 'Michael is a dedicated educator known for his patient and effective teaching style. He specializes in advanced driving techniques and instructor mentoring.'
    },
    {
      id: 3,
      name: 'David Martinez',
      position: 'Operations Manager',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
      color: '#2196F3',
      bio: 'David manages the day-to-day logistics of the driving school. He coordinates class schedules, vehicle maintenance, and staff operations to keep everything running smoothly.'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      position: 'Customer Relations',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
      color: '#E91E63',
      bio: 'Emma is the friendly face of the driving school, handling student inquiries, scheduling, and support. She ensures every student has a positive experience from start to finish.'
    },
    {
      id: 5,
      name: 'Jessica Chen',
      position: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
      color: '#FF9800',
      bio: 'Jessica leads the school\'s outreach and promotional efforts. She designs campaigns to attract new students and build the school\'s reputation in the community.'
    }
  ];

  return (
    <div className="team-page">
      {/* Navigation */}
      <Nav2 />

      {/* Team Header */}
      <header className="team-header">
        <div className="team-label">Team</div>
        <h1>BUSINESS TEAM PRESENTATION</h1>
        <p>This slide is perfect for product descriptions</p>
      </header>

      {/* Team Members Section */}
      <section className="team-members-container">
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-member-card">
              <div className="member-image-container">
                <img src={member.image} alt={member.name} className="member-image" />
              </div>
              <div className="member-details">
                <h3 className="member-position" style={{color: member.color}}>{member.position}</h3>
                <h2 className="member-name">{member.name}</h2>
                <p className="member-bio">
                  {member.bio}
                </p>
                <div className="member-social">
                  <a href="#" className="social-link"><FontAwesomeIcon icon={faFacebookF} /></a>
                  <a href="#" className="social-link"><FontAwesomeIcon icon={faTwitter} /></a>
                  <a href="#" className="social-link"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                  <a href="#" className="social-link"><FontAwesomeIcon icon={faInstagram} /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Team;