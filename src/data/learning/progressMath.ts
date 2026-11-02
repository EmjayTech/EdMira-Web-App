import { ProgressSummary, QuizAttempt, TopicPerformance } from './types';

/**
 * Pure progress calculations over a list of attempts (newest first).
 *
 * These run on the phone for both mock and real data, so the backend only
 * has to return the attempt history. If the backend later provides its own
 * /progress endpoint, these can be swapped out in learningService.ts.
 */

/** Average score (%) below which a practised topic is flagged as weak. */
export const WEAK_TOPIC_THRESHOLD = 60;

export const getTopicPerformance = (attempts: QuizAttempt[]): TopicPerformance[] => {
  const byTopic = new Map<string, QuizAttempt[]>();
  attempts.forEach(a => {
    byTopic.set(a.topicId, [...(byTopic.get(a.topicId) ?? []), a]);
  });

  return [...byTopic.values()].map(list => {
    // `attempts` is newest first, so list[0] is the latest attempt.
    const latest = list[0];
    const scores = list.map(a => a.score);
    return {
      topicId: latest.topicId,
      courseId: latest.courseId,
      topicTitle: latest.topicTitle,
      courseTitle: latest.courseTitle,
      attempts: list.length,
      averageScore: Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length),
      bestScore: Math.max(...scores),
      lastScore: latest.score,
      lastAttemptAt: latest.submittedAt,
    };
  });
};

/**
 * Topics whose average practice score is below the threshold, weakest first.
 * Uses the average so one lucky or unlucky attempt doesn't dominate.
 */
export const getWeakTopics = (performance: TopicPerformance[]) =>
  performance
    .filter(p => p.averageScore < WEAK_TOPIC_THRESHOLD)
    .sort((a, b) => a.averageScore - b.averageScore);

/** Local calendar day, so a late-night quiz counts for the student's day. */
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const computeStreak = (attempts: QuizAttempt[]) => {
  const days = new Set(attempts.map(a => dayKey(new Date(a.submittedAt))));
  const cursor = new Date();
  // Allow the streak to still count if the student hasn't practised yet today.
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export const getSummary = (attempts: QuizAttempt[]): ProgressSummary => ({
  quizzesTaken: attempts.length,
  questionsAnswered: attempts.reduce((sum, a) => sum + a.answeredCount, 0),
  averageScore: attempts.length
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : null,
  topicsPractised: new Set(attempts.map(a => a.topicId)).size,
  streakDays: computeStreak(attempts),
});
