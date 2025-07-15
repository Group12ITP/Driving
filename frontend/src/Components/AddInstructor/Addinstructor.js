import React, { useState } from 'react'
import Nav from '../Nav/Nav'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '@fortawesome/fontawesome-free/css/all.min.css';

function AddInstructor() {
    const history = useNavigate();
    const [inputs,setInputs] = useState({
        name:"",
        gmail:"",
        phone:"",
        gender:"",
        age:"",
        experience:"",
        hiredate:"",
        salary:"",
        workinghours:"",
        licenseNumber:"",
        vehcleId:"",
        vehcleNumber:"",    
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
    sendRequest().then(()=>history('/instructordetails'))
}

const sendRequest = async() =>{
    await axios.post("http://localhost:5000/instructors",{
        name:String(inputs.name),
        gmail:String(inputs.gmail),
        phone:String(inputs.phone),
        gender:String(inputs.gender),
        age:String(inputs.age),
        experience:String(inputs.experience),
        hiredate:String(inputs.hiredate),
        salary:String(inputs.salary),
        workinghours:String(inputs.workinghours),   
        licenseNumber:String(inputs.licenseNumber),
        vehcleId:String(inputs.vehcleId),
       
  

    }).then(res => res.data);
}

  return (
    <div>
      <Nav/>
      <div className="auth-container">
        <div className="auth-card">
          <div className="welcome-section">
            <div className="logo"></div>
            <h2>Instructor Details</h2>
            <p>Add a new instructor to the system by filling out their information</p>
            <a href="/instructordetails" className="sign-btn">VIEW INSTRUCTORS</a>
          </div>
          
          <div className="form-section2">
            <h2>Add New Instructor</h2>
            
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
                <i className="fas fa-phone"></i>
                <input 
                  type="text" 
                  onChange={handleChange} 
                  name="phone" 
                  value={inputs.phone} 
                  placeholder="Phone"
                  required
                />
              </div>
              
              <div className="input-field">
                <i className="fas fa-venus-mars"></i>
                <input 
                  type="text" 
                  onChange={handleChange} 
                  name="gender" 
                  value={inputs.gender} 
                  placeholder="Gender"
                  required
                />
              </div>
              <div className="input-field">
                <i className="fas fa-birthday-cake"></i>
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
                <i className="fas fa-briefcase"></i>
                <input 
                  type="text" 
                  onChange={handleChange} 
                  name="experience" 
                  value={inputs.experience} 
                  placeholder="Experience"
                  required
                />
              </div>
              <div className="input-field">
                <i className="fas fa-calendar-alt"></i>
                <input 
                  type="date" 
                  onChange={handleChange} 
                  name="hiredate" 
                  value={inputs.hiredate} 
                  placeholder="Hire Date"
                  required
                />
              </div>

              <div className="input-field">
                <i className="fas fa-dollar-sign"></i>
                <input 
                  type="text" 
                  onChange={handleChange} 
                  name="salary" 
                  value={inputs.salary} 
                  placeholder="Salary"
                  required
                />
              </div>

              <div className="input-field">
                <i className="fas fa-clock"></i>
                <input 
                  type="text" 
                  onChange={handleChange} 
                  name="workinghours" 
                  value={inputs.workinghours} 
                  placeholder="Working Hours"
                  required
                />
              </div>

              <div className="input-field">
                <i className="fas fa-id-card"></i>
                <input 
                  type="text" 
                  onChange={handleChange} 
                  name="licenseNumber" 
                  value={inputs.licenseNumber} 
                  placeholder="License Number"
                  required
                />
              </div>

              <div className="input-field">
                <i className="fas fa-car"></i>
                <input 
                  type="text" 
                  onChange={handleChange} 
                  name="vehcleId" 
                  value={inputs.vehcleId} 
                  placeholder="Vehicle ID"
                  required
                />
              </div>

              

             
              
              <button type="submit" className="signup-btn">ADD INSTRUCTOR</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddInstructor
