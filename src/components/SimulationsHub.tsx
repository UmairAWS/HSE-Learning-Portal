import React, { useState } from "react";
import Element1Simulation from "./simulations/Element1Simulation";
import Element2Simulation from "./simulations/Element2Simulation";
import Element3Simulation from "./simulations/Element3Simulation";
import Element4Simulation from "./simulations/Element4Simulation";
import { DollarSign, RefreshCw, Shield, Search } from "lucide-react";
import { ElementId } from "../types";

interface SimulationsHubProps {
  initialChapterId?: ElementId;
  initialSubTab?: string;
}

export default function SimulationsHub({ initialChapterId, initialSubTab }: SimulationsHubProps) {
  const [selectedElement, setSelectedElement] = useState<ElementId>(initialChapterId || 1);
  const [selectedSubTab, setSelectedSubTab] = useState<string | undefined>(initialSubTab);

  // Sync if initialChapterId changes
  React.useEffect(() => {
    if (initialChapterId) {
      setSelectedElement(initialChapterId);
    }
  }, [initialChapterId]);

  // Sync if initialSubTab changes
  React.useEffect(() => {
    if (initialSubTab) {
      setSelectedSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const simulationCards = [
    {
      id: 1 as ElementId,
      title: "Chapter 1: Iceberg & Contractor Vetting",
      subtitle: "Uninsured 10:1 Losses & Competence Assessment",
      icon: DollarSign,
      color: "from-rose-500 to-red-600",
      badge: "Cost & Due Diligence",
    },
    {
      id: 2 as ElementId,
      title: "Chapter 2: PDCA & SMART Policy Architect",
      subtitle: "Management Systems & Objective Formulation",
      icon: RefreshCw,
      color: "from-sky-500 to-blue-600",
      badge: "Systems & Policy",
    },
    {
      id: 3 as ElementId,
      title: "Chapter 3: 5x5 Matrix & Hierarchy of Control",
      subtitle: "Dynamic Risk Reduction & Chemical Lab",
      icon: Shield,
      color: "from-emerald-500 to-teal-600",
      badge: "Risk & PTW",
    },
    {
      id: 4 as ElementId,
      title: "Chapter 4: '5 Whys' Root Cause & Monitoring",
      subtitle: "Accident Investigation & Leading Indicators",
      icon: Search,
      color: "from-amber-500 to-orange-600",
      badge: "Investigation & Audit",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header - Compact & Smart */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl text-white border border-slate-700/60 shadow-md">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block">
              Interactive HSE Laboratory
            </span>
          </div>
          <h2 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight mb-1 text-white">
            HSE Core Interactive Chapter Simulations
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Move beyond textbook theory with real-time interactive models: calculate uninsured 10:1 accident costs, formulate SMART policies, test 5x5 dynamic risk matrices, and run 5 Whys root cause investigation chains.
          </p>
        </div>
      </div>

      {/* Chapter Cards Nav - 2x2 on mobile, 4-col on desktop to save space */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {simulationCards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedElement === card.id;

          return (
            <button
              key={card.id}
              onClick={() => {
                setSelectedElement(card.id);
                setSelectedSubTab(undefined);
              }}
              className={`p-2.5 sm:p-3.5 rounded-xl border text-left transition flex flex-col justify-between select-none active:scale-[0.98] ${
                isSelected
                  ? "bg-white dark:bg-slate-800 border-emerald-500 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                  : "bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2 sm:mb-3">
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${card.color} shadow-xs`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 truncate max-w-[80px] sm:max-w-none">
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {card.title}
                </h3>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 hidden sm:line-clamp-2">
                {card.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Chapter Simulation Content */}
      <div className="pt-2">
        {selectedElement === 1 && <Element1Simulation initialTab={selectedSubTab as any} />}
        {selectedElement === 2 && <Element2Simulation initialTab={selectedSubTab as any} />}
        {selectedElement === 3 && <Element3Simulation initialTab={selectedSubTab as any} />}
        {selectedElement === 4 && <Element4Simulation initialTab={selectedSubTab as any} />}
      </div>
    </div>
  );
}
