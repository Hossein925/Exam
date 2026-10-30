import { useState, useEffect } from 'react';

export interface UserStudyState {
  bookmarks: string[]; // question ids
  mastered: string[];  // question ids
  reviewNeeded: string[]; // question ids
  userAnswers: Record<string, number>; // questionId -> selectedOption (0..3)
  leitnerBoxes: Record<string, number>; // questionId -> box (1..5)
  examRemainingDays: number;
  dailyGoal: number;
  todayStudiedCount: number;
}

const STORAGE_KEY = 'medix_license_to_medical_study_state_v1';

const defaultState: UserStudyState = {
  bookmarks: [],
  mastered: [],
  reviewNeeded: [],
  userAnswers: {},
  leitnerBoxes: {},
  examRemainingDays: 14,
  dailyGoal: 50,
  todayStudiedCount: 0
};

export function useStudyState() {
  const [state, setState] = useState<UserStudyState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch {
      // fallback to default
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  const toggleBookmark = (id: string) => {
    setState(prev => {
      const isBookmarked = prev.bookmarks.includes(id);
      return {
        ...prev,
        bookmarks: isBookmarked ? prev.bookmarks.filter(x => x !== id) : [...prev.bookmarks, id]
      };
    });
  };

  const markMastered = (id: string) => {
    setState(prev => {
      const curBox = prev.leitnerBoxes[id] || 1;
      const nextBox = Math.min(5, curBox + 1);
      return {
        ...prev,
        mastered: prev.mastered.includes(id) ? prev.mastered : [...prev.mastered, id],
        reviewNeeded: prev.reviewNeeded.filter(x => x !== id),
        leitnerBoxes: { ...prev.leitnerBoxes, [id]: nextBox },
        todayStudiedCount: prev.todayStudiedCount + 1
      };
    });
  };

  const markReviewNeeded = (id: string) => {
    setState(prev => {
      return {
        ...prev,
        reviewNeeded: prev.reviewNeeded.includes(id) ? prev.reviewNeeded : [...prev.reviewNeeded, id],
        mastered: prev.mastered.filter(x => x !== id),
        leitnerBoxes: { ...prev.leitnerBoxes, [id]: 1 },
        todayStudiedCount: prev.todayStudiedCount + 1
      };
    });
  };

  const setAnswer = (id: string, optIndex: number) => {
    setState(prev => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [id]: optIndex }
    }));
  };

  const setRemainingDays = (days: number) => {
    setState(prev => ({ ...prev, examRemainingDays: Math.max(1, days) }));
  };

  const setDailyGoal = (goal: number) => {
    setState(prev => ({ ...prev, dailyGoal: Math.max(10, goal) }));
  };

  const resetProgress = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید تمام سوابق مطالعه و پاسخ‌ها را ریست کنید؟')) {
      setState(defaultState);
    }
  };

  return {
    state,
    toggleBookmark,
    markMastered,
    markReviewNeeded,
    setAnswer,
    setRemainingDays,
    setDailyGoal,
    resetProgress
  };
}
