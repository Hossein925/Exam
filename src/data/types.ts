export interface Question {
  id: string;
  year: number;
  examName: string;
  number: number;
  subject: string;
  category: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
  highYieldTip: string;
  difficulty?: 'آسان' | 'متوسط' | 'دشوار' | 'دام‌دار';
  sourcePdf: string;
}

export interface ExamInfo {
  id: number;
  title: string;
  date: string;
  totalQuestions: number;
  extractedCount: number;
  durationMinutes: number;
  description: string;
  pdfPath: string;
}

export interface CategoryInfo {
  id: string;
  title: string;
  icon: string;
  count: number;
  desc: string;
}
