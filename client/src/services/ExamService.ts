import { Exam } from '@/models/Exam';
import { Question } from '@/models/Question';
import { ExamResult } from '@/models/ExamResult';
import { AIService } from './AIService';

/**
 * Exam Service - Business logic orchestrator
 * Demonstrates: Service Pattern, Dependency Injection, Separation of Concerns
 */
export class ExamService {
  private aiService: AIService;
  private currentExam: Exam | null = null;

  /**
   * Constructor with Dependency Injection
   * @param aiService - Any implementation of AIService (polymorphism)
   */
  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  /**
   * Creates an exam from an uploaded file
   */
  async createExamFromFile(file: File, title: string = 'AI Generated Exam'): Promise<Exam> {
    const questions = await this.aiService.analyzeDocument(file);
    
    if (questions.length === 0) {
      throw new Error('No questions found in the document');
    }

    this.currentExam = new Exam(title, questions);
    this.currentExam.start(); // Auto-start the exam
    
    return this.currentExam;
  }

  /**
   * Creates an exam from a topic using AI generation
   */
  async createExamFromTopic(
    topic: string,
    questionCount: number,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    title?: string
  ): Promise<Exam> {
    const questions = await this.aiService.generateQuestions(topic, questionCount, difficulty);
    
    if (questions.length === 0) {
      throw new Error('Failed to generate questions');
    }

    this.currentExam = new Exam(
      title || `${topic} - Exam`,
      questions
    );
    this.currentExam.start();
    
    return this.currentExam;
  }

  /**
   * Gets the current exam in progress
   */
  getCurrentExam(): Exam | null {
    return this.currentExam;
  }

  /**
   * Starts the exam timer
   */
  startExam(): void {
    if (!this.currentExam) {
      throw new Error('No exam loaded');
    }
    this.currentExam.start();
  }

  /**
   * Submits an answer for a question
   */
  submitAnswer(questionId: number, answerIndex: number): void {
    if (!this.currentExam) {
      throw new Error('No exam in progress');
    }
    this.currentExam.answerQuestion(questionId, answerIndex);
  }

  /**
   * Completes the exam and returns results
   */
  completeExam(): ExamResult {
    if (!this.currentExam) {
      throw new Error('No exam to complete');
    }

    if (!this.currentExam.canSubmit()) {
      throw new Error('Not all questions have been answered');
    }

    this.currentExam.end();
    const result = new ExamResult(this.currentExam);
    
    return result;
  }

  /**
   * Gets exam progress information
   */
  getProgress(): { answered: number; total: number; percentage: number } {
    if (!this.currentExam) {
      return { answered: 0, total: 0, percentage: 0 };
    }

    return {
      answered: this.currentExam.getAnsweredCount(),
      total: this.currentExam.totalQuestions,
      percentage: this.currentExam.getProgressPercentage(),
    };
  }

  /**
   * Resets the current exam
   */
  resetExam(): void {
    this.currentExam = null;
  }

  /**
   * Saves exam to localStorage
   */
  saveExam(exam: Exam): void {
    try {
      localStorage.setItem('currentExam', JSON.stringify(exam.toJSON()));
    } catch (error) {
      console.error('Failed to save exam:', error);
    }
  }

  /**
   * Loads exam from localStorage
   */
  loadExam(): Exam | null {
    try {
      const data = localStorage.getItem('currentExam');
      if (!data) return null;

      const parsed = JSON.parse(data);
      return Exam.fromJSON(parsed);
    } catch (error) {
      console.error('Failed to load exam:', error);
      return null;
    }
  }

  /**
   * Clears saved exam from localStorage
   */
  clearSavedExam(): void {
    localStorage.removeItem('currentExam');
  }
}
