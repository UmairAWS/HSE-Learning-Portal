import React, { useState, useEffect } from "react";
import { ElementId } from "../types";
import {
  Calculator,
  History,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  X,
  RotateCcw,
  ExternalLink,
  Shield,
  Search,
  Sparkles,
  Layers,
  FileText,
  BrainCircuit,
  DollarSign,
  TrendingDown,
  Info,
  Copy,
  Check,
  Zap,
  Edit3,
  Scale,
  Building2,
  BookOpen,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";


export interface QuickHistoryItem {
  id: string;
  title: string;
  subtitle: string;
  tab: string;
  chapterId?: ElementId;
  subTab?: string;
  timestamp: number;
  iconType: "calc" | "sim" | "quiz" | "flashcards" | "obe" | "diagram";
}

interface QuickAccessBarProps {
  activeTab: string;
  onNavigate: (tab: string, chapterId?: ElementId, subTab?: string) => void;
}

export default function QuickAccessBar({ activeTab, onNavigate }: QuickAccessBarProps) {
  // Sidebar expanded / collapsed state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activePanel, setActivePanel] = useState<"calc" | "history" | "shortcuts" | "notes">("calc");

  // Calculator Mode: AFR (Frequency Rate), Incidence Rate, or Severity Rate
  const [calcType, setCalcType] = useState<"afr" | "incidence" | "severity" | "uninsured">("afr");

  // AFR inputs
  const [injuries, setInjuries] = useState<number>(3);
  const [hoursWorked, setHoursWorked] = useState<number>(1200000);
  const [multiplier, setMultiplier] = useState<number>(1000000); // 1,000,000 or 100,000

  // Incidence Rate inputs
  const [incidenceInjuries, setIncidenceInjuries] = useState<number>(4);
  const [employees, setEmployees] = useState<number>(250);

  // Severity Rate inputs
  const [daysLost, setDaysLost] = useState<number>(45);
  const [severityHours, setSeverityHours] = useState<number>(500000);
  const [severityInjuries, setSeverityInjuries] = useState<number>(3);

  // Uninsured Cost inputs
  const [insuredCost, setInsuredCost] = useState<number>(5000);
  const [uninsuredRatio, setUninsuredRatio] = useState<number>(10);

  // Copy state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Student Scratchpad Notes state (persisted in localStorage)
  const [studentNotes, setStudentNotes] = useState<string>(() => {
    return (
      localStorage.getItem("hse_quick_notes") ||
      "• AFR Benchmark: Target ≤ 0.5 per 100k hrs (≡ ≤ 5.0 per 1M hrs)\n• Equivalence: 0.25/100k = 2.50/1M (identical 1 in 400k hrs)\n• ERICPD: Eliminate first, PPE last\n• Uninsured accident costs ratio: 10:1 (HSG96 ranges 8:1 - 36:1)"
    );
  });

  // Recent Activities History
  const [historyItems, setHistoryItems] = useState<QuickHistoryItem[]>(() => {
    const saved = localStorage.getItem("hse_recent_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse quick history", e);
      }
    }
    // Default initial items
    return [
      {
        id: "hist_1",
        title: "Accident Frequency Rate (AFR)",
        subtitle: "HSE Performance Calculator",
        tab: "quick-calc",
        timestamp: Date.now() - 1000 * 60 * 15,
        iconType: "calc",
      },
      {
        id: "hist_2",
        title: "Chapter 3: 5x5 Matrix & PTW",
        subtitle: "Dynamic Risk Control Simulator",
        tab: "simulations",
        chapterId: 3,
        timestamp: Date.now() - 1000 * 60 * 45,
        iconType: "sim",
      },
      {
        id: "hist_3",
        title: "Flashcards: Core Terminology",
        subtitle: "Spaced Repetition Review (Box 1-2)",
        tab: "flashcards",
        timestamp: Date.now() - 1000 * 60 * 120,
        iconType: "flashcards",
      },
    ];
  });

  // Save notes to localStorage
  const handleSaveNotes = (val: string) => {
    setStudentNotes(val);
    localStorage.setItem("hse_quick_notes", val);
  };

  // Listen to global open quick access events
  useEffect(() => {
    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ panel?: "calc" | "history" | "shortcuts" | "notes" }>;
      setIsOpen(true);
      if (customEvent.detail?.panel) {
        setActivePanel(customEvent.detail.panel);
      }
    };
    window.addEventListener("open_quick_access", handleCustomOpen);
    return () => window.removeEventListener("open_quick_access", handleCustomOpen);
  }, []);

  // Record history whenever tab or action changes
  const recordHistory = (item: Omit<QuickHistoryItem, "id" | "timestamp">) => {
    setHistoryItems((prev) => {
      const filtered = prev.filter((h) => h.title !== item.title);
      const updated = [
        {
          ...item,
          id: "hist_" + Date.now(),
          timestamp: Date.now(),
        },
        ...filtered,
      ].slice(0, 8); // Keep last 8 items
      localStorage.setItem("hse_recent_history", JSON.stringify(updated));
      return updated;
    });
  };

  // Track tab changes in history
  useEffect(() => {
    const tabTitles: Record<string, { title: string; subtitle: string; icon: QuickHistoryItem["iconType"] }> = {
      dashboard: { title: "Overview Dashboard", subtitle: "Syllabus progress & roadmap", icon: "sim" },
      simulations: { title: "Chapter Simulations Hub", subtitle: "Interactive risk & investigation models", icon: "sim" },
      obe: { title: "Scenario & P.E.E. Case Study", subtitle: "Open-book practical scenarios", icon: "obe" },
      quiz: { title: "Quick Practice Quiz", subtitle: "Multi-chapter rapid assessment", icon: "quiz" },
      flashcards: { title: "Spaced Flashcards", subtitle: "Active recall terminology drill", icon: "flashcards" },
      visuals: { title: "Visual Infographics", subtitle: "Diagrams & hierarchy schemas", icon: "diagram" },
      analytics: { title: "Performance Analytics", subtitle: "Competency readiness report", icon: "sim" },
    };

    if (tabTitles[activeTab]) {
      const info = tabTitles[activeTab];
      recordHistory({
        title: info.title,
        subtitle: info.subtitle,
        tab: activeTab,
        iconType: info.icon,
      });
    }
  }, [activeTab]);

  // AFR Calculations (Normalized & Invariant to Multiplier)
  const rawRatePer100k = hoursWorked > 0 ? (injuries * 100000) / hoursWorked : 0;
  const rawRatePer1M = hoursWorked > 0 ? (injuries * 1000000) / hoursWorked : 0;
  const calculatedAFR = (multiplier === 100000 ? rawRatePer100k : rawRatePer1M).toFixed(2);
  const equivalentAFR = (multiplier === 100000 ? rawRatePer1M : rawRatePer100k).toFixed(2);
  const otherMultiplier = multiplier === 100000 ? 1000000 : 100000;
  const otherMultiplierLabel = multiplier === 100000 ? "1,000,000 hrs (OSHA/Intl)" : "100,000 hrs (UK HSE)";
  const hoursPerInjury = hoursWorked > 0 && injuries > 0 ? Math.round(hoursWorked / injuries) : 0;

  // Incidence Rate Calculations
  const calculatedIncidence = employees > 0 ? ((incidenceInjuries * 1000) / employees).toFixed(2) : "0.00";
  const workforcePercentage = employees > 0 ? ((incidenceInjuries / employees) * 100).toFixed(2) : "0.00";

  // Severity Rate Calculations
  const calculatedSeverity = severityHours > 0 ? ((daysLost * 1000) / severityHours).toFixed(2) : "0.00";
  const meanLostDays = severityInjuries > 0 ? (daysLost / severityInjuries).toFixed(1) : "0.0";

  // Uninsured Cost Calculations
  const calculatedUninsured = (insuredCost * uninsuredRatio).toLocaleString();
  const calculatedGrandLoss = (insuredCost * (1 + uninsuredRatio)).toLocaleString();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // AFR Benchmark: Evaluates normalized rate per 100,000 hours so that
  // 0.25 / 100k and 2.50 / 1M produce the EXACT same physical reality & rating.
  const getAfrBenchmark = (currentMultiplier: number, normalizedPer100kVal: number) => {
    if (normalizedPer100kVal <= 0.5) {
      return {
        status: "low",
        text: "Low Incident Frequency (Good Performance)",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        thresholdInfo:
          currentMultiplier === 100000
            ? "Within low-risk threshold (≤ 0.50 per 100,000 hrs)"
            : "Within low-risk threshold (≤ 5.00 per 1,000,000 hrs)",
      };
    }
    if (normalizedPer100kVal <= 2.0) {
      return {
        status: "moderate",
        text: "Moderate Frequency (Standard Benchmark)",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        thresholdInfo:
          currentMultiplier === 100000
            ? "Standard industry average (0.51 to 2.00 per 100,000 hrs)"
            : "Standard industry average (5.01 to 20.00 per 1,000,000 hrs)",
      };
    }
    return {
      status: "high",
      text: "High Frequency (Intervention Required)",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      thresholdInfo:
        currentMultiplier === 100000
          ? "Exceeds standard threshold (> 2.00 per 100,000 hrs)"
          : "Exceeds standard threshold (> 20.00 per 1,000,000 hrs)",
    };
  };

  const getIncidenceBenchmark = (val: number) => {
    if (val <= 5.0) {
      return {
        text: "Low Incidence (≤ 5.0 per 1,000 workers)",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        detail: `Only ${workforcePercentage}% of the workforce affected annually.`,
      };
    }
    if (val <= 15.0) {
      return {
        text: "Moderate Incidence (5.1 – 15.0 per 1,000 workers)",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        detail: `${workforcePercentage}% of the workforce affected annually (average industry range).`,
      };
    }
    return {
      text: "High Incidence (> 15.0 per 1,000 workers)",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      detail: `Elevated risk: ${workforcePercentage}% of the workforce injured this year.`,
    };
  };

  const getSeverityBenchmark = (val: number) => {
    if (val <= 0.2) {
      return {
        text: "Low Severity (≤ 0.20 days lost / 1,000 hrs)",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        detail: `Minimal downtime. Average ${meanLostDays} lost days per reported injury.`,
      };
    }
    if (val <= 0.5) {
      return {
        text: "Moderate Severity (0.21 – 0.50 days lost / 1,000 hrs)",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        detail: `Standard industrial recovery time. Average ${meanLostDays} lost days per injury.`,
      };
    }
    return {
      text: "High Severity (> 0.50 days lost / 1,000 hrs)",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      detail: `Significant severity. Extended absences averaging ${meanLostDays} lost days per injury.`,
    };
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const lastUsedItem = historyItems[0];

  return (
    <>
      {/* Collapsed Floating Right Dock (Always visible & accessible) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-y border-slate-200 dark:border-slate-800 rounded-l-2xl shadow-xl p-1.5 gap-2 group transition-all">
          {/* Main Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md hover:scale-105 active:scale-95 transition relative flex items-center justify-center group"
            title="Quick Access & Formula Tools"
            aria-label="Open Quick Access Bar"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span className="absolute -left-1 -top-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </button>

          {/* Quick Icon 1: Frequency Rate Calculator */}
          <button
            onClick={() => {
              setActivePanel("calc");
              setIsOpen(true);
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500 transition relative"
            title="Frequency Rate (AFR) Calculator"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Quick Icon 2: Last Used History */}
          <button
            onClick={() => {
              setActivePanel("history");
              setIsOpen(true);
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition relative"
            title="Resume Last Used Activity"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Quick Icon 3: Scratchpad */}
          <button
            onClick={() => {
              setActivePanel("notes");
              setIsOpen(true);
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-500 transition relative"
            title="HSE Revision Scratchpad"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Vertical Label Pill for easy discovery */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-2 [writing-mode:vertical-rl] rotate-180 transition flex items-center gap-1"
          >
            <span>QUICK TOOLS</span>
          </button>
        </div>
      </div>

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          {/* Backdrop on small screens */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
          />

          {/* Right-Side Panel Container */}
          <div className="relative w-full max-w-[390px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    HSE Quick Access Bar
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Frequent safety formulas &amp; recent session
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Close Quick Bar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Last Used Highlight Bar (Always accessible at top) */}
            {lastUsedItem && (
              <div className="p-3 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Last Used ({formatTimeAgo(lastUsedItem.timestamp)}):</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                    {lastUsedItem.title}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (lastUsedItem.tab === "quick-calc") {
                      setActivePanel("calc");
                    } else {
                      onNavigate(lastUsedItem.tab, lastUsedItem.chapterId);
                      setIsOpen(false);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 flex items-center gap-1 transition shadow-sm"
                >
                  Resume &rarr;
                </button>
              </div>
            )}

            {/* Sub-tab Switcher */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 p-1.5 gap-1 text-xs font-bold">
              <button
                onClick={() => setActivePanel("calc")}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activePanel === "calc"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Formulas</span>
              </button>

              <button
                onClick={() => setActivePanel("history")}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activePanel === "history"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
              </button>

              <button
                onClick={() => setActivePanel("shortcuts")}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activePanel === "shortcuts"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Chapters</span>
              </button>

              <button
                onClick={() => setActivePanel("notes")}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activePanel === "notes"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Scratchpad</span>
              </button>
            </div>

            {/* Quick Feature Launchpad Strip */}
            <div className="px-3.5 py-2 bg-emerald-500/5 dark:bg-emerald-950/20 border-b border-emerald-500/10 flex items-center justify-between text-[11px] overflow-x-auto gap-2 no-scrollbar">
              <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0 text-[10px] uppercase tracking-wider">
                Quick Jump:
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    onNavigate("simulations", 4, "rate_calc");
                    setIsOpen(false);
                  }}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition hover:border-emerald-500 flex items-center gap-1 shadow-2xs text-[11px]"
                  title="Jump to detailed AFR calculator & comparator"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>AFR Lab</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    onNavigate("simulations", 1, "iceberg");
                    setIsOpen(false);
                  }}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition hover:border-rose-500 flex items-center gap-1 shadow-2xs text-[11px]"
                  title="Jump to 10:1 Iceberg Cost Simulation"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>10:1 Iceberg</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    onNavigate("simulations", 3, "matrix");
                    setIsOpen(false);
                  }}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 font-semibold transition hover:border-teal-500 flex items-center gap-1 shadow-2xs text-[11px]"
                  title="Jump to 5x5 Risk Matrix & Chemical Lab"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  <span>5x5 Matrix</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    onNavigate("simulations", 3, "ptw");
                    setIsOpen(false);
                  }}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 font-semibold transition hover:border-amber-500 flex items-center gap-1 shadow-2xs text-[11px]"
                  title="Jump to Permit-to-Work Interactive Form"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>PTW Form</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    onNavigate("simulations", 4, "fivewhys");
                    setIsOpen(false);
                  }}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition hover:border-blue-500 flex items-center gap-1 shadow-2xs text-[11px]"
                  title="Jump to 5 Whys Root Cause Investigation"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>5 Whys</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("open_glossary"));
                    setIsOpen(false);
                  }}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition hover:border-purple-500 flex items-center gap-1 shadow-2xs text-[11px]"
                  title="Open HSE Terminology Glossary"
                >
                  <BookOpen className="w-2.5 h-2.5 text-purple-500" />
                  <span>Glossary</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Panel Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* PANEL 1: FREQUENCY RATE & HSE CALCULATOR */}
              {activePanel === "calc" && (
                <div className="space-y-4 text-xs">
                  {/* Calculator Type Pills */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      onClick={() => setCalcType("afr")}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition flex items-center justify-center gap-1 ${
                        calcType === "afr"
                          ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span>Frequency Rate (AFR)</span>
                      {calcType === "afr" && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("simulations", 4, "rate_calc");
                            setIsOpen(false);
                          }}
                          className="p-0.5 rounded hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          title="Open full detailed calculation page"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setCalcType("incidence")}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition flex items-center justify-center gap-1 ${
                        calcType === "incidence"
                          ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span>Incidence Rate</span>
                      {calcType === "incidence" && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("simulations", 4, "rate_calc");
                            setIsOpen(false);
                          }}
                          className="p-0.5 rounded hover:bg-sky-500/20 text-sky-600 dark:text-sky-400"
                          title="Open full detailed calculation page"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setCalcType("severity")}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition flex items-center justify-center gap-1 ${
                        calcType === "severity"
                          ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span>Severity Rate</span>
                      {calcType === "severity" && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("simulations", 4, "rate_calc");
                            setIsOpen(false);
                          }}
                          className="p-0.5 rounded hover:bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          title="Open full detailed calculation page"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setCalcType("uninsured")}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition flex items-center justify-center gap-1 ${
                        calcType === "uninsured"
                          ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span>10:1 Iceberg Cost</span>
                      {calcType === "uninsured" && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("simulations", 1, "iceberg");
                            setIsOpen(false);
                          }}
                          className="p-0.5 rounded hover:bg-rose-500/20 text-rose-600 dark:text-rose-400"
                          title="Open full iceberg simulation page"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  </div>

                  {/* 1. AFR CALCULATOR */}
                  {calcType === "afr" && (
                    <div className="space-y-3.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
                            Accident Frequency Rate (AFR)
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Chapter 4 Metric</span>
                        </div>
                        <button
                          onClick={() => {
                            onNavigate("simulations", 4, "rate_calc");
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition hover:scale-[1.02] active:scale-95 group shrink-0"
                          title="Open full detailed AFR calculator & comparator laboratory"
                        >
                          <span>Full Calculator Lab</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                        </button>
                      </div>

                      {/* Formula Card */}
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-center">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">AFR</span> = (Lost Time Injuries &times; {multiplier.toLocaleString()}) &divide; Hours Worked
                      </div>

                      {/* Inputs */}
                      <div className="space-y-2.5">
                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Number of Lost-Time Injuries:
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={injuries}
                            onChange={(e) => setInjuries(Math.max(0, Number(e.target.value)))}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Total Person-Hours Worked:
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="10000"
                            value={hoursWorked}
                            onChange={(e) => setHoursWorked(Math.max(1, Number(e.target.value)))}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Standard Multiplier Factor:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setMultiplier(1000000)}
                              className={`py-1.5 px-2 rounded-lg font-bold text-[11px] border transition ${
                                multiplier === 1000000
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                              }`}
                            >
                              1,000,000 hrs (OSHA/Intl)
                            </button>
                            <button
                              onClick={() => setMultiplier(100000)}
                              className={`py-1.5 px-2 rounded-lg font-bold text-[11px] border transition ${
                                multiplier === 100000
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                              }`}
                            >
                              100,000 hrs (UK HSE)
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Computed Result Box */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-xs">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Calculated Frequency Rate
                        </div>
                        <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                          {calculatedAFR}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                          Injuries per {multiplier.toLocaleString()} person-hours
                        </div>

                        {/* Invariant Benchmark status */}
                        {(() => {
                          const bench = getAfrBenchmark(multiplier, rawRatePer100k);
                          return (
                            <div className={`p-2 rounded-xl text-left border space-y-0.5 ${bench.color}`}>
                              <div className="text-[11px] font-bold flex items-center justify-between">
                                <span>{bench.text}</span>
                              </div>
                              <div className="text-[10px] opacity-90">
                                {bench.thresholdInfo}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Mathematical Equivalence Callout */}
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                            <Scale className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Mathematical Equivalence</span>
                          </div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                            They are mathematically identical. An Accident Frequency Rate (AFR) of{" "}
                            <strong className="text-slate-900 dark:text-white font-mono">
                              {multiplier === 100000 ? calculatedAFR : equivalentAFR}
                            </strong>{" "}
                            per 100,000 hours reflects the exact same physical reality as{" "}
                            <strong className="text-slate-900 dark:text-white font-mono">
                              {multiplier === 1000000 ? calculatedAFR : equivalentAFR}
                            </strong>{" "}
                            per 1,000,000 hours.
                          </p>
                          {hoursWorked > 0 && injuries > 0 && (
                            <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 pt-1 border-t border-slate-200/80 dark:border-slate-700/80">
                              ✓ Physical Reality: 1 lost-time injury every{" "}
                              <strong className="font-mono">{hoursPerInjury.toLocaleString()}</strong> hours worked.
                            </div>
                          )}
                        </div>

                        {/* Deep-dive Navigation Button for AFR */}
                        <button
                          onClick={() => {
                            onNavigate("simulations", 4, "rate_calc");
                            setIsOpen(false);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 group hover:shadow-emerald-500/25 mt-2"
                        >
                          <span>Deep-Dive AFR Calculator &amp; Industry Benchmarks</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                        </button>

                        <button
                          onClick={() =>
                            handleCopy(
                              `AFR = (${injuries} * ${multiplier}) / ${hoursWorked} = ${calculatedAFR} per ${multiplier.toLocaleString()} hrs (Equiv to ${equivalentAFR} per ${otherMultiplier.toLocaleString()} hrs)`,
                              "afr"
                            )
                          }
                          className="mt-1 text-[10px] text-slate-500 hover:text-emerald-500 flex items-center justify-center gap-1 mx-auto"
                        >
                          {copiedText === "afr" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copiedText === "afr" ? "Copied formula & equivalence!" : "Copy result for assignment"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. INCIDENCE RATE CALCULATOR */}
                  {calcType === "incidence" && (
                    <div className="space-y-3.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
                            Accident Incidence Rate (AIR)
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Per 1,000 Workers</span>
                        </div>
                        <button
                          onClick={() => {
                            onNavigate("simulations", 4, "rate_calc");
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs transition hover:scale-[1.02] active:scale-95 group shrink-0"
                          title="Open full incidence & rate comparator"
                        >
                          <span>Full Comparison Lab</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-center">
                        <span className="text-sky-600 dark:text-sky-400 font-bold">AIR</span> = (Reportable Injuries &times; 1,000) &divide; Average Employees
                      </div>

                      <div className="space-y-2.5">
                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Number of Reportable Injuries:
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={incidenceInjuries}
                            onChange={(e) => setIncidenceInjuries(Math.max(0, Number(e.target.value)))}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Average Number of Employees:
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={employees}
                            onChange={(e) => setEmployees(Math.max(1, Number(e.target.value)))}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-xs">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Calculated Incidence Rate
                        </div>
                        <div className="text-3xl font-black text-sky-600 dark:text-sky-400 font-mono">
                          {calculatedIncidence}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                          Injuries per 1,000 employees per annum
                        </div>

                        {/* Benchmark status */}
                        {(() => {
                          const bench = getIncidenceBenchmark(Number(calculatedIncidence));
                          return (
                            <div className={`p-2 rounded-xl text-left border space-y-0.5 ${bench.color}`}>
                              <div className="text-[11px] font-bold">{bench.text}</div>
                              <div className="text-[10px] opacity-90">{bench.detail}</div>
                            </div>
                          );
                        })()}

                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left text-[10px] text-slate-600 dark:text-slate-400 space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-sky-500" />
                            Workforce Risk Evaluation
                          </div>
                          <p>
                            Affects <strong className="font-mono text-slate-900 dark:text-white">{workforcePercentage}%</strong> of the organization&apos;s total workforce annually.
                          </p>
                          <p className="text-[9px] text-slate-500">
                            HSE Benchmark target: Below 5.0 per 1,000 workers (&lt; 0.5% annual rate).
                          </p>
                        </div>

                        {/* Deep-dive Navigation Button for AIR */}
                        <button
                          onClick={() => {
                            onNavigate("simulations", 4, "rate_calc");
                            setIsOpen(false);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 group hover:shadow-sky-500/25 mt-2"
                        >
                          <span>Deep-Dive Workforce Risk &amp; Incidence Studio</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                        </button>

                        <button
                          onClick={() =>
                            handleCopy(
                              `Incidence Rate = (${incidenceInjuries} * 1000) / ${employees} = ${calculatedIncidence} per 1,000 workers (${workforcePercentage}% workforce affected)`,
                              "inc"
                            )
                          }
                          className="mt-1 text-[10px] text-slate-500 hover:text-sky-500 flex items-center justify-center gap-1 mx-auto"
                        >
                          {copiedText === "inc" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copiedText === "inc" ? "Copied formulation!" : "Copy formulation"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 3. SEVERITY RATE CALCULATOR */}
                  {calcType === "severity" && (
                    <div className="space-y-3.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
                            Accident Severity Rate (ASR)
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Lost Days Metric</span>
                        </div>
                        <button
                          onClick={() => {
                            onNavigate("simulations", 4, "rate_calc");
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition hover:scale-[1.02] active:scale-95 group shrink-0"
                          title="Open full severity rate & duration lab"
                        >
                          <span>Full Severity Lab</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-center">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">ASR</span> = (Days Lost &times; 1,000) &divide; Hours Worked
                      </div>

                      <div className="space-y-2.5">
                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Total Working Days Lost:
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={daysLost}
                            onChange={(e) => setDaysLost(Math.max(0, Number(e.target.value)))}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Total Hours Worked:
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="10000"
                            value={severityHours}
                            onChange={(e) => setSeverityHours(Math.max(1, Number(e.target.value)))}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Number of Lost-Time Injuries (for Duration index):
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={severityInjuries}
                            onChange={(e) => setSeverityInjuries(Math.max(1, Number(e.target.value)))}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-xs">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Severity Rate
                        </div>
                        <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                          {calculatedSeverity}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                          Days lost per 1,000 hours worked
                        </div>

                        {/* Benchmark status */}
                        {(() => {
                          const bench = getSeverityBenchmark(Number(calculatedSeverity));
                          return (
                            <div className={`p-2 rounded-xl text-left border space-y-0.5 ${bench.color}`}>
                              <div className="text-[11px] font-bold">{bench.text}</div>
                              <div className="text-[10px] opacity-90">{bench.detail}</div>
                            </div>
                          );
                        })()}

                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left text-[10px] text-slate-600 dark:text-slate-400 space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            Mean Duration per Injury:
                          </div>
                          <p>
                            Average absence: <strong className="font-mono text-slate-900 dark:text-white">{meanLostDays}</strong> days lost per reported injury.
                          </p>
                          <p className="text-[9px] text-slate-500">
                            High duration indicates severe injuries (e.g. fractures, back injuries) requiring ergonomic and guarding reviews.
                          </p>
                        </div>

                        {/* Deep-dive Navigation Button for ASR */}
                        <button
                          onClick={() => {
                            onNavigate("simulations", 4, "rate_calc");
                            setIsOpen(false);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 group hover:shadow-amber-500/25 mt-2"
                        >
                          <span>Deep-Dive Severity Rate &amp; Lost-Time Studio</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                        </button>

                        <button
                          onClick={() =>
                            handleCopy(
                              `Severity Rate = (${daysLost} * 1000) / ${severityHours} = ${calculatedSeverity} days/1k hrs (Mean duration: ${meanLostDays} days/injury)`,
                              "sev"
                            )
                          }
                          className="mt-1 text-[10px] text-slate-500 hover:text-amber-500 flex items-center justify-center gap-1 mx-auto"
                        >
                          {copiedText === "sev" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copiedText === "sev" ? "Copied!" : "Copy formulation"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 4. UNINSURED ICEBERG CALCULATOR */}
                  {calcType === "uninsured" && (
                    <div className="space-y-3.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
                            The Uninsured Iceberg Cost Model
                          </span>
                          <span className="text-[10px] font-mono text-rose-500 font-bold">Chapter 1 Model</span>
                        </div>
                        <button
                          onClick={() => {
                            onNavigate("simulations", 1, "iceberg");
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs transition hover:scale-[1.02] active:scale-95 group shrink-0"
                          title="Open full 10:1 Iceberg Cost Simulator"
                        >
                          <span>Full Simulator</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        UK HSE research (HSG96) demonstrates uninsured indirect losses are 8 to 36 times greater than insured direct costs.
                      </p>

                      {/* Ratio Selector */}
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Indirect-to-Direct Ratio:
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { r: 8, l: "8:1 (Min)" },
                            { r: 10, l: "10:1 (Norm)" },
                            { r: 15, l: "15:1 (High)" },
                            { r: 36, l: "36:1 (Max)" },
                          ].map((item) => (
                            <button
                              key={item.r}
                              onClick={() => setUninsuredRatio(item.r)}
                              className={`py-1 rounded-lg text-[10px] font-bold border transition ${
                                uninsuredRatio === item.r
                                  ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                              }`}
                            >
                              {item.l}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Insured Direct Costs (Tip of Iceberg):
                        </label>
                        <input
                          type="number"
                          step="500"
                          value={insuredCost}
                          onChange={(e) => setInsuredCost(Math.max(0, Number(e.target.value)))}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                          <div className="text-[9px] font-bold text-rose-600 uppercase">
                            Uninsured Losses ({uninsuredRatio}&times;)
                          </div>
                          <div className="text-base font-black text-rose-600 dark:text-rose-400 mt-0.5 font-mono">
                            £{calculatedUninsured}
                          </div>
                          <div className="text-[9px] text-slate-500 mt-1">
                            Investigation, sick pay & delays
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 text-white dark:bg-slate-800 border border-slate-700">
                          <div className="text-[9px] font-bold text-slate-400 uppercase">
                            Total Loss ({uninsuredRatio + 1}&times;)
                          </div>
                          <div className="text-base font-black text-emerald-400 mt-0.5 font-mono">
                            £{calculatedGrandLoss}
                          </div>
                          <div className="text-[9px] text-slate-400 mt-1">
                            Complete business impact
                          </div>
                        </div>
                      </div>

                      {/* Educational Iceberg breakdown */}
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] space-y-1.5">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                          <span>Iceberg Anatomy (HSG96)</span>
                          <span className="text-[9px] text-rose-500 font-semibold">{uninsuredRatio}:1 Ratio Applied</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[9px] leading-relaxed">
                          <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                            <strong>Insured (Tip):</strong> Medical fees, covered damage repairs, workers&apos; compensation liability payouts.
                          </div>
                          <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <strong>Uninsured (Mass):</strong> Sick pay, replacement overtime, investigation hours, uninsurable court fines.
                          </div>
                        </div>
                      </div>

                      {/* Deep-dive Navigation Button for Iceberg */}
                      <button
                        onClick={() => {
                          onNavigate("simulations", 1, "iceberg");
                          setIsOpen(false);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 group hover:shadow-rose-500/25 mt-2"
                      >
                        <span>Deep-Dive 10:1 Iceberg &amp; Contractor Due Diligence Studio</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* PANEL 2: RECENT SESSIONS & HISTORY */}
              {activePanel === "history" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Recent Learning Modules
                    </span>
                    <span className="text-[10px] text-slate-400">Tap to resume</span>
                  </div>

                  <div className="space-y-2">
                    {historyItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.tab === "quick-calc") {
                            setActivePanel("calc");
                          } else {
                            onNavigate(item.tab, item.chapterId, item.subTab);
                            setIsOpen(false);
                          }
                        }}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/60 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            {item.iconType === "calc" && <Calculator className="w-4 h-4" />}
                            {item.iconType === "sim" && <Shield className="w-4 h-4" />}
                            {item.iconType === "quiz" && <Check className="w-4 h-4" />}
                            {item.iconType === "flashcards" && <BrainCircuit className="w-4 h-4" />}
                            {item.iconType === "obe" && <FileText className="w-4 h-4" />}
                            {item.iconType === "diagram" && <Layers className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-500 transition">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 block">
                            {formatTimeAgo(item.timestamp)}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition inline-block">
                            Go &rarr;
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PANEL 3: CHAPTER SHORTCUTS */}
              {activePanel === "shortcuts" && (
                <div className="space-y-3">
                  {/* Quick HSE Glossary Launcher */}
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                        <span>HSE Terminology Glossary</span>
                      </div>
                      <kbd className="text-[10px] font-mono px-1.5 py-0.2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-500">
                        ⌘K
                      </kbd>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Instant definitions for complex terms (SFARP, PTW, ERICPD, COSHH, WEL, RIDDOR, and ASR).
                    </p>
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("open_glossary"));
                        setIsOpen(false);
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Open Search Glossary</span>
                    </button>
                  </div>

                  {/* Interactive Tool & Lab Launchers */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Interactive Simulators &amp; Labs</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">One-click deep link</span>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        {
                          title: "AFR & Safety Rates Calculator",
                          subtitle: "Compare 100k vs 1M multipliers, sectors & paradoxes",
                          chapterId: 4 as ElementId,
                          subTab: "rate_calc",
                          badge: "Ch 4 Lab",
                          color: "emerald",
                        },
                        {
                          title: "10:1 Uninsured Iceberg Cost Simulator",
                          subtitle: "HSG96 ratio calculations & business loss model",
                          chapterId: 1 as ElementId,
                          subTab: "iceberg",
                          badge: "Ch 1 Model",
                          color: "rose",
                        },
                        {
                          title: "5x5 Dynamic Risk Matrix & Chemical Lab",
                          subtitle: "Initial vs residual risk & ERICPD hierarchy controls",
                          chapterId: 3 as ElementId,
                          subTab: "matrix",
                          badge: "Ch 3 Matrix",
                          color: "teal",
                        },
                        {
                          title: "Permit-to-Work (PTW) Interactive Form",
                          subtitle: "Hot work, confined space, and isolation authorization",
                          chapterId: 3 as ElementId,
                          subTab: "ptw",
                          badge: "Ch 3 PTW",
                          color: "amber",
                        },
                        {
                          title: "5 Whys Root Cause Investigation",
                          subtitle: "Drill down through direct, underlying & systemic causes",
                          chapterId: 4 as ElementId,
                          subTab: "fivewhys",
                          badge: "Ch 4 Root Cause",
                          color: "blue",
                        },
                        {
                          title: "PDCA Cycle & SMART Safety Objectives",
                          subtitle: "ISO 45001 / HSG65 policy architecture & review triggers",
                          chapterId: 2 as ElementId,
                          subTab: "pdca",
                          badge: "Ch 2 PDCA",
                          color: "sky",
                        },
                        {
                          title: "Contractor Vetting & Due Diligence",
                          subtitle: "Score competence, insurance, RAMS & supervision",
                          chapterId: 1 as ElementId,
                          subTab: "contractor",
                          badge: "Ch 1 Due Diligence",
                          color: "rose",
                        },
                      ].map((tool) => (
                        <button
                          key={tool.title}
                          onClick={() => {
                            onNavigate("simulations", tool.chapterId, tool.subTab);
                            setIsOpen(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/80 transition flex items-center justify-between group shadow-2xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {tool.badge}
                              </span>
                              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition">
                                {tool.title}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {tool.subtitle}
                            </div>
                          </div>
                          <span className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-500 transition">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                    Direct Chapter Curriculum
                  </div>

                  <div className="space-y-2">
                    {[
                      { id: 1 as ElementId, title: "Chapter 1: Why Manage H&S", subtitle: "Iceberg 10:1 & Contractor Due Diligence", tab: "simulations", color: "rose" },
                      { id: 2 as ElementId, title: "Chapter 2: Management Systems", subtitle: "PDCA Cycle & SMART Policy Formulation", tab: "simulations", color: "sky" },
                      { id: 3 as ElementId, title: "Chapter 3: Managing Risk", subtitle: "5x5 Dynamic Matrix & Permit-to-Work", tab: "simulations", color: "emerald" },
                      { id: 4 as ElementId, title: "Chapter 4: Monitoring & Audit", subtitle: "5-Whys Root Cause & Active Inspections", tab: "simulations", color: "amber" },
                    ].map((chap) => (
                      <button
                        key={chap.id}
                        onClick={() => {
                          onNavigate("simulations", chap.id);
                          setIsOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 transition flex items-center justify-between group"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Curriculum Guide
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition block">
                            {chap.title}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {chap.subtitle}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition">
                          &rarr;
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Other Direct Module Shortcuts */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                    <button
                      onClick={() => {
                        onNavigate("flashcards");
                        setIsOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4" /> Spaced Flashcards Deck
                      </span>
                      <span>&rarr;</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate("obe");
                        setIsOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Practical Scenario &amp; P.E.E.
                      </span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              )}

              {/* PANEL 4: SCRATCHPAD & FORMULA CHEATSHEET */}
              {activePanel === "notes" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Quick Revision Scratchpad
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Persisted locally for your formulas, acronyms, and exam pointers:
                    </p>
                    <textarea
                      rows={6}
                      value={studentNotes}
                      onChange={(e) => handleSaveNotes(e.target.value)}
                      placeholder="Jot down notes, formulas, or key case law..."
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Quick formula reference cards */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px] uppercase tracking-wider">
                      Essential Formula Reference
                    </span>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-[11px]">
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold">Accident Frequency Rate:</div>
                      <div className="text-slate-600 dark:text-slate-300">
                        (Injuries &times; 1,000,000) &divide; Hours Worked
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-[11px]">
                      <div className="text-sky-600 dark:text-sky-400 font-bold">Incidence Rate:</div>
                      <div className="text-slate-600 dark:text-slate-300">
                        (Injuries &times; 1,000) &divide; Average Headcount
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-[11px]">
                      <div className="text-purple-600 dark:text-purple-400 font-bold">Control Hierarchy (ERICPD):</div>
                      <div className="text-slate-600 dark:text-slate-300">
                        Elimination &rarr; Reduction &rarr; Isolation &rarr; Controls &rarr; PPE &rarr; Discipline
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Quick Status */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[10px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                HSE Learning Portal Tools
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500"
              >
                Close &times;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
