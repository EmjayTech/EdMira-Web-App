import { BACKEND } from '@/config/backend';
import { apiRepository } from './api/apiRepository';
import { mockRepository } from './mock/mockRepository';
import { isRetryable } from '@/api/errors';
import { enqueue, flushOutbox, OutboxItem } from './outbox';
import {
  ContentRepository,
  FeedbackRepository,
  QuizRepository,
} from './repository';
import { NewFeedback, NewQuestionReport, SubmitQuizInput } from './types';

/**
 * ─── Learning service (the ONLY data entry point for screens) ────────────────
 *
 * Screens and hooks import from here and nothing else. Each area picks its
 * data source from src/config/backend.ts → BACKEND.useMock, so going live
 * is a config change, not a code change.
 */

const content: ContentRepository = BACKEND.useMock.content ? mockRepository : apiRepository;
const quizzes: QuizRepository = BACKEND.useMock.quizzes ? mockRepository : apiRepository;
const feedback: FeedbackRepository = BACKEND.useMock.feedback ? mockRepository : apiRepository;

// ── Content ──────────────────────────────────────────────────────────────────

export const getCourses = () => content.getCourses();
export const getCourse = (courseId: string) => content.getCourse(courseId);
export const getTopic = (topicId: string) => content.getTopic(topicId);
export const searchContent = (query: string) => content.search(query);
export const getResources = (courseId: string) => content.getResources(courseId);
export const getResourceDownload = (resourceId: string) => content.getResourceDownload(resourceId);

// ── Quizzes ──────────────────────────────────────────────────────────────────

export const getQuizQuestions = (topicId: string) => quizzes.getQuizQuestions(topicId);
export const submitQuiz = (input: SubmitQuizInput) => quizzes.submitQuiz(input);
export const getAttempts = () => quizzes.getAttempts();
export const getAttemptReview = (attemptId: string) => quizzes.getAttemptReview(attemptId);

// ── Feedback (with offline outbox) ───────────────────────────────────────────

const sendOutboxItem = (item: OutboxItem) =>
  item.kind === 'report'
    ? feedback.reportQuestion(item.payload)
    : feedback.sendFeedback(item.payload);

/**
 * Report a question. If the network is down the report is queued and sent
 * later, so the student always gets a "thanks" (US-23).
 */
export const reportQuestion = async (report: NewQuestionReport) => {
  try {
    await feedback.reportQuestion(report);
  } catch (error) {
    if (!isRetryable(error)) throw error;
    await enqueue({ kind: 'report', payload: report });
  }
};

/** Send product feedback, queueing it if offline (US-24). */
export const sendFeedback = async (item: NewFeedback) => {
  try {
    await feedback.sendFeedback(item);
  } catch (error) {
    if (!isRetryable(error)) throw error;
    await enqueue({ kind: 'feedback', payload: item });
  }
};

/** Retry anything queued while offline. Called on app start / resume. */
export const syncPending = () => flushOutbox(sendOutboxItem);
