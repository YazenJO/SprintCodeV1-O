import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, FileText, Image } from 'lucide-react';
import { Exam } from '@/models/Exam';
import { ExamService } from '@/services/ExamService';

interface UploadFormProps {
  examService: ExamService;
  onExamStart: (exam: Exam) => void;
}

export default function UploadForm({ examService, onExamStart }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File is too large. Please upload a file under 10MB.');
        setFile(null);
        setPreview('');
        return;
      }

      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Please upload an image (PNG, JPG, GIF) or PDF file.');
        setFile(null);
        setPreview('');
        return;
      }

      setFile(selectedFile);
      setError('');

      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use OOP ExamService to create exam from file
      const exam = await examService.createExamFromFile(file, 'Test Bank Exam');
      
      if (exam.totalQuestions > 0) {
        onExamStart(exam);
      } else {
        throw new Error('No questions were found in the document.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0d1117]">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#0d1117] to-[#1c2128] border border-[#30363d] rounded-lg p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00ff88] via-[#00d9ff] to-[#7f5af0]"></div>
          
          {/* Logo Badge */}
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#7f5af0] shadow-[0_0_20px_rgba(127,90,240,0.4)] mb-5 bg-gradient-to-br from-[#7f5af0] to-[#b537f2] p-[3px]">
            <img 
              src="https://bbc6eaed9f.imgdist.com/pub/bfra/4gqbadwa/4ad/c28/028/480679157_947194314189632_5166021214682579611_n.jpg" 
              alt="Logo" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <span className="font-mono text-sm text-[#58a6ff] block mb-3">&lt;test-generator&gt;</span>
          <div className="font-mono text-sm text-[#00ff88] mb-1">$ ./initialize-exam</div>
          <h1 className="font-mono text-4xl font-bold text-white mb-3 tracking-tight">
            AI Test Bank<span className="text-[#7f5af0]"> Generator</span>
          </h1>
          <div className="inline-block bg-gradient-to-r from-[#00ff88] to-[#7f5af0] text-white px-4 py-1.5 rounded text-sm font-bold font-mono mb-3 shadow-[0_0_15px_rgba(127,90,240,0.3)]">
            STATUS: ONLINE
          </div>
          <p className="font-mono text-base text-[#8b949e]">&gt; Upload.status = <span className="text-[#00ff88]">READY</span></p>
        </div>

        {/* Main Form Container */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-[0_0_40px_rgba(0,255,136,0.15)] overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center p-4 border-b border-[#30363d]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
          </div>

          <div className="p-8 bg-[#0d1117]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Terminal Status */}
              <div className="font-mono text-sm text-[#00ff88] mb-6 leading-relaxed">
                $ npm run upload-document --success<br/>
                <span className="text-[#8b949e]"># Upload your test bank for AI analysis</span><br/>
                <span className="text-[#00d9ff]">✓</span> <span className="text-[#c9d1d9]">System ready</span><br/>
                <span className="text-[#00d9ff]">✓</span> <span className="text-[#c9d1d9]">AI model loaded</span><br/>
                <span className="text-[#00d9ff]">✓</span> <span className="text-[#c9d1d9]">Awaiting file input</span>
              </div>

              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                  disabled={isLoading}
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full p-10 border-2 border-dashed border-[#30363d] rounded-lg cursor-pointer hover:border-[#7f5af0] hover:bg-[#161b22] transition-all duration-200"
                >
                  <Upload className="w-10 h-10 text-[#8b949e] mb-3" />
                  <span className="font-mono text-sm font-medium text-[#c9d1d9] mb-1">
                    {file ? file.name : '$ select-file --type=testbank'}
                  </span>
                  <span className="font-mono text-xs text-[#8b949e]">
                    // Images (PNG, JPG, GIF) or PDF (max 10MB)
                  </span>
                </label>
              </div>

              {/* Preview */}
              {preview && (
                <div className="relative border border-[#30363d] rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,136,0.1)]">
                  <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview('');
                      setError('');
                    }}
                    className="absolute top-3 right-3 bg-[#ff6b6b] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#ff5555] transition-colors shadow-lg"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-[#161b22] border border-[#30363d] border-l-4 border-l-[#00ff88] rounded p-6">
                <h3 className="font-mono text-sm font-semibold text-[#58a6ff] mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  // How to execute:
                </h3>
                <ol className="font-mono text-xs text-[#8b949e] space-y-2">
                  <li><span className="text-[#00ff88]">1.</span> Click upload area above</li>
                  <li><span className="text-[#00ff88]">2.</span> Select test bank file (image/PDF)</li>
                  <li><span className="text-[#00ff88]">3.</span> Wait for AI analysis</li>
                  <li><span className="text-[#00ff88]">4.</span> Start your exam session</li>
                </ol>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-[#161b22] border border-[#ff6b6b] border-l-4 rounded">
                  <p className="font-mono text-sm text-[#ff6b6b] font-bold mb-2">⚠ ERROR</p>
                  <pre className="font-mono text-xs text-[#ff6b6b] whitespace-pre-wrap leading-relaxed">{error}</pre>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !file}
                className="w-full bg-gradient-to-r from-[#7f5af0] to-[#00ff88] hover:opacity-90 text-white font-bold py-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-mono shadow-[0_8px_20px_rgba(127,90,240,0.4)]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    $ analyzing-document...
                  </>
                ) : (
                  <>
                    <Image className="w-5 h-5" />
                    $ git checkout exam-mode
                  </>
                )}
              </Button>
            </form>

            <p className="font-mono text-xs text-[#8b949e] text-center mt-6">
              // Secure processing • No data stored • AI-powered analysis
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 font-mono text-sm text-[#58a6ff]">
          &lt;/test-generator&gt;
        </div>
      </div>
    </div>
  );
}
