import React, { useState } from "react";
import {
  Calculator,
  BarChart3,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Building2,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Info,
  Scale,
  Layers,
  ShieldCheck,
  Target,
  Eye,
  EyeOff,
  Check
} from "lucide-react";

export interface IndustryBenchmarkSector {
  id: string;
  name: string;
  ratePer100k: number;
  hazardLevel: "Low" | "Moderate" | "High" | "Very High";
  description: string;
  source: string;
}

export const INDUSTRY_SECTORS: IndustryBenchmarkSector[] = [
  {
    id: "offices",
    name: "Offices & Financial",
    ratePer100k: 0.3,
    hazardLevel: "Low",
    description: "Predominantly indoor, sedentary work with minimal machinery or transport exposure.",
    source: "UK HSE Industry Baseline",
  },
  {
    id: "retail",
    name: "Retail & Commercial",
    ratePer100k: 0.8,
    hazardLevel: "Low",
    description: "Customer-facing physical operations, goods stacking, slip/trip hazards, loading areas.",
    source: "HSE / OSHA Retail Profile",
  },
  {
    id: "warehousing",
    name: "Warehousing & Logistics",
    ratePer100k: 1.5,
    hazardLevel: "Moderate",
    description: "Forklift and pedestrian interaction, high racking, manual handling, rapid cross-dock sorting.",
    source: "UK HSE Standard Industry Benchmark",
  },
  {
    id: "manufacturing",
    name: "General Manufacturing",
    ratePer100k: 2.2,
    hazardLevel: "High",
    description: "Machine guarding, assembly lines, metalworking, mechanical tooling, and noise exposure.",
    source: "HSE Manufacturing Report",
  },
  {
    id: "construction",
    name: "Construction & Civil",
    ratePer100k: 3.4,
    hazardLevel: "High",
    description: "Work at height, excavations, heavy mobile plant, scaffolding, dynamic contractors.",
    source: "Construction Health & Safety Norm",
  },
  {
    id: "heavy_extractive",
    name: "Heavy Industry & Mining",
    ratePer100k: 4.8,
    hazardLevel: "Very High",
    description: "Smelting, quarrying, continuous chemical processing, molten metals, and mining.",
    source: "ILO Heavy Industry Benchmark",
  },
];

interface CalcData {
  name: string;
  accidents: number;
  hours: number;
  workers: number;
}

interface PresetScenario {
  id: string;
  title: string;
  subtitle: string;
  calc1: CalcData;
  calc2: CalcData;
  lesson: string;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "growth_paradox",
    title: "The Rapid Expansion Paradox",
    subtitle: "Workforce doubles, accidents rise slightly, but actual safety rate improves dramatically.",
    calc1: {
      name: "Year 2024 (Baseline)",
      accidents: 3,
      hours: 150000,
      workers: 75,
    },
    calc2: {
      name: "Year 2025 (After Expansion)",
      accidents: 5,
      hours: 500000,
      workers: 250,
    },
    lesson:
      "Raw accidents rose from 3 to 5 (+67%), causing panic in the boardroom! However, total exposure hours more than tripled (+233%). The true accident frequency rate fell from 2.00 to 1.00 per 100k hours (a 50% safety improvement). Raw counts deceive; rates reveal true risk exposure.",
  },
  {
    id: "downsizing_illusion",
    title: "The Downsizing Illusion",
    subtitle: "Raw accidents fall from 4 to 3, but the site operated fewer hours — safety actually worsened!",
    calc1: {
      name: "Pre-Restructure (Normal)",
      accidents: 4,
      hours: 400000,
      workers: 200,
    },
    calc2: {
      name: "Post-Restructure (Partial Shut)",
      accidents: 3,
      hours: 150000,
      workers: 80,
    },
    lesson:
      "Management celebrated because accidents fell from 4 to 3 (-25%). But because factory shifts were curtailed, working hours plummeted by 62.5%. The frequency rate spiked from 1.00 up to 2.00 per 100k hours (+100% worse!). Without rate calculation, severe safety degradation remains hidden.",
  },
  {
    id: "cross_site",
    title: "Cross-Site Benchmarking (Site A vs Site B)",
    subtitle: "Two distribution warehouses report the exact same 4 accidents — which one is safer?",
    calc1: {
      name: "Depot North (Small Hub)",
      accidents: 4,
      hours: 100000,
      workers: 50,
    },
    calc2: {
      name: "Depot South (Mega Hub)",
      accidents: 4,
      hours: 500000,
      workers: 250,
    },
    lesson:
      "Both depots had 4 lost-time accidents. Looking at raw data alone, an auditor might assume their performance is equal. In reality, Depot North has an alarming rate of 4.00 per 100k hours, while Depot South has a rate of 0.80 per 100k hours. Depot North is 5 times more hazardous per hour worked!",
  },
  {
    id: "contractor_risk",
    title: "Direct Staff vs. Turnaround Contractors",
    subtitle: "Practical scenario: Comparing injury frequency between direct employees and short-term contractors.",
    calc1: {
      name: "Permanent Employees",
      accidents: 2,
      hours: 320000,
      workers: 160,
    },
    calc2: {
      name: "Maintenance Contractors",
      accidents: 3,
      hours: 60000,
      workers: 60,
    },
    lesson:
      "Contractors had only 3 accidents compared to 2 for permanent staff. However, contractor hours were brief (60,000 hrs). Contractor LTIFR is 5.00 vs 0.63 for staff (nearly 8x higher). In practical workplace assessments, this highlights inadequate contractor vetting, induction, or supervision.",
  },
];

export default function FrequencyRateComparator() {
  // Multiplier: 100,000 (UK HSE Standard) vs 1,000,000 (OSHA/ILO International)
  const [multiplier, setMultiplier] = useState<number>(100000);

  // Calculator 1 (Baseline / Site A / Year 1)
  const [calc1, setCalc1] = useState<CalcData>({
    name: "Site A / Year 1 (Baseline)",
    accidents: 3,
    hours: 150000,
    workers: 75,
  });

  // Calculator 2 (Comparison / Site B / Year 2)
  const [calc2, setCalc2] = useState<CalcData>({
    name: "Site B / Year 2 (Comparison)",
    accidents: 5,
    hours: 500000,
    workers: 250,
  });

  // Benchmark target rate & industry overlay toggle
  const [showBenchmarkOverlay, setShowBenchmarkOverlay] = useState<boolean>(true);
  const [selectedSectorId, setSelectedSectorId] = useState<string>("warehousing");
  const [benchmarkRate, setBenchmarkRate] = useState<number>(1.5);

  const currentSector =
    INDUSTRY_SECTORS.find((s) => s.id === selectedSectorId) || INDUSTRY_SECTORS[2];

  const handleSelectSector = (sector: IndustryBenchmarkSector) => {
    setSelectedSectorId(sector.id);
    setBenchmarkRate(multiplier === 100000 ? sector.ratePer100k : sector.ratePer100k * 10);
  };

  const handleSetMultiplier = (newMultiplier: number) => {
    setMultiplier(newMultiplier);
    const baseRate = currentSector.ratePer100k;
    setBenchmarkRate(newMultiplier === 100000 ? baseRate : baseRate * 10);
  };

  // Graph View: "grouped" | "rate_vs_raw" | "exposure_curve"
  const [graphView, setGraphView] = useState<"grouped" | "rate_vs_raw" | "exposure_curve">("grouped");

  // Quick Hours Calculator modal or toggle for either calculator
  const [hoursHelperFor, setHoursHelperFor] = useState<1 | 2 | null>(null);
  const [helperWeeks, setHelperWeeks] = useState<number>(48);
  const [helperHoursPerWeek, setHelperHoursPerWeek] = useState<number>(40);

  // Math calculations
  const rate1 = (calc1.accidents / (calc1.hours || 1)) * multiplier;
  const rate2 = (calc2.accidents / (calc2.hours || 1)) * multiplier;

  // Incident Rate (Accident Incidence Rate per 1,000 employees)
  const incidentRate1 = ((calc1.accidents * 1000) / (calc1.workers || 1)).toFixed(1);
  const incidentRate2 = ((calc2.accidents * 1000) / (calc2.workers || 1)).toFixed(1);

  // Percentage differences
  const rawAccidentsDiff =
    calc1.accidents > 0
      ? (((calc2.accidents - calc1.accidents) / calc1.accidents) * 100).toFixed(1)
      : "0";

  const hoursDiff =
    calc1.hours > 0
      ? (((calc2.hours - calc1.hours) / calc1.hours) * 100).toFixed(1)
      : "0";

  const rateDiff =
    rate1 > 0
      ? (((rate2 - rate1) / rate1) * 100).toFixed(1)
      : "0";

  const rateDifferenceNum = Number(rateDiff);
  const isRateImproved = rateDifferenceNum < 0;
  const isRateIdentical = rateDifferenceNum === 0;

  const applyHelperHours = (targetCalc: 1 | 2) => {
    const target = targetCalc === 1 ? calc1 : calc2;
    const computedHours = Math.round(target.workers * helperHoursPerWeek * helperWeeks);
    if (targetCalc === 1) {
      setCalc1((prev) => ({ ...prev, hours: computedHours }));
    } else {
      setCalc2((prev) => ({ ...prev, hours: computedHours }));
    }
    setHoursHelperFor(null);
  };

  const loadPreset = (preset: PresetScenario) => {
    setCalc1(preset.calc1);
    setCalc2(preset.calc2);
  };

  // SVG Chart Dimensions & Helpers
  const maxRate = Math.max(rate1, rate2, benchmarkRate * 1.3, 0.1);
  const maxAccidents = Math.max(calc1.accidents, calc2.accidents, 1);

  return (
    <div className="space-y-6">
      {/* Header & Concept Explanation */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 uppercase tracking-wide">
                Chapter 4 Reactive Monitoring (HSE Metric)
              </span>
              <span className="text-xs text-slate-500 font-medium">Standard Statistical Metrics</span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-500" />
              Lost-Time Accident Frequency Rate Dual-Calculator &amp; Comparative Graph
            </h3>
          </div>

          {/* Standard Multiplier Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 px-2">Standard:</span>
            <button
              onClick={() => handleSetMultiplier(100000)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                multiplier === 100000
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              × 100,000 hrs (UK / ISO Standard)
            </button>
            <button
              onClick={() => handleSetMultiplier(1000000)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                multiplier === 1000000
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              × 1,000,000 hrs (OSHA / ILO Standard)
            </button>
          </div>
        </div>

        {/* Core Mathematical Formula Display */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                Standard Lost-Time Injury Frequency Rate (LTIFR) Formula:
              </div>
              <div className="font-mono text-sm md:text-base text-amber-400 font-bold">
                Rate = (Number of Lost-Time Accidents ÷ Total Working Hours) × {multiplier.toLocaleString()}
              </div>
            </div>
            <div className="text-xs text-slate-400 md:text-right border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4">
              <span className="text-amber-300 font-semibold">{multiplier.toLocaleString()} hours</span> equates to ~
              {multiplier === 100000 ? "50 full-time workers" : "500 full-time workers"} working for 1 full year.
            </div>
          </div>
        </div>
      </div>

      {/* Preset Scenarios Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Exam Scenarios (Click to Load):
          </span>
          <span className="text-[11px] text-slate-500">See how raw counts contrast with rates</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_SCENARIOS.map((p) => (
            <button
              key={p.id}
              onClick={() => loadPreset(p)}
              className="p-3 rounded-xl text-left bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 transition group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                  {p.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {p.subtitle}
                </div>
              </div>
              <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                Load Case &rarr;
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* The Two Calculators (Side-by-Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* CALCULATOR 1: Baseline / Site A */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border-2 border-sky-400/40 dark:border-sky-500/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <div>
                <input
                  type="text"
                  value={calc1.name}
                  onChange={(e) => setCalc1({ ...calc1, name: e.target.value })}
                  className="font-bold text-sm text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-sky-500 px-0.5"
                  title="Click to rename"
                />
                <div className="text-[10px] text-slate-500">Baseline Period / First Site</div>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              Calculator A
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Number of Lost-Time Accidents (LTI):
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={calc1.accidents}
                onChange={(e) => setCalc1({ ...calc1, accidents: Math.max(0, Number(e.target.value)) })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Total Hours Worked by All Staff:
                </label>
                <button
                  onClick={() => setHoursHelperFor(hoursHelperFor === 1 ? null : 1)}
                  className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  Estimate from Headcount
                </button>
              </div>
              <input
                type="number"
                min="1000"
                step="10000"
                value={calc1.hours}
                onChange={(e) => setCalc1({ ...calc1, hours: Math.max(1, Number(e.target.value)) })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Average Headcount (for Accident Incidence Rate):
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={calc1.workers}
                onChange={(e) => setCalc1({ ...calc1, workers: Math.max(1, Number(e.target.value)) })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
            </div>

            {/* Inline Hours Estimator Helper */}
            {hoursHelperFor === 1 && (
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-2">
                <div className="text-[11px] font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Working Hours Calculation Helper
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span>Weekly Hours/Worker:</span>
                    <input
                      type="number"
                      value={helperHoursPerWeek}
                      onChange={(e) => setHelperHoursPerWeek(Number(e.target.value))}
                      className="w-full p-1.5 rounded border border-sky-300 dark:border-sky-700 bg-white dark:bg-slate-900 mt-1"
                    />
                  </div>
                  <div>
                    <span>Working Weeks/Year:</span>
                    <input
                      type="number"
                      value={helperWeeks}
                      onChange={(e) => setHelperWeeks(Number(e.target.value))}
                      className="w-full p-1.5 rounded border border-sky-300 dark:border-sky-700 bg-white dark:bg-slate-900 mt-1"
                    />
                  </div>
                </div>
                <button
                  onClick={() => applyHelperHours(1)}
                  className="w-full py-1.5 rounded bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition"
                >
                  Apply: {calc1.workers} × {helperHoursPerWeek} × {helperWeeks} = {(calc1.workers * helperHoursPerWeek * helperWeeks).toLocaleString()} hrs
                </button>
              </div>
            )}
          </div>

          {/* Result Card for Calculator 1 */}
          <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-2">
            <div className="text-[11px] font-semibold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
              {calc1.name} Frequency Rate:
            </div>
            <div className="text-3xl font-black text-sky-600 dark:text-sky-400 font-mono">
              {rate1.toFixed(2)}{" "}
              <span className="text-xs font-normal text-slate-500">
                per {multiplier === 100000 ? "100k" : "1M"} hrs
              </span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between border-t border-sky-200/60 dark:border-sky-800/60 pt-2 font-mono">
              <span>Incident Rate (AIR):</span>
              <strong className="text-slate-900 dark:text-white">{incidentRate1} per 1,000 workers</strong>
            </div>
          </div>
        </div>

        {/* CALCULATOR 2: Comparison / Site B */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border-2 border-indigo-400/40 dark:border-indigo-500/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <div>
                <input
                  type="text"
                  value={calc2.name}
                  onChange={(e) => setCalc2({ ...calc2, name: e.target.value })}
                  className="font-bold text-sm text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-indigo-500 px-0.5"
                  title="Click to rename"
                />
                <div className="text-[10px] text-slate-500">Comparison Period / Second Site</div>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Calculator B
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Number of Lost-Time Accidents (LTI):
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={calc2.accidents}
                onChange={(e) => setCalc2({ ...calc2, accidents: Math.max(0, Number(e.target.value)) })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Total Hours Worked by All Staff:
                </label>
                <button
                  onClick={() => setHoursHelperFor(hoursHelperFor === 2 ? null : 2)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  Estimate from Headcount
                </button>
              </div>
              <input
                type="number"
                min="1000"
                step="10000"
                value={calc2.hours}
                onChange={(e) => setCalc2({ ...calc2, hours: Math.max(1, Number(e.target.value)) })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Average Headcount (for Accident Incidence Rate):
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={calc2.workers}
                onChange={(e) => setCalc2({ ...calc2, workers: Math.max(1, Number(e.target.value)) })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
            </div>

            {/* Inline Hours Estimator Helper */}
            {hoursHelperFor === 2 && (
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <div className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Working Hours Calculation Helper
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span>Weekly Hours/Worker:</span>
                    <input
                      type="number"
                      value={helperHoursPerWeek}
                      onChange={(e) => setHelperHoursPerWeek(Number(e.target.value))}
                      className="w-full p-1.5 rounded border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 mt-1"
                    />
                  </div>
                  <div>
                    <span>Working Weeks/Year:</span>
                    <input
                      type="number"
                      value={helperWeeks}
                      onChange={(e) => setHelperWeeks(Number(e.target.value))}
                      className="w-full p-1.5 rounded border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 mt-1"
                    />
                  </div>
                </div>
                <button
                  onClick={() => applyHelperHours(2)}
                  className="w-full py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                >
                  Apply: {calc2.workers} × {helperHoursPerWeek} × {helperWeeks} = {(calc2.workers * helperHoursPerWeek * helperWeeks).toLocaleString()} hrs
                </button>
              </div>
            )}
          </div>

          {/* Result Card for Calculator 2 */}
          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-2">
            <div className="text-[11px] font-semibold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">
              {calc2.name} Frequency Rate:
            </div>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {rate2.toFixed(2)}{" "}
              <span className="text-xs font-normal text-slate-500">
                per {multiplier === 100000 ? "100k" : "1M"} hrs
              </span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between border-t border-indigo-200/60 dark:border-indigo-800/60 pt-2 font-mono">
              <span>Incident Rate (AIR):</span>
              <strong className="text-slate-900 dark:text-white">{incidentRate2} per 1,000 workers</strong>
            </div>
          </div>
        </div>
      </div>

      {/* THE GRAPH COMPONENT */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Interactive Visual Comparison Chart
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Normalizing risk per hours of exposure to expose the deception of raw accident numbers
            </p>
          </div>

          {/* Action Bar: Benchmark Overlay Toggle + Graph View Tabs */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {/* TOGGLE: Overlay Industry Benchmark */}
            <button
              onClick={() => setShowBenchmarkOverlay((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                showBenchmarkOverlay
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Toggle industry standard safety benchmark overlay and sector performance context"
            >
              <Target className={`w-3.5 h-3.5 ${showBenchmarkOverlay ? "text-amber-500" : "text-slate-400"}`} />
              <span>Industry Benchmark:</span>
              <div
                className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors ${
                  showBenchmarkOverlay ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-xs ${
                    showBenchmarkOverlay ? "translate-x-3.5" : "translate-x-0.5"
                  }`}
                />
              </div>
              <span className="font-mono text-[10px] font-bold">
                {showBenchmarkOverlay ? "ON" : "OFF"}
              </span>
            </button>

            {/* Graph View Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setGraphView("grouped")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  graphView === "grouped"
                    ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Grouped Benchmark Chart
              </button>
              <button
                onClick={() => setGraphView("rate_vs_raw")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  graphView === "rate_vs_raw"
                    ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                Rate vs. Raw Contrast
              </button>
              <button
                onClick={() => setGraphView("exposure_curve")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  graphView === "exposure_curve"
                    ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Hours Exposure Curve
              </button>
            </div>
          </div>
        </div>

        {/* Industry Standard Benchmark Overlay Panel (Dynamic based on Toggle) */}
        {showBenchmarkOverlay ? (
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/90 dark:border-amber-800/70 space-y-3 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Industry Standard Safety Benchmark:
                </span>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  {benchmarkRate.toFixed(2)} per {multiplier === 100000 ? "100k" : "1M"} hrs
                </span>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  ({currentSector.name})
                </span>
              </div>

              {/* Slider for custom fine-tuning */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <span className="text-[11px] text-slate-500 shrink-0">Fine-tune Target:</span>
                <input
                  type="range"
                  min={multiplier === 100000 ? "0.2" : "2"}
                  max={multiplier === 100000 ? "6.0" : "60"}
                  step={multiplier === 100000 ? "0.1" : "1"}
                  value={benchmarkRate}
                  onChange={(e) => setBenchmarkRate(Number(e.target.value))}
                  className="w-full sm:w-36 accent-amber-500 cursor-pointer"
                />
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 w-9 text-right text-xs">
                  {benchmarkRate.toFixed(1)}
                </span>
              </div>
            </div>

            {/* 6 Industry Sector Benchmark Preset Selectors */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Select Sector to Overlay Official Industry Standards:
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                  Hazard Rating: <strong className="text-amber-600 dark:text-amber-400">{currentSector.hazardLevel} Hazard</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {INDUSTRY_SECTORS.map((sector) => {
                  const sectorRate = multiplier === 100000 ? sector.ratePer100k : sector.ratePer100k * 10;
                  const isSelected = selectedSectorId === sector.id && Math.abs(benchmarkRate - sectorRate) < 0.05;
                  return (
                    <button
                      key={sector.id}
                      onClick={() => handleSelectSector(sector)}
                      className={`p-2 rounded-xl text-left transition border cursor-pointer ${
                        isSelected
                          ? "bg-white dark:bg-slate-800 border-amber-500 dark:border-amber-400 shadow-xs ring-2 ring-amber-500/20"
                          : "bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-[11px] truncate text-slate-800 dark:text-slate-200" title={sector.name}>
                          {sector.name.split(" ")[0]}
                        </span>
                        <span className="font-mono font-bold text-[10px] text-amber-600 dark:text-amber-400">
                          {sectorRate.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {sector.hazardLevel}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Context Description of the selected sector */}
              <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5 pt-1">
                <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>{currentSector.name}:</strong> {currentSector.description}{" "}
                  <span className="text-slate-400 dark:text-slate-500">Source: {currentSector.source}</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Target className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Industry Standard Benchmark overlay is off.</strong> Graph displays isolated site-to-site A/B comparison without sector threshold lines.
              </span>
            </div>
            <button
              onClick={() => setShowBenchmarkOverlay(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-amber-600 dark:text-amber-400 text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Enable Overlay
            </button>
          </div>
        )}

        {/* VIEW 1: GROUPED BENCHMARK COMPARATIVE CHART (NEW IMPROVED GRAPH TYPE) */}
        {graphView === "grouped" && (() => {
          const chartMax = showBenchmarkOverlay
            ? Math.max(rate1, rate2, benchmarkRate * 1.25, 1.0) * 1.25
            : Math.max(rate1, rate2, 1.0) * 1.25;
          const plotHeight = 160;
          const baseY = 210;
          const h1 = Math.max(12, (rate1 / chartMax) * plotHeight);
          const h2 = Math.max(12, (rate2 / chartMax) * plotHeight);
          const y1 = baseY - h1;
          const y2 = baseY - h2;
          const benchY = baseY - Math.min(plotHeight, Math.max(0, (benchmarkRate / chartMax) * plotHeight));

          return (
            <div className="space-y-4">
              <div className="w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-4">
                <svg
                  viewBox="0 0 760 290"
                  className="w-full h-auto select-none"
                  style={{ minHeight: "260px" }}
                >
                  <defs>
                    <linearGradient id="calc1Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                    <linearGradient id="calc2Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
                    </filter>
                  </defs>

                  {/* Grid lines and Y-axis marks */}
                  {[0, 0.25, 0.5, 0.75, 1.0].map((step) => {
                    const val = chartMax * step;
                    const gridY = baseY - step * plotHeight;
                    return (
                      <g key={step}>
                        <line
                          x1="75"
                          x2="720"
                          y1={gridY}
                          y2={gridY}
                          stroke="currentColor"
                          className="text-slate-200 dark:text-slate-800"
                          strokeDasharray={step === 0 ? "none" : "3,3"}
                          strokeWidth={step === 0 ? "1.5" : "1"}
                        />
                        <text
                          x="65"
                          y={gridY + 4}
                          textAnchor="end"
                          className="fill-slate-400 font-mono text-[11px]"
                        >
                          {val.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Industry Target Benchmark Line & Shaded Tolerance Zone */}
                  {showBenchmarkOverlay && (
                    <g>
                      <rect
                        x="75"
                        y={benchY}
                        width="645"
                        height={Math.max(0, baseY - benchY)}
                        fill="rgba(245, 158, 11, 0.05)"
                      />
                      <line
                        x1="75"
                        x2="720"
                        y1={benchY}
                        y2={benchY}
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="6,4"
                      />
                      <rect
                        x="565"
                        y={benchY - 12}
                        width="155"
                        height="22"
                        rx="6"
                        fill="#f59e0b"
                        filter="url(#shadow)"
                      />
                      <text
                        x="642"
                        y={benchY + 3}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontWeight="bold"
                        fontSize="10"
                      >
                        Target: {benchmarkRate.toFixed(1)} ({currentSector.name.split(" ")[0]})
                      </text>
                    </g>
                  )}

                  {/* Visual Delta Connector Arc between the two bars */}
                  <g>
                    <path
                      d={`M 255 ${Math.min(y1, y2) - 25} Q 380 ${Math.min(y1, y2) - 45} 505 ${Math.min(y1, y2) - 25}`}
                      fill="none"
                      stroke="currentColor"
                      className="text-slate-300 dark:text-slate-700"
                      strokeWidth="1.5"
                      strokeDasharray="4,3"
                    />
                    <rect
                      x="320"
                      y={Math.min(y1, y2) - 56}
                      width="120"
                      height="24"
                      rx="12"
                      fill={isRateImproved ? "#10b981" : isRateIdentical ? "#64748b" : "#ef4444"}
                      filter="url(#shadow)"
                    />
                    <text
                      x="380"
                      y={Math.min(y1, y2) - 40}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontWeight="bold"
                      fontSize="11"
                    >
                      {isRateImproved
                        ? `↓ -${Math.abs(rateDifferenceNum).toFixed(1)}% Safer`
                        : isRateIdentical
                        ? `= Identical Rate`
                        : `↑ +${Math.abs(rateDifferenceNum).toFixed(1)}% Higher Risk`}
                    </text>
                  </g>

                  {/* Bar 1 (Calc 1) */}
                  <g className="cursor-pointer group">
                    <rect
                      x="200"
                      y={y1}
                      width="110"
                      height={h1}
                      rx="8"
                      fill="url(#calc1Grad)"
                      filter="url(#shadow)"
                      className="transition-all duration-300 group-hover:opacity-90"
                    />
                    {/* Floating Value Pill Badge */}
                    <rect
                      x="195"
                      y={y1 - 28}
                      width="120"
                      height="24"
                      rx="6"
                      fill="#0284c7"
                      filter="url(#shadow)"
                    />
                    <text
                      x="255"
                      y={y1 - 12}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      {rate1.toFixed(2)} / {multiplier === 100000 ? "100k" : "1M"}
                    </text>

                    {/* Target Compliance Indicator */}
                    {showBenchmarkOverlay && (
                      <text
                        x="255"
                        y={baseY + 16}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        className={rate1 <= benchmarkRate ? "fill-emerald-600 dark:fill-emerald-400" : "fill-rose-500"}
                      >
                        {rate1 <= benchmarkRate
                          ? `✓ Within Benchmark (${((1 - rate1 / benchmarkRate) * 100).toFixed(0)}% Safer)`
                          : `⚠️ Exceeds Benchmark (+${((rate1 / benchmarkRate - 1) * 100).toFixed(0)}%)`}
                      </text>
                    )}
                    {/* Label */}
                    <text
                      x="255"
                      y={baseY + 36}
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="bold"
                      className="fill-slate-900 dark:fill-white"
                    >
                      {calc1.name}
                    </text>
                    <text
                      x="255"
                      y={baseY + 54}
                      textAnchor="middle"
                      fontSize="11"
                      className="fill-slate-500"
                    >
                      {calc1.accidents} LTIs · {calc1.hours.toLocaleString()} hrs · {calc1.workers} staff
                    </text>
                  </g>

                  {/* Bar 2 (Calc 2) */}
                  <g className="cursor-pointer group">
                    <rect
                      x="450"
                      y={y2}
                      width="110"
                      height={h2}
                      rx="8"
                      fill="url(#calc2Grad)"
                      filter="url(#shadow)"
                      className="transition-all duration-300 group-hover:opacity-90"
                    />
                    {/* Floating Value Pill Badge */}
                    <rect
                      x="445"
                      y={y2 - 28}
                      width="120"
                      height="24"
                      rx="6"
                      fill="#4f46e5"
                      filter="url(#shadow)"
                    />
                    <text
                      x="505"
                      y={y2 - 12}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      {rate2.toFixed(2)} / {multiplier === 100000 ? "100k" : "1M"}
                    </text>

                    {/* Target Compliance Indicator */}
                    {showBenchmarkOverlay && (
                      <text
                        x="505"
                        y={baseY + 16}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        className={rate2 <= benchmarkRate ? "fill-emerald-600 dark:fill-emerald-400" : "fill-rose-500"}
                      >
                        {rate2 <= benchmarkRate
                          ? `✓ Within Benchmark (${((1 - rate2 / benchmarkRate) * 100).toFixed(0)}% Safer)`
                          : `⚠️ Exceeds Benchmark (+${((rate2 / benchmarkRate - 1) * 100).toFixed(0)}%)`}
                      </text>
                    )}
                    {/* Label */}
                    <text
                      x="505"
                      y={baseY + 36}
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="bold"
                      className="fill-slate-900 dark:fill-white"
                    >
                      {calc2.name}
                    </text>
                    <text
                      x="505"
                      y={baseY + 54}
                      textAnchor="middle"
                      fontSize="11"
                      className="fill-slate-500"
                    >
                      {calc2.accidents} LTIs · {calc2.hours.toLocaleString()} hrs · {calc2.workers} staff
                    </text>
                  </g>
                </svg>
              </div>

              {/* Quick Summary Cards below the SVG */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-sky-800 dark:text-sky-300">
                      {calc1.name}
                    </span>
                    <div className="text-slate-600 dark:text-slate-400">
                      {calc1.accidents} accidents in {calc1.hours.toLocaleString()} hours
                    </div>
                    {showBenchmarkOverlay && (
                      <div className="pt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            rate1 <= benchmarkRate
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                              : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                          }`}
                        >
                          {rate1 <= benchmarkRate ? (
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          ) : (
                            <AlertTriangle className="w-2.5 h-2.5" />
                          )}
                          {rate1 <= benchmarkRate
                            ? `${((1 - rate1 / benchmarkRate) * 100).toFixed(0)}% below ${currentSector.name.split(" ")[0]} norm`
                            : `+${((rate1 / benchmarkRate - 1) * 100).toFixed(0)}% above ${currentSector.name.split(" ")[0]} norm`}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-mono font-bold text-base text-sky-600 dark:text-sky-400">
                    {rate1.toFixed(2)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300">
                      {calc2.name}
                    </span>
                    <div className="text-slate-600 dark:text-slate-400">
                      {calc2.accidents} accidents in {calc2.hours.toLocaleString()} hours
                    </div>
                    {showBenchmarkOverlay && (
                      <div className="pt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            rate2 <= benchmarkRate
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                              : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                          }`}
                        >
                          {rate2 <= benchmarkRate ? (
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          ) : (
                            <AlertTriangle className="w-2.5 h-2.5" />
                          )}
                          {rate2 <= benchmarkRate
                            ? `${((1 - rate2 / benchmarkRate) * 100).toFixed(0)}% below ${currentSector.name.split(" ")[0]} norm`
                            : `+${((rate2 / benchmarkRate - 1) * 100).toFixed(0)}% above ${currentSector.name.split(" ")[0]} norm`}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-mono font-bold text-base text-indigo-600 dark:text-indigo-400">
                    {rate2.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* VIEW 2: RATE VS RAW COUNTS (FIXED UI/UX - ZERO TEXT COLLISION) */}
        {graphView === "rate_vs_raw" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Standardized Frequency Rate Bar Graph */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">
                      A. Frequency Rate (Normalized)
                    </span>
                    <span className="text-[11px] text-slate-500">True risk per hours worked</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                    Per {multiplier === 100000 ? "100k" : "1M"} hrs
                  </span>
                </div>

                {/* Safe Headroom Plotting Canvas */}
                <div className="h-64 relative flex items-end justify-around pt-10 pb-6 px-4 border-b border-l border-slate-300 dark:border-slate-700">
                  {/* Benchmark target line */}
                  {showBenchmarkOverlay && (
                    <div
                      className="absolute left-0 right-0 border-t-2 border-dashed border-amber-500 z-10 flex items-center justify-end pr-2 pointer-events-none"
                      style={{
                        bottom: `${Math.min(170, Math.max(24, (benchmarkRate / maxRate) * 120 + 24))}px`,
                      }}
                    >
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white shadow-sm">
                        Benchmark: {benchmarkRate.toFixed(2)} ({currentSector.name.split(" ")[0]})
                      </span>
                    </div>
                  )}

                  {/* Bar 1 (Calc 1) */}
                  <div className="flex flex-col items-center group w-28">
                    <span className="mb-2 px-2.5 py-1 rounded-full text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800 font-mono shadow-sm">
                      {rate1.toFixed(2)}
                    </span>
                    <div
                      className="w-16 rounded-t-xl bg-gradient-to-t from-sky-600 to-sky-400 transition-all duration-500 shadow-md group-hover:brightness-110"
                      style={{
                        height: `${Math.min(130, Math.max(16, (rate1 / maxRate) * 120))}px`,
                      }}
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center mt-2.5 max-w-[110px] leading-tight">
                      {calc1.name}
                    </span>
                  </div>

                  {/* Bar 2 (Calc 2) */}
                  <div className="flex flex-col items-center group w-28">
                    <span className="mb-2 px-2.5 py-1 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-800 font-mono shadow-sm">
                      {rate2.toFixed(2)}
                    </span>
                    <div
                      className="w-16 rounded-t-xl bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-500 shadow-md group-hover:brightness-110"
                      style={{
                        height: `${Math.min(130, Math.max(16, (rate2 / maxRate) * 120))}px`,
                      }}
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center mt-2.5 max-w-[110px] leading-tight">
                      {calc2.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Lower bar = Safer workplace</span>
                  {showBenchmarkOverlay ? (
                    <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                      <span>Industry Target ({currentSector.name.split(" ")[0]})</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400">Benchmark overlay hidden</span>
                  )}
                </div>
              </div>

              {/* Right Column: Raw Accidents Bar Graph (The Deceptive Count) */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">
                      B. Raw Lost-Time Accidents (Deceptive)
                    </span>
                    <span className="text-[11px] text-slate-500">Unadjusted headcounts</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Absolute Count
                  </span>
                </div>

                {/* Safe Headroom Plotting Canvas for Raw Count */}
                <div className="h-64 relative flex items-end justify-around pt-10 pb-6 px-4 border-b border-l border-slate-300 dark:border-slate-700">
                  {/* Bar 1 (Calc 1 Raw) */}
                  <div className="flex flex-col items-center group w-28">
                    <span className="mb-2 px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono shadow-sm">
                      {calc1.accidents} LTIs
                    </span>
                    <div
                      className="w-16 rounded-t-xl bg-gradient-to-t from-slate-500 to-slate-400 transition-all duration-500 shadow-md group-hover:brightness-110"
                      style={{
                        height: `${Math.min(130, Math.max(16, (calc1.accidents / maxAccidents) * 120))}px`,
                      }}
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center mt-2.5 max-w-[110px] leading-tight">
                      {calc1.name}
                    </span>
                  </div>

                  {/* Bar 2 (Calc 2 Raw) */}
                  <div className="flex flex-col items-center group w-28">
                    <span className="mb-2 px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono shadow-sm">
                      {calc2.accidents} LTIs
                    </span>
                    <div
                      className="w-16 rounded-t-xl bg-gradient-to-t from-slate-600 to-slate-500 transition-all duration-500 shadow-md group-hover:brightness-110"
                      style={{
                        height: `${Math.min(130, Math.max(16, (calc2.accidents / maxAccidents) * 120))}px`,
                      }}
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center mt-2.5 max-w-[110px] leading-tight">
                      {calc2.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Ignores workforce size &amp; hours</span>
                  <span className="font-semibold text-rose-500">
                    {Number(rawAccidentsDiff) > 0
                      ? `+${rawAccidentsDiff}% Raw Increase`
                      : Number(rawAccidentsDiff) === 0
                      ? "0.0% Raw Difference"
                      : `${rawAccidentsDiff}% Raw Decrease`}
                  </span>
                </div>
              </div>
            </div>

            {/* Deception Gap Analysis Callout */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Statistical Deception Gap:</strong> Raw accident counts show{" "}
                  <strong>
                    {Number(rawAccidentsDiff) === 0
                      ? "no difference (identical)"
                      : `${rawAccidentsDiff}% change`}
                  </strong>
                  , but the normalized frequency rate reveals a{" "}
                  <strong>{Math.abs(rateDifferenceNum).toFixed(1)}% {isRateImproved ? "improvement" : "deterioration"}</strong> in safety risk per hour worked.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: INTERACTIVE HOURS EXPOSURE CURVE */}
        {graphView === "exposure_curve" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                <strong>Why the denominator matters:</strong> See how accident frequency rate changes as total working hours scale from 50,000 to 1,000,000 hours for both accident counts ({calc1.name}: {calc1.accidents} accidents vs {calc2.name}: {calc2.accidents} accidents).
              </div>

              {/* Sensitivity Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-500 font-semibold">
                      <th className="py-2 px-3">Working Hours</th>
                      <th className="py-2 px-3">Approx. Workers</th>
                      <th className="py-2 px-3 text-sky-600 dark:text-sky-400">
                        {calc1.name} ({calc1.accidents} LTIs)
                      </th>
                      <th className="py-2 px-3 text-indigo-600 dark:text-indigo-400">
                        {calc2.name} ({calc2.accidents} LTIs)
                      </th>
                      <th className="py-2 px-3">Benchmark ({benchmarkRate.toFixed(2)})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                    {[50000, 100000, 250000, 500000, 750000, 1000000].map((testHours) => {
                      const r1 = ((calc1.accidents / testHours) * multiplier).toFixed(2);
                      const r2 = ((calc2.accidents / testHours) * multiplier).toFixed(2);
                      const approxHeadcount = Math.round(testHours / 2000);

                      return (
                        <tr
                          key={testHours}
                          className={`hover:bg-slate-100 dark:hover:bg-slate-800/50 transition ${
                            testHours === calc1.hours || testHours === calc2.hours
                              ? "bg-amber-500/10 font-bold"
                              : ""
                          }`}
                        >
                          <td className="py-2.5 px-3">{testHours.toLocaleString()} hrs</td>
                          <td className="py-2.5 px-3 font-sans text-slate-500">~{approxHeadcount} staff</td>
                          <td className="py-2.5 px-3 text-sky-600 dark:text-sky-400">{r1}</td>
                          <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">{r2}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-sans">
                            {Number(r2) <= benchmarkRate ? (
                              <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Within Target
                              </span>
                            ) : (
                              <span className="text-rose-500 text-[11px] flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Exceeds Target
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* COMPARATIVE VERDICT & DECEPTION CALLOUT BANNER (MOVED DIRECTLY BELOW GRAPH) */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isRateImproved
            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
            : isRateIdentical
            ? "bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700"
            : "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800"
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isRateImproved ? (
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <TrendingDown className="w-4 h-4" />
                </div>
              ) : isRateIdentical ? (
                <div className="w-8 h-8 rounded-full bg-slate-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Scale className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <TrendingUp className="w-4 h-4" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                  Comparative Analysis:{" "}
                  {isRateImproved ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-black">
                      Safety Improved by {Math.abs(rateDifferenceNum).toFixed(1)}%
                    </span>
                  ) : isRateIdentical ? (
                    <span className="text-slate-600 dark:text-slate-300 font-black">Identical Rates</span>
                  ) : (
                    <span className="text-rose-700 dark:text-rose-400 font-black">
                      Safety Deteriorated by +{Math.abs(rateDifferenceNum).toFixed(1)}%
                    </span>
                  )}
                </h4>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Raw accidents went from <strong>{calc1.accidents}</strong> to <strong>{calc2.accidents}</strong> ({Number(rawAccidentsDiff) >= 0 ? `+${rawAccidentsDiff}%` : `${rawAccidentsDiff}%`}), while total exposure hours changed by {Number(hoursDiff) >= 0 ? `+${hoursDiff}%` : `${hoursDiff}%`}.
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0 self-end md:self-auto font-mono">
            <div className="text-center p-2 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="block text-[10px] text-slate-500">Calc 1 Rate</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">{rate1.toFixed(2)}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="text-center p-2 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="block text-[10px] text-slate-500">Calc 2 Rate</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{rate2.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* HSE Assessment Insight text with accurate condition handling */}
        <div className="mt-3.5 pt-3 border-t border-slate-200/70 dark:border-slate-700/70 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong>HSE Assessment Takeaway: </strong>
            {calc1.accidents === calc2.accidents && isRateImproved && (
              <span>
                Raw accidents remained identical ({calc1.accidents} to {calc2.accidents}), yet the safety frequency rate improved dramatically by <strong>{Math.abs(rateDifferenceNum).toFixed(1)}%</strong> because exposure hours expanded by <strong>+{hoursDiff}%</strong>. In scenario-based assessments, examiners test this scenario: candidates who look solely at identical raw incident counts fail to recognize the significant drop in injury probability per hour worked!
              </span>
            )}
            {calc1.accidents === calc2.accidents && !isRateImproved && !isRateIdentical && (
              <span>
                Raw accidents remained identical ({calc1.accidents} to {calc2.accidents}), yet the safety frequency rate worsened by <strong>+{Math.abs(rateDifferenceNum).toFixed(1)}%</strong> because operational hours dropped. Fewer hours with identical injuries means workers faced greater risk per hour of work.
              </span>
            )}
            {calc2.accidents > calc1.accidents && isRateImproved && (
              <span>
                Even though raw accidents <em>increased</em> (+{rawAccidentsDiff}%), the accident frequency rate <em>decreased</em> (-{Math.abs(rateDifferenceNum).toFixed(1)}%) because the workforce or working hours expanded much faster (+{hoursDiff}%). In a scenario-based assessment, students who rely solely on raw figures will mistakenly criticize safety performance and miss this positive statistical trend!
              </span>
            )}
            {calc2.accidents < calc1.accidents && !isRateImproved && (
              <span>
                Even though raw accidents <em>decreased</em> ({rawAccidentsDiff}%), the frequency rate actually <em>got worse</em> (+{Math.abs(rateDifferenceNum).toFixed(1)}%) because working hours dropped sharply ({hoursDiff}%). A superficial observer would praise the reduction in accidents, failing to realize that workers experienced higher accident probability per hour!
              </span>
            )}
            {calc2.accidents > calc1.accidents && !isRateImproved && (
              <span>
                Both raw accidents and frequency rates rose. This indicates genuine degradation in health and safety control measures that cannot be excused by workforce changes.
              </span>
            )}
            {calc2.accidents < calc1.accidents && isRateImproved && (
              <span>
                Both raw accidents and frequency rates fell. This demonstrates comprehensive safety improvement across both absolute incident count and hours of exposure.
              </span>
            )}
            {isRateIdentical && calc1.accidents === calc2.accidents && (
              <span>
                Both sites or periods have identical accident numbers and working hours, resulting in matching frequency rates.
              </span>
            )}
          </div>
        </div>

        {/* Industry Standard Benchmark Context (Overlay Mode) */}
        {showBenchmarkOverlay && (
          <div className="mt-3 pt-3 border-t border-amber-200/80 dark:border-amber-900/60 text-xs text-slate-800 dark:text-slate-200 leading-relaxed flex items-start gap-2">
            <Building2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1.5 w-full">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  Industry Benchmark Performance ({currentSector.name} · Target: {benchmarkRate.toFixed(2)} / {multiplier === 100000 ? "100k" : "1M"} hrs):
                </span>
                <span className="text-[10px] text-slate-500">
                  Ref: {currentSector.source}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div
                  className={`p-2 rounded-lg border ${
                    rate1 <= benchmarkRate
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200"
                  }`}
                >
                  <strong>{calc1.name}:</strong> Frequency rate of <strong>{rate1.toFixed(2)}</strong> is{" "}
                  {rate1 <= benchmarkRate ? (
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                      ✓ {((1 - rate1 / benchmarkRate) * 100).toFixed(1)}% safer than the industry standard.
                    </span>
                  ) : (
                    <span className="font-semibold text-rose-700 dark:text-rose-300">
                      ⚠️ {((rate1 / benchmarkRate - 1) * 100).toFixed(1)}% higher than the industry standard.
                    </span>
                  )}
                </div>
                <div
                  className={`p-2 rounded-lg border ${
                    rate2 <= benchmarkRate
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200"
                  }`}
                >
                  <strong>{calc2.name}:</strong> Frequency rate of <strong>{rate2.toFixed(2)}</strong> is{" "}
                  {rate2 <= benchmarkRate ? (
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                      ✓ {((1 - rate2 / benchmarkRate) * 100).toFixed(1)}% safer than the industry standard.
                    </span>
                  ) : (
                    <span className="font-semibold text-rose-700 dark:text-rose-300">
                      ⚠️ {((rate2 / benchmarkRate - 1) * 100).toFixed(1)}% higher than the industry standard.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step HSE Assessment Answer Writing Guide */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-800 dark:text-slate-200 space-y-2">
        <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-amber-600" />
          How to Score Full Marks on Rate Questions in Practical HSE Assessments:
        </div>
        <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>State the formula explicitly:</strong> Write out <em>Rate = (Number of LTIs ÷ Total Hours Worked) × 100,000</em>. Never skip this step.
          </li>
          <li>
            <strong>Show your working:</strong> Substitute the exact numbers: <em>({calc2.accidents} ÷ {calc2.hours.toLocaleString()}) × {multiplier.toLocaleString()} = {rate2.toFixed(2)}</em>.
          </li>
          <li>
            <strong>Always specify the units:</strong> Write &quot;{rate2.toFixed(2)} per {multiplier === 100000 ? "100,000" : "1,000,000"} hours worked&quot; (a naked number loses marks).
          </li>
          <li>
            <strong>Evaluate the trend critically:</strong> Explain to the examiner whether changes in working hours, overtime, or plant closures explain why the rate moved differently from raw accident counts.
          </li>
        </ol>
      </div>
    </div>
  );
}
