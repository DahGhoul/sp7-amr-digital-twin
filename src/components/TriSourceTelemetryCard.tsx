import {
  Dna,
  Pill,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Info,
  Hospital,
} from "lucide-react";
import { RegionalScenario } from "../types";

interface TriSourceTelemetryCardProps {
  scenario: RegionalScenario;
  proaInterventionActive?: boolean;
}

export const TriSourceTelemetryCard: React.FC<TriSourceTelemetryCardProps> = ({
  scenario,
  proaInterventionActive = false,
}) => {
  const effectiveConcentration = proaInterventionActive
    ? Math.round(scenario.wbe.residualConcentrationNgL * 0.35)
    : scenario.wbe.residualConcentrationNgL;

  const pnecRatio = +(
    effectiveConcentration / (scenario.wbe.pnecSelectiveThresholdNgL || 64)
  ).toFixed(2);
  const exceedsPnec = pnecRatio > 1.0;

  return (
    <div className="space-y-4">
      {/* Section Header Banner */}
      <div className="p-4 rounded-xl bg-[#0d0d12] border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div>
          <span className="text-[11px] uppercase font-mono tracking-wider text-amber-400 font-bold block">
            PASO 2: LECTURA DE LOS 3 SENSORES REGIONALES (TRI-SOURCE COUPLING)
          </span>
          <h3 className="text-sm sm:text-base font-bold text-zinc-100 mt-0.5">
            ¿Qué están detectando hoy los sensores en {scenario.region.split("—")[0]}?
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono">
          {exceedsPnec ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/70 border border-red-800/70 text-red-200 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />
              <div>
                <span className="block leading-none">
                  PELIGRO EN DESAGÜE: {pnecRatio}x SOBRE EL LÍMITE SEGURO
                </span>
                <span className="text-[10px] text-red-400 font-normal">
                  Las bacterias están mutando en las tuberías (R_sel &gt; 1.0)
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AGUA BAJO LÍMITE SEGURO ({pnecRatio}x PNEC)</span>
            </div>
          )}
        </div>
      </div>

      {/* 3 Sensor Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SENSOR 1: HOSPITALES & GENÓMICA */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#14141a] border border-zinc-800 flex flex-col justify-between hover:border-blue-800/60 transition-colors shadow-sm">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/60 text-blue-400 flex items-center justify-center shrink-0">
                  <Hospital className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                    SENSOR 1 • CLÍNICA Y GENÓMICA
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-100">
                    Hospitales y Laboratorios
                  </h4>
                </div>
              </div>
              <span className="text-[10px] font-mono text-blue-300 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800/40 text-right">
                {scenario.clinical.setting.split("(")[0]}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-400">Bacteria Detectada:</span>
                <span className="font-bold text-zinc-100 italic font-mono">
                  {scenario.clinical.pathogen}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-400">Pacientes Confirmados:</span>
                <span className="font-bold text-zinc-100 bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-700 font-mono">
                  {scenario.clinical.isolatesCount} enfermos en hospital
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-400" title="Gen que destruye al antibiótico">
                  Escudo Genético (ARG):
                </span>
                <span className="text-red-300 font-bold bg-red-950/50 px-2 py-0.5 rounded border border-red-800/40 font-mono">
                  {scenario.clinical.criticalArg}
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Frecuencia de Resistencia Hoy:</span>
                  <span className="font-bold text-amber-400 font-mono">
                    {scenario.clinical.argFrequencyPct}% de cultivos fallan
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, scenario.clinical.argFrequencyPct * 1.8)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Plain Spanish Explanation Box */}
          <div className="mt-4 p-3 rounded-lg bg-[#0d0d12] border border-blue-900/30 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>En palabras simples:</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {scenario.clinical.plainExplanation || scenario.clinical.notes}
            </p>
          </div>
        </div>

        {/* SENSOR 2: FARMACIAS & RECETAS (DDD) */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#14141a] border border-zinc-800 flex flex-col justify-between hover:border-amber-800/60 transition-colors shadow-sm">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-800/60 text-amber-400 flex items-center justify-center shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                    SENSOR 2 • CONSUMO DE MEDICINAS
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-100">
                    Farmacias, Boticas y Postas
                  </h4>
                </div>
              </div>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                Métrica OMS (DDD)
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {scenario.prescription.antibiotics.map((ab, idx) => {
                const effectiveDdd = proaInterventionActive
                  ? +(ab.dddRate * 0.55).toFixed(1)
                  : ab.dddRate;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#0d0d12] border border-zinc-800/90 space-y-1.5"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-bold text-zinc-100">{ab.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          proaInterventionActive
                            ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/50 font-bold"
                            : ab.status === "critical"
                            ? "bg-red-950/60 text-red-300 border-red-800/50 font-bold"
                            : ab.status === "elevated"
                            ? "bg-amber-950/60 text-amber-300 border-amber-800/50"
                            : "bg-emerald-950/60 text-emerald-300 border-emerald-800/50"
                        }`}
                      >
                        {proaInterventionActive
                          ? "Controlado por PROA"
                          : ab.status === "critical"
                          ? "Abuso Crítico"
                          : ab.status === "elevated"
                          ? "Consumo Elevado"
                          : "Uso Normal"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-zinc-400 font-mono text-[11px]">
                      <span>Dosis vendidas/recetadas:</span>
                      <span className="font-bold text-amber-400">
                        {effectiveDdd} DDD / 1,000 hab
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-500">
                      Lugar: {ab.targetContext}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plain Spanish Explanation Box */}
          <div className="mt-4 p-3 rounded-lg bg-[#0d0d12] border border-amber-900/30 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>En palabras simples:</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {proaInterventionActive
                ? "✅ Al activar el protocolo PROA, los médicos restringieron las recetas innecesarias, reduciendo la presión de antibióticos un 45%."
                : scenario.prescription.plainExplanation}
            </p>
          </div>
        </div>

        {/* SENSOR 3: DESAGÜES & AGUAS RESIDUALES (WBE) */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#14141a] border border-zinc-800 flex flex-col justify-between hover:border-red-800/60 transition-colors shadow-sm">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-800/60 text-red-400 flex items-center justify-center shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold block">
                    SENSOR 3 • DESAGÜES SEDALIB (WBE)
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-100">
                    Colectores de Aguas Residuales
                  </h4>
                </div>
              </div>
              <span className="text-[10px] font-mono text-red-300 bg-red-950/50 px-2 py-0.5 rounded border border-red-800/40">
                {scenario.wbe.collectorId.split("(")[0]}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-400">Bacterias/Genes en el Agua:</span>
                <span className="font-bold text-red-400 font-mono">
                  +{scenario.wbe.argBaselineIncreasePct}% más que el mes pasado
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-400">Cantidad Exacta en Tubo:</span>
                <span className="font-bold text-zinc-100 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700 font-mono">
                  {scenario.wbe.argCopiesPerLiter.toLocaleString()} copias/Litro
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-400">Antibiótico en el Agua:</span>
                <span className="text-zinc-100 font-mono font-bold">
                  {effectiveConcentration} ng/L{" "}
                  <span className="text-zinc-500 font-normal">
                    (Límite seguro: {scenario.wbe.pnecSelectiveThresholdNgL} ng/L)
                  </span>
                </span>
              </div>

              {/* Visual Bar of Selective Pressure R_sel */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Índice de Peligro Ambiental (R_sel):</span>
                  <span
                    className={`font-bold font-mono ${
                      exceedsPnec ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {pnecRatio} veces el límite seguro
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      exceedsPnec
                        ? "bg-gradient-to-r from-amber-500 to-red-600"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, pnecRatio * 6)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Plain Spanish Explanation Box */}
          <div className="mt-4 p-3 rounded-lg bg-[#0d0d12] border border-red-900/30 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-400">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>En palabras simples:</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {proaInterventionActive
                ? `✅ Con los filtros de carbón activado en Sedalib, el antibiótico en el agua bajó a ${effectiveConcentration} ng/L (${pnecRatio}x), frenando la creación de superbacterias.`
                : scenario.wbe.plainExplanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
