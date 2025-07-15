import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom' 
import { useNavigate } from 'react-router-dom'
import Nav from '../Nav/Nav'
import '@fortawesome/fontawesome-free/css/all.min.css';
import './UpdateUser.css';

function UpdateUser() {
    const [inputs,setInputs] = useState({});
    const history = useNavigate();
    const id = useParams().id;

    useEffect(()=>{
        const fetchHandler = async () => {
            await axios
            .get(`http://localhost:5000/users/${id}`)
            .then((res)=>res.data)
            .then((data)=>setInputs(data.user));
        }
        fetchHandler();
    },[id]);

    const sendRequest = async ()=>{
        await axios
        .put(`http://localhost:5000/users/${id}`,{
            name: String(inputs.name),
            gmail: String(inputs.gmail),
            age: Number(inputs.age),
            gender: String(inputs.gender),
            address: String(inputs.address),
            phoneNumber: String(inputs.phoneNumber)
        })
        .then((res)=>res.data);
    };

    const handleChange = (e)=>{
        setInputs((prevState)=>({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    };
    
    const handleSubmit =(e) =>{
        e.preventDefault();
        console.log(inputs);
        sendRequest().then(()=>
        history('/userdetails'));
    };

  return (
    <div>
      <Nav/>
      <div className="updateuser-auth-container">
        <div className="updateuser-auth-card">
          <div className="updateuser-welcome-section">
            <div className="updateuser-logo"></div>
            <h2>Update User</h2>
            <p>Edit user information and click update to save your changes</p>
            <a href="/userdetails" className="updateuser-sign-btn">BACK TO USERS</a>
          </div>
          
          <div className="updateuser-form-section">
            <h2>Edit User Info</h2>
            
            <form onSubmit={handleSubmit} className="updateuser-form">
              <div className="updateuser-input-field">
                <i className="fas fa-user"></i>
                <input 
                  type="text" 
                  onChange={handleChange} 
                  name="name" 
                  value={inputs.name || ""} 
                  placeholder="Name" 
                  required
                />
              </div>
              
              <div className="updateuser-input-field">
                <i className="fas fa-envelope"></i>
                <input 
                  type="email" 
                  onChange={handleChange} 
                  name="gmail" 
                  value={inputs.gmail || ""} 
                  placeholder="Email"
                  required
                />
              </div>
              
              <div className="updateuser-input-field">
                <i className="fas fa-calendar-alt"></i>
                <input 
                  type="number" 
                  onChange={handleChange} 
                  name="age" 
                  value={inputs.age || ""} 
                  placeholder="Age"
                  required
                  min="0"
                  max="150"
                  className="updateuser-age-input"
                />
              </div>

              <div className="updateuser-input-field">
                <i className="fas fa-venus-mars"></i>
                <select 
                  onChange={handleChange} 
                  name="gender" 
                  value={inputs.gender || ""} 
                  required
                  className="updateuser-gender-select"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="updateuser-input-field">
                <i className="fas fa-map-marker-alt"></i>
                <input 
                  type="text" 
                  onChange={handleChange} 
                  name="address" 
                  value={inputs.address || ""} 
                  placeholder="Address"
                  required
                />
              </div>

              <div className="updateuser-input-field">
                <i className="fas fa-phone"></i>
                <input 
                  type="tel" 
                  onChange={handleChange} 
                  name="phoneNumber" 
                  value={inputs.phoneNumber || ""} 
                  placeholder="Phone Number"
                  required
                />
              </div>
              
              <button type="submit" className="updateuser-signup-btn">UPDATE USER</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateUser
