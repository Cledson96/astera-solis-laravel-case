export type UserDto = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "teacher" | "student" | string;
  school_id?: number | null;
};

export type CollectionDto = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  segment: string;
  subject: string | null;
  active: boolean;
  materials_count?: number;
  quizzes_count?: number;
};

export type MaterialDto = {
  id: number;
  collection_id: number;
  collection?: CollectionDto | null;
  title: string;
  type: string;
  summary: string | null;
  url: string | null;
  estimated_minutes: number;
  active: boolean;
};

export type QuizQuestionDto = {
  id: number;
  quiz_id: number;
  statement: string;
  options: Record<string, string>;
  points: number;
};

export type QuizDto = {
  id: number;
  collection_id: number;
  collection?: CollectionDto | null;
  title: string;
  description: string | null;
  passing_score: number;
  active: boolean;
  questions_count?: number;
  questions?: QuizQuestionDto[];
};

export type QuizAttemptDto = {
  id: number;
  quiz_id: number;
  user_id: number;
  answers: Record<string, string>;
  score: number;
  approved: boolean;
  submitted_at: string;
};
