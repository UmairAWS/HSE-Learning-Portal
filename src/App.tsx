import React, { useState, useEffect } from "react";
import { StudentProfile, ElementId } from "./types";
import { INITIAL_BADGES } from "./data/neboshContent";
import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";
import DashboardView from "./components/DashboardView";
import SimulationsHub from "./components/SimulationsHub";
import OBEExamSimulator from "./components/OBEExamSimulator";
import QuizView from "./components/QuizView";
import FlashcardsView from "./components/FlashcardsView";
import VisualDiagrams from "./components/VisualDiagrams";
import AnalyticsView from "./components/AnalyticsView";
import StudyGroupChat from "./components/StudyGroupChat";
import LeaderboardView from "./components/LeaderboardView";
import CloudSyncModal from "./components/CloudSyncModal";
import NotificationModal from "./components/NotificationModal";
import GlossaryModal from "./components/GlossaryModal";
import QuickAccessBar from "./components/QuickAccessBar";
import OfflineIndicator from "./components/OfflineIndicator";
import PWAInstallModal from "./components/PWAInstallModal";
import { Layers, FileCheck, CheckSquare, BarChart3, MessageSquare, Trophy, Eye, X, BookOpen, BrainCircuit, Search, Download, Calculator, Bell, Cloud, Edit3 } from "lucide-react";
import { ReaderProvider } from "./context/ReaderContext";


const INITIAL_PROFILE: StudentProfile = {
  name: "Alex Mercer",
  title: "Candidate Safety Officer",
  xp: 780,
  level: 2,
  streakDays: 7,
  lastActiveDate: new Date().toISOString().split("T")[0],
  targetExamDate: "2026-11-15",
  notificationsEnabled: true,
  notificationTime: "19:00",
  syncCode: "NEB-784",
  completedQuestionIds: ["q_el1_1", "q_el3_1"],
  bookmarkedQuestionIds: ["q_el2_1"],
  weakTopics: ["Hierarchy of Control", "Iceberg Ratio"],
  attempts: [
    {
      id: "att_1",
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      type: "quiz",
      score: 8,
      totalPossible: 10,
      timeSpentSeconds: 240,
      verdict: "Pass",
      elementBreakdown: {
        1: { correct: 3, total: 3 },
        2: { correct: 2, total: 3 },
        3: { correct: 2, total: 2 },
        4: { correct: 1, total: 2 },
      },
    },
    {
      id: "att_2",
      date: new Date(Date.now() - 86400000).toISOString(),
      type: "quiz",
      score: 9,
      totalPossible: 10,
      timeSpentSeconds: 195,
      verdict: "Distinction",
      elementBreakdown: {
        1: { correct: 2, total: 2 },
        2: { correct: 3, total: 3 },
        3: { correct: 2, total: 3 },
        4: { correct: 2, total: 2 },
      },
    },
  ],
  badges: INITIAL_BADGES,
};

export default function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("nebosh_theme");
    return saved ? saved === "dark" : true; // default to dark theme for study contrast
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("nebosh_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("nebosh_theme", "light");
    }
  }, [darkMode]);

  // Profile state with local storage persistence
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem("nebosh_student_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved profile", e);
      }
    }
    return INITIAL_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem("nebosh_student_profile", JSON.stringify(profile));
  }, [profile]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedChapterSimulation, setSelectedChapterSimulation] = useState<ElementId>(1);
  const [selectedSimulationSubTab, setSelectedSimulationSubTab] = useState<string | undefined>(undefined);

  // Navigation with chapter and subtab support
  const handleNavigate = (tab: string, chapterId?: ElementId, subTab?: string) => {
    if (chapterId) {
      setSelectedChapterSimulation(chapterId);
    }
    setSelectedSimulationSubTab(subTab);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Modals
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState<boolean>(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [glossaryQuery, setGlossaryQuery] = useState<string>("");

  const handleOpenGlossary = (initialQuery?: string) => {
    if (initialQuery !== undefined) {
      setGlossaryQuery(initialQuery);
    }
    setIsGlossaryOpen(true);
  };

  // Keyboard shortcut for quick glossary search (Cmd+K / Ctrl+K, or slash when not typing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          (activeEl as HTMLElement).isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsGlossaryOpen((prev) => !prev);
      } else if (e.key === "/" && !isTyping) {
        e.preventDefault();
        setIsGlossaryOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen for global open_glossary custom events
  useEffect(() => {
    const handleOpenGlossaryEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ query?: string }>;
      if (customEvent.detail?.query) {
        setGlossaryQuery(customEvent.detail.query);
      }
      setIsGlossaryOpen(true);
    };
    window.addEventListener("open_glossary", handleOpenGlossaryEvent);
    return () => window.removeEventListener("open_glossary", handleOpenGlossaryEvent);
  }, []);


  // Bookmark toggle
  const handleToggleBookmark = (questionId: string) => {
    setProfile((prev) => {
      const exists = prev.bookmarkedQuestionIds.includes(questionId);
      const updated = exists
        ? prev.bookmarkedQuestionIds.filter((id) => id !== questionId)
        : [...prev.bookmarkedQuestionIds, questionId];
      return { ...prev, bookmarkedQuestionIds: updated };
    });
  };

  // Question completed
  const handleQuestionCompleted = (questionId: string, isCorrect: boolean, elementId: ElementId) => {
    setProfile((prev) => {
      const completedSet = new Set(prev.completedQuestionIds);
      completedSet.add(questionId);

      const xpGain = isCorrect ? 25 : 10;
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / 500) + 1;

      // Check badges
      const updatedBadges = prev.badges.map((b) => {
        if (b.id === "badge_quiz_master" && completedSet.size >= 5 && !b.unlockedAt) {
          return { ...b, unlockedAt: new Date().toISOString() };
        }
        if (b.id === "badge_el3_risk" && elementId === 3 && isCorrect && !b.unlockedAt) {
          return { ...b, unlockedAt: new Date().toISOString() };
        }
        return b;
      });

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedQuestionIds: Array.from(completedSet),
        badges: updatedBadges,
      };
    });
  };

  const handleAwardXP = (amount: number, reason: string) => {
    setProfile((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 500) + 1;
      const reviewedCount = (prev.flashcardsReviewedCount || 0) + 1;

      const updatedBadges = prev.badges.map((b) => {
        if (b.id === "badge_flashcard_srs" && reviewedCount >= 10 && !b.unlockedAt) {
          return { ...b, unlockedAt: new Date().toISOString() };
        }
        return b;
      });

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        flashcardsReviewedCount: reviewedCount,
        badges: updatedBadges,
      };
    });
  };

  const handleUpdateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
  };

  const handleSaveNotificationSettings = (settings: {
    notificationsEnabled: boolean;
    notificationTime: string;
    targetExamDate: string;
  }) => {
    setProfile((prev) => ({
      ...prev,
      notificationsEnabled: settings.notificationsEnabled,
      notificationTime: settings.notificationTime,
      targetExamDate: settings.targetExamDate,
    }));
  };

  return (
    <ReaderProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors overflow-x-hidden w-full max-w-full">
        {/* Top Navigation */}
        <Navbar
          profile={profile}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onOpenSync={() => setIsSyncModalOpen(true)}
          onOpenNotifications={() => setIsNotificationModalOpen(true)}
          onOpenGlossary={handleOpenGlossary}
        />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-12">
        {activeTab === "dashboard" && (
          <DashboardView
            profile={profile}
            onNavigate={(tab) => handleNavigate(tab)}
            onOpenPwaModal={() => setIsPwaModalOpen(true)}
          />
        )}

        {activeTab === "simulations" && (
          <SimulationsHub
            initialChapterId={selectedChapterSimulation}
            initialSubTab={selectedSimulationSubTab}
          />
        )}

        {activeTab === "obe" && <OBEExamSimulator />}

        {activeTab === "quiz" && (
          <QuizView
            onQuestionCompleted={handleQuestionCompleted}
            bookmarkedIds={profile.bookmarkedQuestionIds}
            onToggleBookmark={handleToggleBookmark}
            onNavigateToFlashcards={() => handleNavigate("flashcards")}
          />
        )}

        {activeTab === "flashcards" && (
          <FlashcardsView
            onAwardXP={handleAwardXP}
            onNavigateTab={(tab) => handleNavigate(tab)}
          />
        )}

        {activeTab === "visuals" && <VisualDiagrams />}

        {activeTab === "analytics" && (
          <AnalyticsView
            profile={profile}
            onNavigateToElement={(elId) => handleNavigate("simulations", elId)}
          />
        )}

        {activeTab === "chat" && <StudyGroupChat profile={profile} />}

        {activeTab === "leaderboard" && <LeaderboardView profile={profile} />}
      </main>

      {/* Persistent Right-Side Quick Access Bar */}
      <QuickAccessBar
        activeTab={activeTab}
        onNavigate={handleNavigate}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Occupational Health, Safety &amp; Environment Curriculum Aligned</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>P.E.E. Assessment Framework</span>
            <span>•</span>
            <span>ILO-OSH 2001 &amp; ISO 45001 Standards</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenMore={() => setIsMobileMoreOpen(true)}
      />

      {/* Mobile "More" Drawer Modal */}
      {isMobileMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex flex-col justify-end animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3.5 max-h-[85vh] overflow-y-auto pb-safe">
            {/* Drawer Drag Indicator & Header */}
            <div className="flex flex-col items-center gap-1.5 pb-2">
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>

            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">All Study Modules &amp; Tools</h3>
                <p className="text-[11px] text-slate-400">Everything accessible in one unified hub</p>
              </div>
              <button
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 text-xs">
              {/* Quick Frequency Formulas & Calculator */}
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  window.dispatchEvent(new CustomEvent("open_quick_access", { detail: { panel: "calc" } }));
                }}
                className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 font-bold flex items-center gap-2.5 text-left col-span-2 text-emerald-700 dark:text-emerald-300 active:scale-[0.98] transition"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold leading-tight">Quick Formulas &amp; Rate Calculator</div>
                  <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-normal">
                    AFR, AIR, Iceberg 10:1 ratio &amp; cost calculator
                  </div>
                </div>
              </button>

              {/* Glossary Search */}
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  handleOpenGlossary();
                }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-bold flex items-center gap-2 text-left active:scale-[0.98] transition"
              >
                <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold">HSE Glossary</div>
                  <div className="text-[10px] text-slate-400 font-normal">Terms &amp; statutory rules</div>
                </div>
              </button>

              {/* Revision Scratchpad */}
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  window.dispatchEvent(new CustomEvent("open_quick_access", { detail: { panel: "notes" } }));
                }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-bold flex items-center gap-2 text-left active:scale-[0.98] transition"
              >
                <Edit3 className="w-4 h-4 text-purple-500 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold">Study Notes</div>
                  <div className="text-[10px] text-slate-400 font-normal">Scratchpad &amp; summary</div>
                </div>
              </button>

              {/* Spaced-Repetition Flashcards */}
              <button
                onClick={() => {
                  setActiveTab("flashcards");
                  setIsMobileMoreOpen(false);
                }}
                className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 font-bold flex items-center gap-2.5 text-left col-span-2 text-indigo-700 dark:text-indigo-300 active:scale-[0.98] transition"
              >
                <BrainCircuit className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <div className="font-bold leading-tight">Spaced-Repetition Flashcards</div>
                  <div className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 font-normal">Leitner 5-box statutory definitions</div>
                </div>
              </button>

              {/* Infographics */}
              <button
                onClick={() => {
                  setActiveTab("visuals");
                  setIsMobileMoreOpen(false);
                }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-bold flex items-center gap-2 text-left active:scale-[0.98] transition"
              >
                <Eye className="w-4 h-4 text-rose-500 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold">Infographics</div>
                  <div className="text-[10px] text-slate-400 font-normal">Hierarchy &amp; models</div>
                </div>
              </button>

              {/* Analytics */}
              <button
                onClick={() => {
                  setActiveTab("analytics");
                  setIsMobileMoreOpen(false);
                }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-bold flex items-center gap-2 text-left active:scale-[0.98] transition"
              >
                <BarChart3 className="w-4 h-4 text-sky-500 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold">Analytics</div>
                  <div className="text-[10px] text-slate-400 font-normal">Mastery &amp; readiness</div>
                </div>
              </button>

              {/* Study Group */}
              <button
                onClick={() => {
                  setActiveTab("chat");
                  setIsMobileMoreOpen(false);
                }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-bold flex items-center gap-2 text-left active:scale-[0.98] transition"
              >
                <MessageSquare className="w-4 h-4 text-purple-500 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold">Study Group</div>
                  <div className="text-[10px] text-slate-400 font-normal">Peer discussions</div>
                </div>
              </button>

              {/* Leaderboard */}
              <button
                onClick={() => {
                  setActiveTab("leaderboard");
                  setIsMobileMoreOpen(false);
                }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-bold flex items-center gap-2 text-left active:scale-[0.98] transition"
              >
                <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold">Leaderboard</div>
                  <div className="text-[10px] text-slate-400 font-normal">Class rankings</div>
                </div>
              </button>

              {/* Cloud Backup & Progress Sync */}
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  setIsSyncModalOpen(true);
                }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-bold flex items-center gap-2 text-left active:scale-[0.98] transition"
              >
                <Cloud className="w-4 h-4 text-sky-500 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold">Cloud Sync</div>
                  <div className="text-[10px] text-slate-400 font-normal">Progress backup</div>
                </div>
              </button>

              {/* Study Reminders */}
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  setIsNotificationModalOpen(true);
                }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-bold flex items-center gap-2 text-left active:scale-[0.98] transition"
              >
                <Bell className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold">Reminders</div>
                  <div className="text-[10px] text-slate-400 font-normal">Exam target schedule</div>
                </div>
              </button>

              {/* Install PWA */}
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  setIsPwaModalOpen(true);
                }}
                className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2.5 text-left col-span-2 active:scale-[0.98] transition"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold leading-tight">Install Web App (100% Offline Study Mode)</div>
                  <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-normal">
                    Add to phone home screen or desktop dock
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Mode Active Banner */}
      <OfflineIndicator />

      {/* PWA & Offline Hub Modal */}
      <PWAInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />

      {/* Cloud Sync Modal */}
      <CloudSyncModal
        profile={profile}
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Notification Modal */}
      <NotificationModal
        profile={profile}
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onSaveSettings={handleSaveNotificationSettings}
      />

        {/* Integrated Search-Based HSE Glossary Modal */}
        <GlossaryModal
          isOpen={isGlossaryOpen}
          onClose={() => setIsGlossaryOpen(false)}
          initialSearchQuery={glossaryQuery}
          onNavigateToChapter={(chapterId, subTab) => handleNavigate("simulations", chapterId, subTab)}
          onNavigateTab={handleNavigate}
        />
      </div>
    </ReaderProvider>
  );
}
