import { mockDelay } from '@/api/mock';
import { STORAGE_KEYS } from '@/storage/keys';
import { COURSES, QUESTIONS, RESOURCES, TOPICS } from './catalog';
import { LearningRepository } from '@/data/learning/repository';
import { appendToList, newId, readList } from '@/storage/scopedStorage';
import {
  CourseWithTopics,
  Feedback,
  QuestionReport,
  QuizAttempt,
  QuizQuestion,
} from '@/data/learning/types';

/**
 * Local sample-data implementation of the learning API.
 *
 * It mimics what the backend is expected to do — only serving published
 * content, grading attempts, hiding answers until submission — so switching
 * to the real API needs no screen changes.
 */

const KEYS = {
  attempts: STORAGE_KEYS.quizAttempts,
  reports: STORAGE_KEYS.questionReports,
  feedback: STORAGE_KEYS.feedback,
};

const delay = <T>(value: T) => mockDelay(value);

const isPublished = (item: { status: string }) => item.status === 'published';

const publishedTopicsFor = (courseId: string) =>
  TOPICS.filter(t => t.courseId === courseId && isPublished(t)).sort(
    (a, b) => a.order - b.order,
  );

const courseById = (id: string) => {
  const course = COURSES.find(c => c.id === id);
  return course && { ...course, forYou: true };
};

const publishedCourses = (): CourseWithTopics[] =>
  COURSES.filter(isPublished).map(course => ({
    ...course,
    forYou: true,
    topics: publishedTopicsFor(course.id),
  }));

const publishedQuestionsFor = (topicId: string) =>
  QUESTIONS.filter(qn => qn.topicId === topicId && isPublished(qn));

const newestFirst = (list: QuizAttempt[]) =>
  [...list].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

export const mockRepository: LearningRepository = {
  // ── Content ────────────────────────────────────────────────────────────────

  getResources: courseId => delay(RESOURCES.filter(r => r.courseId === courseId)),

  // Sample materials are links only; there are no files to download offline.
  getResourceDownload: () => Promise.reject(new Error('Downloads need the EdMira server.')),

  getCourses: () => delay(publishedCourses()),

  getCourse: courseId => {
    const course = publishedCourses().find(c => c.id === courseId);
    return course ? delay(course) : Promise.reject(new Error('Course not found'));
  },

  getTopic: topicId => {
    const topic = TOPICS.find(t => t.id === topicId && isPublished(t));
    const course = topic && courseById(topic.courseId);
    if (!topic || !course) return Promise.reject(new Error('Topic not found'));
    return delay({
      topic,
      course,
      questionCount: publishedQuestionsFor(topicId).length,
    });
  },

  search: async query => {
    const needle = query.trim().toLowerCase();
    const courses = publishedCourses();
    if (!needle) return delay({ courses, topics: [] });
    const matches = (text: string) => text.toLowerCase().includes(needle);
    return delay({
      courses: courses.filter(c => matches(c.title) || matches(c.description)),
      topics: courses.flatMap(course =>
        course.topics
          .filter(t => matches(t.title) || matches(t.summary))
          .map(topic => ({ topic, course })),
      ),
    });
  },

  // ── Quizzes ────────────────────────────────────────────────────────────────

  getQuizQuestions: topicId =>
    delay(
      publishedQuestionsFor(topicId).map(
        // Strip answer + explanation, exactly like the server should.
        ({ answerIndex: _a, explanation: _e, ...question }): QuizQuestion => question,
      ),
    ),

  submitQuiz: async input => {
    const topic = TOPICS.find(t => t.id === input.topicId);
    const course = topic && courseById(topic.courseId);
    if (!topic || !course) throw new Error('Topic not found');

    const graded = input.answers.map(a => {
      const question = QUESTIONS.find(qn => qn.id === a.questionId);
      return {
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        correct: !!question && a.selectedIndex === question.answerIndex,
      };
    });
    const correctCount = graded.filter(g => g.correct).length;
    const total = graded.length;
    const attempt: QuizAttempt = {
      id: newId(),
      topicId: topic.id,
      courseId: course.id,
      topicTitle: topic.title,
      courseTitle: course.title,
      startedAt: input.startedAt,
      submittedAt: new Date().toISOString(),
      total,
      correctCount,
      answeredCount: graded.filter(g => g.selectedIndex !== null).length,
      score: total ? Math.round((correctCount / total) * 100) : 0,
      answers: graded,
    };
    await appendToList(KEYS.attempts, attempt);
    return delay(attempt);
  },

  getAttempts: async () => newestFirst(await readList<QuizAttempt>(KEYS.attempts)),

  getAttemptReview: async attemptId => {
    const attempt = (await readList<QuizAttempt>(KEYS.attempts)).find(
      a => a.id === attemptId,
    );
    if (!attempt) throw new Error('We couldn’t find this attempt.');
    const ids = new Set(attempt.answers.map(a => a.questionId));
    return delay({ attempt, questions: QUESTIONS.filter(qn => ids.has(qn.id)) });
  },

  // ── Feedback ───────────────────────────────────────────────────────────────

  reportQuestion: report =>
    appendToList<QuestionReport>(KEYS.reports, {
      ...report,
      id: newId(),
      createdAt: new Date().toISOString(),
    }),

  sendFeedback: feedback =>
    appendToList<Feedback>(KEYS.feedback, {
      ...feedback,
      id: newId(),
      createdAt: new Date().toISOString(),
    }),
};
