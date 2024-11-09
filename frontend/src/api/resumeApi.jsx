import axios from 'axios';

const API_URL = 'http://localhost:5000/api/resume';

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  return axios.post(`${API_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getResumeById = (id) => axios.get(`${API_URL}/${id}`);

// API to get all resumes
export const getAllResumes = async () => {
  return await axios.get('http://localhost:5000/api/resumes'); // Change the URL to match your backend endpoint
};

// API to delete a specific resume
export const deleteResume = async (id) => {
  return await axios.delete(`http://localhost:5000/api/resumes/${id}`);
};

export const updateResume = async (id, updatedData) => {
  return await axios.put(`${API_URL}/${id}`, updatedData);
};