import { FlashcardSRSState } from "../types";

export const LEITNER_BOXES = [
  {
    box: 1,
    name: "Learning",
    intervalDesc: "Daily",
    defaultIntervalDays: 1,
    color: "bg-red-500 text-white",
    badgeColor: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    description: "New or forgotten cards reviewed in every session",
  },
  {
    box: 2,
    name: "Reviewing",
    intervalDesc: "Every 3 Days",
    defaultIntervalDays: 3,
    color: "bg-amber-500 text-white",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description: "Beginning retention, tested after a short gap",
  },
  {
    box: 3,
    name: "Consolidating",
    intervalDesc: "Every 7 Days",
    defaultIntervalDays: 7,
    color: "bg-sky-500 text-white",
    badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    description: "Good memory consolidation; weekly verification",
  },
  {
    box: 4,
    name: "Proficient",
    intervalDesc: "Every 14 Days",
    defaultIntervalDays: 14,
    color: "bg-indigo-500 text-white",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    description: "High retention, bi-weekly check",
  },
  {
    box: 5,
    name: "Exam Ready",
    intervalDesc: "Every 30 Days",
    defaultIntervalDays: 30,
    color: "bg-emerald-500 text-white",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "Mastered! Solidified in long-term memory for the exam",
  },
];

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function isCardDue(state?: FlashcardSRSState): boolean {
  if (!state) return true; // new card is due
  const today = getTodayDateString();
  return state.nextReviewDate <= today;
}

export function createInitialSRSState(cardId: string): FlashcardSRSState {
  return {
    cardId,
    box: 1,
    intervalDays: 1,
    easeFactor: 2.5,
    repetitions: 0,
    nextReviewDate: getTodayDateString(),
    consecutiveCorrect: 0,
    bookmarked: false,
  };
}

export type SRSRating = "again" | "hard" | "good" | "easy";

export interface SRSResult {
  newState: FlashcardSRSState;
  xpAwarded: number;
  boxChanged: number; // positive for advance, negative for regress
}

export function calculateSRSNextState(
  currentState: FlashcardSRSState,
  rating: SRSRating
): SRSResult {
  const today = getTodayDateString();
  const currentBox = currentState.box;
  let newBox = currentBox;
  let intervalDays = 1;
  let easeFactor = currentState.easeFactor;
  let consecutive = currentState.consecutiveCorrect;
  let xp = 5; // base review XP

  switch (rating) {
    case "again":
      newBox = 1;
      intervalDays = 1;
      consecutive = 0;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      xp = 5;
      break;

    case "hard":
      newBox = Math.max(1, currentBox);
      intervalDays = Math.max(1, Math.round(currentState.intervalDays * 1.2));
      consecutive = Math.max(0, consecutive - 1);
      easeFactor = Math.max(1.3, easeFactor - 0.1);
      xp = 10;
      break;

    case "good":
      newBox = Math.min(5, currentBox + 1);
      if (newBox === 1) intervalDays = 1;
      else if (newBox === 2) intervalDays = 3;
      else if (newBox === 3) intervalDays = 7;
      else if (newBox === 4) intervalDays = 14;
      else intervalDays = 30;

      consecutive += 1;
      xp = newBox >= 4 ? 25 : 15;
      break;

    case "easy":
      newBox = Math.min(5, currentBox + 2);
      if (newBox <= 2) intervalDays = 4;
      else if (newBox === 3) intervalDays = 10;
      else if (newBox === 4) intervalDays = 21;
      else intervalDays = 35;

      consecutive += 2;
      easeFactor = Math.min(3.0, easeFactor + 0.15);
      xp = 30;
      break;
  }

  const nextReviewDate = addDays(today, intervalDays);

  return {
    newState: {
      ...currentState,
      box: newBox,
      intervalDays,
      easeFactor: Number(easeFactor.toFixed(2)),
      repetitions: currentState.repetitions + 1,
      nextReviewDate,
      lastReviewedAt: new Date().toISOString(),
      consecutiveCorrect: consecutive,
    },
    xpAwarded: xp,
    boxChanged: newBox - currentBox,
  };
}
