import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaCalendarAlt, FaGraduationCap, FaSearch } from 'react-icons/fa';
import './StudentList.css';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProgress, setSelectedProgress] = useState('All');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/Users');
            if (response.data && response.data.Users) {
                setStudents(response.data.Users);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = 
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student._id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesProgress = selectedProgress === 'All' || student.studentProgress === selectedProgress;
        return matchesSearch && matchesProgress;
    });

    const progressOptions = [
        'All',
        'Not Started',
        'Theory Learning',
        'Theory Test Passed',
        'Practical Training',
        'Ready for License Test',
        'Licensed'
    ];

    const getProgressColor = (progress) => {
        switch (progress) {
            case 'Not Started': return '#ff4444';
            case 'Theory Learning': return '#ffa726';
            case 'Theory Test Passed': return '#66bb6a';
            case 'Practical Training': return '#42a5f5';
            case 'Ready for License Test': return '#7e57c2';
            case 'Licensed': return '#26a69a';
            default: return '#9e9e9e';
        }
    };

    return (
        <div className="student-list-container">
            <div className="student-list-header">
                <h2>Student Details</h2>
                <div className="student-list-controls">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="progress-filter">
                        {progressOptions.map((progress) => (
                            <button
                                key={progress}
                                className={`progress-button ${selectedProgress === progress ? 'active' : ''}`}
                                style={selectedProgress === progress ? { backgroundColor: getProgressColor(progress) } : {}}
                                onClick={() => setSelectedProgress(progress)}
                            >
                                {progress}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="student-grid">
                {filteredStudents.map((student) => (
                    <div key={student._id} className="student-card">
                        <div className="student-card-header">
                            <div className="student-avatar">
                                <FaUser />
                            </div>
                            <div className="student-status" style={{ backgroundColor: getProgressColor(student.studentProgress) }}>
                                {student.studentProgress}
                            </div>
                        </div>
                        <div className="student-info">
                            <h3>{student.name}</h3>
                            <div className="student-details">
                                <div className="student-detail-item">
                                    <FaCalendarAlt />
                                    <span>Start Date: {new Date(student.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="student-detail-item">
                                    <FaGraduationCap />
                                    <span>Student ID: {student._id}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentList; 