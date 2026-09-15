import { useState } from "react";
import { Activity, Cpu, ShieldAlert, Sliders, Dna, Droplets, Pill, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  onOpenConfig: () => void;
  isSimulating: boolean;
  simulationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConfig,
  isSimulating,
  simulationCount,
}) => {
  return (
    <header className="bg-[#0d0d12] border-b border-zinc-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Digital Twin Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white text-xs font-mono tracking-wider shadow-sm shadow-red-950">
            SP-7
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold tracking-widest text-zinc-100 uppercase font-sans">
                Gemelo Digital Híbrido Regional
              </h1>
              <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                RAM SURVEILLANCE
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wide flex items-center gap-2 mt-0.5">
              <span>CORE ANALYTIC ENGINE v2.0.4</span>
              <span className="text-zinc-700">•</span>
              <span className="text-zinc-400 flex items-center gap-1 font-mono">
                Consistencia Determinista (T: 0.2, P: 0.95)
              </span>
            </p>
          </div>
        </div>

        {/* Tri-source badges & Status Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Tri-Source Indicator Pills */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#14141a] border border-zinc-800 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-blue-400 font-medium">
              <Dna className="w-3 h-3 text-blue-500" /> Genómica
            </span>
            <span className="text-zinc-700">|</span>
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Pill className="w-3 h-3 text-amber-500" /> Prescripción DDD
            </span>
            <span className="text-zinc-700">|</span>
            <span className="flex items-center gap-1 text-red-400 font-medium">
              <Droplets className="w-3 h-3 text-red-500" /> WBE Efluentes
            </span>
          </div>

          {/* System Status readout */}
          <div className="text-right hidden sm:block border-l border-zinc-800 pl-3 font-mono">
            <div className="text-[9px] text-zinc-500 uppercase tracking-tight">System State</div>
            <div className="text-xs text-green-500 flex items-center gap-1">
              <span className="animate-pulse">●</span> SYSTEM ACTIVE
            </div>
          </div>

          {/* AI Studio Config trigger */}
          <button
            id="btn-open-aistudio-config"
            onClick={onOpenConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-mono transition-all cursor-pointer"
            title="Ver Configuración de Parámetros en Google AI Studio"
          >
            <Sliders className="w-3.5 h-3.5 text-zinc-400" />
            <span>Configuración AI Studio</span>
          </button>

          {/* Simulation status counter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
            <Cpu className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin text-blue-400" : "text-zinc-500"}`} />
            <span>{isSimulating ? "MODELANDO..." : `SIM-${simulationCount > 0 ? simulationCount : "LIVE"}`}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

