import { Dna, Pill, Droplets, AlertTriangle, ChevronRight, Activity, ShieldCheck, Zap } from "lucide-react";
import { RegionalScenario } from "../types";

interface TriSourceTelemetryCardProps {
  scenario: RegionalScenario;
  onModifyScenario?: (updated: RegionalScenario) => void;
}

export const TriSourceTelemetryCard: React.FC<TriSourceTelemetryCardProps> = ({
  scenario,
}) => {
  const pnecRatio = +(
    scenario.wbe.residualConcentrationNgL / (scenario.wbe.pnecSelectiveThresholdNgL || 64)
  ).toFixed(2);
  const exceedsPnec = pnecRatio > 1.0;

  return (
    <div className="space-y-4">
      {/* Scenario header banner */}
      <div className="p-4 rounded-lg bg-[#0d0d12] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              {scenario.region}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              Pob: {scenario.population.toLocaleString()} hab
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-zinc-100 mt-1 uppercase tracking-wide">
            {scenario.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">{scenario.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          {exceedsPnec && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/60 border border-red-800/60 text-red-300 text-xs font-bold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>PRESIÓN SELECTIVA ({pnecRatio}x PNEC)</span>
            </div>
          )}
        </div>
      </div>

      {/* 3 Heterogeneous Source Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Source 1: Genómica Clínica */}
        <div className="p-4 rounded-lg bg-[#14141a] border border-zinc-800 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-900/30 border border-blue-800/40 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                  <Dna className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wide font-mono">
                  1. Vigilancia Clínica
                </span>
              </div>
              <span className="text-[10px] font-mono text-blue-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {scenario.clinical.setting}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Patógeno Aislado:</span>
                <span className="font-semibold text-zinc-200 italic">
                  {scenario.clinical.pathogen}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Aislamientos Formales:</span>
                <span className="font-bold text-zinc-100 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {scenario.clinical.isolatesCount} casos
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Gen / Mecanismo ARG:</span>
                <span className="text-red-400 font-bold bg-red-950/40 px-1.5 py-0.5 rounded border border-red-800/30">
                  {scenario.clinical.criticalArg}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Frecuencia Resistencia:</span>
                <span className="font-bold text-amber-400">
                  {scenario.clinical.argFrequencyPct}%
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-500">Linaje / ST:</span>
                <span className="text-zinc-300">
                  {scenario.clinical.lineageST}
                </span>
              </div>
            </div>
          </div>

          {scenario.clinical.notes && (
            <p className="mt-3 text-[11px] text-zinc-400 bg-[#0d0d12] p-2 rounded border border-zinc-800/80 font-mono">
              Nota: {scenario.clinical.notes}
            </p>
          )}
        </div>

        {/* Source 2: Prescripción & Dispensación */}
        <div className="p-4 rounded-lg bg-[#14141a] border border-zinc-800 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-amber-900/30 border border-amber-800/40 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                  <Pill className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wide font-mono">
                  2. Prescripción DDD
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                Farmacias / APS
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              {scenario.prescription.antibiotics.map((ab, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-[#0d0d12] border border-zinc-800 space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-200">{ab.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                        ab.status === "critical"
                          ? "bg-red-950/60 text-red-400 border-red-800/40 font-bold"
                          : ab.status === "elevated"
                          ? "bg-amber-950/60 text-amber-400 border-amber-800/40"
                          : "bg-green-950/60 text-green-400 border-green-800/40"
                      }`}
                    >
                      {ab.status === "critical"
                        ? "Pico Crítico"
                        : ab.status === "elevated"
                        ? "Elevado"
                        : "Normal"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="text-zinc-500">Dispensado:</span>
                    <span className="font-bold text-amber-400">
                      {ab.dddRate} DDD / 1k hab/d
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    Ámbito: {ab.targetContext}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 text-[10px] text-zinc-500 bg-[#0d0d12] p-2 rounded border border-zinc-800/80 font-mono">
            Métrica estandarizada: Dosis Diarias Definidas (OMS) por 1000 hab/día.
          </div>
        </div>

        {/* Source 3: WBE Epidemiología en Aguas Residuales */}
        <div className="p-4 rounded-lg bg-[#14141a] border border-zinc-800 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-900/30 border border-red-800/40 text-red-400 flex items-center justify-center font-mono font-bold text-xs">
                  <Droplets className="w-3.5 h-3.5 text-red-400" />
                </div>
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wide font-mono">
                  3. Aguas Residuales (WBE)
                </span>
              </div>
              <span className="text-[10px] font-mono text-red-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {scenario.wbe.collectorId}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Gen en Efluente:</span>
                <span className="font-bold text-red-400">
                  {scenario.wbe.argDetected}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Carga Cuantificada:</span>
                <span className="font-bold text-zinc-100 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {scenario.wbe.argCopiesPerLiter.toExponential(1)} copias/L
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Variación Línea Base:</span>
                <span className="font-bold text-red-400">
                  +{scenario.wbe.argBaselineIncreasePct}%
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Antibiótico Residual:</span>
                <span className="text-zinc-200">
                  {scenario.wbe.residualAntibiotic} ({scenario.wbe.residualConcentrationNgL} ng/L)
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-500">Umbral PNEC:</span>
                <span className="text-amber-400 font-bold">
                  {scenario.wbe.pnecSelectiveThresholdNgL} ng/L ({pnecRatio}x)
                </span>
              </div>
            </div>
          </div>

          {scenario.wbe.hypervirulentLineageDetected && (
            <div className="mt-3 text-[11px] text-red-300 bg-red-950/50 p-2 rounded border border-red-800/50 flex items-center gap-1.5 font-mono font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>ALERTA WBE: Linaje {scenario.wbe.hypervirulentLineageDetected}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
