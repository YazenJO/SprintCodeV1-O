# OOP vs Functional: Architecture Comparison

## Current Implementation (Functional)

### geminiClient.ts (Functional)
```typescript
// Standalone functions
const fileToBase64 = (file: File): Promise<...> => { }
export const analyzeLocalFileWithGemini = async (file: File) => { }
```

### UploadForm.tsx (Functional Component)
```typescript
export default function UploadForm({ onExamStart }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  // ... hooks
}
```

---

## Alternative OOP Implementation

### GeminiClient.ts (OOP Version)
```typescript
export class GeminiClient {
  private apiKey: string;
  private model: any;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    const genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  private fileToBase64(file: File): Promise<{ data: string; mimeType: string }> {
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
  }

  public async analyzeDocument(file: File): Promise<GeminiResponse> {
    const { data: fileData, mimeType } = await this.fileToBase64(file);
    
    const prompt = `...`; // Same prompt
    
    const imagePart = {
      inlineData: { data: fileData, mimeType },
    };

    const result = await this.model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    const cleanedJson = text.replace(/```json\n/g, '').replace(/\n```/g, '').trim();
    
    return JSON.parse(cleanedJson);
  }
}

// Usage:
const client = new GeminiClient(apiKey);
const result = await client.analyzeDocument(file);
```

### UploadForm.tsx (OOP Component - Class-based React)
```typescript
interface UploadFormProps {
  onExamStart: (questions: Question[]) => void;
}

interface UploadFormState {
  file: File | null;
  isLoading: boolean;
  error: string;
  preview: string;
}

export default class UploadForm extends React.Component<UploadFormProps, UploadFormState> {
  private geminiClient: GeminiClient;

  constructor(props: UploadFormProps) {
    super(props);
    this.state = {
      file: null,
      isLoading: false,
      error: '',
      preview: '',
    };
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.geminiClient = new GeminiClient(apiKey);
  }

  handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validation...
      this.setState({ file: selectedFile, error: '' });
      
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.setState({ preview: reader.result as string });
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { file } = this.state;
    
    if (!file) {
      this.setState({ error: 'Please select a file.' });
      return;
    }

    this.setState({ isLoading: true, error: '' });

    try {
      const result = await this.geminiClient.analyzeDocument(file);
      if (result && result.questions && result.questions.length > 0) {
        this.props.onExamStart(result.questions);
      } else {
        throw new Error('No questions found.');
      }
    } catch (err) {
      this.setState({ 
        error: err instanceof Error ? err.message : 'Unknown error' 
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { file, isLoading, error, preview } = this.state;
    
    return (
      <div className="...">
        {/* Same JSX as functional version */}
      </div>
    );
  }
}
```

---

## Comparison Table

| Feature | Functional (Current) | OOP (Alternative) |
|---------|---------------------|-------------------|
| **Code Lines** | ~130 lines | ~180 lines |
| **Learning Curve** | Easy | Medium |
| **React Modern Practice** | ✅ Recommended | ❌ Legacy |
| **State Management** | `useState` hook | `this.state` |
| **Lifecycle** | `useEffect` | `componentDidMount`, etc. |
| **`this` Binding** | Not needed | Required |
| **Reusability** | Tree-shakable functions | Class instances |
| **Performance** | Slightly better | Slightly worse |
| **Hackathon Speed** | ⚡ Faster | 🐌 Slower |

---

## Recommendation

**Keep Functional for Hackathon** because:
1. ✅ 30% less code to write
2. ✅ Industry standard for React (2025)
3. ✅ Judges will recognize modern practices
4. ✅ Easier to debug in 4 hours
5. ✅ Better TypeScript integration

**Use OOP if:**
- You need complex state machines
- Multiple instances of similar objects
- Building a large enterprise app
- Team prefers class-based patterns

---

## Hybrid Approach (Best of Both)

You could add OOP for the **AI service layer** only:

```typescript
// services/ExamService.ts
export class ExamService {
  private geminiClient: GeminiClient;
  
  constructor() {
    this.geminiClient = new GeminiClient(import.meta.env.VITE_GEMINI_API_KEY);
  }
  
  async processTestBank(file: File): Promise<Question[]> {
    const result = await this.geminiClient.analyzeDocument(file);
    return result.questions;
  }
  
  async generateExamFromTopic(topic: string, count: number): Promise<Question[]> {
    // Future bonus feature
  }
}
```

Then use it in functional components:
```typescript
const examService = new ExamService(); // Singleton
const questions = await examService.processTestBank(file);
```

This gives you:
- OOP for business logic (testable, organized)
- Functional for UI (modern, fast)
- Best of both worlds! 🌟
