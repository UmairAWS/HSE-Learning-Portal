import React from "react";
import { LayoutDashboard, Layers, FileCheck, CheckSquare, MoreHorizontal } from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMore: () => void;
}

export default function MobileNav({ activeTab, setActiveTab, onOpenMore }: MobileNavProps) {
  const tabs = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "simulations", label: "Sims", icon: Layers },
    { id: "obe", label: "Cases", icon: FileCheck },
    { id: "quiz", label: "Quiz", icon: CheckSquare },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[42px] py-1 px-2 rounded-xl transition ${
              isActive
                ? "text-emerald-600 dark:text-emerald-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "scale-110" : ""}`} />
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMore}
        className="flex flex-col items-center justify-center min-w-[50px] min-h-[42px] py-1 px-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition"
      >
        <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-[10px] mt-0.5">More</span>
      </button>
    </div>
  );
}
