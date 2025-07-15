import React, { useState } from 'react'
import Nav from '../Nav/Nav'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './adduser.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function AddUser() {
    const history = useNavigate();
    const [inputs,setInputs] = useState({
        name:"",
        gmail:"",
        age:"",
        address:"",
    })
    
const handleChange = (e)=>{
    setInputs((prevState)=>({
        ...prevState,
        [e.target.name]: e.target.value,
    }))
};

const handleSubmit =(e) =>{
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(()=>history('/userdetails'))
}

const sendRequest = async() =>{
    await axios.post("http://localhost:5000/users",{
        name:String(inputs.name),
        gmail:String(inputs.gmail),
        age:String(inputs.age),
        address:String(inputs.address),
    }).then(res => res.data);
}

  return (
    <div>
      <Nav/>
      <div className="auth-container">
        <div className="auth-card">
          <div className="welcome-section">
            <div className="logo"></div>
            <h2>User Details</h2>
            <p>Add a new user to the system by filling out their information</p>
            <a href="/userdetails" className="sign-btn">VIEW USERS</a>
          </div>
          
          <div className="form-section2">
            <h2>Add New User</h2>
            
            <div className="social-icons">
              <a href="#" className="social-icon facebook-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon google-icon">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="social-icon instagram-icon">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
            
            <p className="or-text">or fill out the form below:</p>
            
            <form onSubmit={handleSubmit}>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input 
                  type="text" 
                  onChange={handleChange} 
                  name="name" 
                  value={inputs.name} 
                  placeholder="Name" 
                  required
                />
              </div>
              
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input 
                  type="email" 
                  onChange={handleChange} 
                  name="gmail" 
                  value={inputs.gmail} 
                  placeholder="Email"
                  required
                />
              </div>
              
              <div className="input-field">
                <i className="fas fa-calendar-alt"></i>
                <input 
                  type="text" 
                  onChange={handleChange} 
                  name="age" 
                  value={inputs.age} 
                  placeholder="Age"
                  required
                />
              </div>
              
              <div className="input-field">
                <i className="fas fa-map-marker-alt"></i>
                <input 
                  type="text" 
                  onChange={handleChange} 
                  name="address" 
                  value={inputs.address} 
                  placeholder="Address"
                  required
                />
              </div>
              
              <button type="submit" className="signup-btn">ADD USER</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUser
