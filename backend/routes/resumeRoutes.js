const express = require('express');
const { uploadResume, getResume, getAllResumes, deleteResume , updateResume} = require('../controllers/resumeController');
const router = express.Router();

// Route to upload a resume
router.post('/upload', uploadResume);

// Route to get a resume by ID
router.get('/:id', getResume);

// Route to get all resumes
router.get('/', getAllResumes);

// Route to delete a resume by ID
router.delete('/:id', deleteResume);

router.put('/:id', updateResume);

module.exports = router;
