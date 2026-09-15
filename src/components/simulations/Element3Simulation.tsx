import React, { useState, useEffect, useRef } from "react";
import { Shield, AlertOctagon, Check, Play, FileText, CheckCircle2 } from "lucide-react";

interface HazardScenario {
  id: string;
  title: string;
  category: "Chemical & Molecular" | "Physical Height" | "Mechanical Plant";
  description: string;
  initialLikelihood: number;
  initialSeverity: number;
  molecularFormula?: string;
  molecularDetails?: string;
  controls: {
    tier: number;
    name: string;
    description: string;
    likelihoodReduction: number;
    severityReduction: number;
  }[];
}

const SCENARIOS: HazardScenario[] = [
  {
    id: "chem_degreaser",
    title: "Vapour Degreasing with Trichloroethylene (TCE)",
    category: "Chemical & Molecular",
    description: "Workers manually clean machined components in open solvent tanks. TCE vapour evaporates rapidly, creating severe chronic neurotoxic & carcinogenic risks.",
    initialLikelihood: 5,
    initialSeverity: 5,
    molecularFormula: "C₂HCl₃ (Trichloroethylene)",
    molecularDetails: "Halogenated organic compound. Inhaled molecules rapidly cross the blood-brain barrier and cause acute narcosis and long-term renal cancer.",
    controls: [
      {
        tier: 1,
        name: "Elimination: Ultrasonic Hot-Water Wash",
        description: "Completely eliminate the solvent degreaser; replace with aqueous alkaline cleaning system.",
        likelihoodReduction: 4,
        severityReduction: 4,
      },
      {
        tier: 2,
        name: "Substitution: Low-VOC Citrus Ester",
        description: "Substitute toxic TCE with biodegradable non-toxic aqueous degreasing agent.",
        likelihoodReduction: 3,
        severityReduction: 3,
      },
      {
        tier: 3,
        name: "Engineering: Local Exhaust Ventilation (LEV) & Sealed Tank",
        description: "Enclose vapour tank with lip extraction and automated mechanical parts basket.",
        likelihoodReduction: 3,
        severityReduction: 1,
      },
      {
        tier: 4,
        name: "Administrative: Safe System of Work & 20-min Job Rotation",
        description: "Strict work procedures limiting exposure time, air monitoring, and mandatory training.",
        likelihoodReduction: 1,
        severityReduction: 1,
      },
      {
        tier: 5,
        name: "PPE: Organic Vapour Chemical Respirator & Nitrile Gloves",
        description: "Wear half-mask cartridge respirators and chemical-resistant gloves (safe person last resort).",
        likelihoodReduction: 1,
        severityReduction: 0,
      },
    ],
  },
  {
    id: "work_height",
    title: "Fragile Asbestos-Cement Roof Maintenance",
    category: "Physical Height",
    description: "Maintenance workers must access gutters above an old 7-metre warehouse roof composed of brittle corrugated asbestos sheeting.",
    initialLikelihood: 4,
    initialSeverity: 5,
    controls: [
      {
        tier: 1,
        name: "Elimination: Ground-Level Drone & Telescopic Camera",
        description: "Perform gutter inspection using a high-resolution drone without any worker mounting the roof.",
        likelihoodReduction: 4,
        severityReduction: 4,
      },
      {
        tier: 2,
        name: "Substitution: Mobile Elevating Work Platform (MEWP)",
        description: "Position cherry picker / scissor lift adjacent to building instead of stepping on fragile roof.",
        likelihoodReduction: 3,
        severityReduction: 2,
      },
      {
        tier: 3,
        name: "Engineering: Crawling Boards & Edge Protection Guardrails",
        description: "Install load-spreading crawling boards, safety staging, and perimeter scaffolding.",
        likelihoodReduction: 3,
        severityReduction: 1,
      },
      {
        tier: 4,
        name: "Administrative: Roof-Work Permit & Weather Restrictions",
        description: "Prohibit work in rain/frost, mandatory site induction, and continuous ground supervision.",
        likelihoodReduction: 1,
        severityReduction: 0,
      },
      {
        tier: 5,
        name: "PPE: Fall-Arrest Harness & Hard Hat with Chin Strap",
        description: "Connect inertia reel harness to overhead static safety lifeline.",
        likelihoodReduction: 0,
        severityReduction: 2,
      },
    ],
  },
];

interface Element3SimulationProps {
  initialTab?: "matrix" | "ptw";
}

export default function Element3Simulation({ initialTab }: Element3SimulationProps = {}) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("chem_degreaser");
  const [appliedControlIndices, setAppliedControlIndices] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"matrix" | "ptw">(initialTab || "matrix");

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // PTW interactive form state
  const [ptwStep, setPtwStep] = useState<1 | 2 | 3 | 4>(1);
  const [ptwSignatures, setPtwSignatures] = useState({
    authorisingManager: "",
    competentWorker: "",
    clearanceSign: "",
    cancellationSign: "",
  });

  const scenario = SCENARIOS.find((s) => s.id === selectedScenarioId)!;

  // Calculate current risk
  let currentLikelihood = scenario.initialLikelihood;
  let currentSeverity = scenario.initialSeverity;

  appliedControlIndices.forEach((idx) => {
    const ctrl = scenario.controls[idx];
    if (ctrl) {
      currentLikelihood = Math.max(1, currentLikelihood - ctrl.likelihoodReduction);
      currentSeverity = Math.max(1, currentSeverity - ctrl.severityReduction);
    }
  });

  const initialRiskScore = scenario.initialLikelihood * scenario.initialSeverity;
  const currentRiskScore = currentLikelihood * currentSeverity;

  const toggleControl = (index: number) => {
    if (appliedControlIndices.includes(index)) {
      setAppliedControlIndices(appliedControlIndices.filter((i) => i !== index));
    } else {
      setAppliedControlIndices([...appliedControlIndices, index]);
    }
  };

  // Canvas interactive molecular visualizer for chemical hazard
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (activeTab !== "matrix" || selectedScenarioId !== "chem_degreaser") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    // Simulated atoms in C2HCl3
    // Carbon-1, Carbon-2, Chlorine-1, Chlorine-2, Chlorine-3, Hydrogen
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      angle += 0.02;

      // Draw background glow
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140);
      grad.addColorStop(0, "rgba(30, 41, 59, 0.8)");
      grad.addColorStop(1, "rgba(15, 23, 42, 1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Orbital rotation offset
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Positions
      const c1 = { x: cx - 40 * cosA, y: cy - 20 * sinA, r: 18, color: "#475569", label: "C" };
      const c2 = { x: cx + 40 * cosA, y: cy + 20 * sinA, r: 18, color: "#475569", label: "C" };
      const cl1 = { x: c1.x - 45 * sinA, y: c1.y + 40 * cosA, r: 22, color: "#10b981", label: "Cl" };
      const cl2 = { x: c1.x + 35 * sinA, y: c1.y - 45 * cosA, r: 22, color: "#10b981", label: "Cl" };
      const cl3 = { x: c2.x + 45 * sinA, y: c2.y - 40 * cosA, r: 22, color: "#10b981", label: "Cl" };
      const h1 = { x: c2.x - 30 * sinA, y: c2.y + 35 * cosA, r: 12, color: "#e2e8f0", label: "H" };

      // Bonds
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 4;
      const drawBond = (p1: any, p2: any) => {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      };

      // Double bond between C1 and C2
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(c1.x - 4 * sinA, c1.y + 4 * cosA);
      ctx.lineTo(c2.x - 4 * sinA, c2.y + 4 * cosA);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(c1.x + 4 * sinA, c1.y - 4 * cosA);
      ctx.lineTo(c2.x + 4 * sinA, c2.y - 4 * cosA);
      ctx.stroke();

      drawBond(c1, cl1);
      drawBond(c1, cl2);
      drawBond(c2, cl3);
      drawBond(c2, h1);

      // Draw Atoms
      const atoms = [cl1, cl2, cl3, c1, c2, h1];
      atoms.forEach((atom) => {
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, atom.r, 0, Math.PI * 2);
        ctx.fillStyle = atom.color;
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = atom.label === "H" ? "#0f172a" : "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(atom.label, atom.x, atom.y);
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeTab, selectedScenarioId]);

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab("matrix")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs md:text-sm transition flex items-center justify-center gap-1.5 ${
            activeTab === "matrix"
              ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Shield className="w-4 h-4" />
          5x5 Matrix & Control Lab
        </button>
        <button
          onClick={() => setActiveTab("ptw")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs md:text-sm transition flex items-center justify-center gap-1.5 ${
            activeTab === "ptw"
              ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <FileText className="w-4 h-4" />
          Permit-to-Work (PTW)
        </button>
      </div>

      {activeTab === "matrix" ? (
        <div className="space-y-6">
          {/* Scenario Selector */}
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  setAppliedControlIndices([]);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  selectedScenarioId === sc.id
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span>{sc.category === "Chemical & Molecular" ? "🧪" : "🏗️"}</span>
                <span>{sc.title}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Hazard description & Controls Checklist */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 uppercase">
                  {scenario.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 mb-1">
                  {scenario.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {scenario.description}
                </p>

                {scenario.molecularFormula && (
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 mb-2">
                    <canvas ref={canvasRef} width={130} height={100} className="rounded-lg shrink-0" />
                    <div className="text-[11px] space-y-1">
                      <div className="text-emerald-400 font-bold">{scenario.molecularFormula}</div>
                      <p className="text-slate-400 leading-snug">{scenario.molecularDetails}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hierarchy of Controls Checklist */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>General Hierarchy of Control (ISO 45001 / ILO):</span>
                  <span className="text-[10px] text-slate-500 font-normal">Click to apply/remove</span>
                </div>

                <div className="space-y-2">
                  {scenario.controls.map((ctrl, index) => {
                    const isApplied = appliedControlIndices.includes(index);
                    const tierNames = [
                      "1. Elimination (Most Effective)",
                      "2. Substitution",
                      "3. Engineering Controls",
                      "4. Administrative Controls",
                      "5. Personal Protective Equipment (Least Effective)",
                    ];

                    return (
                      <button
                        key={index}
                        onClick={() => toggleControl(index)}
                        className={`w-full text-left p-2.5 rounded-lg border transition text-xs flex items-start gap-2.5 ${
                          isApplied
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-slate-900 dark:text-white shadow-sm"
                            : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                            isApplied
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-400"
                          }`}
                        >
                          {isApplied && <Check className="w-3 h-3" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-[11px] text-slate-900 dark:text-white">
                              {tierNames[ctrl.tier - 1]}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              L-{ctrl.likelihoodReduction}, S-{ctrl.severityReduction}
                            </span>
                          </div>
                          <div className="font-medium text-[11px] text-emerald-600 dark:text-emerald-400">
                            {ctrl.name}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {ctrl.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: 5x5 Matrix & Risk Score Card */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Interactive 5x5 Risk Assessment Matrix
                  </h4>
                  <div className="text-xs">
                    Risk = Likelihood ({currentLikelihood}) × Severity ({currentSeverity})
                  </div>
                </div>

                {/* 5x5 Grid */}
                <div className="relative">
                  <div className="flex flex-col gap-1">
                    {[5, 4, 3, 2, 1].map((sVal) => (
                      <div key={sVal} className="flex items-center gap-1">
                        <span className="w-5 text-[10px] font-bold text-slate-400 text-right pr-1">
                          S{sVal}
                        </span>
                        {[1, 2, 3, 4, 5].map((lVal) => {
                          const score = sVal * lVal;
                          const isInitial =
                            scenario.initialLikelihood === lVal && scenario.initialSeverity === sVal;
                          const isCurrent = currentLikelihood === lVal && currentSeverity === sVal;

                          let bgClass = "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300";
                          if (score >= 15) {
                            bgClass = "bg-rose-500/25 text-rose-700 dark:text-rose-300";
                          } else if (score >= 8) {
                            bgClass = "bg-amber-500/25 text-amber-700 dark:text-amber-300";
                          }

                          return (
                            <div
                              key={lVal}
                              className={`flex-1 h-9 rounded-md flex items-center justify-center font-bold text-xs relative transition ${bgClass} ${
                                isCurrent
                                  ? "ring-2 ring-emerald-500 scale-105 z-10 shadow-md font-black"
                                  : isInitial
                                  ? "ring-2 ring-rose-500 opacity-90"
                                  : "opacity-70"
                              }`}
                            >
                              <span>{score}</span>
                              {isCurrent && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                              )}
                              {isInitial && !isCurrent && (
                                <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" title="Initial Hazard Level"></span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 pl-6">
                    <span>L1 (Rare)</span>
                    <span>L2 (Unlikely)</span>
                    <span>L3 (Possible)</span>
                    <span>L4 (Likely)</span>
                    <span>L5 (Very Probable)</span>
                  </div>
                </div>

                {/* Score Comparison */}
                <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Initial Risk</div>
                    <div className="text-xl font-extrabold text-rose-500">{initialRiskScore} / 25</div>
                    <div className="text-[10px] text-rose-400 font-semibold">Unacceptable (High Risk)</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Residual Risk</div>
                    <div
                      className={`text-xl font-extrabold ${
                        currentRiskScore <= 6
                          ? "text-emerald-500"
                          : currentRiskScore <= 12
                          ? "text-amber-500"
                          : "text-rose-500"
                      }`}
                    >
                      {currentRiskScore} / 25
                    </div>
                    <div
                      className={`text-[10px] font-semibold ${
                        currentRiskScore <= 6
                          ? "text-emerald-500"
                          : currentRiskScore <= 12
                          ? "text-amber-500"
                          : "text-rose-500"
                      }`}
                    >
                      {currentRiskScore <= 6
                        ? "Acceptable (Safe to Proceed)"
                        : currentRiskScore <= 12
                        ? "Tolerable (Interim Controls)"
                        : "Unacceptable"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
                <strong>🎯 Key Lesson for HSE Assessment:</strong> Technical engineering controls (LEV, guards) and elimination/substitution are significantly more reliable than PPE or administrative procedures because they protect everyone automatically and don&apos;t depend on individual human compliance!
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Permit to Work (PTW) Interactive Sign-Off */
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Interactive Permit-to-Work (PTW) 4-Step Lifecycle
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Permits are essential for high-risk jobs (Hot Work, Confined Space, Work at Height, High Voltage). Step through the mandatory sequence:
            </p>
          </div>

          {/* Stepper Header */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, name: "1. Issue", desc: "Manager Authorises" },
              { num: 2, name: "2. Receipt", desc: "Workers Accept" },
              { num: 3, name: "3. Clearance", desc: "Work Handback" },
              { num: 4, name: "4. Cancellation", desc: "Isolations Lifted" },
            ].map((step) => (
              <button
                key={step.num}
                onClick={() => setPtwStep(step.num as any)}
                className={`p-2.5 rounded-xl border text-center transition ${
                  ptwStep === step.num
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                    : ptwStep > step.num
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-600 dark:text-emerald-400"
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500"
                }`}
              >
                <div className="font-bold text-xs">{step.name}</div>
                <div className="text-[10px] opacity-80 hidden sm:block">{step.desc}</div>
              </button>
            ))}
          </div>

          {/* Step Contents */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            {ptwStep === 1 && (
              <div className="space-y-3 text-xs">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  Section 1: ISSUE (Authorising Manager / Safety Controller)
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  The authorising manager must carry out a risk assessment, specify the exact task and location, confirm required isolations (Lockout/Tagout, gas testing), and establish valid time limits.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Permit Type:</label>
                    <select className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <option>Hot Work (Welding / Cutting)</option>
                      <option>Confined Space Entry</option>
                      <option>High-Voltage Electrical Maintenance</option>
                      <option>Work at Height (&gt; 4 metres)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Authorising Manager Signature:</label>
                    <input
                      type="text"
                      placeholder="Type your name to sign"
                      value={ptwSignatures.authorisingManager}
                      onChange={(e) =>
                        setPtwSignatures({ ...ptwSignatures, authorisingManager: e.target.value })
                      }
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setPtwStep(2)}
                  disabled={!ptwSignatures.authorisingManager}
                  className="mt-2 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50 transition"
                >
                  Proceed to Section 2 (Receipt) &rarr;
                </button>
              </div>
            )}

            {ptwStep === 2 && (
              <div className="space-y-3 text-xs">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  Section 2: RECEIPT (Competent Workers / Contractors)
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Workers sign to certify they understand the hazards, have verified isolations, and will strictly obey the safe methods specified in the permit.
                </p>
                <div>
                  <label className="font-semibold block mb-1">Competent Lead Worker Signature:</label>
                  <input
                    type="text"
                    placeholder="Worker signature name"
                    value={ptwSignatures.competentWorker}
                    onChange={(e) =>
                      setPtwSignatures({ ...ptwSignatures, competentWorker: e.target.value })
                    }
                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <button
                  onClick={() => setPtwStep(3)}
                  disabled={!ptwSignatures.competentWorker}
                  className="mt-2 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50 transition"
                >
                  Confirm Receipt &amp; Authorize Work &rarr;
                </button>
              </div>
            )}

            {ptwStep === 3 && (
              <div className="space-y-3 text-xs">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  Section 3: CLEARANCE / RETURN TO SERVICE
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  When work is finished, workers remove all tools, waste, and personnel, and formally certify that the plant is safe to be re-energised.
                </p>
                <div>
                  <label className="font-semibold block mb-1">Clearance Sign-off:</label>
                  <input
                    type="text"
                    placeholder="Worker clearance signature"
                    value={ptwSignatures.clearanceSign}
                    onChange={(e) =>
                      setPtwSignatures({ ...ptwSignatures, clearanceSign: e.target.value })
                    }
                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <button
                  onClick={() => setPtwStep(4)}
                  disabled={!ptwSignatures.clearanceSign}
                  className="mt-2 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50 transition"
                >
                  Hand Back to Manager &rarr;
                </button>
              </div>
            )}

            {ptwStep === 4 && (
              <div className="space-y-3 text-xs">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  Section 4: CANCELLATION (Authorising Manager)
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  The authorising manager inspects the completed area, confirms isolations are safely removed, and signs to cancel the permit. No further work may occur under this permit!
                </p>
                <div>
                  <label className="font-semibold block mb-1">Final Cancellation Signature:</label>
                  <input
                    type="text"
                    placeholder="Manager cancellation signature"
                    value={ptwSignatures.cancellationSign}
                    onChange={(e) =>
                      setPtwSignatures({ ...ptwSignatures, cancellationSign: e.target.value })
                    }
                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                {ptwSignatures.cancellationSign && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Permit Lifecycle Successfully Completed &amp; Archived!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
