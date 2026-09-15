import React from "react";
import { StudentProfile, ElementId } from "../types";
import { NEBOSH_ELEMENTS } from "../data/neboshContent";
import { TrendingUp, Award, Flame, AlertCircle, CheckCircle, Clock, Target, ArrowRight } from "lucide-react";

interface AnalyticsViewProps {
  profile: StudentProfile;
  onNavigateToElement: (elementId: ElementId) => void;
}

export default function AnalyticsView({ profile, onNavigateToElement }: AnalyticsViewProps) {
  // Compute element stats based on attempts
  const elementStats: Record<ElementId, { correct: number; total: number }> = {
    1: { correct: 0, total: 0 },
    2: { correct: 0, total: 0 },
    3: { correct: 0, total: 0 },
    4: { correct: 0, total: 0 },
  };

  profile.attempts.forEach((att) => {
    (Object.keys(att.elementBreakdown) as unknown as ElementId[]).forEach((el) => {
      elementStats[el].correct += att.elementBreakdown[el]?.correct || 0;
      elementStats[el].total += att.elementBreakdown[el]?.total || 0;
    });
  });

  // Calculate overall readiness score (0-100%)
  const totalCorrect = Object.values(elementStats).reduce((acc, curr) => acc + curr.correct, 0);
  const totalQuestions = Object.values(elementStats).reduce((acc, curr) => acc + curr.total, 0);

  const baselineReadiness = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 65;
  const readinessScore = Math.min(100, Math.max(20, baselineReadiness + Math.min(15, profile.streakDays * 2)));

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Stat Cards - Compact & Smart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {/* Readiness Gauge */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-3.5">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={readinessScore >= 75 ? "text-emerald-500" : readinessScore >= 45 ? "text-sky-500" : "text-amber-500"}
                strokeDasharray={`${readinessScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-slate-900 dark:text-white">
              {readinessScore}%
            </span>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              HSE Readiness
            </div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-0.5">
              {readinessScore >= 75 ? "Distinction Potential" : readinessScore >= 45 ? "Competent Grade" : "Needs Revision"}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Threshold: 45%</p>
          </div>
        </div>

        {/* Study Streak */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Active Streak
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {profile.streakDays} Days
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Daily practice active</p>
          </div>
        </div>

        {/* Total XP */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Knowledge XP
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {profile.xp} XP
            </div>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Level {profile.level} Scholar</p>
          </div>
        </div>

        {/* Questions Completed */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Completed Tasks
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {profile.completedQuestionIds.length} Items
            </div>
            <p className="text-[11px] text-slate-500">Across 4 Chapters</p>
          </div>
        </div>
      </div>

      {/* Element Mastery Progress Bars */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Chapter-by-Chapter Mastery Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target a minimum of 45% in every chapter to ensure balanced competency across all safety areas.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full self-start sm:self-auto border border-emerald-500/20">
            HSE Competency Standard
          </span>
        </div>

        <div className="space-y-4">
          {NEBOSH_ELEMENTS.map((el) => {
            const stats = elementStats[el.id];
            const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 60 + el.id * 5;

            return (
              <div key={el.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Chapter {el.id}: {el.shortTitle}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500">
                      {stats.total > 0 ? `${stats.correct}/${stats.total} correct` : "Estimated"}
                    </span>
                    <span
                      className={`font-bold ${
                        pct >= 70 ? "text-emerald-500" : pct >= 45 ? "text-sky-500" : "text-rose-500"
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 70 ? "bg-emerald-500" : pct >= 45 ? "bg-sky-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weakest Topics & Recommendations Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Weakest Topics Identified for Revision
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Based on recent quiz attempts and practical scenario evaluations, these areas require extra focus:
          </p>

          <div className="space-y-2.5">
            {[
              {
                topic: "Hierarchy of Risk Control (5 Tiers)",
                elementId: 3 as ElementId,
                desc: "Ensure you justify why engineering controls are superior to PPE in scenario evaluations.",
              },
              {
                topic: "The Uninsured Cost Iceberg (10:1 Ratio)",
                elementId: 1 as ElementId,
                desc: "Clarify uninsurable criminal fines versus compensable civil claims.",
              },
              {
                topic: "Audits vs. Inspections (Strategic vs. Operational)",
                elementId: 4 as ElementId,
                desc: "Don't confuse checking fire extinguisher tags with auditing the overall SMS.",
              },
            ].map((weak, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    {weak.topic}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {weak.desc}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToElement(weak.elementId)}
                  className="py-1 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shrink-0 transition flex items-center gap-1"
                >
                  Revise <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Study Action Plan */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Personalized Daily Revision Roadmap
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Optimal 20-minute daily micro-study sessions to maximize memory consolidation:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Chapter 3: 5x5 Matrix Simulator</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600">5 Mins</span>
            </div>

            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Case Study: Reversing Vehicle (10 Marks)</span>
              </div>
              <span className="text-[10px] font-bold text-sky-600">10 Mins</span>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Study Group Discussion with Dr. Phelpstead</span>
              </div>
              <span className="text-[10px] font-bold text-purple-600">5 Mins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
