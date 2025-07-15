import axios from 'axios';

const API_URL = 'http://localhost:5000/schedule';

// Helper function to handle responses and errors consistently
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response || error);
    throw error;
  }
};

// Get all schedules
const getAllSchedules = async () => {
  const result = await handleApiCall(() => axios.get(API_URL));
  return result.data; // Return the data array
};

// Get schedules by instructor ID
const getSchedulesByInstructor = async (instructorId) => {
  try {
    console.log('Fetching schedules for instructor ID:', instructorId);
    const result = await handleApiCall(() => axios.get(`${API_URL}/instructor/${instructorId}`));
    console.log('Instructor schedules API response:', result);
    return result.data || []; // Return empty array as fallback
  } catch (error) {
    console.error('Error fetching instructor schedules:', error);
    throw error;
  }
};

// Get schedule by ID
const getScheduleById = async (scheduleId) => {
  const result = await handleApiCall(() => axios.get(`${API_URL}/${scheduleId}`));
  return result.data; // Return the schedule object
};

// Create a new schedule
const createSchedule = async (scheduleData) => {
  console.log('Creating schedule with data:', scheduleData);
  const result = await handleApiCall(() => axios.post(API_URL, scheduleData));
  return result.data; // Return the created schedule
};

// Update a schedule
const updateSchedule = async (scheduleId, scheduleData) => {
  console.log('Updating schedule with data:', scheduleData);
  const result = await handleApiCall(() => axios.put(`${API_URL}/${scheduleId}`, scheduleData));
  return result.data; // Return the updated schedule
};

// Delete a schedule
const deleteSchedule = async (scheduleId) => {
  const result = await handleApiCall(() => axios.delete(`${API_URL}/${scheduleId}`));
  return result.message; // Return the success message
};

// Update schedule status
const updateScheduleStatus = async (scheduleId, status) => {
  const result = await handleApiCall(() => axios.patch(`${API_URL}/${scheduleId}/status`, { status }));
  return result.data; // Return the updated schedule
};

// Get schedules by date range
const getSchedulesByDateRange = async (startDate, endDate) => {
  const result = await handleApiCall(() => axios.get(`${API_URL}/date-range?startDate=${startDate}&endDate=${endDate}`));
  return result.data; // Return the data array
};

export default {
  getAllSchedules,
  getSchedulesByInstructor,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  updateScheduleStatus,
  getSchedulesByDateRange
}; 