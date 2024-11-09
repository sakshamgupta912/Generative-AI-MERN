// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const multer = require('multer');
const upload = multer();

// Routes
const resumeRoutes = require('./routes/resumeRoutes');

// Apply multer middleware for the entire /api/resume route
app.use('/api/resume', upload.single('resume'), resumeRoutes);
app.use(bodyParser.json());  // Handle JSON data in requests
app.use('/api/resumes', resumeRoutes); // Mount the routes


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
