import React, { useState, useRef, useEffect } from "react";
import { useReaderSettings, ReaderFontSize, ReaderFontFamily, ReaderLineSpacing } from "../context/ReaderContext";
import { SlidersHorizontal, Check, RotateCcw, X, Sparkles, BookOpenText } from "lucide-react";

interface ReaderSettingsPopoverProps {
  buttonClassName?: string;
}

export default function ReaderSettingsPopover({ buttonClassName }: ReaderSettingsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const {
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    lineSpacing,
    setLineSpacing,
    highlightKeyTerms,
    setHighlightKeyTerms,
    resetSettings,
  } = useReaderSettings();

  // Close on click outside or Esc
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Trigger Button - Compact & Clean */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={
          buttonClassName ||
          `flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition border ${
            isOpen
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80"
          }`
        }
        title="Adjust text size, font family & reading format"
        aria-label="Reading & text format settings"
      >
        <span className="font-extrabold text-[11px] tracking-tight">Aa</span>
        <span className="hidden xl:inline text-[11px]">Format</span>
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 space-y-3.5 text-slate-900 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-1.5">
              <BookOpenText className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Text &amp; Reading Format
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Text Size Controls */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span>Text Size</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px]">
                {fontSize === "normal" ? "Normal (15px)" : fontSize === "large" ? "Large (17px)" : "X-Large (19px)"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: "normal", label: "A", sub: "100%" },
                  { id: "large", label: "A+", sub: "112%" },
                  { id: "xlarge", label: "A++", sub: "125%" },
                ] as const
              ).map((size) => (
                <button
                  key={size.id}
                  onClick={() => setFontSize(size.id as ReaderFontSize)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition flex flex-col items-center justify-center ${
                    fontSize === size.id
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 ring-1 ring-emerald-500/30"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{size.label}</span>
                  <span className="text-[9px] font-normal opacity-70">{size.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Typeface Preference */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Reading Typeface
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setFontFamily("study")}
                className={`p-2 rounded-xl text-left border transition text-xs ${
                  fontFamily === "study"
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold ring-1 ring-emerald-500/30"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">Lexend</span>
                  {fontFamily === "study" && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                  High-legibility study font
                </p>
              </button>

              <button
                onClick={() => setFontFamily("sans")}
                className={`p-2 rounded-xl text-left border transition text-xs ${
                  fontFamily === "sans"
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold ring-1 ring-emerald-500/30"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">Plus Jakarta</span>
                  {fontFamily === "sans" && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                  Clean modern geometric
                </p>
              </button>
            </div>
          </div>

          {/* Line Spacing */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Line Spacing (Leading)
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setLineSpacing("normal")}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition ${
                  lineSpacing === "normal"
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold ring-1 ring-emerald-500/30"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                }`}
              >
                Standard (1.5)
              </button>
              <button
                onClick={() => setLineSpacing("relaxed")}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition ${
                  lineSpacing === "relaxed"
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold ring-1 ring-emerald-500/30"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                }`}
              >
                Spacious (1.75)
              </button>
            </div>
          </div>

          {/* Scenario Smart Fact Highlighter Toggle */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Highlight Key Evidence</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Marks hazards &amp; facts in scenario stories
              </p>
            </div>
            <button
              onClick={() => setHighlightKeyTerms(!highlightKeyTerms)}
              className={`w-9 h-5 rounded-full transition p-0.5 ${
                highlightKeyTerms ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition transform ${
                  highlightKeyTerms ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Reset Action */}
          <div className="pt-1 flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Settings auto-save</span>
            <button
              onClick={resetSettings}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
