import React from 'react'
import Nav from '../Nav/Nav'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import './user.css'

function User(props) {
const {_id, name, gmail, age, gender, address, phoneNumber, studentId, password} = props.user;
const { refreshUsers } = props;

const history = useNavigate();

const deleteHandler = async() => {
    const isConfirmed = window.confirm(`Are you sure you want to delete ${name}'s record?`);
    
    if (isConfirmed) {
        try {
            await axios.delete(`http://localhost:5000/users/${_id}`);
            refreshUsers(); // Refresh the user list after successful deletion
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again.");
        }
    }
}

  return (
    <tr>
        <td>{studentId}</td>
        <td>{name}</td>
        <td>{gmail}</td>
        <td>{password}</td>
        <td>{age}</td>
        <td>{gender}</td>
        <td>{address}</td>
        <td>{phoneNumber}</td>
        <td>
            <Link to={`/userdetails/${_id}`} className="usr-update-btn">Update</Link>
            <button onClick={deleteHandler} className="usr-delete-btn">Delete</button>
        </td>
    </tr>
  )
}

export default User
