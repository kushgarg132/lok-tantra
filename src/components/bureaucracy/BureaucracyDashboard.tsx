"use client";

import { useState } from "react";
import { IASHierarchyPanel } from "./IASHierarchyPanel";
import { IPSHierarchyPanel } from "./IPSHierarchyPanel";
import { PolicyFlowPanel } from "./PolicyFlowPanel";
import { PMOPanel } from "./PMOPanel";
import { CabinetSecretariatPanel } from "./CabinetSecretariatPanel";
import { DistrictAdminPanel } from "./DistrictAdminPanel";
import { AllIndiaServicesPanel } from "./AllIndiaServicesPanel";

type TabId = "policy" | "ias" | "ips" | "pmo" | "cabinet" | "district" | "services";

const TABS: { id: TabId; label: string; icon: string; desc: string }[] = [
  { id: "policy", label: "Policy Flow", icon: "🔗", desc: "PM → Citizen" },
  { id: "ias", label: "IAS Hierarchy", icon: "🏛️", desc: "Administrative service" },
  { id: "ips", label: "IPS / IFS", icon: "🚔", desc: "Police & Foreign" },
  { id: "pmo", label: "PMO Structure", icon: "🏢", desc: "Prime Minister's Office" },
  { id: "cabinet", label: "Cabinet Secretariat", icon: "📋", desc: "Cabinet committees" },
  { id: "district", label: "District Admin", icon: "🗺️", desc: "Ground-level government" },
  { id: "services", label: "All India Services", icon: "📜", desc: "IAS, IPS, IFoS & more" },
];

interface BureaucracyDashboardProps {
  dbStats?: {
    officials: number;
    departments: number;
  };
}

export function BureaucracyDashboard({ dbStats }: BureaucracyDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("policy");

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex overflow-x-auto gap-1 pb-1 -mx-1 px-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
              activeTab === tab.id
                ? "bg-saffron-500 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* Active tab header */}
      <div className="flex items-center gap-3">
        <div className="text-2xl">{TABS.find((t) => t.id === activeTab)?.icon}</div>
        <div>
          <h2 className="font-display font-bold text-slate-900 dark:text-slate-100 text-lg">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h2>
          <div className="text-xs text-slate-500">{TABS.find((t) => t.id === activeTab)?.desc}</div>
        </div>
      </div>

      {/* Content */}
      {activeTab === "policy" && <PolicyFlowPanel />}
      {activeTab === "ias" && <IASHierarchyPanel />}
      {activeTab === "ips" && <IPSHierarchyPanel />}
      {activeTab === "pmo" && <PMOPanel />}
      {activeTab === "cabinet" && <CabinetSecretariatPanel />}
      {activeTab === "district" && <DistrictAdminPanel />}
      {activeTab === "services" && <AllIndiaServicesPanel />}

      {/* DB section */}
      {dbStats && dbStats.officials > 0 && (
        <div className="card p-5 border border-dashed border-slate-300 dark:border-slate-700">
          <div className="text-xs text-slate-400 uppercase font-semibold mb-3">Database Records</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-slate-700 dark:text-slate-300">{dbStats.officials}</div>
              <div className="text-xs text-slate-400">Officials seeded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-slate-700 dark:text-slate-300">{dbStats.departments}</div>
              <div className="text-xs text-slate-400">Departments</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
