import React, { useState, useEffect, useMemo, useRef } from "react";
import { GlossaryTerm, GlossaryCategory, ElementId } from "../types";
import { HSE_GLOSSARY_DATA } from "../data/hseGlossaryData";
import {
  Search,
  BookOpen,
  X,
  Copy,
  Check,
  Tag,
  BookMarked,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Layers,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearchQuery?: string;
  onNavigateToChapter?: (chapterId: ElementId, subTab?: string) => void;
  onNavigateTab?: (tab: string, chapterId?: ElementId, subTab?: string) => void;
}

interface TermQuickAction {
  title: string;
  buttonText: string;
  tab: string;
  chapterId: ElementId;
  subTab: string;
  badge: string;
  description: string;
}

const TERM_QUICK_ACTIONS: Record<string, TermQuickAction> = {
  afr: {
    title: "Accident Frequency Rate (AFR) Detailed Calculator",
    buttonText: "Open Detailed AFR & Rate Comparator",
    tab: "simulations",
    chapterId: 4,
    subTab: "rate_calc",
    badge: "Interactive Lab",
    description: "Calculate AFR with 100,000 vs 1,000,000 multipliers, benchmark against UK HSE industry sectors, and explore the Severity Paradox.",
  },
  air: {
    title: "Accident Incidence Rate (AIR) Calculator",
    buttonText: "Open Rate & Workforce Exposure Lab",
    tab: "simulations",
    chapterId: 4,
    subTab: "rate_calc",
    badge: "Interactive Lab",
    description: "Determine reportable incidents per 1,000 employees and quantify proportion of workforce affected.",
  },
  asr: {
    title: "Accident Severity Rate (ASR) Calculator",
    buttonText: "Open Severity & Lost Time Lab",
    tab: "simulations",
    chapterId: 4,
    subTab: "rate_calc",
    badge: "Interactive Lab",
    description: "Analyze lost working days per 1,000 hours worked and mean absence duration per injury.",
  },
  "uninsured-costs": {
    title: "The 10:1 Uninsured Iceberg Cost Model",
    buttonText: "Open Iceberg Financial Cost Simulator",
    tab: "simulations",
    chapterId: 1,
    subTab: "iceberg",
    badge: "Cost Model",
    description: "Simulate uninsured business losses (8:1 to 36:1 ratio) with HSG96 direct vs indirect cost breakdown.",
  },
  "contractor-management": {
    title: "Contractor Vetting & Due Diligence Studio",
    buttonText: "Open Contractor Management Lab",
    tab: "simulations",
    chapterId: 1,
    subTab: "contractor",
    badge: "Due Diligence Lab",
    description: "Score competence, insurance, RAMS, and supervision protocols for third-party contractors.",
  },
  "pdca-cycle": {
    title: "Plan-Do-Check-Act (PDCA) Management System",
    buttonText: "Open PDCA Interactive Simulator",
    tab: "simulations",
    chapterId: 2,
    subTab: "pdca",
    badge: "System Simulator",
    description: "Explore ISO 45001 / HSG65 cycle stages, feedback loops, and continual safety improvement.",
  },
  "smart-objectives": {
    title: "SMART Safety Policy & Objective Architect",
    buttonText: "Open SMART Policy Builder",
    tab: "simulations",
    chapterId: 2,
    subTab: "smart",
    badge: "Policy Architect",
    description: "Draft compliant, audit-ready safety objectives aligned with NEBOSH criteria.",
  },
  "policy-review": {
    title: "Safety Policy Review Triggers Lab",
    buttonText: "Open Policy Review Simulator",
    tab: "simulations",
    chapterId: 2,
    subTab: "review",
    badge: "Compliance Lab",
    description: "Evaluate workplace triggers (legislation changes, major incidents, audits) requiring mandatory policy reviews.",
  },
  "risk-assessment-5-steps": {
    title: "Dynamic 5x5 Risk Matrix & Control Lab",
    buttonText: "Open 5x5 Matrix Simulator",
    tab: "simulations",
    chapterId: 3,
    subTab: "matrix",
    badge: "Risk Studio",
    description: "Identify hazards, evaluate Likelihood x Severity, and apply ERICPD controls to reduce residual risk.",
  },
  "hierarchy-of-control": {
    title: "Hierarchy of Risk Control (ERICPD) Simulator",
    buttonText: "Open Controls Hierarchy Simulator",
    tab: "simulations",
    chapterId: 3,
    subTab: "matrix",
    badge: "Control Studio",
    description: "Test Elimination, Substitution, Engineering, Administration, and PPE controls across workplace hazard scenarios.",
  },
  "permit-to-work": {
    title: "Interactive Permit-to-Work (PTW) Form",
    buttonText: "Open Interactive PTW Form",
    tab: "simulations",
    chapterId: 3,
    subTab: "ptw",
    badge: "Permit Studio",
    description: "Walk through Issue, Acceptance, Clearance, and Cancellation phases for high-risk maintenance operations.",
  },
  "confined-space": {
    title: "Confined Space & High-Risk Permit Protocol",
    buttonText: "Open Confined Space PTW Simulator",
    tab: "simulations",
    chapterId: 3,
    subTab: "ptw",
    badge: "Permit Studio",
    description: "Simulate atmospheric testing, emergency rescue planning, and isolation protocols under PTW.",
  },
  "5-whys": {
    title: "5 Whys Root Cause Investigation Studio",
    buttonText: "Open 5 Whys Root Cause Lab",
    tab: "simulations",
    chapterId: 4,
    subTab: "fivewhys",
    badge: "Investigation Lab",
    description: "Drill down through direct, underlying, and systemic root causes using structured incident trees.",
  },
  "active-reactive-monitoring": {
    title: "Active vs Reactive Safety Monitoring Sorter",
    buttonText: "Open Monitoring & Metrics Sorter",
    tab: "simulations",
    chapterId: 4,
    subTab: "active_reactive",
    badge: "Monitoring Studio",
    description: "Classify workplace safety data into proactive leading checks vs lagging incident metrics.",
  },
};

const CATEGORIES: { id: "ALL" | GlossaryCategory; label: string }[] = [
  { id: "ALL", label: "All Categories" },
  { id: "Legal & Duties", label: "Legal & Duties" },
  { id: "Management Systems", label: "Systems & Policy" },
  { id: "Risk Assessment & Controls", label: "Risk & Controls" },
  { id: "Human Factors & Culture", label: "Human Factors" },
  { id: "Monitoring & Metrics", label: "Monitoring & Rates" },
  { id: "Incident Investigation", label: "Incident Investigation" },
];

const CHAPTERS: { id: 0 | ElementId; label: string }[] = [
  { id: 0, label: "All Chapters" },
  { id: 1, label: "Ch 1: Why Manage H&S" },
  { id: 2, label: "Ch 2: Systems & Policy" },
  { id: 3, label: "Ch 3: Managing Risk" },
  { id: 4, label: "Ch 4: Monitoring & Measuring" },
];

export default function GlossaryModal({
  isOpen,
  onClose,
  initialSearchQuery = "",
  onNavigateToChapter,
  onNavigateTab,
}: GlossaryModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | GlossaryCategory>("ALL");
  const [selectedChapter, setSelectedChapter] = useState<0 | ElementId>(0);
  const [selectedTermId, setSelectedTermId] = useState<string>(HSE_GLOSSARY_DATA[0].id);
  const [copied, setCopied] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Sync initial query when opened
  useEffect(() => {
    if (isOpen) {
      if (initialSearchQuery) {
        setSearchQuery(initialSearchQuery);
      }
      setTimeout(() => {
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }, 50);
    }
  }, [isOpen, initialSearchQuery]);

  // Keyboard shortcut listener for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter terms based on query, category, and chapter
  const filteredTerms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return HSE_GLOSSARY_DATA.filter((term) => {
      // Category filter
      if (selectedCategory !== "ALL" && term.category !== selectedCategory) {
        return false;
      }
      // Chapter filter
      if (selectedChapter !== 0 && term.chapter !== selectedChapter) {
        return false;
      }
      // Search query filter
      if (!q) return true;

      const matchesTerm = term.term.toLowerCase().includes(q);
      const matchesAcronym = term.acronym?.toLowerCase().includes(q);
      const matchesSummary = term.summary.toLowerCase().includes(q);
      const matchesDef = term.fullDefinition.toLowerCase().includes(q);
      const matchesExample = term.practicalHseExample.toLowerCase().includes(q);
      const matchesFormula = term.keyFormulaOrBreakdown?.toLowerCase().includes(q);

      return matchesTerm || matchesAcronym || matchesSummary || matchesDef || matchesExample || matchesFormula;
    });
  }, [searchQuery, selectedCategory, selectedChapter]);

  // Ensure an active term is selected
  useEffect(() => {
    if (filteredTerms.length > 0) {
      const exists = filteredTerms.some((t) => t.id === selectedTermId);
      if (!exists) {
        setSelectedTermId(filteredTerms[0].id);
      }
    }
  }, [filteredTerms, selectedTermId]);

  const activeTerm = useMemo(() => {
    return (
      filteredTerms.find((t) => t.id === selectedTermId) ||
      HSE_GLOSSARY_DATA.find((t) => t.id === selectedTermId) ||
      filteredTerms[0] ||
      HSE_GLOSSARY_DATA[0]
    );
  }, [filteredTerms, selectedTermId]);

  const handleCopyDefinition = () => {
    if (!activeTerm) return;
    const textToCopy = `${activeTerm.term}${activeTerm.acronym ? ` (${activeTerm.acronym})` : ""}\n\nDefinition:\n${activeTerm.fullDefinition}\n\nPractical Example:\n${activeTerm.practicalHseExample}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectRelated = (termId: string) => {
    const found = HSE_GLOSSARY_DATA.find((t) => t.id === termId);
    if (found) {
      setSelectedTermId(termId);
      // Reset search if not in current filtered list so it shows cleanly
      setSearchQuery("");
      setSelectedCategory("ALL");
      setSelectedChapter(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="hse-glossary-overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="hse-glossary-modal"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-5xl h-[92vh] sm:h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Top Search & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/90 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>HSE Terminology Glossary</span>
                  <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {HSE_GLOSSARY_DATA.length} Terms
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Quick definitions, legal tests, formula breakdowns, and practical scenario examples.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                ESC to close
              </span>
              <button
                id="glossary-close-btn"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
                title="Close Glossary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Integrated Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              id="glossary-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terminology, acronyms (SFARP, PTW, AFR, COSHH, WEL, RIDDOR), or concepts..."
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills - Wrap so all chapters and categories are accessible */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            {/* Chapter Selector */}
            <div className="flex flex-wrap items-center gap-1">
              {CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapter(ch.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition select-none active:scale-95 ${
                    selectedChapter === ch.id
                      ? "bg-emerald-600 text-white shadow-xs font-semibold"
                      : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>

            <div className="hidden sm:block w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>

            {/* Category Selector */}
            <div className="flex flex-wrap items-center gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition select-none active:scale-95 ${
                    selectedCategory === cat.id
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold"
                      : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area: Split View on MD+, Stacked on Mobile */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Column: List of Terms (4 or 5 cols on desktop) */}
          <div
            ref={listContainerRef}
            className="md:col-span-5 border-r border-slate-200 dark:border-slate-800/80 overflow-y-auto p-3 space-y-1.5 bg-slate-50/40 dark:bg-slate-950/20"
          >
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Matches ({filteredTerms.length})</span>
              {searchQuery && <span>Filter active</span>}
            </div>

            {filteredTerms.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <BookMarked className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No terminology matched &quot;{searchQuery}&quot;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                    setSelectedChapter(0);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredTerms.map((term) => {
                const isSelected = activeTerm && activeTerm.id === term.id;
                return (
                  <button
                    key={term.id}
                    id={`term-item-${term.id}`}
                    onClick={() => setSelectedTermId(term.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-start justify-between gap-2 ${
                      isSelected
                        ? "bg-white dark:bg-slate-800/90 border-emerald-500/60 shadow-sm ring-1 ring-emerald-500/20"
                        : "bg-white/60 dark:bg-slate-900/50 border-slate-200/70 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-xs font-bold truncate ${
                            isSelected
                              ? "text-emerald-700 dark:text-emerald-300"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {term.term}
                        </span>
                        {term.acronym && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            {term.acronym}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {term.summary}
                      </p>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          Ch {term.chapter}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {term.category}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected
                          ? "text-emerald-500 translate-x-0.5"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Comprehensive Detail View (7 cols on desktop) */}
          <div className="md:col-span-7 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-slate-900 flex flex-col justify-between">
            {activeTerm ? (
              <div className="space-y-5">
                {/* Header & Badges */}
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Chapter {activeTerm.chapter}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {activeTerm.category}
                      </span>
                    </div>

                    <button
                      onClick={handleCopyDefinition}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
                      title="Copy definition to clipboard"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {activeTerm.term}
                  </h1>

                  {activeTerm.acronym && (
                    <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                      Acronym / Standard: {activeTerm.acronym}
                    </p>
                  )}
                </div>

                {/* Direct Interactive Tool Quick Launch */}
                {TERM_QUICK_ACTIONS[activeTerm.id] && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white tracking-wider">
                          {TERM_QUICK_ACTIONS[activeTerm.id].badge}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {TERM_QUICK_ACTIONS[activeTerm.id].title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {TERM_QUICK_ACTIONS[activeTerm.id].description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const action = TERM_QUICK_ACTIONS[activeTerm.id];
                        onClose();
                        if (onNavigateTab) {
                          onNavigateTab(action.tab, action.chapterId, action.subTab);
                        } else if (onNavigateToChapter) {
                          onNavigateToChapter(action.chapterId, action.subTab);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 shrink-0 group hover:shadow-emerald-500/25 active:scale-95"
                    >
                      <span>{TERM_QUICK_ACTIONS[activeTerm.id].buttonText}</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                    </button>
                  </div>
                )}

                {/* Primary Authoritative Definition */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Authoritative Definition</span>
                  </h3>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                    {activeTerm.fullDefinition}
                  </div>
                </div>

                {/* Key Formula / Breakdown (if present) */}
                {activeTerm.keyFormulaOrBreakdown && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-sky-500" />
                      <span>Formula &amp; Core Structure</span>
                    </h3>
                    <div className="p-3.5 rounded-xl bg-sky-500/5 dark:bg-sky-950/20 border border-sky-500/20 font-mono text-xs text-sky-900 dark:text-sky-300">
                      {activeTerm.keyFormulaOrBreakdown}
                    </div>
                  </div>
                )}

                {/* Practical HSE Example */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Workplace Scenario Application</span>
                  </h3>
                  <div className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeTerm.practicalHseExample}
                  </div>
                </div>

                {/* Examiner Pitfall / Distinction */}
                {activeTerm.examinerDistinction && (
                  <div className="p-3.5 rounded-xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Common Examiner Trap &amp; Distinction</span>
                    </div>
                    <p className="text-xs text-rose-950 dark:text-rose-200/90 leading-relaxed pl-5">
                      {activeTerm.examinerDistinction}
                    </p>
                  </div>
                )}

                {/* Related Terms */}
                {activeTerm.relatedTermIds && activeTerm.relatedTermIds.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-purple-500" />
                      <span>Related Terminology</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeTerm.relatedTermIds.map((relId) => {
                        const relTerm = HSE_GLOSSARY_DATA.find((t) => t.id === relId);
                        if (!relTerm) return null;
                        return (
                          <button
                            key={relId}
                            onClick={() => handleSelectRelated(relId)}
                            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 font-medium"
                          >
                            <span>{relTerm.term}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8 text-slate-400">
                <p>Select a term from the list to view its complete definition and workplace context.</p>
              </div>
            )}

            {/* Bottom Navigation Helper */}
            {activeTerm && (onNavigateToChapter || onNavigateTab) && (
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-6 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-400">
                  Topic from Chapter {activeTerm.chapter} ({activeTerm.category})
                </span>
                {TERM_QUICK_ACTIONS[activeTerm.id] ? (
                  <button
                    onClick={() => {
                      const action = TERM_QUICK_ACTIONS[activeTerm.id];
                      onClose();
                      if (onNavigateTab) {
                        onNavigateTab(action.tab, action.chapterId, action.subTab);
                      } else if (onNavigateToChapter) {
                        onNavigateToChapter(action.chapterId, action.subTab);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition group"
                  >
                    <span>{TERM_QUICK_ACTIONS[activeTerm.id].buttonText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      if (onNavigateToChapter) {
                        onNavigateToChapter(activeTerm.chapter);
                      } else if (onNavigateTab) {
                        onNavigateTab("simulations", activeTerm.chapter);
                      }
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>Practice Chapter {activeTerm.chapter} Interactive Simulation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
