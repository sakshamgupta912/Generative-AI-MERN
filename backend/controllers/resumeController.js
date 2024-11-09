const Resume = require('../models/Resume');
const pdfParse = require('pdf-parse'); // For extracting text from PDF resumes
const { getInterviewQuestions } = require('../services/geminiService.js');
const { OpenAI } = require('openai'); // Import the OpenAI SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use your OpenAI API Key from environment variables
});
// Upload and parse resume
// const generateInterviewQuestions = async (skills) => {
//   try {
//     // Create a prompt from the skills extracted from the resume
//     const prompt = `Generate interview questions based on the following skills: ${skills.join(', ')}.`;

//     // Create the JSON body for the request
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo', // or 'gpt-3.5-turbo'
//       messages: [
//         {
//           role: 'system',
//           content: 'You are an expert interviewer who generates interview questions based on skills provided.',
//         },
//         {
//           role: 'user',
//           content: prompt,
//         },
//       ],
//     });

//     // Extract and clean up the questions from the response
//     const questions = response.choices[0].message.content.split('\n').map(question => question.trim()).filter(Boolean);

//     return questions; // Return the array of questions
//   } catch (error) {
//     console.error('Error generating interview questions:', error);
//     throw new Error('Error generating interview questions');
//   }
// };
const axios = require('axios'); // Import the Axios library
// const generateInterviewQuestions = async (skills) => {
//   console.log('Generating interview questions for skills:', skills);
//   try {
//     // Construct a more detailed prompt that explicitly requests JSON format
//     const prompt = `Generate 5 technical interview questions for the following skills: ${skills.join(', ')}. 
//     Format each question as a JSON array where each object has a "question" field and a "skill" field. 
//     Example format: [{"question": "What is...", "skill": "JavaScript"}]`;

//     const response = await axios.post(
//       'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro/generateContent',
//       {
//         contents: [{
//           parts: [{
//             text: prompt
//           }]
//         }],
//         generationConfig: {
//           temperature: 0.7,
//           maxOutputTokens: 1024,
//           topP: 0.8,
//           topK: 40
//         }
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
//         },
//         params: {
//           key: process.env.GEMINI_API_KEY // Required as a URL parameter
//         }
//       }
//     );

//     // Handle the response structure correctly
//     const generatedText = response.data.candidates[0].content.parts[0].text;
    
//     // Extract JSON from the response text (in case it's wrapped in markdown code blocks)
//     const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
//     if (!jsonMatch) {
//       throw new Error('Invalid response format from Gemini API');
//     }

//     const questions = JSON.parse(jsonMatch[0]);
    
//     // Validate the response format
//     if (!Array.isArray(questions) || !questions.every(q => q.question && q.skill)) {
//       throw new Error('Invalid question format in response');
//     }

//     return questions.map(item => ({
//       question: item.question,
//       skill: item.skill
//     }));

//   } catch (error) {
//     console.error('Error generating interview questions:', error);
//     if (error.response) {
//       console.error('API Error:', error.response.data);
//     }
//     throw new Error(`Failed to generate interview questions: ${error.message}`);
//   }
// };
// const generateInterviewQuestions = async (skills) => {
//   console.log('Generating interview questions for skills:', skills);
//   try {
//     const prompt = {
//       text: `Generate 3 interview questions for each of these skills: ${skills.join(', ')}.
//       Return the response in the following JSON format only:
//       {
//         "questions": [
//           {
//             "skill": "skillName",
//             "question": "question text",
//             "difficulty": "beginner|intermediate|advanced"
//           }
//         ]
//       }`
//     };

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           contents: [{
//             parts: [prompt]
//           }],
//           generationConfig: {
//             temperature: 0.4,
//             topK: 32,
//             topP: 1,
//             maxOutputTokens: 1024,
//           }
//         })
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(`API request failed: ${JSON.stringify(errorData)}`);
//     }

//     const data = await response.json();
    
//     // Log the raw response for debugging
//     console.log('Raw API Response:', JSON.stringify(data, null, 2));

//     // Safely access the generated text
//     if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
//       throw new Error('Unexpected API response structure');
//     }

//     const generatedText = data.candidates[0].content.parts[0].text;

//     try {
//       // Attempt to parse the entire response as JSON first
//       const parsedResponse = JSON.parse(generatedText);
//       if (parsedResponse.questions && Array.isArray(parsedResponse.questions)) {
//         return parsedResponse.questions;
//       }
//     } catch (e) {
//       // If direct parsing fails, try to extract JSON from the text
//       const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
//       if (!jsonMatch) {
//         throw new Error('No valid JSON found in response');
//       }
//       const parsedResponse = JSON.parse(jsonMatch[0]);
//       if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
//         throw new Error('Invalid response structure');
//       }
//       return parsedResponse.questions;
//     }

//     throw new Error('Failed to parse response into expected format');

//   } catch (error) {
//     console.error('Error generating interview questions:', error);
//     throw new Error(`Failed to generate interview questions: ${error.message}`);
//   }
// };

const generateInterviewQuestions = async (skills) => {
  console.log('Generating interview questions for skills:', skills);
  try {
    const prompt = {
      text: `Generate 3 interview questions for each of these skills: ${skills.join(', ')}.
      The questions should be challenging and technical.
      Format: Return just an array of questions as strings, with no JSON structure.`
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [prompt]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Unexpected API response structure');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the response and format it into an array of strings
    let questions;
    try {
      // First try to parse as JSON in case the API returns JSON
      const parsed = JSON.parse(generatedText);
      if (Array.isArray(parsed)) {
        questions = parsed;
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        // Extract questions if they're in a questions array
        questions = parsed.questions.map(q => 
          typeof q === 'string' ? q : q.question
        );
      }
    } catch (e) {
      // If not JSON, split by newlines and clean up
      questions = generatedText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          // Remove numbering if present (1., 2., etc.)
          return line.replace(/^\d+\.\s*/, '');
        });
    }

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Failed to generate valid questions');
    }

    // Make sure all questions are strings
    questions = questions.map(q => q.toString().trim());

    // Filter out any empty questions
    questions = questions.filter(q => q.length > 0);

    return questions;

  } catch (error) {
    console.error('Error generating interview questions:', error);
    throw new Error(`Failed to generate interview questions: ${error.message}`);
  }
};
const uploadResume = async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text;

    const resumeData = {
      name: extractName(text),
      email: extractEmail(text),
      skills: extractSkills(text),
      experience: extractExperience(text),
      education: extractEducation(text)
    };

    // Mocked interview questions based on the skills in the resume
    let interviewQuestions = [];
    try {
      interviewQuestions = await generateInterviewQuestions(resumeData.skills);
      console.log('Generated questions:', questions);
    } catch (error) {
      console.error('Error:', error.message);
    }
    resumeData.interviewQuestions = interviewQuestions;

    const newResume = new Resume(resumeData);
    await newResume.save();

    // Send the resume and interview questions in the response
    res.status(201).json({
      message: 'Resume uploaded and parsed successfully',
      resume: newResume,
      interviewQuestions: resumeData.interviewQuestions // Include interview questions in the response
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({ message: 'Error uploading resume', error });
  }
};

// Helper function to extract name from the resume text
const extractName = (text) => {
  const nameRegex = /([A-Z][a-z]+ [A-Z][a-z]+)/; // Match names like "John Doe"
  const match = text.match(nameRegex);
  return match ? match[0] : 'Not Found';
};

// Helper function to extract email from the resume text
const extractEmail = (text) => {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/; // Match email format
  const match = text.match(emailRegex);
  return match ? match[0] : 'Not Found';
};

// Helper function to extract skills from the resume text
const extractSkills = (text) => {
  const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++']; // Define a list of common skills
  const foundSkills = skills.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
  return foundSkills.length ? foundSkills : ['Not Found'];
};

// Helper function to extract experience (mock logic)
const extractExperience = (text) => {
  const experienceRegex = /([A-Za-z\s]+)\s+-\s+(\d{4})\s+to\s+(\d{4})/; // Matches experience in format "Company - 2018 to 2021"
  const matches = text.match(experienceRegex);
  return matches ? [{ title: matches[1], company: matches[0], years: matches[3] }] : [];
};

// Helper function to extract education (mock logic)
const extractEducation = (text) => {
  const educationRegex = /([A-Za-z\s]+)\s+-\s+(\d{4})/; // Matches education format like "Degree - 2020"
  const matches = text.match(educationRegex);
  return matches ? [{ degree: matches[1], institution: matches[0], year: matches[3] }] : [];
};

// Retrieve a specific resume by ID
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving resume', error });
  }
};


// Fetch all resumes (exclude sensitive fields)
  const getAllResumes = async (req, res) => {
    try {
      const resumes = await Resume.find(); // Fetch all resumes from the database
      res.status(200).json(resumes); // Send the resumes as response
    } catch (error) {
      console.error("Error retrieving resumes:", error);
      res.status(500).json({ message: 'Error retrieving resumes', error });
    }
  };
  
  // Delete a specific resume by ID
const deleteResume = async (req, res) => {
    try {
      const resume = await Resume.findByIdAndDelete(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      res.status(200).json({ message: `Resume for ${resume.name} deleted successfully` });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting resume', error });
    }
  };

  const updateResume = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      // Find the resume by ID
      const resume = await Resume.findById(id);
      if (!resume) return res.status(404).json({ message: 'Resume not found' });
  
      // Update the name and email if they are present in the request body
      if (updates.name) {
        resume.name = updates.name;
      }
      if (updates.email) {
        resume.email = updates.email;
      }
  
      // Update other fields (if any)
      Object.assign(resume, updates);
  
      // Update interview questions if skills have changed
      if (updates.skills) {
        resume.interviewQuestions = await generateInterviewQuestions(updates.skills);
      }
  
      // Save the updated resume
      await resume.save();
      res.status(200).json({ message: 'Resume updated successfully', resume });
    } catch (error) {
      console.error('Error updating resume:', error);
      res.status(500).json({ message: 'Error updating resume', error });
    }
  };
  
  
module.exports = { uploadResume, getResume, getAllResumes, deleteResume, updateResume };
  
