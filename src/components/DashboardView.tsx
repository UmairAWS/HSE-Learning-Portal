import React from "react";
import { StudentProfile, ElementId } from "../types";
import { NEBOSH_ELEMENTS } from "../data/neboshContent";
import { Flame, Play, Sparkles, BookOpen, Layers, ArrowRight, Shield, RefreshCw, DollarSign, Search, Award, BrainCircuit, Target, Calendar, Smartphone, WifiOff, Download, CheckCircle2 } from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";

interface DashboardViewProps {
  profile: StudentProfile;
  onNavigate: (tab: string, elementId?: ElementId) => void;
  onOpenPwaModal?: () => void;
}

export default function DashboardView({ profile, onNavigate, onOpenPwaModal }: DashboardViewProps) {
  const { isInstalled } = usePWAInstall();
  const daysUntilExam = Math.max(
    0,
    Math.ceil((new Date(profile.targetExamDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  const elementIcons: Record<ElementId, any> = {
    1: DollarSign,
    2: RefreshCw,
    3: Shield,
    4: Search,
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Optimized Compact Mission Control Hero Banner */}
      <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white border border-emerald-800/40 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            {/* Top Badge Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                HSE Professional Core Curriculum
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                <Flame className="w-3 h-3 fill-amber-400" /> {profile.streakDays} Day Study Streak
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              {profile.name ? `Welcome back, ${profile.name}!` : "Welcome to HSE Learning Portal"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Target assessment date is in <strong className="text-white">{daysUntilExam} days</strong>. Focus today on mastering the <strong>P.E.E. framework</strong> (Point, Evidence, Explanation) and exploring our 4 core chapter simulations.
            </p>

            {/* Compact Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1.5">
              <button
                onClick={() => onNavigate("flashcards")}
                className="py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                Spaced Repetition
              </button>
              <button
                onClick={() => onNavigate("simulations")}
                className="py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <Layers className="w-3.5 h-3.5" />
                Chapter Simulations
              </button>
              <button
                onClick={() => onNavigate("obe")}
                className="py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center gap-1.5 backdrop-blur transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Scenario Lab
              </button>
            </div>
          </div>

          {/* Quick Metrics Pod */}
          <div className="w-full md:w-auto shrink-0 grid grid-cols-3 md:flex md:flex-col gap-1.5 sm:gap-2 pt-2.5 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-5">
            <div className="p-1.5 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-center md:text-left">
              <span className="block text-[9px] sm:text-[10px] text-slate-400 font-medium truncate">Days to Exam</span>
              <span className="text-xs sm:text-base md:text-lg font-extrabold text-white flex items-center justify-center md:justify-start gap-1">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" /> {daysUntilExam}d
              </span>
            </div>
            <div className="p-1.5 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-center md:text-left">
              <span className="block text-[9px] sm:text-[10px] text-slate-400 font-medium truncate">Study Streak</span>
              <span className="text-xs sm:text-base md:text-lg font-extrabold text-amber-400 flex items-center justify-center md:justify-start gap-1">
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" /> {profile.streakDays}d
              </span>
            </div>
            <div className="p-1.5 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-center md:text-left">
              <span className="block text-[9px] sm:text-[10px] text-slate-400 font-medium truncate">Knowledge XP</span>
              <span className="text-xs sm:text-base md:text-lg font-extrabold text-purple-400 flex items-center justify-center md:justify-start gap-1">
                <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {profile.xp}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500 via-teal-600 to-transparent pointer-events-none"></div>
      </div>

      {/* 4 Main Action Cards - Compact & Smart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div
          onClick={() => onNavigate("flashcards")}
          className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
              Spaced Repetition
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              32+ statutory definitions, SFARP tests, and ILO conventions using Leitner 5-box memory intervals.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
            Practice Deck <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("quiz")}
          className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500 transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
              <Play className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
              Rapid Revision Quiz
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Multiple-choice drills across all 4 chapters with instant statutory citations and rationales.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
            Start Drill <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("obe")}
          className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:border-sky-400 dark:hover:border-sky-500 transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition">
              Case Scenario Lab
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Workplace case studies. Submit structured P.E.E. answers for automated rubric grading &amp; feedback.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
            Enter Lab <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("simulations")}
          className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:border-teal-400 dark:hover:border-teal-500 transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition">
              4-Chapter Sims
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              10:1 Uninsured Loss Iceberg, SMART Policy Builder, 5x5 Matrix, and 5 Whys Engine.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
            Launch Sims <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Instant Web App Access & 100% Offline Study Banner */}
      <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-800/50 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                Web App (PWA) &amp; Offline Study Available
              </span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                {isInstalled ? "Installed" : "Instant Access"}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
              Launch directly from your desktop dock or phone home screen. Flashcards, quizzes, and 4-chapter simulations run 100% offline.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPwaModal}
          className="w-full sm:w-auto justify-center px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 shrink-0"
        >
          {isInstalled ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          <span>{isInstalled ? "Offline Hub" : "Install App"}</span>
        </button>
      </div>

      {/* Syllabus Element Chapters Grid */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Core Health &amp; Safety Management Chapters
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Master the four foundational chapters evaluated across international HSE frameworks
            </p>
          </div>
          <button
            onClick={() => onNavigate("analytics")}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline self-start sm:self-auto"
          >
            View Mastery Analytics &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {NEBOSH_ELEMENTS.map((el) => {
            const Icon = elementIcons[el.id] || Shield;

            return (
              <div
                key={el.id}
                className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 transition space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                        Chapter {el.id}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {el.shortTitle}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 shrink-0">
                    {el.topics.length} Topics
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {el.description}
                </p>

                {/* Subtopic tags */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {el.topics.slice(0, 4).map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                  {el.topics.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 font-medium">
                      +{el.topics.length - 4} more
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">Interactive Simulator</span>
                  <button
                    onClick={() => onNavigate("simulations", el.id)}
                    className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Open Simulator &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
