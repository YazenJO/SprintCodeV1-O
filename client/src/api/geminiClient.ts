/**
 * Gemini API Client
 * Handles communication with Google Gemini API for analyzing test bank documents (images and PDFs)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

interface GeminiResponse {
  questions: Question[];
}

/**
 * Convert File to base64
 */
const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        data: base64Data,
        mimeType: file.type,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes a local file (image or PDF) using the Gemini API
 * @param file The local file to analyze
 * @returns Promise resolving to parsed questions
 */
export const analyzeLocalFileWithGemini = async (file: File): Promise<GeminiResponse> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  // Initialize the Gemini API
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use gemini-2.0-flash
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash"
  });

  const prompt = `
    Analyze the provided document (image or PDF) of a test bank. Extract each question, its multiple-choice options, and identify the correct answer.
    Return the data in a structured JSON format. The JSON object must have a single key "questions", which is an array of objects.
    Each object in the array must have the following keys:
    - "id": A unique number for the question (e.g., 1, 2, 3...).
    - "text": The full text of the question.
    - "options": An array of strings, where each string is a multiple-choice option (e.g., ["A) Option 1", "B) Option 2", ...]).
    - "correctIndex": The zero-based index of the correct answer within the "options" array.

    Example response format:
    {
      "questions": [
        {
          "id": 1,
          "text": "What is the capital of France?",
          "options": ["A) Berlin", "B) Madrid", "C) Paris", "D) Rome"],
          "correctIndex": 2
        }
      ]
    }

    Important:
    - If the document contains multiple pages, extract questions from all pages.
    - The correct answer may be marked with an asterisk (*), highlighted, bold, or indicated in some other way.
    - Pay close attention to visual markers for correct answers.
    - Ensure the output is only valid JSON. Do not include any markdown formatting like \`\`\`json.
    - Extract ALL questions from the image, not just a few examples.
  `;

  try {
    // Convert file to base64
    const { data: fileData, mimeType } = await fileToBase64(file);
    
    console.log('Processing local file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      mimeType: mimeType
    });
    
    // Create the image part for Gemini
    const imagePart = {
      inlineData: {
        data: fileData,
        mimeType: mimeType,
      },
    };

    // Generate content with the model
    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const text = response.text();

    // Clean the string if it's wrapped in markdown
    const cleanedJsonString = text.replace(/```json\n/g, '').replace(/\n```/g, '').trim();

    // Parse the cleaned string
    const parsedJson: GeminiResponse = JSON.parse(cleanedJsonString);

    // Basic validation
    if (!parsedJson.questions || !Array.isArray(parsedJson.questions)) {
      throw new Error('Invalid JSON structure received from API.');
    }

    return parsedJson;
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw new Error(`Failed to analyze document. ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
