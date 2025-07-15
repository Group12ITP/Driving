import axios from 'axios';

const API_URL = 'http://localhost:5000/messages';

const getMessagesByStudentId = async (studentId) => {
  const response = await axios.get(`${API_URL}/student/${studentId}`);
  return response.data.messages;
};

const getAllMessages = async () => {
  const response = await axios.get(API_URL);
  return response.data.messages;
};

const createMessage = async (messageData) => {
  const response = await axios.post(API_URL, messageData);
  return response.data.data;
};

const respondToMessage = async (messageId, response) => {
  const responseData = await axios.put(`${API_URL}/respond/${messageId}`, { response });
  return responseData.data;
};

const getPendingMessagesCount = async () => {
  const response = await axios.get(`${API_URL}/pending/count`);
  return response.data.count;
};

export default {
  getMessagesByStudentId,
  getAllMessages,
  createMessage,
  respondToMessage,
  getPendingMessagesCount
};