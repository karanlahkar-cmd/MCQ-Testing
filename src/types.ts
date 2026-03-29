export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface TestState {
  status: 'upload' | 'processing' | 'testing' | 'results';
  questions: Question[];
  userAnswers: (number | null)[];
  error: string | null;
}
