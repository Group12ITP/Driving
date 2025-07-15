import React from 'react'
import Nav from '../Nav/Nav'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function Instructor(props) {
const {_id,name,gmail,phone,gender,age,experience,hiredate,salary,workinghours,licenseNumber,vehcleId} = props.instructor;

const history = useNavigate();

const deleteHandler = async() =>{
    await axios.delete(`http://localhost:5000/instructors/${_id}`)
    .then(res=>res.data)
    .then(() => history("/"))
    .then(() => history("/instructordetails"))
}
  return (
    <tr>    
        <td>{_id}</td>
        <td>{name}</td> 
        <td>{gmail}</td>
        <td>{phone}</td>  
        <td>{gender}</td>
        <td>{age}</td>
        <td>{experience}</td>
        <td>{hiredate}</td>
        <td>{salary}</td>
        <td>{workinghours}</td>
        <td>{licenseNumber}</td>     
        <td>{vehcleId}</td>
        <td>
            <Link to={`/instructordetails/${_id}`} className="update-btn">Update</Link>
            <button onClick={deleteHandler} className="delete-btn">Delete</button>
        </td>
    </tr>
  )
}

export default Instructor;
