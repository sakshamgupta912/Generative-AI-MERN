import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import ResumeList from './components/ResumeList';
import ResumeDetail from './components/ResumeDetail';
import UpdateResumePage from './pages/UpdateResumePage';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/resumes" element={<ResumeList />} />
      <Route path="/resume/:id" element={<ResumeDetail />} />
      <Route path="/update-resume/:id" element={<UpdateResumePage />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
