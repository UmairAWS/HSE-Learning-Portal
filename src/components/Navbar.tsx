import React, { useState, useRef, useEffect } from "react";
import { StudentProfile } from "../types";
import {
  Flame,
  Award,
  Moon,
  Sun,
  Bell,
  Cloud,
  ShieldCheck,
  Zap,
  Search,
  ChevronDown,
  PieChart,
  BarChart3,
  MessagesSquare,
  Trophy,
  Layers,
  LayoutDashboard,
  FileCheck2,
  CheckSquare,
  BookMarked,
} from "lucide-react";
import ReaderSettingsPopover from "./ReaderSettingsPopover";

interface NavbarProps {
  profile: StudentProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSync: () => void;
  onOpenNotifications: () => void;
  onOpenGlossary: (initialQuery?: string) => void;
}

export default function Navbar({
  profile,
  activeTab,
  setActiveTab,
  darkMode,
  onToggleDarkMode,
  onOpenSync,
  onOpenNotifications,
  onOpenGlossary,
}: NavbarProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Core study modules (frequent access)
  const primaryNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "simulations", label: "Simulations", icon: Layers },
    { id: "obe", label: "OBE Scenarios", icon: FileCheck2 },
    { id: "quiz", label: "Practice Quiz", icon: CheckSquare },
    { id: "flashcards", label: "Flashcards", icon: BookMarked },
  ];

  // Secondary tools & study features
  const secondaryNavItems = [
    { id: "visuals", label: "Infographics", icon: PieChart, desc: "Hierarchy & models" },
    { id: "analytics", label: "Analytics", icon: BarChart3, desc: "Syllabus readiness" },
    { id: "chat", label: "Study Group", icon: MessagesSquare, desc: "Peer discussions" },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy, desc: "Class rankings" },
  ];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeTab);
  const activeSecondaryItem = secondaryNavItems.find((item) => item.id === activeTab);

  // Close "More" dropdown on click outside or Esc
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsMoreOpen(false);
      }
    }
    if (isMoreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMoreOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 h-12 flex items-center justify-between gap-2">
        {/* Left: Compact Brand Logo */}
        <div
          className="flex items-center gap-2 shrink-0 cursor-pointer group select-none"
          onClick={() => setActiveTab("dashboard")}
          title="Return to Study Dashboard"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
              HSE Portal
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              NEBOSH
            </span>
          </div>
        </div>

        {/* Center: Sleek, Single-Line Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {primaryNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* "More" Dropdown Menu for secondary learning modules */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 border ${
                isSecondaryActive
                  ? "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border-emerald-500/30"
                  : isMoreOpen
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <span>{isSecondaryActive && activeSecondaryItem ? activeSecondaryItem.label : "More"}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 opacity-60 transition-transform ${isMoreOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isMoreOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                  Additional Study Tools
                </div>
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMoreOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center gap-2.5 transition ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                      <div className="truncate">
                        <div className="font-semibold leading-none">{item.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Quick Tools, Reader Settings, Search & Stats */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Integrated Glossary Search Button */}
          <button
            id="nav-glossary-search-btn"
            onClick={() => onOpenGlossary()}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition shadow-2xs group"
            title="Search HSE Glossary & Terminology (⌘K or /)"
          >
            <Search className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-medium text-[11px]">Search</span>
            <kbd className="hidden sm:inline-flex items-center px-1 py-0.2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[9px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Student Reading & Text Format Optimizer Popover */}
          <ReaderSettingsPopover />

          {/* Study Streak Counter */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold shrink-0"
            title={`${profile.streakDays} Day Continuous Study Streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{profile.streakDays}d</span>
          </div>

          {/* XP Pill */}
          <div
            className="hidden xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold"
            title={`${profile.xp} Knowledge XP`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{profile.xp} XP</span>
          </div>

          {/* Quick Frequency Calculator & Tools */}
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open_quick_access", { detail: { panel: "calc" } }))
            }
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-500/20 transition shadow-2xs"
            title="Open Quick Tools & Rate Calculator"
          >
            <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
            <span className="hidden sm:inline text-[11px]">Tools</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block" />

          {/* Utility Icon Group: Cloud Sync, Notifications, Dark Mode */}
          <button
            onClick={onOpenSync}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
            title="Cloud Progress Backup"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 absolute top-1 right-1"></span>
          </button>

          <button
            onClick={onOpenNotifications}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Study Reminders & Exam Deadlines"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
