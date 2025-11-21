# AI Test Bank Exam Generator

An intelligent web application that converts test bank documents (images and PDFs) into interactive, self-grading exams using Google's Gemini AI.

## ✨ Features

- 📄 **Multiple Format Support**: Accepts both images (JPG, PNG, etc.) and PDF files
- 🔗 **Google Drive Integration**: Process files directly from Google Drive URLs
- 🤖 **AI-Powered Analysis**: Uses Google Gemini to extract questions and answers
- 📝 **Interactive Exams**: Take exams with immediate feedback
- 📊 **Results Tracking**: See your score and review answers
- 🎨 **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

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

### Using Google Drive Files

1. **Upload** your test bank document (image or PDF) to Google Drive
2. **Share** the file publicly:
   - Right-click → Share
   - Change to "Anyone with the link"
   - Set to "Viewer" access
3. **Copy** the share URL
4. **Paste** the URL in the application
5. **Click** "Generate Exam"
6. **Take** the exam and get instant results!

📚 For detailed instructions, see [GOOGLE_DRIVE_SETUP.md](./GOOGLE_DRIVE_SETUP.md)

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
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Wouter** - Routing

### Backend
- **Express** - Server framework
- **Google Gemini AI** - Document analysis

## 📁 Project Structure

```
ai-test-bank-generator/
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── geminiClient.ts      # Gemini API integration
│   │   ├── components/
│   │   │   ├── UploadForm.tsx       # Google Drive URL input
│   │   │   ├── Exam.tsx             # Exam interface
│   │   │   └── Results.tsx          # Results display
│   │   └── pages/
│   │       └── Home.tsx             # Main page
│   └── index.html
├── server/
│   └── index.ts                     # Express server
├── .env.example                     # Environment variables template
└── package.json
```

## 🔧 Configuration

### Environment Variables

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key (required)

### API Limits

The application uses Google Gemini's free tier by default. Be aware of:
- Rate limits on API calls
- File size limits (varies by plan)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## ⚠️ Important Notes

- Files must be publicly accessible on Google Drive ("Anyone with the link")
- No files are stored on our servers - everything is processed in real-time
- Your API key is used locally and never shared
- Ensure you have permission to use and distribute test bank materials

## 🐛 Troubleshooting

### "Failed to fetch file from Google Drive"
- Ensure the file is shared publicly
- Check that the URL is correct

### "No questions were found"
- Verify the document has clear, readable questions
- Try a higher quality scan or image
- Ensure text is readable (not blurry or low resolution)

### API Errors
- Check your `VITE_GEMINI_API_KEY` in `.env`
- Verify you have API quota available
- Ensure the API key has proper permissions

## 📧 Support

If you encounter any issues, please check the [GOOGLE_DRIVE_SETUP.md](./GOOGLE_DRIVE_SETUP.md) guide or open an issue on GitHub.


