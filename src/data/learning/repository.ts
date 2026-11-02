import {
  AttemptReview,
  CourseWithTopics,
  NewFeedback,
  NewQuestionReport,
  QuizAttempt,
  QuizQuestion,
  ResourceDownloadLink,
  SearchResult,
  StudyResource,
  SubmitQuizInput,
  TopicDetail,
} from './types';

/**
 * Everything the learning screens need from a data source.
 *
 * Two implementations exist:
 *   - mock/mockRepository.ts — local sample data (works with no server)
 *   - api/apiRepository.ts   — the real EdMira backend
 *
 * learningService.ts picks one per area based on src/config/backend.ts.
 * Screens never import a repository directly.
 */

export interface ContentRepository {
  /** Published courses, each with its published topics in order. */
  getCourses(): Promise<CourseWithTopics[]>;
  getCourse(courseId: string): Promise<CourseWithTopics>;
  getTopic(topicId: string): Promise<TopicDetail>;
  search(query: string): Promise<SearchResult>;
  /** Published study materials of a course (course-wide and per topic). */
  getResources(courseId: string): Promise<StudyResource[]>;
  /** A short-lived link to an uploaded material. */
  getResourceDownload(resourceId: string): Promise<ResourceDownloadLink>;
}

export interface QuizRepository {
  /** Published questions for a topic, WITHOUT answers/explanations. */
  getQuizQuestions(topicId: string): Promise<QuizQuestion[]>;
  /** Grades and stores the attempt; returns the graded result. */
  submitQuiz(input: SubmitQuizInput): Promise<QuizAttempt>;
  /** The current student's attempts, newest first. */
  getAttempts(): Promise<QuizAttempt[]>;
  getAttemptReview(attemptId: string): Promise<AttemptReview>;
}

export interface FeedbackRepository {
  reportQuestion(report: NewQuestionReport): Promise<void>;
  sendFeedback(feedback: NewFeedback): Promise<void>;
}

export type LearningRepository = ContentRepository & QuizRepository & FeedbackRepository;
