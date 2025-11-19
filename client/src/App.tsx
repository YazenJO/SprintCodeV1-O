import { useState, useCallback, useMemo } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import UploadForm from './components/UploadForm';
import Exam from './components/Exam';
import Results from './components/Results';
import { Exam as ExamModel } from './models/Exam';
import { ExamService } from './services/ExamService';
import { GeminiAIService } from './services/AIService';

type AppView = 'upload' | 'exam' | 'results';

function App() {
  const [view, setView] = useState<AppView>('upload');
  const [currentExam, setCurrentExam] = useState<ExamModel | null>(null);

  // Initialize ExamService with GeminiAIService (Dependency Injection)
  const examService = useMemo(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const aiService = new GeminiAIService(apiKey);
    return new ExamService(aiService);
  }, []);

  const handleExamStart = useCallback((exam: ExamModel) => {
    setCurrentExam(exam);
    setView('exam');
  }, []);

  const handleExamSubmit = useCallback(() => {
    if (currentExam) {
      currentExam.end();
    }
    setView('results');
  }, [currentExam]);

  const handleRestart = useCallback(() => {
    setView('upload');
    setCurrentExam(null);
    examService.resetExam();
  }, [examService]);

  const renderContent = () => {
    switch (view) {
      case 'exam':
        return currentExam ? (
          <Exam exam={currentExam} onSubmit={handleExamSubmit} />
        ) : (
          <UploadForm examService={examService} onExamStart={handleExamStart} />
        );
      case 'results':
        return currentExam ? (
          <Results exam={currentExam} onRestart={handleRestart} />
        ) : (
          <UploadForm examService={examService} onExamStart={handleExamStart} />
        );
      case 'upload':
      default:
        return <UploadForm examService={examService} onExamStart={handleExamStart} />;
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {renderContent()}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
