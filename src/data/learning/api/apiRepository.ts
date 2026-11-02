import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { unwrap, unwrapList } from '@/api/envelope';
import { LearningRepository } from '@/data/learning/repository';
import type { ResourceDownloadLink } from '@/data/learning/types';
import { notesTarget } from '@/data/learning/notesResources';
import {
  AttemptDTO,
  AttemptReviewDTO,
  CourseDTO,
  QuestionDTO,
  ResourceDTO,
  SearchDTO,
  TopicDetailDTO,
  toAttempt,
  toCourseWithTopics,
  toQuestion,
  toQuizQuestion,
  toResource,
  toSearchResult,
  toTopicDetail,
} from './dto';

/**
 * Real-backend implementation of the learning API.
 *
 * Every call goes through the shared `apiClient` (base URL, timeout and the
 * Bearer token are handled there). Response JSON is converted to app types
 * by the mappers in ./dto.ts.
 *
 * Endpoint paths live in src/api/endpoints.ts.
 */
export const apiRepository: LearningRepository = {
  // ── Content ────────────────────────────────────────────────────────────────

  getCourses: async () => {
    const res = await apiClient.get(ENDPOINTS.courses);
    return unwrapList<CourseDTO>(res.data)
      .map(toCourseWithTopics)
      // The server should only return published content, but never show
      // anything else even if it slips through (US-05).
      .filter(c => c.status === 'published');
  },

  getCourse: async courseId => {
    const res = await apiClient.get(ENDPOINTS.course(courseId));
    return toCourseWithTopics(unwrap<CourseDTO>(res.data));
  },

  getTopic: async topicId => {
    const res = await apiClient.get(ENDPOINTS.topic(topicId));
    return toTopicDetail(unwrap<TopicDetailDTO>(res.data));
  },

  search: async query => {
    if (!query.trim()) {
      return { courses: await apiRepository.getCourses(), topics: [] };
    }
    const res = await apiClient.get(ENDPOINTS.search, { params: { q: query.trim() } });
    return toSearchResult(unwrap<SearchDTO>(res.data));
  },

  getResources: async courseId => {
    const res = await apiClient.get(ENDPOINTS.courseResources(courseId));
    return unwrapList<ResourceDTO>(res.data).map(toResource);
  },

  getResourceDownload: async resourceId => {
    const notes = notesTarget(resourceId);
    const res = await apiClient.get(
      notes
        ? notes.scope === 'topic' ? ENDPOINTS.topicNotes(notes.id) : ENDPOINTS.courseNotes(notes.id)
        : ENDPOINTS.resourceDownload(resourceId),
    );
    return unwrap<ResourceDownloadLink>(res.data);
  },

  // ── Quizzes ────────────────────────────────────────────────────────────────

  getQuizQuestions: async topicId => {
    const res = await apiClient.get(ENDPOINTS.topicQuestions(topicId));
    return unwrapList<QuestionDTO>(res.data).map(toQuizQuestion);
  },

  submitQuiz: async input => {
    const res = await apiClient.post(ENDPOINTS.attempts, input);
    return toAttempt(unwrap<AttemptDTO>(res.data));
  },

  getAttempts: async () => {
    const res = await apiClient.get(ENDPOINTS.attempts);
    return unwrapList<AttemptDTO>(res.data)
      .map(toAttempt)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  },

  getAttemptReview: async attemptId => {
    const res = await apiClient.get(ENDPOINTS.attempt(attemptId));
    const dto = unwrap<AttemptReviewDTO>(res.data);
    return { attempt: toAttempt(dto), questions: (dto.questions ?? []).map(toQuestion) };
  },

  // ── Feedback ───────────────────────────────────────────────────────────────

  reportQuestion: async ({ questionId, ...body }) => {
    await apiClient.post(ENDPOINTS.questionReports(questionId), body);
  },

  sendFeedback: async feedback => {
    await apiClient.post(ENDPOINTS.feedback, feedback);
  },
};
