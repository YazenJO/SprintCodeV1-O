import { Question } from './Question';

/**
 * Exam Model - Manages collection of questions
 * Demonstrates: Composition, Aggregation, State Management
 */
export class Exam {
  private _questions: Question[];
  private _title: string;
  private _timeLimit?: number; // in minutes
  private _startTime?: Date;
  private _endTime?: Date;

  constructor(title: string, questions: Question[], timeLimit?: number) {
    this._title = title;
    this._questions = questions;
    this._timeLimit = timeLimit;
  }

  // Getters
  get questions(): Question[] {
    return [...this._questions]; // Return copy to prevent external modification
  }

  get title(): string {
    return this._title;
  }

  get totalQuestions(): number {
    return this._questions.length;
  }

  get timeLimit(): number | undefined {
    return this._timeLimit;
  }

  get startTime(): Date | undefined {
    return this._startTime;
  }

  get endTime(): Date | undefined {
    return this._endTime;
  }

  // Start/End exam
  start(): void {
    this._startTime = new Date();
  }

  end(): void {
    this._endTime = new Date();
  }

  isStarted(): boolean {
    return this._startTime !== undefined;
  }

  isEnded(): boolean {
    return this._endTime !== undefined;
  }

  // Answer management (delegates to Question objects)
  answerQuestion(questionId: number, answerIndex: number): void {
    const question = this._questions.find((q) => q.id === questionId);
    if (!question) {
      throw new Error(`Question with id ${questionId} not found`);
    }
    question.setUserAnswer(answerIndex);
  }

  getQuestion(questionId: number): Question | undefined {
    return this._questions.find((q) => q.id === questionId);
  }

  // Progress tracking
  getAnsweredCount(): number {
    return this._questions.filter((q) => q.isAnswered()).length;
  }

  getProgressPercentage(): number {
    return (this.getAnsweredCount() / this.totalQuestions) * 100;
  }

  // Time tracking
  getElapsedTime(): number {
    if (!this._startTime) return 0;
    const endTime = this._endTime || new Date();
    return Math.floor((endTime.getTime() - this._startTime.getTime()) / 1000);
  }

  getRemainingTime(): number {
    if (!this._timeLimit || !this._startTime) return Infinity;
    const elapsedMinutes = this.getElapsedTime() / 60;
    return Math.max(0, this._timeLimit - elapsedMinutes);
  }

  // Validation
  canSubmit(): boolean {
    return this.getAnsweredCount() === this.totalQuestions;
  }

  // Serialization
  toJSON() {
    return {
      title: this._title,
      questions: this._questions.map((q) => q.toJSON()),
      timeLimit: this._timeLimit,
      startTime: this._startTime?.toISOString(),
      endTime: this._endTime?.toISOString(),
    };
  }

  // Factory method
  static fromJSON(data: any): Exam {
    const questions = data.questions.map((q: any) => Question.fromJSON(q));
    const exam = new Exam(data.title, questions, data.timeLimit);
    if (data.startTime) {
      exam._startTime = new Date(data.startTime);
    }
    if (data.endTime) {
      exam._endTime = new Date(data.endTime);
    }
    return exam;
  }
}
