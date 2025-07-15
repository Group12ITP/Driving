const axios = require('axios');

const API_URL = 'http://localhost:5000/api/instructor-credentials';

// Test instructor data
const testInstructor = {
    instructorId: 'TEST001',
    name: 'Test Instructor',
    email: 'test@example.com',
    password: 'password123',
    instructorType: 'Bike'
};

let createdInstructorId = null;

// Test GET all instructors
async function testGetAllInstructors() {
    try {
        console.log('\n=== Testing GET all instructors ===');
        const response = await axios.get(API_URL);
        console.log('Status:', response.status);
        console.log('Data structure:', Object.keys(response.data));
        console.log('Number of instructors:', Array.isArray(response.data.data) ? response.data.data.length : 'N/A');
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Test POST create instructor
async function testCreateInstructor() {
    try {
        console.log('\n=== Testing POST create instructor ===');
        const response = await axios.post(API_URL, testInstructor);
        console.log('Status:', response.status);
        console.log('Created instructor:', response.data);
        
        if (response.data && response.data.data && response.data.data._id) {
            createdInstructorId = response.data.data._id;
            console.log('Created instructor ID:', createdInstructorId);
        }
        
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Test GET single instructor
async function testGetSingleInstructor(id) {
    try {
        console.log(`\n=== Testing GET instructor with ID ${id} ===`);
        const response = await axios.get(`${API_URL}/${id}`);
        console.log('Status:', response.status);
        console.log('Instructor data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Test PUT update instructor
async function testUpdateInstructor(id) {
    try {
        console.log(`\n=== Testing PUT update instructor with ID ${id} ===`);
        const updateData = {
            name: 'Updated Test Instructor',
            instructorType: 'BikeCar'
        };
        
        const response = await axios.put(`${API_URL}/${id}`, updateData);
        console.log('Status:', response.status);
        console.log('Updated instructor:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Test DELETE instructor
async function testDeleteInstructor(id) {
    try {
        console.log(`\n=== Testing DELETE instructor with ID ${id} ===`);
        const response = await axios.delete(`${API_URL}/${id}`);
        console.log('Status:', response.status);
        console.log('Delete response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Run all tests
async function runTests() {
    console.log('Starting API tests for instructor credentials...');
    
    // Test server connection
    try {
        await axios.get('http://localhost:5000');
        console.log('Server is running at http://localhost:5000');
    } catch (error) {
        console.error('Server connection error:', error.message);
        console.error('Make sure the server is running at http://localhost:5000');
        return;
    }
    
    // Run tests in sequence
    await testGetAllInstructors();
    const createResult = await testCreateInstructor();
    
    if (createdInstructorId) {
        await testGetSingleInstructor(createdInstructorId);
        await testUpdateInstructor(createdInstructorId);
        await testDeleteInstructor(createdInstructorId);
    } else if (createResult && createResult.data && createResult.data._id) {
        const id = createResult.data._id;
        await testGetSingleInstructor(id);
        await testUpdateInstructor(id);
        await testDeleteInstructor(id);
    } else {
        console.log('\nSkipping update/delete tests because instructor creation failed');
    }
    
    console.log('\nAll tests completed!');
}

runTests(); 