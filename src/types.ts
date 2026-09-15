export type ElementId = 1 | 2 | 3 | 4;

export interface ElementInfo {
  id: ElementId;
  title: string;
  shortTitle: string;
  description: string;
  topics: string[];
  color: string;
}

export interface QuizQuestion {
  id: string;
  elementId: ElementId;
  subtopic: string;
  type: "multiple-choice" | "obe-scenario";
  question: string;
  scenario?: string;
  options?: string[];
  correctIndex?: number;
  explanation: string;
  reference: string;
  commandWord?: "Identify" | "Outline" | "Discuss" | "Explain";
  marks?: number;
  modelAnswer?: string;
  peeChecklist?: {
    point: string;
    evidence: string;
    explanation: string;
  };
}

export interface ExamAttempt {
  id: string;
  date: string;
  type: "quiz" | "obe";
  score: number;
  totalPossible: number;
  elementBreakdown: Record<ElementId, { correct: number; total: number }>;
  timeSpentSeconds: number;
  verdict: "Distinction" | "Credit" | "Pass" | "Referral";
}

export interface StudentProfile {
  name: string;
  title: string;
  streakDays: number;
  lastActiveDate: string;
  xp: number;
  level: number;
  targetExamDate: string;
  notificationsEnabled: boolean;
  notificationTime: string;
  syncCode: string;
  bookmarkedQuestionIds: string[];
  completedQuestionIds: string[];
  weakTopics: string[];
  attempts: ExamAttempt[];
  badges: Badge[];
  flashcardSRS?: Record<string, FlashcardSRSState>;
  flashcardsReviewedCount?: number;
}

export type FlashcardCategory =
  | "legal-definition"
  | "core-terminology"
  | "ilo-standards"
  | "management-framework"
  | "enforcement";

export interface Flashcard {
  id: string;
  elementId: ElementId;
  topic: string;
  category: FlashcardCategory;
  term: string;
  acronym?: string;
  definition: string;
  legalContext?: string;
  keyElements?: string[];
  obeApplicationTip: string;
  examinerWarning?: string;
  isCustom?: boolean;
}

export interface FlashcardSRSState {
  cardId: string;
  box: number; // 1 to 5 (Leitner boxes: 1: Daily, 2: 3d, 3: 7d, 4: 14d, 5: 30d Mastered)
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewedAt?: string;
  consecutiveCorrect: number;
  bookmarked?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: "tutor" | "student" | "system";
  avatar: string;
  content: string;
  timestamp: string;
  likes?: number;
  tag?: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  country: string;
  xp: number;
  streak: number;
  accuracy: number;
  badgeCount: number;
  isCurrentUser?: boolean;
}

export type GlossaryCategory =
  | "Legal & Duties"
  | "Management Systems"
  | "Risk Assessment & Controls"
  | "Human Factors & Culture"
  | "Monitoring & Metrics"
  | "Incident Investigation";

export interface GlossaryTerm {
  id: string;
  term: string;
  acronym?: string;
  chapter: ElementId;
  category: GlossaryCategory;
  summary: string;
  fullDefinition: string;
  keyFormulaOrBreakdown?: string;
  practicalHseExample: string;
  examinerDistinction?: string;
  relatedTermIds?: string[];
}

