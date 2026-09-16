import React, { useState } from "react";
import { StudentProfile, LeaderboardUser } from "../types";
import { Award, Flame, Trophy, CheckCircle, ShieldCheck, Target, FileCheck, DollarSign, GraduationCap } from "lucide-react";

interface LeaderboardViewProps {
  profile: StudentProfile;
}

export default function LeaderboardView({ profile }: LeaderboardViewProps) {
  const [cohortFilter, setCohortFilter] = useState<"global" | "weekly">("global");

  const badgeIconMap: Record<string, any> = {
    GraduationCap,
    Target,
    ShieldAlert: ShieldCheck,
    DollarSign,
    Flame,
    FileCheck,
  };

  const simulatedLeaders: LeaderboardUser[] = [
    {
      rank: 1,
      name: "Ahmed K. (Safety Lead)",
      avatar: "👷‍♂️",
      country: "UAE",
      xp: 2450,
      streak: 19,
      accuracy: 94,
      badgeCount: 6,
    },
    {
      rank: 2,
      name: "Marcus Vance",
      avatar: "👨‍💼",
      country: "UK",
      xp: 1980,
      streak: 14,
      accuracy: 89,
      badgeCount: 5,
    },
    {
      rank: 3,
      name: profile.name ? `${profile.name} (You)` : "You",
      avatar: "🎓",
      country: "Your Region",
      xp: profile.xp,
      streak: profile.streakDays,
      accuracy: 88,
      badgeCount: profile.badges.filter((b) => b.unlockedAt).length,
      isCurrentUser: true,
    },
    {
      rank: 4,
      name: "Elena Rostova",
      avatar: "👩‍🔬",
      country: "Singapore",
      xp: 1420,
      streak: 8,
      accuracy: 85,
      badgeCount: 4,
    },
    {
      rank: 5,
      name: "Sarah Jenkins",
      avatar: "👩‍💼",
      country: "Canada",
      xp: 1150,
      streak: 6,
      accuracy: 81,
      badgeCount: 3,
    },
    {
      rank: 6,
      name: "Tariq Al-Mansoor",
      avatar: "👨‍💻",
      country: "Saudi Arabia",
      xp: 920,
      streak: 4,
      accuracy: 78,
      badgeCount: 3,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Level & XP Banner - Compact & Smart */}
      <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white border border-purple-700/40 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-2xl sm:text-3xl shadow-inner">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                Rank Status: Level {profile.level} Scholar
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {profile.xp} Total Knowledge XP
            </h2>
            <p className="text-xs text-purple-200 mt-0.5">
              Ranked #3 in the HSE Learning Portal Revision League
            </p>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-purple-200">
            <span>Next Rank: Senior Auditor</span>
            <span>{profile.xp % 1000} / 1000 XP</span>
          </div>
          <div className="w-full h-2 bg-purple-950/80 rounded-full overflow-hidden border border-purple-500/30">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${(profile.xp % 1000) / 10}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left: Leaderboard Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-3.5">
          <div className="flex justify-between items-center">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              HSE Portal Leaderboard
            </h3>
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setCohortFilter("global")}
                className={`px-3 py-1 rounded transition ${
                  cohortFilter === "global"
                    ? "bg-white dark:bg-slate-800 text-rose-500 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                All-Time
              </button>
              <button
                onClick={() => setCohortFilter("weekly")}
                className={`px-3 py-1 rounded transition ${
                  cohortFilter === "weekly"
                    ? "bg-white dark:bg-slate-800 text-rose-500 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                This Week
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {simulatedLeaders.map((user) => (
              <div
                key={user.name}
                className={`p-3.5 rounded-xl border transition flex items-center justify-between text-xs ${
                  user.isCurrentUser
                    ? "bg-rose-50/60 dark:bg-rose-950/30 border-rose-500/50 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 text-center font-black ${
                      user.rank === 1
                        ? "text-amber-500 text-sm"
                        : user.rank === 2
                        ? "text-slate-400 text-sm"
                        : user.rank === 3
                        ? "text-amber-700 text-sm"
                        : "text-slate-400"
                    }`}
                  >
                    #{user.rank}
                  </span>
                  <span className="text-xl">{user.avatar}</span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{user.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({user.country})</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                        <Flame className="w-3 h-3 fill-amber-500" /> {user.streak}d streak
                      </span>
                      <span>•</span>
                      <span>{user.accuracy}% accuracy</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-slate-900 dark:text-white text-sm">
                    {user.xp} XP
                  </div>
                  <div className="text-[10px] text-slate-400">{user.badgeCount} Badges</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Unlocked Badges Gallery */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-rose-500" />
              Certificates &amp; Badges
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {profile.badges.filter((b) => b.unlockedAt).length} / {profile.badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {profile.badges.map((badge) => {
              const isUnlocked = !!badge.unlockedAt;
              const IconComponent = badgeIconMap[badge.icon] || Award;

              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border transition flex items-start gap-3 text-xs ${
                    isUnlocked
                      ? "bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/30 text-slate-900 dark:text-white"
                      : "bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60 text-slate-400"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isUnlocked
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                        : "bg-slate-300 dark:bg-slate-700 text-slate-500"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{badge.title}</span>
                      {isUnlocked ? (
                        <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Locked</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
