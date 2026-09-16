import React, { useState, useEffect } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import {
  Download,
  CheckCircle2,
  Smartphone,
  Laptop,
  Wifi,
  WifiOff,
  HardDrive,
  ShieldCheck,
  X,
  Share,
  PlusSquare,
  Sparkles,
  ArrowRight,
  Database,
  RefreshCw,
} from "lucide-react";

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PWAInstallModal({ isOpen, onClose }: PWAInstallModalProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [cacheStatus, setCacheStatus] = useState<string>("Checking offline cache...");
  const [cachedAssetsCount, setCachedAssetsCount] = useState<number>(0);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    async function checkCaches() {
      if (typeof window !== "undefined" && "caches" in window) {
        try {
          const keys = await caches.keys();
          let count = 0;
          for (const key of keys) {
            const cache = await caches.open(key);
            const requests = await cache.keys();
            count += requests.length;
          }
          setCachedAssetsCount(count);
          setCacheStatus(keys.length > 0 ? "Active & Cached" : "Pre-caching on first launch");
        } catch {
          setCacheStatus("Local Storage Active");
        }
      } else {
        setCacheStatus("Local Storage Supported");
      }
    }
    if (isOpen) {
      checkCaches();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setInstalling(true);
    await install();
    setInstalling(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Install Web App &amp; Offline Study</h3>
              <p className="text-xs text-emerald-100 font-medium">Instant launch on Desktop, Android &amp; iOS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Status Banner */}
          <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isInstalled
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                }`}
              >
                {isInstalled ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-bold">
                  {isInstalled ? "App Installed as Standalone PWA" : "Ready for Instant Installation"}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isInstalled
                    ? "Running in dedicated borderless window"
                    : "Install to your homescreen or desktop dock"}
                </div>
              </div>
            </div>

            {isInstallable && !isInstalled && (
              <button
                onClick={handleInstallClick}
                disabled={installing}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{installing ? "Installing..." : "Install Now"}</span>
              </button>
            )}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
                <Laptop className="w-3.5 h-3.5" /> Fast Launch
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                One-tap access from your dock, taskbar, or home screen without opening a browser tab.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
                <WifiOff className="w-3.5 h-3.5" /> 100% Offline Study
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Revise flashcards, practice quizzes, and run simulations with zero internet connection.
              </p>
            </div>
          </div>

          {/* Offline Engine Diagnostics */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Database className="w-3.5 h-3.5 text-emerald-500" /> Offline Readiness Status
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                {isOnline ? "Online (Syncing)" : "Offline (Local Storage)"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Cache Strategy:</span> Workbox Precache
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Status:</span> {cacheStatus}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Local Persistence:</span> Automatic
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Network:</span>{" "}
                {isOnline ? "Connected" : "Disconnected (Offline Mode Active)"}
              </div>
            </div>
          </div>

          {/* Device Installation Guides */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              How to Install Across Devices
            </div>

            {/* iOS Safari Guide */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
              <div className="font-bold text-xs flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Smartphone className="w-3.5 h-3.5 text-sky-500" /> iPhone &amp; iPad (Safari)
              </div>
              <ol className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-decimal list-inside leading-relaxed">
                <li>
                  Tap the <strong className="text-slate-800 dark:text-slate-200">Share</strong> icon (
                  <Share className="w-3 h-3 inline text-sky-500" />) at the bottom or top of Safari.
                </li>
                <li>Scroll down the share sheet and select <strong className="text-slate-800 dark:text-slate-200">Add to Home Screen</strong>.</li>
                <li>Tap <strong className="text-slate-800 dark:text-slate-200">Add</strong> in the top-right corner to launch directly.</li>
              </ol>
            </div>

            {/* Chrome, Edge & Android */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
              <div className="font-bold text-xs flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Laptop className="w-3.5 h-3.5 text-emerald-500" /> Chrome, Edge &amp; Android
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Click the <strong className="text-slate-800 dark:text-slate-200">Install</strong> button in your browser address bar or tap the 3 dots menu (<strong className="text-slate-800 dark:text-slate-200">⋮</strong>) and click <strong className="text-slate-800 dark:text-slate-200">Install HSE Portal</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>PWA v1.0.0 &bull; Offline enabled</span>
          </div>

          <div className="flex items-center gap-2">
            {isInstallable && !isInstalled && (
              <button
                onClick={handleInstallClick}
                disabled={installing}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-sm transition flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
