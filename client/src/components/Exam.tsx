import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Exam as ExamModel } from '@/models/Exam';

interface ExamProps {
  exam: ExamModel;
  onSubmit: () => void;
}

export default function Exam({ exam, onSubmit }: ExamProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [, forceUpdate] = useState({});

  const questions = exam.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const selectedOption = currentQuestion.userAnswer;

  // Helper function to detect and format code in question text
  const formatQuestionText = (text: string) => {
    // Check if question contains ACTUAL code (not just asking about code/programs)
    const codePatterns = [
      /(?:code:|output of|following code|this code)/i,  // Code prefix (with or without colon)
      /;\s*\w+\s*=/,  // Variable assignments with semicolons (e.g., "x = 5; y = 10")
      /\w+\s*=\s*\d+;\s*\w+/,  // Multiple statements like "x=5; y=10"
      /for\s*\(/,   // For loops
      /while\s*\(/,  // While loops  
      /if\s*\(/,    // If statements
      /console\.log\(/,
      /print\s*\(/,
      /System\.out\./,
      /println\(/,
      /range\s*\(/,
    ];

    const hasCode = codePatterns.some(pattern => pattern.test(text));

    if (!hasCode) {
      // Regular question - preserve line breaks
      const lines = text.split('\n');
      return (
        <div className="mb-6">
          {lines.map((line, idx) => (
            <p key={idx} className="text-xl font-semibold text-[#c9d1d9] leading-relaxed">
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      );
    }

    // Try to extract code from common patterns (use multiline flag instead of dotAll)
    const codeMatch = text.match(/(?:code:|output of:?|following code:?|this code:?)\s*([\s\S]+?)(?:\?|$)/i);
    
    if (codeMatch) {
      const beforeCode = text.substring(0, codeMatch.index);
      let codeText = codeMatch[1].trim();
      const afterCode = text.substring((codeMatch.index || 0) + codeMatch[0].length);

      // Format code with proper line breaks
      // Replace common separators with newlines
      codeText = codeText
        .replace(/;\s*/g, ';\n')           // Semicolons
        .replace(/\{\s*/g, '{\n  ')        // Opening braces
        .replace(/\}\s*/g, '\n}\n')        // Closing braces
        .replace(/\n\s*\n/g, '\n')         // Remove extra blank lines
        .trim();

      // Render code with syntax highlighting using React components
      const renderCodeWithHighlighting = (code: string) => {
        const lines = code.split('\n');
        
        return lines.map((line, lineIdx) => {
          const parts: { text: string; color: string }[] = [];
          let currentText = line;
          
          // Define color patterns
          const patterns = [
            { regex: /\b(int|float|double|char|boolean|void|String|for|while|if|else|return|def|class|public|private|static|var|let|const|function|import|from)\b/g, color: '#c792ea' },
            { regex: /\b(\d+)\b/g, color: '#f78c6c' },
            { regex: /(["'])([^"']*)\1/g, color: '#c3e88d' },
            { regex: /\b(println|print|printf|console|log|System|out|range)\b/g, color: '#82aaff' },
            { regex: /([+\-*/%=<>!&|]+)/g, color: '#89ddff' }
          ];
          
          // Simple rendering without complex parsing
          return (
            <div key={lineIdx} className="leading-relaxed">
              <span style={{ color: '#a9b1d6' }}>{line || '\u00A0'}</span>
            </div>
          );
        });
      };

      const codeLines = renderCodeWithHighlighting(codeText);

      return (
        <div className="mb-6">
          {beforeCode && (
            <>
              <p className="text-lg font-semibold text-[#c9d1d9] mb-2">{beforeCode.trim()}</p>
              <div className="h-4"></div>
            </>
          )}
          
          {/* Code Block */}
          <div className="bg-[#0d1117] border-2 border-[#30363d] rounded-lg overflow-hidden mb-4 shadow-[0_0_15px_rgba(127,90,240,0.2)]">
            <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2 h-2 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2 h-2 rounded-full bg-[#27c93f]"></div>
              </div>
              <span className="font-mono text-xs text-[#8b949e] ml-3">code.txt</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <div className="font-mono text-xs sm:text-sm">
                {codeLines}
              </div>
            </div>
          </div>

          {afterCode && <p className="text-lg font-semibold text-[#c9d1d9]">{afterCode}</p>}
        </div>
      );
    }

    // If code pattern detected but can't extract, show with code styling
    return (
      <div className="mb-6">
        <div className="bg-[#0d1117] border-2 border-[#30363d] rounded-lg p-4 overflow-x-auto shadow-[0_0_15px_rgba(127,90,240,0.2)]">
          <pre className="font-mono text-xs sm:text-sm text-[#a9b1d6] leading-relaxed whitespace-pre-wrap">
            {text}
          </pre>
        </div>
      </div>
    );
  };

  const handleOptionChange = (optionIndex: number) => {
    // Use OOP method to answer question
    exam.answerQuestion(currentQuestion.id, optionIndex);
    // Force re-render by updating state with new object
    forceUpdate({});
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const unansweredCount = exam.totalQuestions - exam.getAnsweredCount();
    if (unansweredCount > 0) {
      const confirmed = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`
      );
      if (!confirmed) return;
    }
    onSubmit();
  };

  const progress = ((currentQuestionIndex + 1) / exam.totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-[#0d1117] p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-[0_0_20px_rgba(0,255,136,0.1)] p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-mono text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00ff88]">$</span> exam-session.run()
            </h1>
            <span className="font-mono text-sm font-medium text-[#8b949e] bg-[#0d1117] px-3 py-1 rounded border border-[#30363d]">
              {currentQuestionIndex + 1} / {exam.totalQuestions}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#0d1117] rounded-full h-3 border border-[#30363d] overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#7f5af0] to-[#00ff88] h-full transition-all duration-300 shadow-[0_0_10px_rgba(127,90,240,0.5)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-[0_0_40px_rgba(0,255,136,0.15)] overflow-hidden mb-6">
          {/* Terminal Header */}
          <div className="flex items-center p-4 border-b border-[#30363d] bg-[#0d1117]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <span className="font-mono text-xs text-[#8b949e] ml-4">question_{currentQuestionIndex + 1}.tsx</span>
          </div>

          <div className="p-8 bg-[#0d1117]">
            <div className="font-mono text-xs text-[#00ff88] mb-4">
              <span className="text-[#8b949e]">// Question {currentQuestionIndex + 1}</span>
            </div>
            
            {/* Formatted Question Text with Code Detection */}
            {formatQuestionText(currentQuestion.text)}

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedOption === index
                      ? 'border-[#7f5af0] bg-[#161b22] shadow-[0_0_15px_rgba(127,90,240,0.3)]'
                      : 'border-[#30363d] hover:border-[#58a6ff] hover:bg-[#161b22]'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={selectedOption === index}
                    onChange={() => handleOptionChange(index)}
                    className="w-4 h-4 text-[#7f5af0] cursor-pointer accent-[#7f5af0]"
                  />
                  <span className={`ml-3 font-medium ${selectedOption === index ? 'text-white' : 'text-[#c9d1d9]'}`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 font-mono border-[#30363d] bg-[#161b22] text-[#c9d1d9] hover:bg-[#1c2128] hover:border-[#7f5af0] disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            $ back
          </Button>

          {currentQuestionIndex < exam.totalQuestions - 1 ? (
            <Button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 font-mono bg-gradient-to-r from-[#7f5af0] to-[#00ff88] hover:opacity-90 text-white shadow-[0_4px_15px_rgba(127,90,240,0.4)]"
            >
              $ next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 font-mono bg-gradient-to-r from-[#00ff88] to-[#00d9ff] hover:opacity-90 text-[#0d1117] font-semibold shadow-[0_4px_15px_rgba(0,255,136,0.4)]"
            >
              $ submit-exam --final
            </Button>
          )}
        </div>

        {/* Question Indicator */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-[0_0_20px_rgba(0,255,136,0.1)] p-6">
          <p className="font-mono text-sm text-[#8b949e] mb-4">// Question Navigation:</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-10 h-10 rounded-lg font-mono font-semibold text-sm transition-all ${
                  q.isAnswered()
                    ? 'bg-[#00ff88] text-[#0d1117] shadow-[0_0_10px_rgba(0,255,136,0.4)]'
                    : idx === currentQuestionIndex
                      ? 'bg-[#7f5af0] text-white shadow-[0_0_10px_rgba(127,90,240,0.4)]'
                      : 'bg-[#0d1117] border border-[#30363d] text-[#8b949e] hover:border-[#7f5af0]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <p className="font-mono text-xs text-[#8b949e] mt-4 flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-[#00ff88] rounded"></span>
              Answered
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-[#0d1117] border border-[#30363d] rounded"></span>
              Pending
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
