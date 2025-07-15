import React from 'react'
import './Nav.css';
import {Link} from "react-router-dom";

function Nav() {
  return (
    <div>
      <ul className="driving-school-home-ul">
        
        
        <li className='driving-school-home-ll'>
        <Link to="/userdetails" className="active driving-school-home-a">
          <h1>User details</h1>
          </Link>
        </li>
        
        
        <li className='driving-school-home-ll'>
        <Link to="/admin/messages" className="active driving-school-home-a">
          <h1>Messages</h1>
          </Link>
        </li>
        
        
      </ul>
    </div>
  )
}

export default Nav
