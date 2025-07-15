const axios = require('axios');

// Test the API
async function testAPI() {
    const API_URL = 'http://localhost:5000/api/instructor-credentials';
    
    console.log('=== Testing Instructor Credentials API ===');
    
    try {
        // Check if server is running
        console.log('\nTesting server connection...');
        await axios.get('http://localhost:5000');
        console.log('✓ Server is running at http://localhost:5000');
        
        // Test GET all instructor credentials
        console.log('\nTesting GET all instructor credentials...');
        const getResponse = await axios.get(API_URL);
        console.log('Status:', getResponse.status);
        console.log('Response structure:', Object.keys(getResponse.data));
        
        if (getResponse.data.success) {
            console.log('Number of instructors:', getResponse.data.data.length);
        } else {
            console.log('Response data:', getResponse.data);
        }
        
        console.log('\n=== All tests completed ===');
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('Make sure your server is running at http://localhost:5000');
        }
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Run the test
testAPI(); 