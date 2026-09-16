import React, { useState } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { Download, Check, Smartphone, Sparkles } from "lucide-react";
import PWAInstallModal from "./PWAInstallModal";

interface PWAInstallButtonProps {
  variant?: "nav" | "banner" | "compact";
  className?: string;
}

export default function PWAInstallButton({ variant = "nav", className = "" }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  if (variant === "compact") {
    return (
      <>
        <button
          onClick={handleClick}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition border ${
            isInstalled
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-2xs"
          } ${className}`}
          title={isInstalled ? "PWA Installed & Offline Ready" : "Install HSE Learning Portal as Web App"}
        >
          {isInstalled ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          <span>{isInstalled ? "Installed" : "Install App"}</span>
        </button>
        <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
          isInstalled
            ? "bg-slate-100/90 dark:bg-slate-800/80 text-emerald-600 dark:text-emerald-400 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200/80"
            : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-emerald-500/30 shadow-xs"
        } ${className}`}
        title={isInstalled ? "Web App Installed (Offline Ready)" : "Install App to Desktop / Home Screen for Instant & Offline Access"}
      >
        {isInstalled ? (
          <Check className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <Download className="w-3.5 h-3.5 text-white animate-bounce-subtle" />
        )}
        <span className="hidden sm:inline font-bold">
          {isInstalled ? "App Installed" : "Install App"}
        </span>
        <span className="sm:hidden font-bold">
          {isInstalled ? "PWA" : "Install"}
        </span>
      </button>

      <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
