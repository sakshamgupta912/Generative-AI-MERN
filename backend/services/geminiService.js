// // backend/services/geminiService.js
// const axios = require('axios');
// import { GenerativeAI } from '@google/generativeai';

// // Function to fetch interview questions based on skills

// const getInterviewQuestions = async (skills) => {
    
//     try {
//       const model = new GenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
  
//       const prompt = `Generate a list of interview questions for a candidate with the following skills: ${skills.join(', ')}`;
//       const response = await model.generate({
//         prompt: prompt,
//         model: 'gemini-pro' // Choose the appropriate model
//       });
  
//       // Parse the response to extract interview questions (might require adjustment)
//       const questions = response.text.split('\n');
//       questions.shift(); // Remove the first line if it's introductory text
  
//       return questions;
//     } catch (error) {
//       console.error("Error generating interview questions:", error);
//       return [];
//     }
//   };

// module.exports = { getInterviewQuestions };

