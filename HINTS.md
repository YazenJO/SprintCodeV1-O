# � Competition Hints: AI Test Bank Generator

## 🎯 Challenge Overview
Build a web application that uses AI to analyze test bank documents and generate interactive exams. You'll need to integrate Google's Gemini AI, handle file uploads, and create a smooth user experience.

---

## 🏆 Competition Rules

⚠️ **This is a coding competition - you must implement the solution yourself!**

These hints will guide you in the right direction, but:
- ❌ No complete code solutions provided
- ✅ Architectural guidance and best practices
- ✅ Links to official documentation
- ✅ Common pitfall warnings
- ✅ Testing strategies

**Good luck! 🚀**

---

## 📚 What You Need to Learn

### Core Technologies Required:
1. **React** - Component-based UI
2. **TypeScript** - Type-safe JavaScript
3. **AI API Integration** - Google Gemini
4. **File Handling** - Browser FileReader API
5. **Async/Await** - Promises and async operations
6. **Error Handling** - Try/catch and user feedback

---

## �️ Project Roadmap

### Phase 1: Environment Setup (⏱️ 15 mins)
- [ ] Install dependencies
- [ ] Get Gemini API key
- [ ] Configure environment variables
- [ ] Start dev server

### Phase 2: Understand the Codebase (⏱️ 30 mins)
- [ ] Explore project structure
- [ ] Identify missing implementations
- [ ] Read component props and interfaces
- [ ] Trace data flow

### Phase 3: API Integration (⏱️ 1-2 hours) **MAIN CHALLENGE**
- [ ] Study Gemini API documentation
- [ ] Implement file-to-base64 conversion
- [ ] Create API client
- [ ] Handle responses
- [ ] Parse JSON results

### Phase 4: Error Handling (⏱️ 30 mins)
- [ ] Add try/catch blocks
- [ ] Validate inputs
- [ ] Display user-friendly errors
- [ ] Handle edge cases

### Phase 5: Testing (⏱️ 30 mins)
- [ ] Test with sample images
- [ ] Test error scenarios
- [ ] Verify question parsing
- [ ] Check exam flow

---

## 🔑 Critical Hints

### Hint 1: Getting Started with Gemini AI

**What you need:**
- A FREE API key from Google AI Studio
- The official SDK: `@google/generative-ai`
- Environment variable setup

**Where to look:**
- 🔗 [Google AI Studio](https://aistudio.google.com/app/apikey)
- 📖 [Gemini API Docs](https://ai.google.dev/docs)
- 📦 [SDK on npm](https://www.npmjs.com/package/@google/generative-ai)

**Questions to answer:**
- How do I initialize the Gemini client?
- Which model should I use? (Hint: Check model names in docs)
- How do I pass both text and images to the API?

---

### Hint 2: File Upload Mystery

**The Challenge:**
You need to convert a File object from the browser into something Gemini can understand.

**Key Concepts to Research:**
- What is base64 encoding?
- How does `FileReader` work in browsers?
- What format does Gemini expect for images?

**Starting Point:**
```typescript
// You'll need something like this structure:
const imagePart = {
  inlineData: {
    data: ???,      // What goes here?
    mimeType: ???   // What goes here?
  }
};
```

**Questions to solve:**
- How do I read a File as base64?
- Do I need to include the "data:image/png;base64," prefix?
- Where do I get the MIME type from?

---

### Hint 3: Talking to AI

**The Challenge:**
Craft a prompt that makes Gemini extract questions in the exact format you need.

**Prompt Engineering Tips:**
- Be VERY specific about output format
- Request JSON only (no markdown)
- Give examples of what you want
- Define the data structure clearly
- Handle edge cases in your prompt

**Things to think about:**
- What if there are no questions in the image?
- How do you identify the correct answer?
- Should you use few-shot examples?
- How do you prevent the AI from adding extra text?

**Documentation:**
- 🔗 [Gemini Prompting Guide](https://ai.google.dev/docs/prompting_intro)

---

### Hint 4: API Call Structure

**You need to figure out:**

1. **How to initialize the client**
   - Which package to import?
   - How to pass your API key?
   - Which model name to use?

2. **How to structure the request**
   - What method sends the request?
   - How to combine text + image?
   - What does the response look like?

3. **How to handle the response**
   - Where is the text in the response object?
   - How to parse JSON from text?
   - What if parsing fails?

**Exploration Task:**
Look at the `@google/generative-ai` package documentation and find:
- The main class name
- The method for generating content
- The response object structure

---

### Hint 5: Common Mistakes to Avoid

⚠️ **API Key Issues:**
- Forgetting to restart dev server after changing `.env`
- Using the wrong environment variable format
- Hardcoding keys (security risk!)

⚠️ **File Handling:**
- Not validating file size/type before upload
- Forgetting to handle FileReader errors
- Including base64 prefix when it shouldn't be there

⚠️ **API Integration:**
- Using wrong model names
- Not handling rate limits (429 errors)
- Forgetting async/await
- Not catching errors

⚠️ **Response Parsing:**
- Assuming AI always returns valid JSON
- Not handling markdown code blocks in response
- Forgetting to validate parsed data

---

## 🔍 Where to Find Answers

### Official Documentation:
1. **Google Gemini API**: https://ai.google.dev/docs
2. **SDK Reference**: https://ai.google.dev/tutorials/node_quickstart
3. **React Docs**: https://react.dev
4. **FileReader API**: https://developer.mozilla.org/en-US/docs/Web/API/FileReader

### Code Exploration:
- Check existing component files for data structures
- Look at TypeScript interfaces to understand data flow
- Examine the incomplete `geminiClient.ts` file

### Testing Resources:
- Use `console.log()` extensively
- Check browser DevTools Network tab
- Try Google AI Studio playground first

---

## 🎓 Learning Checkpoints

### Checkpoint 1: Can you answer these?
- [ ] What npm package do I need for Gemini?
- [ ] Where do I store my API key?
- [ ] What is the main model I should use?

### Checkpoint 2: File handling
- [ ] How do I read a file in the browser?
- [ ] What is base64 encoding?
- [ ] How do I get a file's MIME type?

### Checkpoint 3: API Integration
- [ ] How do I initialize the Gemini client?
- [ ] What method sends content to Gemini?
- [ ] How do I include an image in my request?

### Checkpoint 4: Response Handling
- [ ] Where is the text in the API response?
- [ ] How do I safely parse JSON?
- [ ] What if the AI returns invalid data?

---

## 🧪 Testing Strategy

### Test Case 1: Happy Path
- Upload a clear test bank image
- Verify questions are extracted
- Check correct answers are identified
- Ensure exam works properly

### Test Case 2: Error Scenarios
- What happens with no API key?
- What if the file is too large?
- What if the image has no questions?
- What if the API returns an error?

### Test Case 3: Edge Cases
- PDF files (not just images)
- Very small images
- Images with poor quality
- Multiple question formats

---

## 💭 Problem-Solving Approach

When you get stuck:

1. **Read the error message carefully**
   - It usually tells you exactly what's wrong
   - Search the error on Google/Stack Overflow

2. **Check the browser console**
   - Look for JavaScript errors
   - Check Network tab for API calls
   - Verify your API key is being used

3. **Use console.log debugging**
   ```typescript
   console.log('Step 1: File received', file);
   console.log('Step 2: Base64 data', data);
   console.log('Step 3: API response', response);
   ```

4. **Test in isolation**
   - Test file upload separately
   - Test API call with hardcoded data
   - Test JSON parsing separately

5. **Read documentation**
   - Official docs are your best friend
   - Look for code examples
   - Check API reference guides

---

## � What NOT to Do

❌ Copy-paste code without understanding it  
❌ Skip error handling  
❌ Ignore TypeScript type errors  
❌ Commit API keys to version control  
❌ Test only the happy path  
❌ Give up without asking for help  

✅ Read documentation thoroughly  
✅ Test incrementally  
✅ Handle all error cases  
✅ Use TypeScript types properly  
✅ Ask specific questions when stuck  
✅ Understand every line you write  

---

## 🎯 Success Criteria

Your solution should:
- ✅ Successfully upload and analyze test bank files
- ✅ Extract questions and answers correctly
- ✅ Display questions in exam format
- ✅ Calculate and show results
- ✅ Handle errors gracefully
- ✅ Work with both images and PDFs
- ✅ Have a clean, professional UI

---

## 🏁 Final Tips

1. **Start Simple**: Get basic API call working first
2. **Read Errors**: They're your best debugging tool
3. **Use Types**: TypeScript will catch many bugs
4. **Test Often**: Don't write 100 lines before testing
5. **Stay Organized**: Keep code clean and commented
6. **Time Management**: Don't spend hours on styling first

---

## ⏱️ Time Estimates

- Environment setup: **15 minutes**
- Understanding codebase: **30 minutes**
- API integration (main challenge): **1-2 hours**
- Error handling: **30 minutes**
- Testing & debugging: **30 minutes**
- **Total: 3-4 hours**

---

## 🆘 When You're Really Stuck

Ask yourself:
1. What exactly am I trying to do?
2. What have I tried so far?
3. What error am I getting?
4. Where in the docs did I look?
5. What does the console show?

Then seek help with specific questions, not "how do I do everything?"

---

**Remember:** This is a learning experience. The struggle is part of the process. You've got this! 💪

**Good luck, and may your code compile on the first try! 🚀**

### 1️⃣ **Getting Your API Key**

```typescript
// You need a FREE API key from Google AI Studio
// Visit: https://aistudio.google.com/app/apikey
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

**Steps to get API key:**
- Go to https://aistudio.google.com/app/apikey
- Sign in with your Google account
- Click "Create API Key"
- Copy the key and add it to `.env` file:
  ```
  VITE_GEMINI_API_KEY=your_api_key_here
  ```

### 2️⃣ **Installing the Gemini SDK**

```bash
npm install @google/generative-ai
```

**Why this package?**
- Official Google SDK for Gemini AI
- Handles authentication automatically
- Provides TypeScript types
- Simplifies API calls

### 3️⃣ **Understanding the File Upload Flow**

```typescript
// Step 1: Convert file to base64
const fileToBase64 = async (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const data = base64.split(',')[1]; // Remove data:image/png;base64, prefix
      resolve({ data, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
```

**💡 Hint:** 
- `FileReader` is a browser API for reading file contents
- `readAsDataURL()` converts the file to base64 string
- Base64 is needed because we're sending binary data (images) as text to the API

### 4️⃣ **Making the API Call**

```typescript
export const analyzeLocalFileWithGemini = async (file: File): Promise<GeminiResponse> => {
  // 1. Initialize the API client
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // 2. Get the specific model
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  // 3. Convert file to base64
  const { data: fileData, mimeType } = await fileToBase64(file);
  
  // 4. Create the image part
  const imagePart = {
    inlineData: {
      data: fileData,
      mimeType: mimeType,
    },
  };
  
  // 5. Send the prompt + image
  const result = await model.generateContent([prompt, imagePart]);
  
  // 6. Extract text response
  const text = result.response.text();
  
  // 7. Parse JSON
  return JSON.parse(text);
};
```

**💡 Key Points:**
- `gemini-2.0-flash` is the model name (fast and efficient)
- The API accepts both text (prompt) and images together
- The response comes back as text, so we parse it as JSON
- Always wrap in try-catch for error handling

### 5️⃣ **Crafting the Perfect Prompt**

```typescript
const prompt = `
You are an expert at analyzing test bank documents and extracting questions.

INSTRUCTIONS:
1. Extract all multiple-choice questions from this document
2. Each question must have exactly 4 options (A, B, C, D)
3. Identify the correct answer for each question
4. Return ONLY valid JSON, no markdown or extra text

OUTPUT FORMAT (strict JSON):
{
  "questions": [
    {
      "id": 1,
      "text": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    }
  ]
}

RULES:
- correctIndex: 0 for A, 1 for B, 2 for C, 3 for D
- Ensure all text is properly escaped
- Return empty array if no questions found
- Do not include explanations or markdown
`;
```

**💡 Prompt Engineering Tips:**
- Be very specific about output format
- Use examples to guide the AI
- Request JSON only (no markdown code blocks)
- Define clear rules for edge cases
- Use structured format (like numbered lists)

### 6️⃣ **Error Handling Strategies**

```typescript
try {
  const result = await analyzeLocalFileWithGemini(file);
  
  // Validate response
  if (!result || !result.questions || result.questions.length === 0) {
    throw new Error('No questions were found in the document.');
  }
  
  // Success!
  onExamStart(result.questions);
  
} catch (err) {
  // Handle different error types
  if (err instanceof Error) {
    if (err.message.includes('API key')) {
      setError('Invalid API key. Please check your .env file.');
    } else if (err.message.includes('quota')) {
      setError('API quota exceeded. Please try again later.');
    } else if (err.message.includes('MIME')) {
      setError('Unsupported file type. Please use PNG, JPG, or PDF.');
    } else {
      setError(err.message);
    }
  }
}
```

**💡 Common Errors:**
- **401 Unauthorized**: Invalid or missing API key
- **429 Too Many Requests**: Quota limit reached (wait or upgrade)
- **400 Bad Request**: Invalid file type or corrupted image
- **500 Server Error**: Gemini API is down (retry later)

---

## 🎨 Frontend Integration Tips

### **File Upload Component** (`client/src/components/UploadForm.tsx`)

```typescript
// 1. File validation before sending to API
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  
  // Size check (10MB limit)
  if (selectedFile.size > 10 * 1024 * 1024) {
    setError('File too large');
    return;
  }
  
  // Type check
  const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
  if (!validTypes.includes(selectedFile.type)) {
    setError('Invalid file type');
    return;
  }
  
  setFile(selectedFile);
};

// 2. Submit to API
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const result = await analyzeLocalFileWithGemini(file);
    onExamStart(result.questions);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

**💡 UX Best Practices:**
- Show loading state during API call (can take 5-15 seconds)
- Validate files client-side before sending
- Provide clear error messages
- Show file preview for better UX

---

## 🧪 Testing Your API Integration

### **Step-by-Step Testing:**

1. **Test with Console Logs**
```typescript
console.log('1. API Key:', apiKey ? 'Found' : 'Missing');
console.log('2. File:', file.name, file.type, file.size);
console.log('3. Base64 length:', fileData.length);
console.log('4. API Response:', result);
```

2. **Test with Different Files**
- ✅ Clear, high-quality image
- ✅ PDF with text questions
- ❌ Blurry or low-quality image
- ❌ Image without questions
- ❌ Very large files (>10MB)

3. **Test Error Scenarios**
- Remove API key → Should show error
- Upload wrong file type → Should validate
- Upload corrupted file → Should handle gracefully

---

## 🚨 Common Pitfalls & Solutions

### Problem 1: "API Key Not Found"
**Solution:** 
```bash
# Make sure .env file exists in root directory
# File should contain:
VITE_GEMINI_API_KEY=your_actual_key_here

# Restart dev server after changing .env
npm run dev
```

### Problem 2: "Invalid JSON Response"
**Solution:**
```typescript
// The AI sometimes returns markdown. Clean it:
let text = result.response.text();
text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
const parsed = JSON.parse(text);
```

### Problem 3: "CORS Errors"
**Solution:** This shouldn't happen with the SDK, but if it does:
- You're using the wrong approach (REST API instead of SDK)
- Use the SDK: `@google/generative-ai` (handles CORS internally)

### Problem 4: "Rate Limiting (429)"
**Solution:**
- Free tier: 15 requests per minute
- Add retry logic with exponential backoff
- Or upgrade to paid tier

---

## 🎓 Learning Challenges

### **Beginner Challenge:**
1. Add support for more file types (DOCX, TXT)
2. Display the uploaded image before analysis
3. Add a "Cancel" button during loading

### **Intermediate Challenge:**
1. Implement retry logic for failed API calls
2. Add caching to avoid re-analyzing same file
3. Show analysis progress (parsing, extracting, validating)

### **Advanced Challenge:**
1. Support batch file upload (multiple test banks)
2. Add question editing before starting exam
3. Implement OCR fallback for low-quality images
4. Save exam history to localStorage

---

## 📚 API Models Comparison

| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| `gemini-2.0-flash` | ⚡⚡⚡ Fast | ⭐⭐⭐ Good | Current project |
| `gemini-1.5-pro` | ⚡ Slower | ⭐⭐⭐⭐⭐ Best | Complex documents |
| `gemini-1.5-flash` | ⚡⚡ Medium | ⭐⭐⭐ Good | Legacy option |

**💡 Recommendation:** 
- Use `gemini-2.0-flash` for most cases (fast + free tier friendly)
- Use `gemini-1.5-pro` if you need higher accuracy

---

## 🔐 Security Best Practices

1. **Never commit API keys to Git**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   ```

2. **Use environment variables**
   ```typescript
   // ✅ Good
   const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
   
   // ❌ Bad
   const apiKey = "AIzaSy..."; // Never hardcode!
   ```

3. **Validate all user inputs**
   ```typescript
   // Check file size, type, and content before API call
   ```

4. **Rate limiting on frontend**
   ```typescript
   // Prevent spam clicking "Generate" button
   const [isLoading, setIsLoading] = useState(false);
   ```

---

## 🛠️ Development Workflow

### **1. Setup Environment**
```bash
# Install dependencies
npm install

# Create .env file
echo "VITE_GEMINI_API_KEY=your_key" > .env

# Start dev server
npm run dev
```

### **2. Modify API Logic**
```typescript
// Edit: client/src/api/geminiClient.ts
// Test changes immediately (hot reload)
```

### **3. Debug with Browser DevTools**
```javascript
// Console tab: See logs
// Network tab: See API requests
// Application tab: Check localStorage
```

### **4. Test Thoroughly**
- Upload different file types
- Test with no API key
- Test with invalid files
- Test error scenarios

---

## 📖 Additional Resources

### **Official Documentation:**
- Gemini API Docs: https://ai.google.dev/docs
- SDK Reference: https://ai.google.dev/tutorials/node_quickstart
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

### **API Playground:**
- Test prompts: https://aistudio.google.com
- Try different models and see responses in real-time

### **Community:**
- Stack Overflow: Tag `google-gemini`
- GitHub Issues: Report bugs in SDK
- Discord: React and Vite communities

---

## 🎯 Project Completion Checklist

- [ ] API key configured in `.env`
- [ ] File upload working
- [ ] API integration functional
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Questions display correctly
- [ ] Exam functionality works
- [ ] Results calculation accurate
- [ ] UI is responsive
- [ ] Code is clean and commented

---

## 🏆 Final Tips

1. **Start Simple**: Get basic API call working first, then add features
2. **Read Error Messages**: They usually tell you exactly what's wrong
3. **Use Console.log**: Your best debugging friend
4. **Test Incrementally**: Don't write 100 lines before testing
5. **Ask for Help**: Use AI assistants, forums, or mentors when stuck
6. **Document Your Code**: Future you will thank present you

---

## 💡 Remember

> "The best way to learn API integration is by doing it yourself. 
> Make mistakes, debug them, understand why they happened, and move forward."

**Good luck with your project! 🚀**

---

## 📝 Quick Reference: Key Files

```
ai-test-bank-generator/
├── client/src/api/
│   └── geminiClient.ts          ⭐ MAIN API FILE
├── client/src/components/
│   ├── UploadForm.tsx           📤 File upload UI
│   ├── Exam.tsx                 📝 Exam interface
│   └── Results.tsx              📊 Results display
├── .env                         🔑 API key storage
└── package.json                 📦 Dependencies
```

---

**Last Updated:** November 2025  
**Maintained by:** AI Test Bank Generator Team  
**Version:** 1.0.0
