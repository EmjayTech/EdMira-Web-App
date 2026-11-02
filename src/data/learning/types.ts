/**
 * Learning domain types for the EdMira MVP:
 * Course → Topic → (study material + MCQ question bank) → Attempts.
 */

export type ContentStatus = 'draft' | 'in_review' | 'published' | 'archived';

export interface MaterialSection {
  heading: string;
  body: string;
  keyPoints?: string[];
}

export interface Question {
  id: string;
  topicId: string;
  stem: string;
  options: string[];
  /** Index into `options` */
  answerIndex: number;
  explanation?: string;
  status: ContentStatus;
}

export interface Topic {
  id: string;
  courseId: string;
  title: string;
  order: number;
  summary: string;
  readMinutes: number;
  material: MaterialSection[];
  status: ContentStatus;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  /** Short code shown on the course badge, e.g. "ANA" */
  code: string;
  color: string;
  status: ContentStatus;
  /**
   * Matches the student's level, department and school (set per course in the
   * admin dashboard). Courses shows these first; the rest stay browsable.
   */
  forYou: boolean;
}

// ── Study materials ──────────────────────────────────────────────────────────

export type ResourceKind = 'slides' | 'video' | 'textbook' | 'notes';

/**
 * Lecture slides, a YouTube video, a textbook or notes attached to a course
 * or one of its topics (added in the admin dashboard, medically reviewed).
 */
export interface StudyResource {
  id: string;
  courseId: string;
  /** Missing = for the whole course. */
  topicId?: string;
  kind: ResourceKind;
  title: string;
  description: string;
  /** Set when it's a school's own material. */
  institution?: string;
  /** file = uploaded (downloadable); youtube / link open outside the app. */
  source: 'file' | 'youtube' | 'link';
  file?: { name: string; size: number; mimeType: string };
  link?: string;
  youTubeId?: string;
}

/** Short-lived link to an uploaded material. */
export interface ResourceDownloadLink {
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface CourseWithTopics extends Course {
  topics: Topic[];
}

export interface AttemptAnswer {
  questionId: string;
  /** null when the student skipped the question */
  selectedIndex: number | null;
  correct: boolean;
}

export interface QuizAttempt {
  id: string;
  topicId: string;
  courseId: string;
  topicTitle: string;
  courseTitle: string;
  startedAt: string;
  submittedAt: string;
  total: number;
  correctCount: number;
  answeredCount: number;
  /** 0–100 */
  score: number;
  answers: AttemptAnswer[];
}

export interface TopicPerformance {
  topicId: string;
  courseId: string;
  topicTitle: string;
  courseTitle: string;
  attempts: number;
  /** Average score across all attempts, 0–100 */
  averageScore: number;
  bestScore: number;
  lastScore: number;
  lastAttemptAt: string;
}

export interface ProgressSummary {
  quizzesTaken: number;
  questionsAnswered: number;
  averageScore: number | null;
  topicsPractised: number;
  /** Consecutive days (ending today or yesterday) with at least one quiz */
  streakDays: number;
}

export type ReportReason =
  | 'wrong_answer'
  | 'unclear_question'
  | 'explanation_issue'
  | 'typo'
  | 'other';

export interface QuestionReport {
  id: string;
  questionId: string;
  topicId: string;
  reason: ReportReason;
  note: string;
  createdAt: string;
}

export type FeedbackArea =
  | 'courses'
  | 'study_material'
  | 'quizzes'
  | 'progress'
  | 'account'
  | 'other';

export interface Feedback {
  id: string;
  area: FeedbackArea;
  rating: number | null;
  message: string;
  createdAt: string;
}

// ── Service contract types ───────────────────────────────────────────────────

/**
 * A question as served DURING a quiz. The correct answer and explanation are
 * deliberately absent — the server grades the attempt, so answers never reach
 * the phone before the student submits.
 */
export type QuizQuestion = Omit<Question, 'answerIndex' | 'explanation'>;

export interface TopicDetail {
  topic: Topic;
  course: Course;
  questionCount: number;
}

export interface SearchResult {
  courses: CourseWithTopics[];
  topics: { topic: Topic; course: Course }[];
}

export interface SubmitQuizInput {
  topicId: string;
  startedAt: string;
  answers: { questionId: string; selectedIndex: number | null }[];
}

/** A graded attempt plus the full questions (with answers + explanations). */
export interface AttemptReview {
  attempt: QuizAttempt;
  questions: Question[];
}

export type NewQuestionReport = Omit<QuestionReport, 'id' | 'createdAt'>;
export type NewFeedback = Omit<Feedback, 'id' | 'createdAt'>;
