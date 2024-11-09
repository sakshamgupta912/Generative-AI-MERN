import React, { useState } from 'react';
import { uploadResume } from '../api/resumeApi';
import { Link } from 'react-router-dom/dist';
const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState([]); // State for interview questions

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return setMessage('Please select a file.');
    
    try {
      const response = await uploadResume(file);
      setMessage(response.data.message);

      // If questions exist in the response, update the interviewQuestions state
      if (response.data.interviewQuestions) {
        setInterviewQuestions(response.data.interviewQuestions);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage('Error uploading resume.');
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
      
      {/* Display the interview questions if they exist */}
      {interviewQuestions.length > 0 && (
        <div>
          <h3>Interview Questions</h3>
          <ul>
            {interviewQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      )}
       <Link to="/resumes">View All Resumes</Link> {/* Link to ResumesList page */}
    </div>
  );
};

export default UploadResume;
