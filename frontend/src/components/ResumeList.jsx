import React, { useEffect, useState } from 'react';
import { getAllResumes, deleteResume } from '../api/resumeApi'; // Make sure to implement these API calls
import { Link } from 'react-router-dom/dist';

const ResumesList = () => {
  const [resumes, setResumes] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all resumes from the backend
  const fetchResumes = async () => {
    try {
      const response = await getAllResumes();
      setResumes(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setMessage('Error fetching resumes');
    }
  };

  // Delete a resume by its ID
  const handleDelete = async (id) => {
    try {
      const response = await deleteResume(id);
      setMessage(response.data.message);
      fetchResumes(); // Re-fetch resumes after deletion
    } catch (error) {
      console.error('Error deleting resume:', error);
      setMessage('Error deleting resume');
    }
  };

  useEffect(() => {
    fetchResumes(); // Fetch resumes on component mount
  }, []);

  return (
    <div>
      <h2>Resumes List</h2>
      {message && <p>{message}</p>}
      <ul>
        {resumes.map((resume) => (
          <li key={resume._id}>
            <strong>{resume.name}</strong> - {resume.email}
            <button onClick={() => handleDelete(resume._id)}>Delete</button>
            <Link to={`/resume/${resume._id}`}>View</Link>
            <Link to={`/update-resume/${resume._id}`}>Update</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumesList;
