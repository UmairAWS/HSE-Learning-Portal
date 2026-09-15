import React, { useState, useEffect, useMemo } from "react";
import { Flashcard, FlashcardSRSState, ElementId, FlashcardCategory } from "../types";
import { NEBOSH_FLASHCARDS } from "../data/flashcardsData";
import {
  LEITNER_BOXES,
  createInitialSRSState,
  calculateSRSNextState,
  isCardDue,
  getTodayDateString,
  SRSRating,
} from "../utils/srsLogic";
import {
  RotateCcw,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  Bookmark,
  BookmarkCheck,
  Volume2,
  Plus,
  ArrowRight,
  ArrowLeft,
  Filter,
  Check,
  Award,
  AlertTriangle,
  Scale,
  BrainCircuit,
  Eye,
  X,
  Shuffle,
  GraduationCap,
} from "lucide-react";

interface FlashcardsViewProps {
  onAwardXP: (amount: number, reason: string) => void;
  onNavigateTab?: (tab: string) => void;
}

const CATEGORY_LABELS: Record<FlashcardCategory, { label: string; color: string }> = {
  "legal-definition": {
    label: "Legal Definition",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  "core-terminology": {
    label: "Core Terminology",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  "ilo-standards": {
    label: "ILO & Standards",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  "management-framework": {
    label: "Management System",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  "enforcement": {
    label: "Enforcement & Civil",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
};

const ELEMENT_LABELS: Record<ElementId, { short: string; name: string; color: string }> = {
  1: { short: "Chapter 1", name: "Why Manage H&S", color: "text-rose-500 border-rose-500/30 bg-rose-500/10" },
  2: { short: "Chapter 2", name: "Management Systems", color: "text-sky-500 border-sky-500/30 bg-sky-500/10" },
  3: { short: "Chapter 3", name: "Managing Risk & People", color: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" },
  4: { short: "Chapter 4", name: "Monitoring & Measuring", color: "text-amber-500 border-amber-500/30 bg-amber-500/10" },
};

export default function FlashcardsView({ onAwardXP, onNavigateTab }: FlashcardsViewProps) {
  // Custom cards saved in localStorage
  const [customCards, setCustomCards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem("nebosh_custom_flashcards");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse custom flashcards", e);
      }
    }
    return [];
  });

  // All cards combined (default syllabus + custom cards)
  const allCards = useMemo(() => {
    return [...NEBOSH_FLASHCARDS, ...customCards];
  }, [customCards]);

  // SRS States dictionary: { [cardId]: FlashcardSRSState }
  const [srsState, setSrsState] = useState<Record<string, FlashcardSRSState>>(() => {
    const saved = localStorage.getItem("nebosh_srs_state");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse SRS state", e);
      }
    }
    // Initialize defaults with distributed review dates for existing cards
    const initial: Record<string, FlashcardSRSState> = {};
    NEBOSH_FLASHCARDS.forEach((card, idx) => {
      const state = createInitialSRSState(card.id);
      // Give some variation to existing progress for a realistic student profile
      if (idx < 5) {
        state.box = 4;
        state.intervalDays = 14;
        state.repetitions = 6;
        state.consecutiveCorrect = 4;
      } else if (idx < 12) {
        state.box = 3;
        state.intervalDays = 7;
        state.repetitions = 3;
        state.consecutiveCorrect = 2;
      } else if (idx < 20) {
        state.box = 2;
        state.intervalDays = 3;
        state.repetitions = 2;
      }
      initial[card.id] = state;
    });
    return initial;
  });

  // Save SRS state whenever it changes
  useEffect(() => {
    localStorage.setItem("nebosh_srs_state", JSON.stringify(srsState));
  }, [srsState]);

  // View state: 'overview' | 'study' | 'add'
  const [viewMode, setViewMode] = useState<"overview" | "study" | "add">("overview");

  // Study session state
  const [studyQueue, setStudyQueue] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [sessionReviewedCount, setSessionReviewedCount] = useState<number>(0);
  const [sessionXPEarned, setSessionXPEarned] = useState<number>(0);
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false);
  const [studyModeTitle, setStudyModeTitle] = useState<string>("Spaced Repetition Review");

  // Browse and filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedElement, setSelectedElement] = useState<ElementId | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<FlashcardCategory | "all">("all");
  const [selectedBoxFilter, setSelectedBoxFilter] = useState<number | "due" | "bookmarked" | "all">("all");

  // Quick preview modal card
  const [previewCard, setPreviewCard] = useState<Flashcard | null>(null);
  const [isPreviewFlipped, setIsPreviewFlipped] = useState<boolean>(false);

  // New card form state
  const [newCard, setNewCard] = useState({
    term: "",
    acronym: "",
    elementId: 1 as ElementId,
    category: "legal-definition" as FlashcardCategory,
    topic: "",
    definition: "",
    legalContext: "",
    obeApplicationTip: "",
    examinerWarning: "",
  });

  // Today's due cards
  const dueCards = useMemo(() => {
    return allCards.filter((card) => {
      const state = srsState[card.id];
      return isCardDue(state);
    });
  }, [allCards, srsState]);

  // Box distributions
  const boxCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allCards.forEach((card) => {
      const b = srsState[card.id]?.box || 1;
      counts[b as 1 | 2 | 3 | 4 | 5]++;
    });
    return counts;
  }, [allCards, srsState]);

  const masteredCount = boxCounts[4] + boxCounts[5];
  const learningCount = boxCounts[1] + boxCounts[2];

  // Filtered cards for Browse deck
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      const state = srsState[card.id];
      const matchesSearch =
        card.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (card.acronym && card.acronym.toLowerCase().includes(searchQuery.toLowerCase())) ||
        card.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (card.legalContext && card.legalContext.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesElement = selectedElement === "all" || card.elementId === selectedElement;
      const matchesCategory = selectedCategory === "all" || card.category === selectedCategory;

      let matchesBox = true;
      if (selectedBoxFilter === "due") {
        matchesBox = isCardDue(state);
      } else if (selectedBoxFilter === "bookmarked") {
        matchesBox = Boolean(state?.bookmarked);
      } else if (typeof selectedBoxFilter === "number") {
        matchesBox = (state?.box || 1) === selectedBoxFilter;
      }

      return matchesSearch && matchesElement && matchesCategory && matchesBox;
    });
  }, [allCards, searchQuery, selectedElement, selectedCategory, selectedBoxFilter, srsState]);

  // Start study session
  const startStudySession = (cardsToStudy: Flashcard[], title: string = "Spaced Repetition Review") => {
    if (cardsToStudy.length === 0) return;
    // Shuffle queue
    const shuffled = [...cardsToStudy].sort(() => Math.random() - 0.5);
    setStudyQueue(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionReviewedCount(0);
    setSessionXPEarned(0);
    setIsSessionComplete(false);
    setStudyModeTitle(title);
    setViewMode("study");
  };

  // Bookmark toggle
  const toggleBookmark = (cardId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSrsState((prev) => {
      const current = prev[cardId] || createInitialSRSState(cardId);
      return {
        ...prev,
        [cardId]: {
          ...current,
          bookmarked: !current.bookmarked,
        },
      };
    });
  };

  // Current study card
  const currentCard = studyQueue[currentIndex];

  // Handle rating in study mode
  const handleRating = (rating: SRSRating) => {
    if (!currentCard) return;

    const currentState = srsState[currentCard.id] || createInitialSRSState(currentCard.id);
    const { newState, xpAwarded } = calculateSRSNextState(currentState, rating);

    // Update state
    setSrsState((prev) => ({
      ...prev,
      [currentCard.id]: newState,
    }));

    // Award XP
    onAwardXP(xpAwarded, `Flashcard: ${currentCard.term} (${rating.toUpperCase()})`);
    setSessionXPEarned((prev) => prev + xpAwarded);
    setSessionReviewedCount((prev) => prev + 1);

    // If rated "again", re-queue this card towards the end of the session
    if (rating === "again" && studyQueue.length > 1) {
      setStudyQueue((prev) => [...prev, currentCard]);
    }

    // Advance to next card or complete
    if (currentIndex + 1 < studyQueue.length) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSessionComplete(true);
    }
  };

  // Audio pronunciation using Web Speech API
  const speakTerm = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-GB";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Keyboard navigation during study
  useEffect(() => {
    if (viewMode !== "study" || isSessionComplete) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === "1") handleRating("again");
        else if (e.key === "2") handleRating("hard");
        else if (e.key === "3") handleRating("good");
        else if (e.key === "4") handleRating("easy");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, isFlipped, isSessionComplete, currentIndex, studyQueue]);

  // Handle adding custom card
  const handleCreateCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.term.trim() || !newCard.definition.trim()) return;

    const createdCard: Flashcard = {
      id: `custom_fc_${Date.now()}`,
      elementId: newCard.elementId,
      topic: newCard.topic || "Custom Terminology",
      category: newCard.category,
      term: newCard.term.trim(),
      acronym: newCard.acronym.trim() || undefined,
      definition: newCard.definition.trim(),
      legalContext: newCard.legalContext.trim() || undefined,
      obeApplicationTip: newCard.obeApplicationTip.trim() || "Apply in relevant workplace scenario questions.",
      examinerWarning: newCard.examinerWarning.trim() || undefined,
      isCustom: true,
    };

    const updated = [createdCard, ...customCards];
    setCustomCards(updated);
    localStorage.setItem("nebosh_custom_flashcards", JSON.stringify(updated));

    // Initialize SRS state
    setSrsState((prev) => ({
      ...prev,
      [createdCard.id]: createInitialSRSState(createdCard.id),
    }));

    // Award bonus creation XP
    onAwardXP(30, "Created Custom Study Flashcard");

    // Reset form & return to overview
    setNewCard({
      term: "",
      acronym: "",
      elementId: 1,
      category: "legal-definition",
      topic: "",
      definition: "",
      legalContext: "",
      obeApplicationTip: "",
      examinerWarning: "",
    });
    setViewMode("overview");
  };

  // Reset SRS intervals for full deck
  const handleResetSRS = () => {
    if (confirm("Reset all spaced repetition intervals for the entire deck? This will return all cards to Box 1 for a fresh study cycle.")) {
      const reset: Record<string, FlashcardSRSState> = {};
      allCards.forEach((c) => {
        reset[c.id] = createInitialSRSState(c.id);
      });
      setSrsState(reset);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ================= HEADER MISSION CONTROL BANNER ================= */}
      <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/40 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2.5 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" /> Spaced-Repetition System (SRS)
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Leitner 5-Box Memory Engine
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
            HSE Terminology &amp; Statutory Definitions
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Commit statutory duties (<strong className="text-white">SFARP, Strict Liability, ILO C155</strong>), accident models, and risk management definitions to long-term memory. The spaced-repetition algorithm automatically schedules cards right before you forget them.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={() => {
                if (dueCards.length > 0) {
                  startStudySession(dueCards, `Today's Spaced Repetition (${dueCards.length} Cards)`);
                } else {
                  startStudySession(allCards, `All Cards Free Practice (${allCards.length} Cards)`);
                }
              }}
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {dueCards.length > 0 ? `Review ${dueCards.length} Due Cards` : "Practice All 32+ Cards"}
            </button>

            <button
              onClick={() => setViewMode(viewMode === "add" ? "overview" : "add")}
              className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center gap-1.5 backdrop-blur transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Custom Card
            </button>

            {viewMode !== "overview" && (
              <button
                onClick={() => setViewMode("overview")}
                className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Layers className="w-3.5 h-3.5" />
                Deck Overview
              </button>
            )}
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400 via-indigo-600 to-transparent pointer-events-none"></div>
      </div>

      {/* ================= LEITNER BOX STATUS SHELF ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {LEITNER_BOXES.map((box) => {
          const count = boxCounts[box.box as 1 | 2 | 3 | 4 | 5];
          const isSelected = selectedBoxFilter === box.box;
          return (
            <div
              key={box.box}
              onClick={() => {
                setSelectedBoxFilter(isSelected ? "all" : box.box);
                if (viewMode !== "overview") setViewMode("overview");
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-100 dark:bg-slate-800 ring-2 ring-indigo-500 border-indigo-500/50 shadow-md"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                  Box {box.box}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${box.badgeColor}`}>
                  {box.intervalDesc}
                </span>
              </div>

              <div className="my-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{count}</span>
                <span className="text-xs text-slate-500 font-medium">cards</span>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{box.name}</p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${box.color}`}
                    style={{
                      width: `${allCards.length > 0 ? (count / allCards.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= VIEW MODE 1: STUDY SESSION ================= */}
      {viewMode === "study" && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
          {/* Study Navigation Bar */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setViewMode("overview")}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Session
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Card {Math.min(currentIndex + 1, studyQueue.length)} of {studyQueue.length}
              </span>
              <div className="w-24 sm:w-32 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / Math.max(1, studyQueue.length)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-xl">
              <Award className="w-4 h-4" />
              <span>+{sessionXPEarned} XP</span>
            </div>
          </div>

          {/* Session Complete Screen */}
          {isSessionComplete ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-5 shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Study Session Complete!
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  You reviewed {sessionReviewedCount} HSE flashcards and earned <strong>+{sessionXPEarned} XP</strong>!
                </p>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Cards Reviewed</span>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {sessionReviewedCount}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">XP Awarded</span>
                  <p className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
                    +{sessionXPEarned}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Mastered</span>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {masteredCount}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => startStudySession(allCards, "Full Deck Practice")}
                  className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Practice Again
                </button>
                <button
                  onClick={() => setViewMode("overview")}
                  className="py-2.5 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
                >
                  Return to Deck
                </button>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab("quiz")}
                    className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition"
                  >
                    <BookOpen className="w-4 h-4" />
                    Test via Quiz
                  </button>
                )}
              </div>
            </div>
          ) : (
            currentCard && (
              <div className="space-y-4">
                {/* Flashcard Component */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="relative min-h-[380px] sm:min-h-[420px] rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl hover:border-indigo-400/60 dark:hover:border-indigo-600/60 transition cursor-pointer flex flex-col justify-between select-none group"
                >
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border ${
                          ELEMENT_LABELS[currentCard.elementId].color
                        }`}
                      >
                        {ELEMENT_LABELS[currentCard.elementId].short}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${
                          CATEGORY_LABELS[currentCard.category].color
                        }`}
                      >
                        {CATEGORY_LABELS[currentCard.category].label}
                      </span>
                      {currentCard.acronym && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {currentCard.acronym}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Box pill */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        Box {srsState[currentCard.id]?.box || 1}
                      </span>

                      {/* Text-to-speech button */}
                      <button
                        onClick={(e) => speakTerm(currentCard.term, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      {/* Bookmark button */}
                      <button
                        onClick={(e) => toggleBookmark(currentCard.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Bookmark this card"
                      >
                        {srsState[currentCard.id]?.bookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Content (Front or Back) */}
                  <div className="my-auto py-6">
                    {!isFlipped ? (
                      /* FRONT: Term, Topic, Command prompt */
                      <div className="text-center space-y-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                          {currentCard.topic}
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                          {currentCard.term}
                        </h2>
                        {currentCard.legalContext && (
                          <div className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                            <Scale className="w-3.5 h-3.5 text-purple-500" />
                            <span>{currentCard.legalContext}</span>
                          </div>
                        )}
                        <p className="text-xs text-slate-400 pt-3">
                          Tap card or press <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Space</kbd> to reveal HSE definition &amp; practical guidance
                        </p>
                      </div>
                    ) : (
                      /* BACK: Full Definition, Sub-clauses, Scenario Tip, Examiner Warning */
                      <div className="space-y-4 text-left animate-in fade-in duration-200">
                        <div>
                          <span className="text-[11px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                            HSE Standard Formulation
                          </span>
                          <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 mt-1 leading-relaxed">
                            {currentCard.definition}
                          </p>
                        </div>

                        {/* Key elements breakdown */}
                        {currentCard.keyElements && (
                          <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                              Essential Criteria for Full Marks
                            </span>
                            <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                              {currentCard.keyElements.map((el, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-indigo-500 font-bold mt-0.5">•</span>
                                  <span>{el}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Scenario tip */}
                        <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-900 dark:text-sky-200 flex items-start gap-2">
                          <BrainCircuit className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-bold">Scenario Application Tip: </strong>
                            <span>{currentCard.obeApplicationTip}</span>
                          </div>
                        </div>

                        {/* Examiner warning */}
                        {currentCard.examinerWarning && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold">Common Assessment Trap: </strong>
                              <span>{currentCard.examinerWarning}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Flip Indicator */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5" />
                      {isFlipped ? "Showing Back" : "Showing Front"}
                    </span>
                    <span className="group-hover:text-indigo-500 transition font-medium">
                      Click to flip ↷
                    </span>
                  </div>
                </div>

                {/* Response Rating Buttons (Enabled when flipped) */}
                {isFlipped ? (
                  <div className="space-y-2 pt-1 animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Rate Your Recall (Advances Spaced Repetition)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <button
                        onClick={() => handleRating("again")}
                        className="p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 font-bold text-xs flex flex-col items-center justify-center gap-1 transition"
                      >
                        <span className="text-sm">Again</span>
                        <span className="text-[10px] opacity-75">&lt; 1 Day (Box 1)</span>
                        <span className="text-[9px] px-1 rounded bg-red-500/20 text-red-500 font-mono">Key: 1</span>
                      </button>

                      <button
                        onClick={() => handleRating("hard")}
                        className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs flex flex-col items-center justify-center gap-1 transition"
                      >
                        <span className="text-sm">Hard</span>
                        <span className="text-[10px] opacity-75">~ 1-2 Days</span>
                        <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-500 font-mono">Key: 2</span>
                      </button>

                      <button
                        onClick={() => handleRating("good")}
                        className="p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-bold text-xs flex flex-col items-center justify-center gap-1 transition"
                      >
                        <span className="text-sm">Good</span>
                        <span className="text-[10px] opacity-75">+1 Box (3-7d)</span>
                        <span className="text-[9px] px-1 rounded bg-sky-500/20 text-sky-500 font-mono">Key: 3</span>
                      </button>

                      <button
                        onClick={() => handleRating("easy")}
                        className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex flex-col items-center justify-center gap-1 transition"
                      >
                        <span className="text-sm">Easy</span>
                        <span className="text-[10px] opacity-75">+2 Boxes (14-30d)</span>
                        <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-500 font-mono">Key: 4</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => setIsFlipped(true)}
                      className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition"
                    >
                      Show Answer &amp; Legal Context
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* ================= VIEW MODE 2: ADD CUSTOM FLASHCARD ================= */}
      {viewMode === "add" && (
        <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-500" /> Create Custom HSE Flashcard
              </h2>
              <p className="text-xs text-slate-500">
                Add personal mnemonics, regional statutory terms, or classroom notes to your spaced repetition deck.
              </p>
            </div>
            <button
              onClick={() => setViewMode("overview")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateCustomCard} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Term / Concept Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCard.term}
                  onChange={(e) => setNewCard({ ...newCard, term: e.target.value })}
                  placeholder="e.g. Ergonomic Risk Assessment"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Acronym / Mnemonic (Optional)
                </label>
                <input
                  type="text"
                  value={newCard.acronym}
                  onChange={(e) => setNewCard({ ...newCard, acronym: e.target.value })}
                  placeholder="e.g. TILEO, MAC, RULA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Chapter *
                </label>
                <select
                  value={newCard.elementId}
                  onChange={(e) => setNewCard({ ...newCard, elementId: Number(e.target.value) as ElementId })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>Chapter 1: Why Manage H&amp;S</option>
                  <option value={2}>Chapter 2: Management Systems</option>
                  <option value={3}>Chapter 3: Managing Risk &amp; People</option>
                  <option value={4}>Chapter 4: Monitoring &amp; Measuring</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={newCard.category}
                  onChange={(e) => setNewCard({ ...newCard, category: e.target.value as FlashcardCategory })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="legal-definition">Legal Definition</option>
                  <option value="core-terminology">Core Terminology</option>
                  <option value="ilo-standards">ILO &amp; Standards</option>
                  <option value="management-framework">Management Framework</option>
                  <option value="enforcement">Enforcement &amp; Civil</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topic Tag
                </label>
                <input
                  type="text"
                  value={newCard.topic}
                  onChange={(e) => setNewCard({ ...newCard, topic: e.target.value })}
                  placeholder="e.g. Ergonomics"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Definition / Explanation *
              </label>
              <textarea
                required
                rows={3}
                value={newCard.definition}
                onChange={(e) => setNewCard({ ...newCard, definition: e.target.value })}
                placeholder="The structured definition or criteria required by HSE examiners..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Legal / Statutory Citation (Optional)
                </label>
                <input
                  type="text"
                  value={newCard.legalContext}
                  onChange={(e) => setNewCard({ ...newCard, legalContext: e.target.value })}
                  placeholder="e.g. Health & Safety at Work Act 1974 s.2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Examiner Warning / Common Trap (Optional)
                </label>
                <input
                  type="text"
                  value={newCard.examinerWarning}
                  onChange={(e) => setNewCard({ ...newCard, examinerWarning: e.target.value })}
                  placeholder="e.g. Don't confuse with administrative controls..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Practical Scenario Application Tip
              </label>
              <input
                type="text"
                value={newCard.obeApplicationTip}
                onChange={(e) => setNewCard({ ...newCard, obeApplicationTip: e.target.value })}
                placeholder="How to cite this in a practical scenario assessment..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setViewMode("overview")}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Save &amp; Add to Deck
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= VIEW MODE 3: DECK BROWSER & FILTER ================= */}
      {viewMode === "overview" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search legal definitions, terms, acronyms (e.g. SFARP, Iceberg, C155)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startStudySession(filteredCards, `Custom Filter Drill (${filteredCards.length} Cards)`)}
                  disabled={filteredCards.length === 0}
                  className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Shuffle className="w-3.5 h-3.5" /> Drill Filtered ({filteredCards.length})
                </button>

                <button
                  onClick={handleResetSRS}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  title="Reset spaced repetition intervals"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Element and Category Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Chapters:
              </span>

              <button
                onClick={() => setSelectedElement("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedElement === "all"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                All (4)
              </button>

              {([1, 2, 3, 4] as ElementId[]).map((elId) => (
                <button
                  key={elId}
                  onClick={() => setSelectedElement(selectedElement === elId ? "all" : elId)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                    selectedElement === elId
                      ? ELEMENT_LABELS[elId].color + " font-bold shadow-sm"
                      : "border-transparent bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {ELEMENT_LABELS[elId].short}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

              {/* Status Filter Pills */}
              <button
                onClick={() => setSelectedBoxFilter(selectedBoxFilter === "due" ? "all" : "due")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedBoxFilter === "due"
                    ? "bg-rose-600 text-white font-bold"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                }`}
              >
                Due Today ({dueCards.length})
              </button>

              <button
                onClick={() => setSelectedBoxFilter(selectedBoxFilter === "bookmarked" ? "all" : "bookmarked")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  selectedBoxFilter === "bookmarked"
                    ? "bg-amber-500 text-white font-bold"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                }`}
              >
                <Bookmark className="w-3 h-3" /> Bookmarked
              </button>

              {(selectedElement !== "all" || selectedCategory !== "all" || selectedBoxFilter !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedElement("all");
                    setSelectedCategory("all");
                    setSelectedBoxFilter("all");
                    setSearchQuery("");
                  }}
                  className="ml-auto text-[11px] font-bold text-rose-500 hover:underline"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => {
              const state = srsState[card.id];
              const isDue = isCardDue(state);
              const box = state?.box || 1;

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    setPreviewCard(card);
                    setIsPreviewFlipped(false);
                  }}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-400/50 dark:hover:border-indigo-600/50 transition cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Top Metadata */}
                    <div className="flex items-center justify-between gap-1 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-black border ${
                            ELEMENT_LABELS[card.elementId].color
                          }`}
                        >
                          Ch {card.elementId}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            CATEGORY_LABELS[card.category].color
                          }`}
                        >
                          {CATEGORY_LABELS[card.category].label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isDue && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Due for review today"></span>
                        )}
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                            box >= 4
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : box === 3
                              ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          Box {box}
                        </span>
                        <button
                          onClick={(e) => toggleBookmark(card.id, e)}
                          className="p-1 text-slate-300 hover:text-amber-500 transition"
                        >
                          {state?.bookmarked ? (
                            <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Card Title & Term */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                        {card.term}
                      </h3>
                      {card.acronym && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                          {card.acronym}
                        </span>
                      )}
                    </div>

                    {/* Definition Teaser */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {card.definition}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {state ? (isDue ? "Due now" : `Due in ${state.intervalDays}d`) : "New"}
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                      Inspect <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching flashcards</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No cards matched your current search filters. Try clearing your search query or selecting "All".
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedElement("all");
                  setSelectedCategory("all");
                  setSelectedBoxFilter("all");
                }}
                className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: QUICK INSPECT / FLIP CARD ================= */}
      {previewCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setPreviewCard(null)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex flex-wrap items-center gap-2 pr-8">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${ELEMENT_LABELS[previewCard.elementId].color}`}>
                {ELEMENT_LABELS[previewCard.elementId].name}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${CATEGORY_LABELS[previewCard.category].color}`}>
                {CATEGORY_LABELS[previewCard.category].label}
              </span>
              {previewCard.acronym && (
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {previewCard.acronym}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                {previewCard.term}
              </h3>
              <button
                onClick={(e) => speakTerm(previewCard.term, e)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 transition"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Content body */}
            <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                  HSE Standard Formulation
                </span>
                <p className="font-medium mt-1 leading-relaxed text-slate-900 dark:text-slate-100 text-sm">
                  {previewCard.definition}
                </p>
              </div>

              {previewCard.legalContext && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-2">
                  <Scale className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-purple-900 dark:text-purple-200">Legal Standard: </strong>
                    <span className="text-purple-900/90 dark:text-purple-300">{previewCard.legalContext}</span>
                  </div>
                </div>
              )}

              {previewCard.keyElements && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <strong className="text-[10px] font-bold uppercase text-slate-500 block">Core Marking Criteria:</strong>
                  <ul className="space-y-1">
                    {previewCard.keyElements.map((el, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-start gap-2">
                <BrainCircuit className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-sky-900 dark:text-sky-200">Practical Application: </strong>
                  <span className="text-sky-900/90 dark:text-sky-300">{previewCard.obeApplicationTip}</span>
                </div>
              </div>

              {previewCard.examinerWarning && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-amber-900 dark:text-amber-200">Key Assessment Warning: </strong>
                    <span className="text-amber-900/90 dark:text-amber-300">{previewCard.examinerWarning}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal action bar */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">
                Box {srsState[previewCard.id]?.box || 1} • {srsState[previewCard.id]?.repetitions || 0} reviews
              </span>
              <button
                onClick={() => {
                  setPreviewCard(null);
                  startStudySession([previewCard], `Focus Drill: ${previewCard.term}`);
                }}
                className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Study This Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
