import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Exam } from '@/models/Exam';
import { ExamResult } from '@/models/ExamResult';

interface ResultsProps {
  exam: Exam;
  onRestart: () => void;
}

export default function Results({ exam, onRestart }: ResultsProps) {
  // Use OOP ExamResult class for all calculations
  const result = new ExamResult(exam);
  
  const percentage = result.percentage.toFixed(1);
  const grade = result.grade;
  const correctCount = result.correctCount;
  const questions = exam.questions;

  // Get grade colors from ExamResult class
  const gradeColor = result.getGradeColor();
  const gradeBorder = result.getGradeBorder();
  const gradeBg = 'bg-[#161b22]';

  // Helper function to format code in question text
  const formatQuestionText = (text: string) => {
    // Check if question contains ACTUAL code (not just asking about code/programs)
    const codePatterns = [
      /(?:code:|output of|following code|this code)/i,  // Code prefix (with or without colon)
      /;\s*\w+\s*=/,  // Variable assignments with semicolons
      /\w+\s*=\s*\d+;\s*\w+/,  // Multiple statements
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
        <div className="mb-4">
          {lines.map((line, idx) => (
            <p key={idx} className="text-[#c9d1d9] font-medium leading-relaxed">
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      );
    }

    // Extract code if pattern matches
    const codeMatch = text.match(/(?:code:|output of:?|following code:?|this code:?)\s*([\s\S]+?)(?:\?|$)/i);
    
    if (codeMatch) {
      const beforeCode = text.substring(0, codeMatch.index);
      let codeText = codeMatch[1].trim();
      const afterCode = text.substring((codeMatch.index || 0) + codeMatch[0].length);

      // Format code with proper line breaks
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
          return (
            <div key={lineIdx} className="leading-relaxed">
              <span style={{ color: '#a9b1d6' }}>{line || '\u00A0'}</span>
            </div>
          );
        });
      };

      const codeLines = renderCodeWithHighlighting(codeText);

      return (
        <div className="mb-4">
          {beforeCode && (
            <>
              <p className="text-[#c9d1d9] mb-2 font-medium">{beforeCode.trim()}</p>
              <div className="h-3"></div>
            </>
          )}
          
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden mb-3">
            <div className="flex items-center px-3 py-2 bg-[#161b22] border-b border-[#30363d]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2 h-2 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2 h-2 rounded-full bg-[#27c93f]"></div>
              </div>
              <span className="font-mono text-xs text-[#8b949e] ml-2">code.txt</span>
            </div>
            <div className="p-3 overflow-x-auto">
              <div className="font-mono text-xs">
                {codeLines}
              </div>
            </div>
          </div>

          {afterCode && <p className="text-[#c9d1d9] font-medium">{afterCode}</p>}
        </div>
      );
    }

    return (
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 overflow-x-auto mb-4">
        <pre className="font-mono text-xs text-[#a9b1d6] leading-relaxed whitespace-pre-wrap">
          {text}
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d1117] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Score Summary */}
        <div className={`${gradeBg} border-2 ${gradeBorder} rounded-lg shadow-[0_0_40px_rgba(0,255,136,0.2)] p-8 mb-8 text-center relative overflow-hidden`}>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00ff88] via-[#00d9ff] to-[#7f5af0]"></div>
          
          <div className="font-mono text-xs text-[#8b949e] mb-2">// Exam Results</div>
          <h1 className="font-mono text-3xl font-bold text-white mb-6">$ calculate-score --output</h1>

          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="relative">
              <div className={`text-7xl font-bold font-mono ${gradeColor} drop-shadow-[0_0_20px_rgba(127,90,240,0.5)]`}>{grade}</div>
              <p className="font-mono text-sm text-[#8b949e] mt-3">// Grade</p>
            </div>

            <div className="border-l-2 border-[#30363d] pl-8">
              <div className={`text-6xl font-bold font-mono ${gradeColor} drop-shadow-[0_0_20px_rgba(0,255,136,0.5)]`}>{percentage}<span className="text-3xl">%</span></div>
              <p className="font-mono text-sm text-[#8b949e] mt-3">// Score</p>
            </div>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 inline-block">
            <p className="font-mono text-base text-[#c9d1d9]">
              <span className="text-[#00ff88]">correct</span>: {correctCount} / <span className="text-[#00d9ff]">total</span>: {exam.totalQuestions}
            </p>
          </div>
        </div>

        {/* Answer Review */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-[0_0_20px_rgba(0,255,136,0.1)] overflow-hidden mb-6">
          {/* Terminal Header */}
          <div className="flex items-center p-4 border-b border-[#30363d] bg-[#0d1117]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <span className="font-mono text-xs text-[#8b949e] ml-4">answer_review.log</span>
          </div>

          <div className="p-8 bg-[#0d1117]">
            <h2 className="font-mono text-2xl font-bold text-white mb-6">
              <span className="text-[#00ff88]">$</span> review-answers()
            </h2>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const isCorrect = q.isCorrect();

                return (
                  <div
                    key={q.id}
                    className={`p-6 rounded-lg border-2 ${
                      isCorrect
                        ? 'border-[#00ff88] bg-[#161b22] shadow-[0_0_15px_rgba(0,255,136,0.2)]'
                        : 'border-[#ff6b6b] bg-[#161b22] shadow-[0_0_15px_rgba(255,107,107,0.2)]'
                    }`}
                  >
                    {/* Question Number and Status */}
                    <div className="flex items-start gap-3 mb-4">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-[#ff6b6b] flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-mono font-semibold text-[#c9d1d9]">
                          <span className="text-[#8b949e]">//</span> Question {idx + 1}
                          <span className={`ml-3 text-sm font-normal ${isCorrect ? 'text-[#00ff88]' : 'text-[#ff6b6b]'}`}>
                            {isCorrect ? '✓ PASS' : '✗ FAIL'}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Question Text */}
                    {formatQuestionText(q.text)}

                    {/* User's Answer */}
                    <div className="mb-3 bg-[#0d1117] border border-[#30363d] rounded p-3">
                      <p className="font-mono text-xs text-[#8b949e] mb-2">your_answer:</p>
                      <p className={`font-mono text-sm ${isCorrect ? 'text-[#00ff88]' : 'text-[#ff6b6b]'}`}>
                        {q.isAnswered() ? `"${q.getUserAnswerText()}"` : 'null'}
                      </p>
                    </div>

                    {/* Correct Answer (if wrong) */}
                    {!isCorrect && (
                      <div className="bg-[#0d1117] border border-[#30363d] border-l-4 border-l-[#00ff88] rounded p-3">
                        <p className="font-mono text-xs text-[#8b949e] mb-2">correct_answer:</p>
                        <p className="font-mono text-sm text-[#00ff88]">"{q.getCorrectAnswer()}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onRestart}
            className="bg-gradient-to-r from-[#7f5af0] to-[#00ff88] hover:opacity-90 text-white font-bold font-mono px-8 py-4 flex items-center gap-2 shadow-[0_8px_20px_rgba(127,90,240,0.4)]"
          >
            <RotateCcw className="w-5 h-5" />
            $ restart --new-session
          </Button>
        </div>

        <div className="text-center mt-6 font-mono text-sm text-[#58a6ff]">
          &lt;/exam-results&gt;
        </div>
      </div>
    </div>
  );
}
