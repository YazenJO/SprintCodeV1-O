import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question } from '@/models/Question';

/**
 * Abstract AI Service - Demonstrates Abstraction & Interface Segregation
 * This defines a contract that all AI services must follow
 */
export abstract class AIService {
  protected apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required');
    }
    this.apiKey = apiKey;
  }

  // Abstract methods - MUST be implemented by subclasses
  abstract analyzeDocument(file: File): Promise<Question[]>;
  abstract generateQuestions(topic: string, count: number, difficulty?: string): Promise<Question[]>;
}

/**
 * Gemini AI Service Implementation
 * Demonstrates: Inheritance, Polymorphism, Single Responsibility
 */
export class GeminiAIService extends AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private modelName: string;

  constructor(apiKey: string, modelName: string = 'gemini-2.0-flash') {
    super(apiKey); // Call parent constructor
    this.modelName = modelName;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  /**
   * Analyzes a document (PDF/Image) and extracts questions
   * Implements abstract method from AIService
   */
  async analyzeDocument(file: File): Promise<Question[]> {
    try {
      const base64Data = await this.fileToBase64(file);
      const mimeType = this.getMimeType(file);
      
      const prompt = this.buildAnalysisPrompt();
      
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
      ]);

      const responseText = result.response.text();
      return this.parseQuestionsFromResponse(responseText);
    } catch (error: any) {
      console.error('Error analyzing document:', error);
      
      // Handle specific API errors
      if (error.message && error.message.includes('429')) {
        throw new Error(
          'API Rate Limit Exceeded\n\n' +
          'You have made too many requests to the Gemini API. This can happen because:\n' +
          '• You are using the free tier with limited quota\n' +
          '• Multiple requests were made too quickly\n\n' +
          'Solutions:\n' +
          '1. Wait a few minutes and try again\n' +
          '2. Use a different API key\n' +
          '3. Upgrade to a paid plan for higher limits\n' +
          '4. Try a smaller document or fewer questions\n\n' +
          'Learn more: https://ai.google.dev/pricing'
        );
      }
      
      if (error.message && error.message.includes('API key')) {
        throw new Error(
          'Invalid API Key\n\n' +
          'Please check your Gemini API key and make sure it is valid.\n' +
          'Get your API key at: https://makersuite.google.com/app/apikey'
        );
      }
      
      throw new Error(`Failed to analyze document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generates questions from a topic using AI
   * Implements abstract method from AIService
   */
  async generateQuestions(
    topic: string,
    count: number,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ): Promise<Question[]> {
    try {
      const prompt = this.buildGenerationPrompt(topic, count, difficulty);
      
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      return this.parseQuestionsFromResponse(responseText);
    } catch (error: any) {
      console.error('Error generating questions:', error);
      
      // Handle specific API errors
      if (error.message && error.message.includes('429')) {
        throw new Error(
          'API Rate Limit Exceeded\n\n' +
          'You have made too many requests to the Gemini API.\n\n' +
          'Solutions:\n' +
          '1. Wait a few minutes and try again\n' +
          '2. Use a different API key\n' +
          '3. Reduce the number of questions to generate\n' +
          '4. Upgrade to a paid plan for higher limits\n\n' +
          'Learn more: https://ai.google.dev/pricing'
        );
      }
      
      if (error.message && error.message.includes('API key')) {
        throw new Error(
          'Invalid API Key\n\n' +
          'Please check your Gemini API key and make sure it is valid.\n' +
          'Get your API key at: https://makersuite.google.com/app/apikey'
        );
      }
      
      throw new Error(`Failed to generate questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods (Encapsulation - hide implementation details)
  
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private getMimeType(file: File): string {
    const validMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp',
      'application/pdf',
    ];

    if (validMimeTypes.includes(file.type)) {
      return file.type;
    }

    // Fallback based on extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'application/pdf';
    if (['jpg', 'jpeg'].includes(extension || '')) return 'image/jpeg';
    if (extension === 'png') return 'image/png';
    if (extension === 'gif') return 'image/gif';

    return 'image/png'; // Default fallback
  }

  private buildAnalysisPrompt(): string {
    return `You are an expert exam question analyzer. Analyze this test bank document and extract ALL questions.

CRITICAL INSTRUCTION: Convert ALL questions to multiple-choice format with 4 options.

If the document contains:
- True/False questions → Convert to: "A) True, B) False, C) Cannot be determined, D) Depends on context"
- Fill-in-the-blank questions → Create 4 plausible options including the correct answer
- Short answer questions → Generate 4 options with the correct answer and 3 distractors
- Essay questions → Convert to conceptual multiple-choice about key points
- Matching questions → Convert each pair to a separate multiple-choice question
- Code tracing questions → Include the code in the question text, provide 4 possible output/result options
- Code completion questions → Include code snippet in question, provide 4 possible completion options
- Algorithm questions → Present the scenario, provide 4 possible answers
- Already multiple-choice → Keep as-is

HANDLING CODE IN QUESTIONS:
- Format code questions like: "What is the output of this code: [actual code here]"
- Or: "What is the output of the following code: [actual code here]"
- For better readability, you can use semicolons to separate statements (they will be formatted on new lines)
- Replace tabs with spaces
- Keep code readable but JSON-safe
- For code output questions: "What is the output of this code: x = 5; y = x + 3; print(y)" with 4 output options
- For code trace questions: "What is the output of the following code: for i in range(3): print(i)" with 4 value options
- Multi-line code example: "What is the output of this code: int x = 5; int y = 10; int sum = x + y; System.out.println(sum);"

IMPORTANT JSON RULES:
- Return ONLY a valid JSON array
- NO markdown, NO code blocks, NO explanations before or after
- Use double quotes for all strings
- Escape special characters: \" for quotes, \n for newlines, \\ for backslashes
- Do NOT include comments in JSON
- Do NOT use single quotes
- Ensure all brackets and braces are properly closed
- For code in questions: keep it simple, escape quotes, use spaces not tabs

For each question, provide:
1. The question text (include code if it's a code question, remove numbering like "1.", "Q1:")
2. Exactly 4 answer options in format: "A) option1", "B) option2", "C) option3", "D) option4"
3. The correct answer letter (look for asterisks *, bold text, highlights, "ANSWER:" labels, or any visual markers)

Return this EXACT JSON format (nothing else):
[
  {
    "question": "What is the capital of France?",
    "options": ["A) Berlin", "B) Madrid", "C) Paris", "D) Rome"],
    "correctAnswer": "C"
  },
  {
    "question": "What is the output of this code: x = 5; y = x + 3; print(y)",
    "options": ["A) 5", "B) 8", "C) 3", "D) Error"],
    "correctAnswer": "B"
  },
  {
    "question": "Write a C++ program that asks users to enter a value (x) and computes:\ny = x^2 - x + 5, 0<x<5, x/2 otherwise.",
    "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
    "correctAnswer": "A"
  },
  {
    "question": "What is the output of the following code: for i in range(3): print(i)",
    "options": ["A) 0 1 2", "B) 1 2 3", "C) 0 1 2 3", "D) Error"],
    "correctAnswer": "A"
  },
  {
    "question": "What is the output of this code: int x = 10; int y = 20; int z = x + y; System.out.println(z);",
    "options": ["A) 10", "B) 20", "C) 30", "D) 1020"],
    "correctAnswer": "C"
  }
]

Requirements:
- Extract ALL questions from the document
- Convert EVERY question to multiple-choice with exactly 4 options
- For code questions: preserve code readability, escape special characters properly
- For multi-line questions: use \n for line breaks to improve readability
- Clean up question text (remove numbering, escape special characters)
- Make distractors plausible but clearly wrong
- Return ONLY the JSON array, nothing else`;
  }

  private buildGenerationPrompt(
    topic: string,
    count: number,
    difficulty: string
  ): string {
    return `Generate exactly ${count} ${difficulty} multiple-choice questions about "${topic}".

CRITICAL: All questions MUST be multiple-choice with exactly 4 options.

Question types you CAN generate:
- Conceptual questions (definitions, explanations)
- Code tracing questions (what does this code output/return)
- Code analysis questions (what value does variable X have)
- Algorithm questions (which approach is best)
- Problem-solving questions

Do NOT generate:
- True/False questions (unless converted to 4-option format)
- Fill-in-the-blank questions
- Short answer questions
- Essay questions

For programming/code questions:
- Format as: "What is the output of this code: [code here]" or "What is the output of the following code: [code here]"
- Include code snippets after the phrase "code:" or "following code:"
- Separate statements with semicolons for better formatting
- Ask about output, return value, variable values, or behavior
- Provide 4 distinct possible answers
- Keep code simple and JSON-safe (escape quotes, avoid complex formatting)
- Example: "What is the output of this code: x = 10; y = x * 2; print(y)" with options A) 10, B) 20, C) 12, D) Error
- Example: "What is the output of the following code: for i in range(5): print(i)" with options showing different outputs
- Example: "What is the output of this code: int sum = 0; for(int i = 1; i <= 3; i++) { sum += i; } System.out.println(sum);" with proper output options

IMPORTANT JSON RULES:
- Return ONLY a valid JSON array
- NO markdown, NO code blocks, NO explanations
- Use double quotes for all strings
- Escape special characters: \" for quotes, \n for newlines, \\ for backslashes
- Do NOT include comments in JSON
- Ensure all brackets and braces are properly closed
- For code: use spaces not tabs, escape quotes properly

Return ONLY this valid JSON array format (nothing else):
[
  {
    "question": "Question text here?",
    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
    "correctAnswer": "A"
  }
]

Requirements:
- Generate exactly ${count} questions
- Make questions ${difficulty} difficulty level
- Questions should be educational and factually accurate
- Each question MUST have exactly 4 options (A, B, C, D)
- For code questions: ensure code is valid and outputs are correct
- Clearly indicate the correct answer with the letter (A, B, C, or D)
- Make distractors challenging but clearly incorrect
- Vary the position of correct answers (don't always use A or D)
- Return ONLY the JSON array, nothing else`;
  }

  private parseQuestionsFromResponse(responseText: string): Question[] {
    // Clean response - remove markdown code blocks if present
    let jsonText = responseText.trim();
    
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    jsonText = jsonText.trim();

    // Try to parse JSON with better error handling
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw Response:', responseText);
      console.error('Cleaned JSON Text:', jsonText);
      
      // Try to extract JSON array if wrapped in text
      const arrayMatch = jsonText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (arrayMatch) {
        try {
          data = JSON.parse(arrayMatch[0]);
        } catch (retryError) {
          throw new Error(`Invalid JSON response from AI. Please try again. Error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
      } else {
        throw new Error(`Invalid JSON response from AI. Please try again. Error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
    }

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected array of questions');
    }

    // Convert to Question objects
    return data.map((item: any, index: number) => {
      const correctAnswerLetter = item.correctAnswer.toUpperCase().charAt(0);
      const correctIndex = correctAnswerLetter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3

      // Ensure newlines are properly handled (JSON.parse should handle this, but double-check)
      const questionText = item.question || '';
      
      return new Question(
        index + 1,
        questionText,
        item.options,
        correctIndex
      );
    });
  }
}
