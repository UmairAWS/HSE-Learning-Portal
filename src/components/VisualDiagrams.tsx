import React, { useState } from "react";
import { Heart, Coins, Gavel, Globe2, ShieldCheck, AlertTriangle, Eye, Flame, Ban, ShieldAlert } from "lucide-react";

export default function VisualDiagrams() {
  const [activeVisual, setActiveVisual] = useState<"pillars" | "ilo" | "hierarchy" | "signs">("pillars");
  const [selectedSignCategory, setSelectedSignCategory] = useState<string>("prohibition");

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Visual selector pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "pillars", label: "The 3 Pillars of Safety" },
          { id: "ilo", label: "Global ILO Statistics & Burden" },
          { id: "hierarchy", label: "Hierarchy of Risk Control" },
          { id: "signs", label: "Safety Signs Pictograms" },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveVisual(v.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeVisual === v.id
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* 1. THREE PILLARS */}
      {activeVisual === "pillars" && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
              The Three Pillars of Safety Management (Core Chapter 1)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Why must every organisation manage health and safety? Every professional safety justification ties back to these three core pillars:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
              {/* Moral */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/30 dark:to-slate-900 border-2 border-rose-500/30 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center mb-4 shadow-md shadow-rose-500/20">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-rose-600 dark:text-rose-400 mb-2">
                    1. Moral Pillar
                  </h4>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 italic">
                    &quot;It&apos;s simply the right thing to do.&quot;
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    No worker should leave home to earn a livelihood and return suffering injury, illness, disability, or death. Employers control the work premises, machinery, and methods, so they hold a moral duty of care to their workforce and dependants.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-rose-200 dark:border-rose-900/60 text-[11px] text-rose-700 dark:text-rose-300 font-semibold">
                  ILO SafeWork Core Principle
                </div>
              </div>

              {/* Financial */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-sky-50 to-white dark:from-sky-950/30 dark:to-slate-900 border-2 border-sky-500/30 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center mb-4 shadow-md shadow-sky-500/20">
                    <Coins className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-sky-600 dark:text-sky-400 mb-2">
                    2. Financial Pillar
                  </h4>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 italic">
                    &quot;Accidents cost serious money; safe business is profitable.&quot;
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Accidents directly drain profits through damaged machinery, lost production hours, and higher insurance premiums. Hidden uninsured losses (the 10:1 Iceberg) like sick pay, retraining, customer loss, and criminal fines can cause bankruptcy.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-sky-200 dark:border-sky-900/60 text-[11px] text-sky-700 dark:text-sky-300 font-semibold">
                  The Business Case (4% GDP Loss Globally)
                </div>
              </div>

              {/* Legal */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-900 border-2 border-amber-500/30 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-4 shadow-md shadow-amber-500/20">
                    <Gavel className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-amber-600 dark:text-amber-400 mb-2">
                    3. Legal Pillar
                  </h4>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 italic">
                    &quot;The law requires compliance under criminal &amp; civil penalties.&quot;
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    National laws enacted from ILO Conventions (C155 &amp; R164) mandate minimum safety standards. Failure to comply brings criminal enforcement notices (Improvement / Prohibition), massive fines, and imprisonment for directors and managers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
                  Criminal Law vs. Civil Negligence
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ILO STATISTICS */}
      {activeVisual === "ilo" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe2 className="w-5 h-5 text-sky-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  The Global Burden of Workplace Disease &amp; Injury (ILO Data)
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Official figures from the International Labour Organization (ILO SafeWork):
              </p>
            </div>

            {/* KPI 4-Block */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-center">
                <div className="text-2xl md:text-3xl font-black text-rose-600 dark:text-rose-400">
                  2.75M+
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">
                  Work Deaths Annually
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Accidents &amp; Diseases combined</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
                <div className="text-2xl md:text-3xl font-black text-amber-600 dark:text-amber-400">
                  2.4M
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">
                  Occupational Disease Deaths
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Vastly exceeds fatal accidents</p>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-center">
                <div className="text-2xl md:text-3xl font-black text-sky-600 dark:text-sky-400">
                  350K+
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">
                  Fatal Traumatic Accidents
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Half occur in agriculture</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  4% GDP
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">
                  Global Economic Loss
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Lost due to preventable harm</p>
              </div>
            </div>

            {/* High Risk Sectors */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Top 3 Highest-Risk Sectors Identified by the ILO:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-rose-500">1. Agriculture</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Accounts for roughly half of all fatal traumatic incidents globally due to heavy plant, chemicals, and remote isolation.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-sky-500">2. Commercial Fishing</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Extreme maritime environment, winches, heavy nets, cold water immersion, and rapid capsizing risks.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-amber-500">3. Construction</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Work at height, falling objects, excavation collapses, mobile vehicles, and multi-contractor shared sites.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. HIERARCHY OF CONTROL */}
      {activeVisual === "hierarchy" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                The General Hierarchy of Risk Control (ISO 45001 &amp; ILO-OSH 2001)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Inverted pyramid of hazard mitigation. Always work from the top down. Personal protective equipment is strictly the LAST line of defense!
              </p>
            </div>

            <div className="space-y-2.5 max-w-2xl mx-auto">
              {[
                {
                  tier: 1,
                  name: "1. ELIMINATION",
                  effectiveness: "Most Effective (100% Risk Removal)",
                  color: "bg-emerald-600 text-white",
                  desc: "Physically remove the hazard completely (e.g. stop welding steel components on site; purchase pre-fabricated metal frames).",
                  width: "w-full",
                },
                {
                  tier: 2,
                  name: "2. SUBSTITUTION",
                  effectiveness: "Very High Effectiveness",
                  color: "bg-teal-600 text-white",
                  desc: "Replace the hazard with something significantly less dangerous (e.g. substitute toxic solvent paint with water-based emulsion; sack truck for manual handling).",
                  width: "w-[92%]",
                },
                {
                  tier: 3,
                  name: "3. ENGINEERING CONTROLS",
                  effectiveness: "High (Collective Protection)",
                  color: "bg-sky-600 text-white",
                  desc: "Isolate people from the hazard mechanically (e.g. interlocked machine guards, acoustic enclosures, Local Exhaust Ventilation (LEV), physical barriers).",
                  width: "w-[84%]",
                },
                {
                  tier: 4,
                  name: "4. ADMINISTRATIVE CONTROLS",
                  effectiveness: "Moderate (Relies on Human Behavior)",
                  color: "bg-amber-600 text-white",
                  desc: "Change the way people work through procedures (e.g. Safe Systems of Work, Permit-to-Work, safety sign warnings, job rotation, training).",
                  width: "w-[76%]",
                },
                {
                  tier: 5,
                  name: "5. PERSONAL PROTECTIVE EQUIPMENT (PPE)",
                  effectiveness: "Least Effective (Safe Person / Last Resort)",
                  color: "bg-rose-600 text-white",
                  desc: "Protect only the individual wearer (e.g. respirators, ear defenders, safety boots). Fails to danger if improperly fitted, damaged, or removed.",
                  width: "w-[68%]",
                },
              ].map((h) => (
                <div key={h.tier} className={`${h.width} mx-auto transition-all`}>
                  <div className={`p-4 rounded-xl ${h.color} shadow-sm space-y-1`}>
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>{h.name}</span>
                      <span className="text-[10px] opacity-90">{h.effectiveness}</span>
                    </div>
                    <p className="text-[11px] opacity-95 leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <strong>Collective Protection vs. Personal Protection:</strong> Tiers 1–3 protect <em>all</em> personnel in the workplace automatically (Safe Place). Tiers 4–5 depend entirely on individual worker memory and compliance (Safe Person).
            </div>
          </div>
        </div>
      )}

      {/* 4. SAFETY SIGNS */}
      {activeVisual === "signs" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Standard Safety Signs &amp; Pictograms (Chapter 3)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Safety signs use standardized shapes, colours, and pictograms to bypass language and literacy barriers:
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "prohibition", name: "Prohibition (Red/White Circle)" },
                { id: "warning", name: "Warning (Yellow Triangle)" },
                { id: "mandatory", name: "Mandatory (Blue Circle)" },
                { id: "safe_condition", name: "Safe Condition (Green Rectangle)" },
                { id: "fire", name: "Fire-Fighting (Red Rectangle)" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedSignCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedSignCategory === c.id
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Sign Display Box */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-center gap-8">
              {selectedSignCategory === "prohibition" && (
                <>
                  <div className="w-32 h-32 rounded-full border-8 border-red-600 bg-white flex items-center justify-center relative shadow-lg">
                    <Ban className="w-16 h-16 text-black" />
                    <div className="absolute w-28 h-2 bg-red-600 rotate-45"></div>
                  </div>
                  <div className="space-y-1.5 text-xs max-w-md">
                    <div className="text-red-600 font-bold uppercase text-sm">Prohibition Sign</div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Meaning: Do NOT do. Dangerous behavior prohibited.
                    </p>
                    <p className="text-slate-500">
                      Shape: Circular. Background: White. Border &amp; Crossbar: Red. Symbol: Black pictogram.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Examples: &quot;No Smoking&quot;, &quot;No Unauthorised Entry&quot;, &quot;Do Not Drink&quot;.
                    </p>
                  </div>
                </>
              )}

              {selectedSignCategory === "warning" && (
                <>
                  <div className="w-32 h-32 flex items-center justify-center relative shadow-lg">
                    <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[105px] border-b-amber-400 relative flex items-center justify-center">
                      <AlertTriangle className="w-10 h-10 text-black absolute top-12 -left-5" />
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs max-w-md">
                    <div className="text-amber-500 font-bold uppercase text-sm">Warning Sign</div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Meaning: Danger, hazard, be careful, take precautions.
                    </p>
                    <p className="text-slate-500">
                      Shape: Triangular. Background: Yellow/Amber. Border: Black. Symbol: Black pictogram.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Examples: &quot;Forklift Trucks Operating&quot;, &quot;Flammable Material&quot;, &quot;Radiation Hazard&quot;.
                    </p>
                  </div>
                </>
              )}

              {selectedSignCategory === "mandatory" && (
                <>
                  <div className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                    <ShieldAlert className="w-16 h-16" />
                  </div>
                  <div className="space-y-1.5 text-xs max-w-md">
                    <div className="text-blue-500 font-bold uppercase text-sm">Mandatory Action Sign</div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Meaning: You MUST obey. Specific mandatory action required.
                    </p>
                    <p className="text-slate-500">
                      Shape: Circular. Background: Solid Blue. Symbol: White pictogram.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Examples: &quot;Eye Protection Must Be Worn&quot;, &quot;Safety Footwear Compulsory&quot;, &quot;High-Vis Vest&quot;.
                    </p>
                  </div>
                </>
              )}

              {selectedSignCategory === "safe_condition" && (
                <>
                  <div className="w-36 h-28 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-16 h-16" />
                  </div>
                  <div className="space-y-1.5 text-xs max-w-md">
                    <div className="text-emerald-500 font-bold uppercase text-sm">Safe Condition Sign</div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Meaning: The safe way, emergency escape, or medical aid.
                    </p>
                    <p className="text-slate-500">
                      Shape: Rectangular or Square. Background: Green. Symbol: White pictogram.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Examples: &quot;First-Aid Station&quot;, &quot;Emergency Fire Exit Route&quot;, &quot;Eyewash Point&quot;.
                    </p>
                  </div>
                </>
              )}

              {selectedSignCategory === "fire" && (
                <>
                  <div className="w-36 h-28 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg">
                    <Flame className="w-16 h-16" />
                  </div>
                  <div className="space-y-1.5 text-xs max-w-md">
                    <div className="text-red-500 font-bold uppercase text-sm">Fire-Fighting Equipment Sign</div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Meaning: Location of fire-fighting equipment.
                    </p>
                    <p className="text-slate-500">
                      Shape: Rectangular or Square. Background: Red. Symbol: White pictogram.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Examples: &quot;Fire Hose Reel&quot;, &quot;CO2 Extinguisher&quot;, &quot;Manual Alarm Call Point&quot;.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
