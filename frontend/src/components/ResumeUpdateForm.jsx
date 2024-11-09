import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResumeById, updateResume } from '../api/resumeApi'; // Adjust the path as necessary

const ResumeUpdateForm = () => {
  const { id } = useParams(); // Get the resume ID from URL
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const [resume, setResume] = useState({
    name: '',
    email: '',
    skills: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the existing resume data
    getResumeById(id)
      .then(response => {
        setResume(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch resume');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume(prevResume => ({
      ...prevResume,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setResume(prevResume => ({
      ...prevResume,
      skills
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Send the updated data to the backend
    updateResume(id, resume)
      .then(() => {
        navigate(`/resume/${id}`); // Redirect to the updated resume page using navigate
      })
      .catch(err => {
        setError('Failed to update resume');
        setLoading(false);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Fill the following</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={resume.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={resume.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="skills">Skills (comma-separated):</label>
          <input
            type="text"
            id="skills"
            value={resume.skills.join(', ')}
            onChange={handleSkillsChange}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Resume'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeUpdateForm;
