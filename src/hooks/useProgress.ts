'use client';

import { getAttempts } from '@/data/learning/learningService';
import { getSummary, getTopicPerformance, getWeakTopics } from '@/data/learning/progressMath';
import { useAsync } from './useAsync';

/**
 * Student progress derived from their attempt history (same maths as the
 * mobile app). Pages remount on navigation, so results appear right after a quiz.
 */
export const useProgress = () => {
  const { data, loading, error, reload } = useAsync(getAttempts, []);
  const attempts = data ?? [];
  const performance = getTopicPerformance(attempts);
  return {
    attempts,
    performance,
    weakTopics: getWeakTopics(performance),
    summary: getSummary(attempts),
    loading,
    error,
    reload,
  };
};
