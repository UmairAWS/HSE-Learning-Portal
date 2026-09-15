import React, { useState } from "react";
import { RefreshCw, CheckCircle2, AlertTriangle, Layers, Target, Compass } from "lucide-react";

type PDCAPhase = "Plan" | "Do" | "Check" | "Act";

interface Element2SimulationProps {
  initialTab?: "pdca" | "smart" | "review";
}

export default function Element2Simulation({ initialTab }: Element2SimulationProps = {}) {
  const [selectedPhase, setSelectedPhase] = useState<PDCAPhase>("Plan");
  const [activeTab, setActiveTab] = useState<"pdca" | "smart" | "review">(initialTab || "pdca");

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // SMART objective builder state
  const [specific, setSpecific] = useState("Inspect all 24 emergency eyewash stations");
  const [measurable, setMeasurable] = useState("100% completion rate with signed checklist");
  const [achievable, setAchievable] = useState("Assigned to 2 qualified maintenance engineers");
  const [reasonable, setReasonable] = useState("Budget and inspection kits already provided");
  const [timebound, setTimebound] = useState("By the end of Q3 (September 30th)");

  // Policy Review Scenarios
  const [reviewEvents, setReviewEvents] = useState([
    {
      id: 1,
      title: "New Chief Executive Officer (CEO) Appointed",
      description: "Top leadership change with new corporate safety vision.",
      requiresReview: true,
      explanation: "A new CEO or MD must re-sign and re-authorise the General Statement of Intent to show top-level board commitment.",
      userGuessed: null as boolean | null,
    },
    {
      id: 2,
      title: "Routine Staff Birthday Celebration In Canteen",
      description: "Social event during lunch break.",
      requiresReview: false,
      explanation: "Routine social events do not alter workplace hazards, roles, or organizational arrangements.",
      userGuessed: null as boolean | null,
    },
    {
      id: 3,
      title: "Introduction of Automated Laser Cutting Cell",
      description: "Replacing manual saws with high-power Class 4 industrial laser machinery.",
      requiresReview: true,
      explanation: "Technological & process changes introduce novel hazards (radiation, toxic fumes) requiring updated specific arrangements.",
      userGuessed: null as boolean | null,
    },
    {
      id: 4,
      title: "Enforcement Improvement Notice Issued by Inspector",
      description: "Regulatory inspection reveals non-compliant machinery guarding.",
      requiresReview: true,
      explanation: "Enforcement action indicates existing arrangements or monitoring failed, necessitating formal policy review.",
      userGuessed: null as boolean | null,
    },
  ]);

  const pdcaDetails: Record<
    PDCAPhase,
    {
      title: string;
      iloMatch: string;
      isoMatch: string;
      color: string;
      description: string;
      practicalActions: string[];
    }
  > = {
    Plan: {
      title: "PLAN: Setting Vision, Roles & Arrangements",
      iloMatch: "Policy & Organising",
      isoMatch: "Context, Leadership, & Planning",
      color: "border-sky-500 text-sky-500 bg-sky-50 dark:bg-sky-950/30",
      description: "Establish the health and safety policy, define the organizational hierarchy (who is accountable for what), and formulate SMART risk reduction targets.",
      practicalActions: [
        "Sign and date the General Statement of Intent (CEO/MD)",
        "Define chain of command: Senior leaders -> Supervisors -> Workers",
        "Allocate resources: Competent H&S adviser appointment & safety budgets",
        "Plan risk assessment schedules and emergency evacuation plans"
      ],
    },
    Do: {
      title: "DO: Implementing Controls & Safe Systems",
      iloMatch: "Planning & Implementing",
      isoMatch: "Support & Operation",
      color: "border-emerald-500 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
      description: "Put the policy into daily practice by profiling hazards, executing safe systems of work (SSWs), issuing permits-to-work, and conducting worker induction training.",
      practicalActions: [
        "Conduct 5-step risk assessments on all high-hazard tasks",
        "Implement engineering controls and issue necessary PPE free of charge",
        "Provide induction training for all new employees and contractors",
        "Enforce Permit-to-Work (PTW) protocols for hot work and confined spaces"
      ],
    },
    Check: {
      title: "CHECK: Active & Reactive Monitoring",
      iloMatch: "Evaluation & Audit",
      isoMatch: "Performance Evaluation",
      color: "border-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-950/30",
      description: "Measure whether your safety controls are functioning effectively. Combine active monitoring (safety tours, inspections) with reactive data (near misses, accident rates).",
      practicalActions: [
        "Carry out weekly supervisor workplace inspections ('The 4 Ps')",
        "Conduct independent, systematic H&S Audits of the management system",
        "Calculate Lost-time Accident Frequency Rates",
        "Investigate all incidents to identify immediate and root causes"
      ],
    },
    Act: {
      title: "ACT: Review & Continual Improvement",
      iloMatch: "Action for Improvement",
      isoMatch: "Improvement",
      color: "border-rose-500 text-rose-500 bg-rose-50 dark:bg-rose-950/30",
      description: "Close the loop by reviewing performance at board level, learning lessons from audits and accidents, and amending the policy and arrangements for continual improvement.",
      practicalActions: [
        "Conduct annual formal Board of Directors performance reviews",
        "Implement corrective action plans arising from audit non-conformances",
        "Benchmark incident rates against industry averages",
        "Update the safety policy whenever significant changes occur"
      ],
    },
  };

  const handleReviewGuess = (id: number, guess: boolean) => {
    setReviewEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, userGuessed: guess } : e))
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl max-w-lg">
        <button
          onClick={() => setActiveTab("pdca")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs md:text-sm transition flex items-center justify-center gap-1.5 ${
            activeTab === "pdca"
              ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          PDCA Cycle
        </button>
        <button
          onClick={() => setActiveTab("smart")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs md:text-sm transition flex items-center justify-center gap-1.5 ${
            activeTab === "smart"
              ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Target className="w-4 h-4" />
          SMART Policy Builder
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs md:text-sm transition flex items-center justify-center gap-1.5 ${
            activeTab === "review"
              ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Compass className="w-4 h-4" />
          Policy Review Triggers
        </button>
      </div>

      {activeTab === "pdca" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Wheel Buttons */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-500" />
              The Continuous PDCA Loop (ISO 45001 & ILO-OSH)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Click each quadrant to explore how safety policy, execution, monitoring, and audit feed into continual improvement:
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              {(["Plan", "Do", "Check", "Act"] as PDCAPhase[]).map((phase) => (
                <button
                  key={phase}
                  onClick={() => setSelectedPhase(phase)}
                  className={`p-4 rounded-xl border-2 font-bold text-sm transition text-center flex flex-col items-center justify-center gap-1 ${
                    selectedPhase === phase
                      ? `${pdcaDetails[phase].color} shadow-md scale-105`
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400"
                  }`}
                >
                  <span className="text-lg">
                    {phase === "Plan" && "📝"}
                    {phase === "Do" && "⚙️"}
                    {phase === "Check" && "🔍"}
                    {phase === "Act" && "🔄"}
                  </span>
                  <span>{phase}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              ⚡ <strong>Exam Anchor:</strong> ISO 45001 places &quot;Leadership and Worker Participation&quot; right at the core of the PDCA cycle, ensuring top management remains personally accountable.
            </div>
          </div>

          {/* Phase Details Display */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  {selectedPhase} Stage Breakdown
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  ILO-OSH: {pdcaDetails[selectedPhase].iloMatch}
                </span>
              </div>

              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {pdcaDetails[selectedPhase].title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {pdcaDetails[selectedPhase].description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Core Implementation Checkpoints:
                </div>
                {pdcaDetails[selectedPhase].practicalActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-500">
              ISO 45001 Standard mapping: <strong>{pdcaDetails[selectedPhase].isoMatch}</strong>
            </div>
          </div>
        </div>
      )}

      {activeTab === "smart" && (
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Interactive SMART Safety Objective Generator
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Safety auditors and examiners penalize vague goals like &quot;make work safer&quot;. Health & safety objectives must be SMART:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                [S] Specific (What precise task?):
              </label>
              <input
                type="text"
                value={specific}
                onChange={(e) => setSpecific(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                [M] Measurable (How will progress be quantified?):
              </label>
              <input
                type="text"
                value={measurable}
                onChange={(e) => setMeasurable(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                [A] Achievable (Who has the competence & power?):
              </label>
              <input
                type="text"
                value={achievable}
                onChange={(e) => setAchievable(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                [R] Reasonable (Are resources & budget allocated?):
              </label>
              <input
                type="text"
                value={reasonable}
                onChange={(e) => setReasonable(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                [T] Time-Bound (What is the definite completion deadline?):
              </label>
              <input
                type="text"
                value={timebound}
                onChange={(e) => setTimebound(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Formatted Policy Statement Result */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wide">
              Official Formatted SMART Objective for General Statement of Intent:
            </div>
            <p className="text-xs md:text-sm font-medium leading-relaxed text-slate-200">
              &quot;The organisation commits to <strong>{specific}</strong> to achieve <strong>{measurable}</strong>, delegated to <strong>{achievable}</strong> with <strong>{reasonable}</strong>, completed no later than <strong>{timebound}</strong>.&quot;
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-2 border-t border-slate-800">
              <CheckCircle2 className="w-4 h-4" /> Fully meets Chapter 2 criteria for auditable safety targets.
            </div>
          </div>
        </div>
      )}

      {activeTab === "review" && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Policy Review Trigger Challenge
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              A Health & Safety Policy must be a &apos;live&apos; document. Decide whether each workplace event requires a formal review of the Policy:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-3"
              >
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white mb-1">
                    {event.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{event.description}</p>
                </div>

                {event.userGuessed === null ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReviewGuess(event.id, true)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-sky-500 hover:text-white font-semibold text-xs transition"
                    >
                      Requires Review
                    </button>
                    <button
                      onClick={() => handleReviewGuess(event.id, false)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-500 hover:text-white font-semibold text-xs transition"
                    >
                      No Review Needed
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      {event.userGuessed === event.requiresReview ? (
                        <span className="text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct!
                        </span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                      <span className="text-slate-400">
                        (Policy review is {event.requiresReview ? "Mandatory" : "Not Required"})
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-tight text-[11px]">
                      {event.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
