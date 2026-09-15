import React, { useState } from "react";
import { DollarSign, ShieldAlert, CheckCircle2, XCircle, HelpCircle, ArrowRight } from "lucide-react";

interface ContractorBid {
  id: string;
  name: string;
  reputation: string;
  hasPolicy: boolean;
  accidentRate: number; // RIDDOR reportable per 100k
  isoCertified: boolean;
  hasMethodStatement: boolean;
  hourlyRate: number;
  status: "pending" | "approved" | "rejected" | "clarification";
  verdictReason?: string;
}

interface Element1SimulationProps {
  initialTab?: "iceberg" | "contractor";
}

export default function Element1Simulation({ initialTab }: Element1SimulationProps = {}) {
  // Tab within simulation: 1. Iceberg Calculator, 2. Contractor Vetting
  const [activeTab, setActiveTab] = useState<"iceberg" | "contractor">(initialTab || "iceberg");

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Iceberg direct cost state
  const [insuredDirectCost, setInsuredDirectCost] = useState<number>(5000);
  const [multiplier, setMultiplier] = useState<number>(10);

  const uninsuredTotal = insuredDirectCost * multiplier;
  const grandTotal = insuredDirectCost + uninsuredTotal;

  // Contractor vetting state
  const [contractors, setContractors] = useState<ContractorBid[]>([
    {
      id: "c1",
      name: "Apex High-Rise Glazing Ltd",
      reputation: "15 years commercial glazing experience",
      hasPolicy: true,
      accidentRate: 0.12,
      isoCertified: true,
      hasMethodStatement: true,
      hourlyRate: 95,
      status: "pending",
    },
    {
      id: "c2",
      name: "RapidScaff Maintenance",
      reputation: "Budget local general contractor",
      hasPolicy: false,
      accidentRate: 3.8,
      isoCertified: false,
      hasMethodStatement: false,
      hourlyRate: 45,
      status: "pending",
    },
    {
      id: "c3",
      name: "Horizon Mechanical Engineering",
      reputation: "Specialist HVAC & ductwork engineers",
      hasPolicy: true,
      accidentRate: 0.85,
      isoCertified: false,
      hasMethodStatement: true,
      hourlyRate: 75,
      status: "pending",
    },
  ]);

  const handleContractorDecision = (id: string, decision: "approved" | "rejected" | "clarification") => {
    setContractors((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        let reason = "";
        if (decision === "approved") {
          if (!c.hasPolicy || c.accidentRate > 2.0) {
            reason = "Warning: Approved contractor with inadequate safety credentials. Under ILO C155 & R164, the client retains joint legal liability.";
          } else {
            reason = "Excellent selection! Verified written policy, accredited competence, and low accident frequency.";
          }
        } else if (decision === "rejected") {
          reason = "Prudent decision. Contractor failed fundamental competence due diligence criteria (no policy or unacceptable accident rate).";
        } else {
          reason = "Sensible intermediate step: Requesting additional risk assessments and proof of employee competency certification.";
        }
        return { ...c, status: decision, verdictReason: reason };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab("iceberg")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs md:text-sm transition flex items-center justify-center gap-1.5 ${
            activeTab === "iceberg"
              ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          The Uninsured Iceberg
        </button>
        <button
          onClick={() => setActiveTab("contractor")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs md:text-sm transition flex items-center justify-center gap-1.5 ${
            activeTab === "contractor"
              ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Contractor Due Diligence
        </button>
      </div>

      {activeTab === "iceberg" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Breakdown */}
          <div className="lg:col-span-6 space-y-5">
            <div className="p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Interactive Accident Loss Calculator
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                HSE research proves that visible insured costs (the tip of the iceberg) are dwarfed by hidden uninsured losses beneath the waterline.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Insured Direct Costs (Tip):</span>
                    <span className="text-sky-600 dark:text-sky-400 font-bold">£{insuredDirectCost.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={insuredDirectCost}
                    onChange={(e) => setInsuredDirectCost(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>£1,000 (Minor first aid)</span>
                    <span>£50,000 (Major structure/plant repair)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Uninsured Multiplier Ratio (HSE 8:1 to 36:1):</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">{multiplier}:1 Ratio</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="36"
                    step="1"
                    value={multiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>8:1 (Low estimation)</span>
                    <span>10:1 (Average benchmark)</span>
                    <span>36:1 (Severe hidden toll)</span>
                  </div>
                </div>
              </div>

              {/* Total Card */}
              <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/40">
                    <div className="text-[11px] font-semibold text-sky-700 dark:text-sky-300">Insured (Tip)</div>
                    <div className="text-lg font-bold text-sky-600 dark:text-sky-400">£{insuredDirectCost.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Medical, Plant claim</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40">
                    <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">Uninsured (Underwater)</div>
                    <div className="text-lg font-bold text-rose-600 dark:text-rose-400">£{uninsuredTotal.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Absence, fines, delays</div>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs text-slate-500">Total True Business Cost: </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">£{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Exam Takeaway */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
              <strong>💡 Practical Assessment Tip:</strong> When justifying accident prevention to directors, never accept &quot;insurance covers everything&quot;. Explain that criminal fines can <em>never</em> be insured by law, and the hidden uninsured costs (10:1) will sink the company&apos;s profit margin!
            </div>
          </div>

          {/* Visual Iceberg Graphic */}
          <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-white relative overflow-hidden min-h-[380px]">
            {/* Sky Background */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-sky-900/60 to-sky-950/20 z-0"></div>
            {/* Water Surface Line */}
            <div className="absolute top-28 left-0 right-0 border-b-2 border-dashed border-sky-400/80 z-20 flex justify-between px-4 text-[10px] text-sky-300 tracking-wider uppercase font-bold">
              <span>Waterline</span>
              <span>Visible vs. Hidden Threshold</span>
            </div>
            {/* Underwater Sea */}
            <div className="absolute top-28 bottom-0 left-0 right-0 bg-gradient-to-b from-cyan-950/80 via-blue-950 to-slate-950 z-0"></div>

            {/* Iceberg Peak (Tip - Above Water) */}
            <div className="relative z-10 w-40 text-center mb-3 mt-4">
              <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[65px] border-b-sky-200/90 mx-auto filter drop-shadow-lg"></div>
              <div className="mt-1 px-2 py-1 bg-sky-900/90 rounded-md border border-sky-400/60 text-[11px] font-bold text-sky-200 shadow">
                TIP: Insured Costs
                <div className="text-white font-extrabold">£{insuredDirectCost.toLocaleString()}</div>
              </div>
            </div>

            {/* Iceberg Underwater Mass */}
            <div className="relative z-10 w-72 max-w-full text-center mt-3">
              <div className="w-64 h-48 bg-gradient-to-b from-sky-300/40 via-blue-600/30 to-blue-900/40 rounded-b-[70px] rounded-t-[20px] mx-auto border border-cyan-400/40 backdrop-blur-sm p-4 flex flex-col justify-around shadow-2xl">
                <div className="text-[11px] font-bold text-cyan-200 uppercase tracking-wider">
                  Hidden Uninsured Losses ({(uninsuredTotal / grandTotal * 100).toFixed(0)}%)
                </div>
                <div className="text-2xl font-black text-rose-400 tracking-tight">
                  £{uninsuredTotal.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-300 space-y-1 text-left bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1 text-rose-300">
                    <XCircle className="w-3 h-3 text-red-400" />
                    <span>Uninsurable criminal fines</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-sky-400" />
                    <span>Sick pay & temporary staff hiring</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-sky-400" />
                    <span>Investigation hours & lost production</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-sky-400" />
                    <span>Severe brand reputation damage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Contractor Selection Challenge */
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Contractor Selection Simulation (HSE 3-Stage Model: Select, Plan, Monitor)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              You are selecting a contractor for high-risk roof maintenance. Remember: health and safety liability is ALWAYS shared between the client and the contractor! Evaluate their evidence of competence:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contractors.map((c) => (
              <div
                key={c.id}
                className={`p-5 rounded-2xl border transition bg-white dark:bg-slate-800/80 flex flex-col justify-between ${
                  c.status === "approved"
                    ? "border-emerald-500 shadow-emerald-500/10 shadow-md"
                    : c.status === "rejected"
                    ? "border-red-500 opacity-80"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-400"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</h4>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">£{c.hourlyRate}/hr</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">{c.reputation}</p>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">H&S Policy Document:</span>
                      {c.hasPolicy ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Present
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold flex items-center gap-1 text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> None
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">3-Yr Accident Rate:</span>
                      <span
                        className={`font-semibold text-[11px] ${
                          c.accidentRate <= 1.0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-500"
                        }`}
                      >
                        {c.accidentRate} / 100k hrs
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">ISO 45001 Accredited:</span>
                      <span className="text-[11px] font-semibold">
                        {c.isoCertified ? (
                          <span className="text-sky-500">Certified</span>
                        ) : (
                          <span className="text-slate-400">Not certified</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Method Statement:</span>
                      <span className="text-[11px] font-semibold">
                        {c.hasMethodStatement ? "Available" : "Missing"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                  {c.status === "pending" ? (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleContractorDecision(c.id, "approved")}
                        className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                      >
                        Select
                      </button>
                      <button
                        onClick={() => handleContractorDecision(c.id, "clarification")}
                        className="py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition"
                        title="Request More Competence Evidence"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleContractorDecision(c.id, "rejected")}
                        className="py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition"
                        title="Reject Bid"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-bold capitalize mb-1 flex items-center gap-1">
                        Status: <span className="text-rose-500">{c.status}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                        {c.verdictReason}
                      </p>
                      <button
                        onClick={() => handleContractorDecision(c.id, "pending" as any)}
                        className="mt-2 text-[10px] text-sky-500 hover:underline flex items-center gap-1"
                      >
                        Re-evaluate <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
