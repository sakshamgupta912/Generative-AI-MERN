import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getResumeById } from '../api/resumeApi';

const ResumeDetail = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getResumeById(id);
        setResume(response.data);
      } catch (error) {
        console.error('Error fetching resume:', error);
      }
    };
    fetchResume();
  }, [id]);

  if (!resume) return <p>Loading...</p>;

  return (
    <div>
      <h2>Resume Details</h2>
      <p>Email: {resume.email}</p>
      <p>Skills: {resume.skills.join(', ')}</p>

      <h3>Interview Questions</h3>
      <ul>
        {resume.interviewQuestions.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeDetail;
