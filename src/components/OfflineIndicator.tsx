import React, { useState } from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { WifiOff, CheckCircle2, ShieldCheck, X } from "lucide-react";

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  // If online, don't show offline bar
  if (isOnline || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-3 duration-300">
      <div className="bg-amber-600/95 dark:bg-amber-700/95 text-white backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl border border-amber-400/40 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-lg bg-black/20 shrink-0">
            <WifiOff className="w-4 h-4 text-amber-100 animate-pulse" />
          </div>
          <div>
            <div className="font-bold flex items-center gap-1.5 leading-none">
              <span>Offline Study Mode</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
            </div>
            <p className="text-[11px] text-amber-100 mt-0.5 leading-tight">
              All simulations, practice quizzes, flashcards &amp; P.E.E. guides are cached and fully active.
            </p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-amber-200 hover:text-white rounded-md hover:bg-white/10 transition shrink-0"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
