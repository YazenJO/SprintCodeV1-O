# 🎯 OOP Architecture Documentation

## Overview

This project has been structured using **Object-Oriented Programming (OOP)** principles to demonstrate key concepts:
- **Encapsulation** - Data hiding with private fields and controlled access
- **Inheritance** - Base classes extended by specialized implementations
- **Polymorphism** - Swappable implementations through abstract interfaces
- **Abstraction** - Hiding complex implementation details
- **Composition** - Objects containing other objects (HAS-A relationship)

---

## 📁 Project Structure

```
client/src/
├── models/               # Domain models (business entities)
│   ├── Question.ts      # Represents a single exam question
│   ├── Exam.ts          # Manages collection of questions
│   └── ExamResult.ts    # Calculates and stores exam results
│
├── services/            # Business logic layer
│   ├── AIService.ts     # Abstract AI service + Gemini implementation
│   └── ExamService.ts   # Orchestrates exam workflow
│
└── components/          # React UI components
    ├── App.tsx          # Main application
    ├── UploadForm.tsx   # File upload interface
    ├── Exam.tsx         # Interactive exam interface
    └── Results.tsx      # Score display and review
```

---

## 🧩 Models Layer

### 1️⃣ Question.ts - Single Responsibility

**Purpose**: Represents one exam question with validation and behavior.

**Key OOP Concepts**:
```typescript
class Question {
  // ✅ ENCAPSULATION - Private fields (data hiding)
  private _id: number;
  private _text: string;
  private _options: string[];
  private _correctIndex: number;
  private _userAnswer: number | null = null;
  private _difficulty: 'easy' | 'medium' | 'hard';

  // ✅ CONTROLLED ACCESS - Getters return copies to prevent mutation
  get options(): string[] {
    return [...this._options]; // Returns copy, not original
  }

  // ✅ VALIDATION - Setter validates input before storing
  setUserAnswer(answerIndex: number): void {
    if (answerIndex < 0 || answerIndex >= this._options.length) {
      throw new Error('Invalid answer index');
    }
    this._userAnswer = answerIndex;
  }

  // ✅ BEHAVIOR - Methods operate on internal data
  isCorrect(): boolean {
    return this._userAnswer === this._correctIndex;
  }

  isAnswered(): boolean {
    return this._userAnswer !== null;
  }

  // ✅ FACTORY PATTERN - Static method creates instances from JSON
  static fromJSON(data: any): Question {
    const q = new Question(/* ... */);
    if (data.userAnswer !== undefined) {
      q.setUserAnswer(data.userAnswer);
    }
    return q;
  }
}
```

**Why This Matters**:
- Direct field access (`q.correctIndex`) would break encapsulation
- Getters ensure data integrity (can't accidentally modify internal state)
- Methods like `isCorrect()` encapsulate business logic
- Validation in setters prevents invalid states

---

### 2️⃣ Exam.ts - Composition Pattern

**Purpose**: Manages a collection of questions with state tracking.

**Key OOP Concepts**:
```typescript
class Exam {
  // ✅ COMPOSITION - Exam HAS questions (aggregation)
  private _questions: Question[] = [];
  private _startTime: Date | null = null;
  private _endTime: Date | null = null;
  private _timeLimit: number; // in minutes

  // ✅ DELEGATION - Delegates work to Question objects
  answerQuestion(questionId: number, optionIndex: number): void {
    const question = this._questions.find(q => q.id === questionId);
    if (!question) throw new Error('Question not found');
    
    question.setUserAnswer(optionIndex); // Delegates to Question
  }

  // ✅ CALCULATED PROPERTIES - Computed from internal state
  get totalQuestions(): number {
    return this._questions.length;
  }

  getAnsweredCount(): number {
    return this._questions.filter(q => q.isAnswered()).length;
  }

  getProgressPercentage(): number {
    return (this.getAnsweredCount() / this.totalQuestions) * 100;
  }

  // ✅ STATE MANAGEMENT
  canSubmit(): boolean {
    return this.getAnsweredCount() === this.totalQuestions;
  }

  getRemainingTime(): number {
    if (!this._startTime || !this._timeLimit) return 0;
    const elapsed = this.getElapsedTime();
    return Math.max(0, this._timeLimit * 60 - elapsed);
  }
}
```

**Why This Matters**:
- **Composition over Inheritance**: Exam HAS questions (not IS-A question)
- **Single Source of Truth**: Progress calculated from actual question states
- **Encapsulated Complexity**: UI doesn't need to know how time tracking works
- **Delegation**: Each question manages its own answer state

---

### 3️⃣ ExamResult.ts - Separation of Concerns

**Purpose**: Calculates grades and provides analysis (doesn't modify Exam).

**Key OOP Concepts**:
```typescript
class ExamResult {
  readonly score: number;
  readonly percentage: number;
  readonly grade: string;
  readonly correctCount: number;
  readonly incorrectCount: number;
  private readonly exam: Exam;

  constructor(exam: Exam) {
    this.exam = exam;
    
    // ✅ CALCULATED IN CONSTRUCTOR - Immutable after creation
    this.correctCount = this.calculateCorrectCount();
    this.incorrectCount = exam.totalQuestions - this.correctCount;
    this.percentage = (this.correctCount / exam.totalQuestions) * 100;
    this.grade = this.calculateGrade();
    this.score = this.percentage;
  }

  // ✅ PRIVATE HELPER METHODS - Implementation details hidden
  private calculateCorrectCount(): number {
    return this.exam.questions.filter(q => q.isCorrect()).length;
  }

  private calculateGrade(): string {
    if (this.percentage >= 90) return 'A';
    if (this.percentage >= 80) return 'B';
    if (this.percentage >= 70) return 'C';
    if (this.percentage >= 60) return 'D';
    return 'F';
  }

  // ✅ UI HELPERS - Business logic separate from presentation
  getGradeColor(): string {
    const colors = {
      'A': 'text-[#00ff88]',
      'B': 'text-[#00d9ff]',
      'C': 'text-[#ffbd2e]',
      'D': 'text-[#ff9f43]',
      'F': 'text-[#ff6b6b]'
    };
    return colors[this.grade as keyof typeof colors];
  }

  // ✅ ANALYSIS METHODS
  getIncorrectQuestions(): Question[] {
    return this.exam.questions.filter(q => !q.isCorrect());
  }

  isPassing(): boolean {
    return this.percentage >= 60;
  }

  generateReport(): string {
    return `
Exam Report
-----------
Score: ${this.percentage.toFixed(1)}%
Grade: ${this.grade}
Correct: ${this.correctCount}/${this.exam.totalQuestions}
Status: ${this.isPassing() ? 'PASS' : 'FAIL'}
    `.trim();
  }
}
```

**Why This Matters**:
- **Immutable**: Once created, results can't change (data integrity)
- **Single Responsibility**: Only calculates results, doesn't modify exam
- **Separation**: UI logic (`getGradeColor()`) separated from business logic
- **Readonly Fields**: Prevents accidental modification

---

## 🔧 Services Layer

### 4️⃣ AIService.ts - Inheritance & Polymorphism

**Purpose**: Abstract AI integration allowing multiple implementations.

**Key OOP Concepts**:
```typescript
// ✅ ABSTRACT BASE CLASS - Defines contract
abstract class AIService {
  protected apiKey: string; // Protected: accessible to subclasses

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // ✅ ABSTRACT METHODS - Subclasses MUST implement
  abstract analyzeDocument(file: File): Promise<Question[]>;
  abstract generateQuestions(
    topic: string,
    count: number,
    difficulty: 'easy' | 'medium' | 'hard'
  ): Promise<Question[]>;
}

// ✅ INHERITANCE - GeminiAIService IS-A AIService
class GeminiAIService extends AIService {
  private model: any; // Gemini SDK model

  constructor(apiKey: string) {
    super(apiKey); // Call parent constructor
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // ✅ POLYMORPHISM - Implements abstract method
  async analyzeDocument(file: File): Promise<Question[]> {
    const base64 = await this.fileToBase64(file);
    const prompt = this.buildAnalysisPrompt();
    
    const result = await this.model.generateContent([
      { inlineData: { data: base64, mimeType: this.getMimeType(file) } },
      { text: prompt }
    ]);

    return this.parseQuestionsFromResponse(result.response.text());
  }

  // ✅ ENCAPSULATION - Private helper methods
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data:*/*;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private getMimeType(file: File): string {
    // Fallback logic for MIME type detection
    if (file.type) return file.type;
    const ext = file.name.split('.').pop()?.toLowerCase();
    // ... mapping logic
  }

  private parseQuestionsFromResponse(text: string): Question[] {
    // Complex parsing logic hidden from caller
    let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(jsonText);
    
    // ✅ Returns OOP objects, not plain data
    return parsed.questions.map((q: any, index: number) => 
      new Question(index + 1, q.text, q.options, q.correctIndex, q.difficulty)
    );
  }
}
```

**Why This Matters**:
- **Future-Proof**: Can add `OpenAIService`, `AnthropicService` without changing other code
- **Interface Segregation**: Abstract methods define what's required
- **Encapsulation**: Complex file handling hidden in private methods
- **Type Safety**: Returns Question objects, not raw JSON

---

### 5️⃣ ExamService.ts - Dependency Injection

**Purpose**: Orchestrates exam workflow with injected dependencies.

**Key OOP Concepts**:
```typescript
class ExamService {
  private currentExam: Exam | null = null;
  private aiService: AIService; // ✅ DEPENDENCY INJECTION

  // ✅ CONSTRUCTOR INJECTION - Accepts any AIService implementation
  constructor(aiService: AIService) {
    this.aiService = aiService; // Polymorphism: works with any AIService subclass
  }

  // ✅ HIGH-LEVEL WORKFLOW METHODS
  async createExamFromFile(
    file: File,
    title: string,
    timeLimit?: number
  ): Promise<Exam> {
    // Delegates AI work to injected service
    const questions = await this.aiService.analyzeDocument(file);
    
    const exam = new Exam(title, questions, timeLimit);
    this.currentExam = exam;
    this.saveExam(exam);
    return exam;
  }

  async createExamFromTopic(
    topic: string,
    questionCount: number,
    difficulty: 'easy' | 'medium' | 'hard',
    title: string,
    timeLimit?: number
  ): Promise<Exam> {
    const questions = await this.aiService.generateQuestions(
      topic,
      questionCount,
      difficulty
    );
    
    const exam = new Exam(title, questions, timeLimit);
    this.currentExam = exam;
    this.saveExam(exam);
    return exam;
  }

  // ✅ STATE MANAGEMENT
  submitAnswer(questionId: number, answerIndex: number): void {
    if (!this.currentExam) {
      throw new Error('No active exam');
    }
    this.currentExam.answerQuestion(questionId, answerIndex);
    this.saveExam(this.currentExam);
  }

  completeExam(): ExamResult | null {
    if (!this.currentExam) return null;
    
    // ✅ Creates result object without modifying exam
    const result = new ExamResult(this.currentExam);
    this.clearSavedExam();
    this.currentExam = null;
    return result;
  }

  // ✅ PERSISTENCE METHODS
  private saveExam(exam: Exam): void {
    localStorage.setItem('current_exam', JSON.stringify(exam.toJSON()));
  }

  loadExam(): Exam | null {
    const data = localStorage.getItem('current_exam');
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    this.currentExam = Exam.fromJSON(parsed);
    return this.currentExam;
  }

  clearSavedExam(): void {
    localStorage.removeItem('current_exam');
  }

  // ✅ PROGRESS TRACKING
  getProgress(): { answered: number; total: number; percentage: number } | null {
    if (!this.currentExam) return null;
    
    return {
      answered: this.currentExam.getAnsweredCount(),
      total: this.currentExam.totalQuestions,
      percentage: this.currentExam.getProgressPercentage()
    };
  }
}
```

**Why This Matters**:
- **Dependency Injection**: ExamService doesn't create AIService, receives it
- **Testability**: Can inject mock AIService for testing
- **Flexibility**: Swap Gemini for OpenAI without changing ExamService
- **Separation of Concerns**: Orchestrates workflow, delegates specifics

---

## 🔄 How Components Use OOP Models

### App.tsx - Service Initialization

```typescript
function App() {
  const [apiKey, setApiKey] = useState('...');
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);

  // ✅ DEPENDENCY INJECTION - Create service with AI implementation
  const examService = useMemo(
    () => new ExamService(new GeminiAIService(apiKey)),
    [apiKey]
  );

  const handleExamStart = (exam: Exam) => {
    setCurrentExam(exam);
  };

  const handleExamSubmit = () => {
    if (currentExam) {
      const result = examService.completeExam();
      // ... handle result
    }
  };

  return (
    <UploadForm examService={examService} onExamStart={handleExamStart} />
    <Exam exam={currentExam} onSubmit={handleExamSubmit} />
    <Results exam={currentExam} onRestart={handleRestart} />
  );
}
```

### UploadForm.tsx - Service Usage

```typescript
interface UploadFormProps {
  examService: ExamService; // Receives service via props
  onExamStart: (exam: Exam) => void;
}

function UploadForm({ examService, onExamStart }: UploadFormProps) {
  const handleSubmit = async () => {
    // ✅ Uses service method instead of direct API call
    const exam = await examService.createExamFromFile(file, 'Test Bank Exam');
    onExamStart(exam); // Returns OOP object
  };
}
```

### Exam.tsx - Model Interaction

```typescript
interface ExamProps {
  exam: Exam; // Receives OOP model
  onSubmit: () => void;
}

function Exam({ exam, onSubmit }: ExamProps) {
  const questions = exam.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionChange = (optionIndex: number) => {
    // ✅ Calls OOP method (encapsulation)
    exam.answerQuestion(currentQuestion.id, optionIndex);
  };

  const handleSubmit = () => {
    // ✅ Uses OOP method instead of manual counting
    if (exam.getAnsweredCount() !== exam.totalQuestions) {
      alert('Please answer all questions');
      return;
    }
    onSubmit();
  };

  // ✅ Uses OOP methods for display
  const progress = exam.getProgressPercentage();
  const answeredCount = exam.getAnsweredCount();
}
```

### Results.tsx - Result Calculation

```typescript
interface ResultsProps {
  exam: Exam;
  onRestart: () => void;
}

function Results({ exam, onRestart }: ResultsProps) {
  // ✅ Create result object for calculations
  const result = new ExamResult(exam);

  return (
    <div>
      <h1>Grade: {result.grade}</h1>
      <p>Score: {result.percentage.toFixed(1)}%</p>
      <p>Correct: {result.correctCount} / {exam.totalQuestions}</p>
      
      {exam.questions.map(q => (
        <div>
          <p>{q.text}</p>
          <p>Your answer: {q.getUserAnswerText()}</p>
          {!q.isCorrect() && <p>Correct: {q.getCorrectAnswer()}</p>}
        </div>
      ))}
    </div>
  );
}
```

---

## 🎓 Learning Objectives

By studying and working with this architecture, you will learn:

### 1. **Encapsulation**
- Private fields prevent direct access
- Getters/setters control how data is accessed/modified
- Validation ensures data integrity
- Example: `Question._correctIndex` is private, accessed via `isCorrect()`

### 2. **Inheritance**
- `GeminiAIService extends AIService`
- Subclass inherits `apiKey` from parent
- `super()` calls parent constructor
- Example: Can create `OpenAIService extends AIService` easily

### 3. **Polymorphism**
- `ExamService` accepts any `AIService` implementation
- Works with `GeminiAIService`, `OpenAIService`, etc.
- Enables strategy pattern (swap implementations)
- Example: `new ExamService(new GeminiAIService(key))`

### 4. **Abstraction**
- Complex logic hidden behind simple interfaces
- `exam.answerQuestion()` hides validation and state updates
- `aiService.analyzeDocument()` hides API calls and parsing
- Users don't need to know implementation details

### 5. **Composition**
- Exam HAS Questions (aggregation)
- ExamResult HAS reference to Exam
- Prefer composition over inheritance
- Example: `Exam` delegates to `Question.setUserAnswer()`

### 6. **Design Patterns**
- **Factory Pattern**: `Question.fromJSON()`, `Exam.fromJSON()`
- **Dependency Injection**: `ExamService(aiService: AIService)`
- **Service Pattern**: Separate business logic from UI
- **Strategy Pattern**: Swappable AI implementations

---

## 🔍 Compare: OOP vs Functional

### ❌ Functional Approach (Old)
```typescript
// Data is separate from behavior
interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

// State scattered across components
const [questions, setQuestions] = useState<Question[]>([]);
const [answers, setAnswers] = useState<Record<number, number>>({});

// Functions operate on external data
function isCorrect(question: Question, answer: number): boolean {
  return question.correctIndex === answer;
}

// Direct API calls in components
const questions = await analyzeDocument(file);
```

### ✅ OOP Approach (New)
```typescript
// Data and behavior together
class Question {
  private _correctIndex: number;
  private _userAnswer: number | null;

  isCorrect(): boolean {
    return this._userAnswer === this._correctIndex;
  }
}

// Encapsulated state
const [currentExam, setCurrentExam] = useState<Exam | null>(null);

// Methods operate on internal data
const isCorrect = question.isCorrect();

// Service layer handles API calls
const exam = await examService.createExamFromFile(file);
```

---

## 🚀 Next Steps

1. **Explore the code**: Read through each model/service file
2. **Understand relationships**: See how classes interact
3. **Modify carefully**: Add features while maintaining OOP principles
4. **Ask questions**: "Why is this field private?" "Why use a service?"
5. **Experiment**: Try creating a new AIService implementation

---

## 📚 Resources

- **Encapsulation**: Private fields, getters/setters
- **Inheritance**: `extends`, `super()`, abstract classes
- **Polymorphism**: Abstract methods, interface implementation
- **Composition**: HAS-A relationships, delegation
- **SOLID Principles**: Single Responsibility, Dependency Inversion

---

**Questions?** Look for `// ✅` comments throughout the code explaining OOP concepts!
