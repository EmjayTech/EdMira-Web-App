/**
 * Endpoint paths (relative to BACKEND.baseURL), matching EdMira-Backend's
 * controllers. Contract: docs/BACKEND_INTEGRATION.md §3. If a route is
 * renamed on the server, change it here only.
 */
export const ENDPOINTS = {
  // Auth
  signup: '/api/v1/auth/signup',
  verifyEmail: '/api/v1/auth/verify',
  resendOtp: '/api/v1/auth/resend-otp',
  login: '/api/v1/auth/login',
  logout: '/api/v1/auth/logout',
  profile: '/api/v1/auth/profile',
  forgotPassword: '/api/v1/auth/forgot-password',
  resetPassword: '/api/v1/auth/reset-password',
  /** Refresh token goes in the Authorization header (see api/client.ts). */
  refreshToken: '/api/v1/auth/refresh',

  // Reference data for sign-up
  academicOptions: '/api/v1/reference/academic-options',

  // Content
  courses: '/api/v1/courses',
  course: (courseId: string) => `/api/v1/courses/${courseId}`,
  topic: (topicId: string) => `/api/v1/topics/${topicId}`,
  search: '/api/v1/search',
  /** Study materials (slides, videos, textbooks, notes) of a course and its topics. */
  courseResources: (courseId: string) => `/api/v1/courses/${courseId}/resources`,
  /** → { url, name, size, mimeType, expiresAt } — a 15-minute download link. */
  resourceDownload: (resourceId: string) => `/api/v1/resources/${resourceId}/download`,
  /** Signed link to a PDF of the topic's / course's notes. */
  topicNotes: (topicId: string) => `/api/v1/topics/${topicId}/notes`,
  courseNotes: (courseId: string) => `/api/v1/courses/${courseId}/notes`,

  // Quizzes
  topicQuestions: (topicId: string) => `/api/v1/topics/${topicId}/questions`,
  attempts: '/api/v1/quiz-attempts',
  attempt: (attemptId: string) => `/api/v1/quiz-attempts/${attemptId}`,

  // Feedback & support
  questionReports: (questionId: string) => `/api/v1/questions/${questionId}/reports`,
  feedback: '/api/v1/feedback',

  // Campus news
  news: '/api/v1/news',
  newsArticle: (articleId: string) => `/api/v1/news/${articleId}`,
};

/** Auth calls where a 401 means "wrong credentials", not "session expired". */
export const PUBLIC_AUTH_ENDPOINTS = [
  ENDPOINTS.signup,
  ENDPOINTS.verifyEmail,
  ENDPOINTS.resendOtp,
  ENDPOINTS.login,
  ENDPOINTS.forgotPassword,
  ENDPOINTS.resetPassword,
  ENDPOINTS.refreshToken,
];
