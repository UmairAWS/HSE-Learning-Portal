import React, { useState } from "react";
import { StudentProfile } from "../types";
import { Bell, Calendar, Clock, CheckCircle2, X, AlertCircle } from "lucide-react";

interface NotificationModalProps {
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (settings: {
    notificationsEnabled: boolean;
    notificationTime: string;
    targetExamDate: string;
  }) => void;
}

export default function NotificationModal({
  profile,
  isOpen,
  onClose,
  onSaveSettings,
}: NotificationModalProps) {
  const [enabled, setEnabled] = useState(profile.notificationsEnabled);
  const [time, setTime] = useState(profile.notificationTime || "19:00");
  const [examDate, setExamDate] = useState(profile.targetExamDate || "2026-11-15");
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  // Calculate days remaining
  const daysUntilExam = Math.max(
    0,
    Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  const handleRequestPermission = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        setEnabled(true);
      }
    } else {
      setEnabled(true);
    }
  };

  const handleSendTestNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("HSE Study Reminder 🔔", {
        body: `Keep your ${profile.streakDays}-day streak burning! Complete today's 10-minute P.E.E. scenario practice.`,
        icon: "/favicon.ico",
      });
    }
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleSave = () => {
    onSaveSettings({
      notificationsEnabled: enabled,
      notificationTime: time,
      targetExamDate: examDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-amber-950 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base">Study Reminders &amp; Deadlines</h3>
              <p className="text-[11px] text-slate-300">Maintain your daily study streak effortlessly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Days until Exam Countdown Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
                Target Exam Date
              </span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {daysUntilExam} Days Left
              </div>
            </div>
            <Calendar className="w-7 h-7 text-amber-500 opacity-80" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                HSE Target Assessment Date:
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Daily Practice Reminder</div>
                <div className="text-[11px] text-slate-500">Alert to protect your study streak</div>
              </div>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => {
                  if (e.target.checked) handleRequestPermission();
                  else setEnabled(false);
                }}
                className="w-5 h-5 accent-rose-500 cursor-pointer"
              />
            </div>

            {enabled && (
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Preferred Practice Reminder Time:
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            )}

            {enabled && (
              <button
                onClick={handleSendTestNotification}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-200 transition text-[11px] flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>{testSent ? "Test Notification Dispatched!" : "Dispatch Test Notification Alert"}</span>
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-sm"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
