/**
 * Question Model - Represents a single exam question
 * Demonstrates: Encapsulation, Data Modeling, Single Responsibility Principle
 */
export class Question {
  private _id: number;
  private _text: string;
  private _options: string[];
  private _correctIndex: number;
  private _userAnswer?: number;
  private _difficulty?: 'easy' | 'medium' | 'hard';

  constructor(
    id: number,
    text: string,
    options: string[],
    correctIndex: number,
    difficulty?: 'easy' | 'medium' | 'hard'
  ) {
    this._id = id;
    this._text = text;
    this._options = options;
    this._correctIndex = correctIndex;
    this._difficulty = difficulty;
  }

  // Getters (Encapsulation - controlled access to private fields)
  get id(): number {
    return this._id;
  }

  get text(): string {
    return this._text;
  }

  get options(): string[] {
    return [...this._options]; // Return copy to prevent mutation
  }

  get correctIndex(): number {
    return this._correctIndex;
  }

  get difficulty(): string | undefined {
    return this._difficulty;
  }

  get userAnswer(): number | undefined {
    return this._userAnswer;
  }

  // Setters (Encapsulation - validation before setting values)
  setUserAnswer(answerIndex: number): void {
    if (answerIndex >= 0 && answerIndex < this._options.length) {
      this._userAnswer = answerIndex;
    } else {
      throw new Error('Invalid answer index');
    }
  }

  // Business Logic Methods
  isAnswered(): boolean {
    return this._userAnswer !== undefined;
  }

  isCorrect(): boolean {
    return this._userAnswer === this._correctIndex;
  }

  getCorrectAnswer(): string {
    return this._options[this._correctIndex];
  }

  getUserAnswerText(): string | null {
    return this._userAnswer !== undefined
      ? this._options[this._userAnswer]
      : null;
  }

  // Serialization for storage/transfer
  toJSON() {
    return {
      id: this._id,
      text: this._text,
      options: this._options,
      correctIndex: this._correctIndex,
      difficulty: this._difficulty,
      userAnswer: this._userAnswer,
    };
  }

  // Factory method for creating from JSON
  static fromJSON(data: any): Question {
    const question = new Question(
      data.id,
      data.text,
      data.options,
      data.correctIndex,
      data.difficulty
    );
    if (data.userAnswer !== undefined) {
      question.setUserAnswer(data.userAnswer);
    }
    return question;
  }
}
