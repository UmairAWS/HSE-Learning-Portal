import React, { useState } from "react";
import { StudentProfile } from "../types";
import { Cloud, CloudUpload, CloudDownload, Download, Upload, CheckCircle2, Copy, X, Loader2, Key } from "lucide-react";

interface CloudSyncModalProps {
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (newProfile: StudentProfile) => void;
}

export default function CloudSyncModal({
  profile,
  isOpen,
  onClose,
  onUpdateProfile,
}: CloudSyncModalProps) {
  const [syncInputCode, setSyncInputCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloudSave = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/sync/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          syncCode: profile.syncCode,
          data: profile,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Study profile successfully saved to cloud sync!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save to cloud sync." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Network error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloudRestore = async () => {
    if (!syncInputCode.trim()) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/sync/load/${syncInputCode.trim().toUpperCase()}`);
      const data = await res.json();
      if (res.ok && data.data) {
        onUpdateProfile(data.data);
        setMessage({ type: "success", text: `Profile restored! Last updated: ${new Date(data.updatedAt).toLocaleString()}` });
      } else {
        setMessage({ type: "error", text: data.error || "Sync code not found." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Network error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(profile, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hse-learning-portal-progress-${profile.syncCode}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && imported.syncCode) {
          onUpdateProfile(imported);
          setMessage({ type: "success", text: "Successfully imported progress file!" });
        } else {
          setMessage({ type: "error", text: "Invalid profile backup format." });
        }
      } catch (err) {
        setMessage({ type: "error", text: "Failed to read JSON file." });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base">Cross-Platform Cloud Sync</h3>
              <p className="text-[11px] text-slate-300">Sync between phone, tablet, and laptop</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {message && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-200"
                  : "bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-800 dark:text-rose-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <X className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Current Sync Code */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Your Personal Sync Passkey
            </span>
            <div className="flex items-center justify-between gap-2">
              <div className="font-mono text-xl md:text-2xl font-black text-rose-600 dark:text-rose-400 tracking-widest">
                {profile.syncCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 hover:border-rose-400 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Use this key to load your streaks, XP, and test records on your mobile or another device.
            </p>
          </div>

          {/* Cloud Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCloudSave}
              disabled={isLoading}
              className="p-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
              Save Progress Now
            </button>
            <button
              onClick={handleExportJSON}
              className="p-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2 hover:border-slate-400 transition shadow-sm"
            >
              <Download className="w-4 h-4 text-sky-500" />
              Download JSON
            </button>
          </div>

          {/* Restore / Load by Code */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
            <label className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
              Load from Sync Code or Other Device:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={syncInputCode}
                onChange={(e) => setSyncInputCode(e.target.value.toUpperCase())}
                placeholder="e.g. NEB-842"
                className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-mono tracking-wider text-slate-900 dark:text-white uppercase"
              />
              <button
                onClick={handleCloudRestore}
                disabled={isLoading || !syncInputCode.trim()}
                className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs disabled:opacity-40 transition flex items-center gap-1.5"
              >
                <CloudDownload className="w-4 h-4" />
                Restore
              </button>
            </div>
          </div>

          {/* Offline JSON upload */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Offline file restore:</span>
            <label className="cursor-pointer font-bold text-sky-500 hover:underline flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Select Backup JSON
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
