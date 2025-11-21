# AI Test Bank Exam Generator

An intelligent web application that converts test bank documents (images and PDFs) into interactive, self-grading exams using AI-powered document analysis.

## ✨ Features

- 📄 **Multiple Format Support**: Accepts both images (JPG, PNG, etc.) and PDF files
- 🤖 **AI-Powered Analysis**: Automatically extracts questions and answers from documents
- 📝 **Interactive Exams**: Take exams with immediate feedback
- ✅ **Auto-Grading**: Instant scoring and detailed results
- 📊 **Results Review**: See your score and review correct/incorrect answers
- 🎨 **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- ⚡ **Fast Processing**: Generate exams in under 60 seconds

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- AI API key (you'll need to choose and configure an AI service)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd ai-test-bank-generator
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Add your AI API key to `.env`:
   ```
   VITE_AI_API_KEY=your_actual_api_key_here
   ```
   
   > **Note:** The environment variable name may vary based on which AI service you choose to implement.

5. Start the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. Open your browser to `http://localhost:5173`

## 📖 How to Use

1. **Upload** your test bank document (image or PDF)
2. **Wait** for AI to extract questions (5-60 seconds)
3. **Take** the interactive exam
4. **Submit** and get instant results with detailed feedback!

### Supported File Types

#### Images
- JPG/JPEG
- PNG
- GIF
- WebP
- BMP

#### Documents
- PDF (including multi-page documents)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Wouter** - Routing

### Backend
- **Express** - Server framework
- **AI Integration** - Document analysis & question extraction

## 📁 Project Structure

```
ai-test-bank-generator/
├── client/
│   ├── src/
│   │   ├── models/                  # OOP data models
│   │   │   ├── Question.ts          # Question model with encapsulation
│   │   │   ├── Exam.ts              # Exam model with composition
│   │   │   └── ExamResult.ts        # Result calculation model
│   │   ├── services/                # Business logic layer
│   │   │   ├── AIService.ts         # Abstract AI service (factory pattern)
│   │   │   └── ExamService.ts       # Exam orchestration (DI pattern)
│   │   ├── components/              # UI components
│   │   │   ├── UploadForm.tsx       # File upload interface
│   │   │   ├── Exam.tsx             # Interactive exam interface
│   │   │   ├── Results.tsx          # Results display
│   │   │   └── ui/                  # Reusable UI components
│   │   ├── pages/
│   │   │   └── Home.tsx             # Main page
│   │   └── lib/
│   │       └── utils.ts             # Utility functions
│   └── index.html
├── server/
│   └── index.ts                     # Express server
├── .env.example                     # Environment variables template
├── presentation-hackathon.html      # Competition presentation
├── evaluation-criteria.html         # Judging criteria
└── package.json
```

## 🔧 Configuration

### Environment Variables

- `VITE_AI_API_KEY`: Your AI service API key (required)

### API Considerations

When integrating an AI service, be aware of:
- Rate limits on API calls
- File size limits (varies by provider and plan)
- Response time variations
- Cost considerations (if using paid tiers)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🏗️ Architecture & Design Patterns

This project implements professional software engineering patterns:

- **Service Layer Pattern**: Separation of business logic from UI
- **Dependency Injection**: Flexible, testable service architecture
- **Abstract Factory**: Pluggable AI service providers
- **Model-View Pattern**: Clear separation of data and presentation
- **Encapsulation**: Private fields with controlled access
- **Composition**: Building complex objects from simpler ones

See `PROJECT_WORKFLOW.md` for detailed architecture documentation.

## ⚠️ Important Notes

- No files are stored on servers - everything is processed in real-time
- Your API key is used locally and never shared
- Ensure you have permission to use and distribute test bank materials
- Recommended max file size: 10MB for optimal performance

## 🐛 Troubleshooting

### "No questions were found"
- Verify the document has clear, readable questions
- Try a higher quality scan or image
- Ensure text is readable (not blurry or low resolution)
- Check that questions follow a standard format (numbered with options A, B, C, D)

### API Errors
- Check your `VITE_AI_API_KEY` in `.env`
- Verify you have API quota available
- Ensure the API key has proper permissions
- Check for rate limiting issues

### Slow Processing
- Large PDFs (50+ pages) may take longer to process
- Complex layouts or scanned images require more processing time
- Consider splitting very large documents

### File Upload Issues
- Ensure file size is under 10MB
- Supported formats: PDF, PNG, JPG, JPEG, GIF, WebP, BMP
- Check that the file is not corrupted

## 📚 Documentation

- **PROJECT_WORKFLOW.md** - Complete architecture and workflow documentation
- **PROJECT_DIFFICULTY_ASSESSMENT.md** - Difficulty analysis for educators
- **presentation-hackathon.html** - Competition presentation slides
- **evaluation-criteria.html** - Judging criteria for competitions

## 🎓 For Educators & Competition Organizers

This project is designed as a learning tool and hackathon challenge:

- **Time Estimate**: 4-8 hours for experienced developers
- **Difficulty Level**: Intermediate to Advanced
- **Key Learning Outcomes**: OOP, Design Patterns, AI Integration, Full-stack Development
- **AI Usage**: Students can use AI coding assistants (ChatGPT, Copilot) to help code

## 📧 Support

If you encounter any issues, please open an issue on GitHub or refer to the documentation files.


