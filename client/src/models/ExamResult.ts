import { Exam } from './Exam';
import { Question } from './Question';

/**
 * ExamResult - Calculates and stores exam results
 * Demonstrates: Separation of Concerns, Calculated Properties, Data Analysis
 */
export class ExamResult {
  private _exam: Exam;
  private _score: number;
  private _percentage: number;
  private _grade: string;
  private _correctCount: number;
  private _incorrectCount: number;
  private _completionTime: number;

  constructor(exam: Exam) {
    this._exam = exam;
    this._correctCount = this.calculateCorrectCount();
    this._incorrectCount = exam.totalQuestions - this._correctCount;
    this._score = this._correctCount;
    this._percentage = (this._correctCount / exam.totalQuestions) * 100;
    this._grade = this.calculateGrade();
    this._completionTime = exam.getElapsedTime();
  }

  // Getters
  get exam(): Exam {
    return this._exam;
  }

  get score(): number {
    return this._score;
  }

  get percentage(): number {
    return this._percentage;
  }

  get grade(): string {
    return this._grade;
  }

  get correctCount(): number {
    return this._correctCount;
  }

  get incorrectCount(): number {
    return this._incorrectCount;
  }

  get completionTime(): number {
    return this._completionTime;
  }

  // Private calculation methods (Encapsulation)
  private calculateCorrectCount(): number {
    return this._exam.questions.filter((q) => q.isCorrect()).length;
  }

  private calculateGrade(): string {
    if (this._percentage >= 90) return 'A';
    if (this._percentage >= 80) return 'B';
    if (this._percentage >= 70) return 'C';
    if (this._percentage >= 60) return 'D';
    return 'F';
  }

  // Analysis methods
  getGradeColor(): string {
    switch (this._grade) {
      case 'A':
        return 'text-[#00ff88]';
      case 'B':
        return 'text-[#00d9ff]';
      case 'C':
        return 'text-[#ffbd2e]';
      case 'D':
        return 'text-[#ff9f43]';
      default:
        return 'text-[#ff6b6b]';
    }
  }

  getGradeBorder(): string {
    switch (this._grade) {
      case 'A':
        return 'border-[#00ff88]';
      case 'B':
        return 'border-[#00d9ff]';
      case 'C':
        return 'border-[#ffbd2e]';
      case 'D':
        return 'border-[#ff9f43]';
      default:
        return 'border-[#ff6b6b]';
    }
  }

  isPassing(passingScore: number = 60): boolean {
    return this._percentage >= passingScore;
  }

  getIncorrectQuestions(): Question[] {
    return this._exam.questions.filter((q) => !q.isCorrect());
  }

  getCorrectQuestions(): Question[] {
    return this._exam.questions.filter((q) => q.isCorrect());
  }

  // Report generation
  generateReport(): string {
    return `
Exam Results Report
===================
Title: ${this._exam.title}
Score: ${this._score}/${this._exam.totalQuestions}
Percentage: ${this._percentage.toFixed(1)}%
Grade: ${this._grade}
Completion Time: ${Math.floor(this._completionTime / 60)}m ${this._completionTime % 60}s
Status: ${this.isPassing() ? 'PASSED' : 'FAILED'}
    `.trim();
  }

  toJSON() {
    return {
      score: this._score,
      percentage: this._percentage,
      grade: this._grade,
      correctCount: this._correctCount,
      incorrectCount: this._incorrectCount,
      completionTime: this._completionTime,
      isPassing: this.isPassing(),
    };
  }
}
