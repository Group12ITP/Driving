import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentDetails.css';

const URL="http://localhost:5000/Users"

const fetchHandler= async()=>{
    return await axios.get(URL).then((res)=>res.data);
}

function StudentDetails() {
    const [users,setUsers]= useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, userId: null });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProgress, setSelectedProgress] = useState('All');
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        startDate: '',
        studentProgress: 'Not Started'
    });

    useEffect(()=>{
        fetchHandler().then((data) => setUsers(data.Users));
    },[])

    
    const filteredAndSortedUsers = users.filter(user => {
            const matchesSearch = 
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user._id.slice(-6).toLowerCase().includes(searchQuery.toLowerCase());
            const matchesProgress = selectedProgress === 'All' || user.studentProgress === selectedProgress;
            return matchesSearch && matchesProgress;
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    const progressOptions = [
        'All',
        'Not Started',
        'Theory Learning',
        'Theory Test Passed',
        'Practical Training',
        'Ready for License Test',
        'Licensed'
    ];

    const getProgressClass = (progress) => {
        const progressClasses = {
            'Not Started': 'progress-not-started',
            'Theory Learning': 'progress-theory-learning',
            'Theory Test Passed': 'progress-theory-test-passed',
            'Practical Training': 'progress-practical-training',
            'Ready for License Test': 'progress-ready-for-test',
            'Licensed': 'progress-licensed'
        };
        return progressClasses[progress] || 'progress-not-started';
    };

    const getProgressValue = (progress) => {
        const progressValues = {
            'Not Started': 0,
            'Theory Learning': 1,
            'Theory Test Passed': 2,
            'Practical Training': 3,
            'Ready for License Test': 4,
            'Licensed': 5
        };
        return progressValues[progress] || 0;
    };

    const getProgressColor = (progress) => {
        const progressColors = {
            'Not Started': '#ff4444',
            'Theory Learning': '#ffa726',
            'Theory Test Passed': '#66bb6a',
            'Practical Training': '#42a5f5',
            'Ready for License Test': '#7e57c2',
            'Licensed': '#26a69a'
        };
        return progressColors[progress] || '#ff4444';
    };

    const handleDelete = async (id) => {
        setDeleteConfirmation({ show: true, userId: id });
    };

    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`${URL}/${deleteConfirmation.userId}`);
            if (response.data.message) {
                setUsers(users.filter(user => user._id !== deleteConfirmation.userId));
                setDeleteConfirmation({ show: false, userId: null });
                alert('User deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.response?.data?.message || 'Failed to delete user. Please try again.');
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmation({ show: false, userId: null });
    };

    const handleEdit = (user) => {
        setEditingUser(user._id);
        const formattedDate = new Date(user.startDate).toISOString().split('T')[0];
        setFormData({
            name: user.name,
            age: user.age,
            startDate: formattedDate,
            studentProgress: user.studentProgress
        });
    };

    const handleUpdate = async (id) => {
        try {
            const updateData = {
                name: formData.name,
                age: formData.age,
                startDate: new Date(formData.startDate),
                studentProgress: formData.studentProgress
            };
            
            const response = await axios.put(`${URL}/${id}`, updateData);
            if (response.data.user) {
                const updatedData = await fetchHandler();
                setUsers(updatedData.Users);
                setEditingUser(null);
                alert('User updated successfully!');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert(error.response?.data?.message || 'Failed to update user. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="student-details-container">
            <div className="student-details-content">
                <h2 className="student-details-title">Student Progress Timeline</h2>

                <div className="progress-buttons-container">
                    {progressOptions.map((progress) => (
                        <button
                            key={progress}
                            onClick={() => setSelectedProgress(progress)}
                            className={`progress-button ${selectedProgress === progress ? 'active' : ''} ${progress !== 'All' ? getProgressClass(progress) : ''}`}
                        >
                            {progress}
                        </button>
                    ))}
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <div className="search-icon">
                        {searchQuery ? '✕' : '🔍'}
                    </div>
                </div>

                {deleteConfirmation.show && (
                    <div className="delete-confirmation-overlay">
                        <div className="delete-confirmation-modal">
                            <h3>Confirm Delete</h3>
                            <p>Are you sure you want to delete this student?</p>
                            <div className="delete-confirmation-buttons">
                                <button onClick={confirmDelete} className="delete-button confirm">
                                    Delete
                                </button>
                                <button onClick={cancelDelete} className="delete-button cancel">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="student-details-grid">
                    {filteredAndSortedUsers && filteredAndSortedUsers.map((user) => (
                        <div key={user._id} className="student-details-item">
                            <div className="student-details-header">
                                <h3 className="student-details-name">{user.name}</h3>
                                <p className="student-details-id">ID: {user._id.slice(-6)} | Start Date: {new Date(user.startDate).toLocaleDateString()}</p>
                                <div className="student-details-actions">
                                    {editingUser === user._id ? (
                                        <button
                                            onClick={() => handleUpdate(user._id)}
                                            className="edit-button"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="edit-button"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="delete-button"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            {editingUser === user._id ? (
                                <div className="student-details-form">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Name"
                                    />
                                    <input
                                        type="text"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Age"
                                    />
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                    <select
                                        name="studentProgress"
                                        value={formData.studentProgress}
                                        onChange={handleChange}
                                        className="form-input"
                                    >
                                        <option value="Not Started">Not Started</option>
                                        <option value="Theory Learning">Theory Learning</option>
                                        <option value="Theory Test Passed">Theory Test Passed</option>
                                        <option value="Practical Training">Practical Training</option>
                                        <option value="Ready for License Test">Ready for License Test</option>
                                        <option value="Licensed">Licensed</option>
                                    </select>
                                </div>
                            ) : (
                                <div className="student-details-progress">
                                    <div className="progress-bar">
                                        <div style={{
                                            width: `${(getProgressValue(user.studentProgress) / 5) * 100}%`,
                                            height: '100%',
                                            backgroundColor: getProgressColor(user.studentProgress),
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>
                                    <span className="progress-label" style={{ color: getProgressColor(user.studentProgress) }}>
                                        {user.studentProgress}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="progress-legend">
                    <h3>Progress Legend</h3>
                    <div className="progress-legend-grid">
                        {Object.entries({
                            'Not Started': 'progress-not-started',
                            'Theory Learning': 'progress-theory-learning',
                            'Theory Test Passed': 'progress-theory-test-passed',
                            'Practical Training': 'progress-practical-training',
                            'Ready for License Test': 'progress-ready-for-test',
                            'Licensed': 'progress-licensed'
                        }).map(([progress, className]) => (
                            <div key={progress} className="progress-legend-item">
                                <div className={`progress-legend-color ${className}`} />
                                <span>{progress}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDetails 