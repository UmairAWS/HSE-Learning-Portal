import React, { useState } from "react";
import { Search, Calculator, CheckCircle2, AlertOctagon, HelpCircle, Activity } from "lucide-react";
import FrequencyRateComparator from "./FrequencyRateComparator";

interface Element4SimulationProps {
  initialTab?: "fivewhys" | "active_reactive" | "rate_calc";
}

export default function Element4Simulation({ initialTab }: Element4SimulationProps = {}) {
  const [activeTab, setActiveTab] = useState<"fivewhys" | "active_reactive" | "rate_calc">(
    initialTab || "fivewhys"
  );

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // 5 Whys state
  const [whyStep, setWhyStep] = useState<number>(0);

  const fiveWhysChain = [
    {
      level: 1,
      why: "Why did the forklift truck strike the pedestrian worker?",
      answer: "The pedestrian stepped into the aisle and the forklift driver could not brake in time to avoid the collision.",
      type: "Immediate Cause (Unsafe Act & Unsafe Condition)"
    },
    {
      level: 2,
      why: "Why couldn't the forklift driver stop in time?",
      answer: "The forklift was travelling too fast down a blind corner, and its hydraulic brakes were worn and slipping.",
      type: "Immediate Cause (Mechanical fault & speeding)"
    },
    {
      level: 3,
      why: "Why were the forklift brakes worn and defective?",
      answer: "The vehicle missed its scheduled 6-month preventive maintenance inspection three months ago.",
      type: "Underlying Cause (Inadequate Planned Preventive Maintenance)"
    },
    {
      level: 4,
      why: "Why was the preventive maintenance missed?",
      answer: "There was no system in place to track vehicle maintenance hours or take defective machinery out of service.",
      type: "Root Cause (Management System & Defect Reporting Failure)"
    },
    {
      level: 5,
      why: "Why was the warehouse layout permitting shared pedestrian and vehicle traffic without mirrors?",
      answer: "Senior management failed to conduct a workplace transport risk assessment or implement physical segregation barriers.",
      type: "Ultimate Root Cause (Strategic Leadership & Risk Profiling Omission)"
    }
  ];

  // Active vs Reactive Sorting Game
  const [items, setItems] = useState([
    { id: 1, title: "Weekly safety inspection of workshop machinery guards", category: "active", placed: null as "active" | "reactive" | null },
    { id: 2, title: "Total number of lost-time accidents in the last quarter", category: "reactive", placed: null as "active" | "reactive" | null },
    { id: 3, title: "Pre-use inspection checklist signed by forklift driver", category: "active", placed: null as "active" | "reactive" | null },
    { id: 4, title: "Cost of civil claims for employee spinal compensation", category: "reactive", placed: null as "active" | "reactive" | null },
    { id: 5, title: "Executive safety tour conducted by the Managing Director", category: "active", placed: null as "active" | "reactive" | null },
    { id: 6, title: "Worker sickness absence days caused by work-related back pain", category: "reactive", placed: null as "active" | "reactive" | null },
    { id: 7, title: "Percentage of workers who attended fire safety refresher training", category: "active", placed: null as "active" | "reactive" | null },
    { id: 8, title: "Near-miss report of a falling brick from a 5m scaffold", category: "reactive", placed: null as "active" | "reactive" | null },
  ]);

  const handlePlace = (id: number, target: "active" | "reactive") => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, placed: target } : item)));
  };

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl max-w-lg">
        <button
          onClick={() => setActiveTab("fivewhys")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs md:text-sm transition flex items-center justify-center gap-1.5 ${
            activeTab === "fivewhys"
              ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Search className="w-4 h-4" />
          5 Whys Root Cause
        </button>
        <button
          onClick={() => setActiveTab("active_reactive")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs md:text-sm transition flex items-center justify-center gap-1.5 ${
            activeTab === "active_reactive"
              ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Activity className="w-4 h-4" />
          Active vs Reactive
        </button>
        <button
          onClick={() => setActiveTab("rate_calc")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs md:text-sm transition flex items-center justify-center gap-1.5 ${
            activeTab === "rate_calc"
              ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Calculator className="w-4 h-4" />
          Frequency Rate
        </button>
      </div>

      {activeTab === "fivewhys" && (
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase">
                Accident Investigation Protocol
              </span>
              <span className="text-xs text-slate-500">HSG245 Method</span>
            </div>
            <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
              The &apos;5 Whys&apos; Root Cause Investigation Explorer
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Never stop at immediate causes or blame individuals! Click through the 5 Whys chain to uncover why stopping at &quot;careless driver&quot; fails professional HSE incident analysis.
            </p>
          </div>

          {/* Stepper Chain */}
          <div className="space-y-3">
            {fiveWhysChain.map((step, index) => {
              const isRevealed = index <= whyStep;

              return (
                <div
                  key={step.level}
                  className={`p-4 rounded-xl border transition-all ${
                    isRevealed
                      ? "bg-slate-50 dark:bg-slate-900/90 border-amber-400 dark:border-amber-600/60 shadow-sm"
                      : "bg-slate-100/50 dark:bg-slate-900/30 border-dashed border-slate-300 dark:border-slate-800 opacity-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {step.level}
                      </span>
                      <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">
                        {step.why}
                      </h4>
                    </div>
                    {isRevealed && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                        {step.type}
                      </span>
                    )}
                  </div>

                  {isRevealed && (
                    <div className="mt-2.5 pl-8 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border-l-2 border-amber-500/30 ml-3">
                      {step.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              Depth Level: <strong>{whyStep + 1} of 5</strong>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setWhyStep(Math.max(0, whyStep - 1))}
                disabled={whyStep === 0}
                className="py-1.5 px-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-semibold disabled:opacity-40"
              >
                Previous Why
              </button>
              <button
                onClick={() => setWhyStep(Math.min(4, whyStep + 1))}
                disabled={whyStep === 4}
                className="py-1.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold disabled:opacity-40"
              >
                Drill Down Next Why &rarr;
              </button>
            </div>
          </div>

          {whyStep === 4 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 dark:text-amber-200">
              <strong>💡 Practical HSE Takeaway:</strong> If you only fix the immediate cause (repairing the brake), the warehouse layout remains lethal and another forklift will eventually strike a pedestrian. True remedial action targets the management system (Root Cause #5).
            </div>
          )}
        </div>
      )}

      {activeTab === "active_reactive" && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Active (Leading) vs. Reactive (Lagging) Monitoring Sorting Lab
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Classify each health and safety monitoring metric. Active measures check standards before harm occurs; reactive measures analyze events after they happen:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Bucket */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs md:text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> ACTIVE (Leading Indicators)
                </span>
                <span className="text-[10px] text-emerald-600">Preventive Checks</span>
              </div>

              <div className="space-y-2 min-h-[160px]">
                {items
                  .filter((i) => i.placed === "active")
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg text-xs font-medium border flex items-center justify-between ${
                        item.category === "active"
                          ? "bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-emerald-400"
                          : "bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 border-red-400"
                      }`}
                    >
                      <span>{item.title}</span>
                      <button
                        onClick={() => handlePlace(item.id, null as any)}
                        className="text-[10px] text-slate-400 hover:text-red-500 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Reactive Bucket */}
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border-2 border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs md:text-sm text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4" /> REACTIVE (Lagging Indicators)
                </span>
                <span className="text-[10px] text-amber-600">Historical Loss Data</span>
              </div>

              <div className="space-y-2 min-h-[160px]">
                {items
                  .filter((i) => i.placed === "reactive")
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg text-xs font-medium border flex items-center justify-between ${
                        item.category === "reactive"
                          ? "bg-amber-100/70 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-400"
                          : "bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 border-red-400"
                      }`}
                    >
                      <span>{item.title}</span>
                      <button
                        onClick={() => handlePlace(item.id, null as any)}
                        className="text-[10px] text-slate-400 hover:text-red-500 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Unsorted items */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Unsorted Monitoring Items:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {items
                .filter((i) => i.placed === null)
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs flex items-center justify-between gap-2"
                  >
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{item.title}</span>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handlePlace(item.id, "active")}
                        className="py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                      >
                        Active
                      </button>
                      <button
                        onClick={() => handlePlace(item.id, "reactive")}
                        className="py-1 px-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px]"
                      >
                        Reactive
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            {items.every((i) => i.placed !== null) && (
              <div className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 pt-2">
                <CheckCircle2 className="w-4 h-4" /> All items sorted! Notice that near-misses are reactive because an unwanted event already took place!
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "rate_calc" && <FrequencyRateComparator />}
    </div>
  );
}
