import axios from 'axios';

const API_URL = 'http://localhost:5000/api/instructor-credentials';

class InstructorCredentialsService {
    // Get all instructor credentials
    async getAllInstructorCredentials() {
        try {
            console.log('Fetching instructor credentials from:', API_URL);
            const response = await axios.get(API_URL);
            console.log('Instructor credentials response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching instructor credentials:', error);
            console.error('Error details:', error.response ? error.response.data : 'No response data');
            throw error;
        }
    }

    // Get a single instructor credential by ID
    async getInstructorCredential(id) {
        try {
            console.log(`Fetching instructor credential with ID: ${id}`);
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching instructor credential:', error);
            console.error('Error details:', error.response ? error.response.data : 'No response data');
            throw error;
        }
    }

    // Create a new instructor credential
    async createInstructorCredential(instructorData) {
        try {
            console.log('Creating instructor credential with data:', instructorData);
            const response = await axios.post(API_URL, instructorData);
            console.log('Create response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating instructor credential:', error);
            console.error('Error details:', error.response ? error.response.data : 'No response data');
            throw error;
        }
    }

    // Update an instructor credential
    async updateInstructorCredential(id, instructorData) {
        try {
            console.log(`Updating instructor credential with ID: ${id}`, instructorData);
            const response = await axios.put(`${API_URL}/${id}`, instructorData);
            console.log('Update response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating instructor credential:', error);
            console.error('Error details:', error.response ? error.response.data : 'No response data');
            throw error;
        }
    }

    // Delete an instructor credential
    async deleteInstructorCredential(id) {
        try {
            console.log(`Attempting to delete instructor credential with ID: ${id}`);
            
            // Basic validation
            if (!id) {
                console.error('Delete failed: No ID provided');
                throw new Error('No ID provided for deletion');
            }
            
            // Make the delete request
            const response = await axios.delete(`${API_URL}/${id}`);
            console.log('Delete response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error deleting instructor credential:', error);
            if (error.response) {
                console.error('Server response:', error.response.status, error.response.data);
            }
            throw error;
        }
    }
}

export default new InstructorCredentialsService(); 