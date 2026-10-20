import { useState, useEffect } from "react";
import { PRESET_SCENARIOS } from "../data/scenarios";
import { RegionalScenario } from "../types";
import {
  Play,
  Sliders,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Code2,
  Hospital,
  Pill,
  Droplets,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

interface ScenarioSelectorProps {
  selectedScenario: RegionalScenario;
  onSelectScenario: (scenario: RegionalScenario) => void;
  onRunSimulation: (promptText: string, temp: number, topP: number) => void;
  isSimulating: boolean;
  proaInterventionActive: boolean;
  onToggleProaIntervention: (active: boolean) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  selectedScenario,
  onSelectScenario,
  onRunSimulation,
  isSimulating,
  proaInterventionActive,
  onToggleProaIntervention,
}) => {
  const [activePresetId, setActivePresetId] = useState<string>(selectedScenario.id);
  const [customPrompt, setCustomPrompt] = useState<string>(selectedScenario.rawPrompt);
  const [temperature, setTemperature] = useState<number>(0.2);
  const [topP, setTopP] = useState<number>(0.95);
  const [showTechnicalPrompt, setShowTechnicalPrompt] = useState<boolean>(false);

  // Sync when selectedScenario changes from outside (e.g. from Map or Evaluator tab)
  useEffect(() => {
    setActivePresetId(selectedScenario.id);
    setCustomPrompt(selectedScenario.rawPrompt);
  }, [selectedScenario.id]);

  const buildDynamicPrompt = (sc: RegionalScenario, proaActive: boolean) => {
    const pnecRatio = (
      sc.wbe.residualConcentrationNgL / (sc.wbe.pnecSelectiveThresholdNgL || 64)
    ).toFixed(2);
    const mainAb = sc.prescription.antibiotics[0];

    return `[DATOS DE ENTRADA REGIONAL - GEMELO DIGITAL SP-7 TRUJILLO]
Región: ${sc.region}
Población estimada en cuenca: ${sc.population.toLocaleString()} habitantes (Área Metropolitana de Trujillo: 1.15M hab)
Estado de Mitigación PROA / Sedalib: ${proaActive ? "ACTIVO (Restricción farmacológica y filtrado terciario aplicados)" : "INACTIVO (Evolución libre sin intervención)"}

1. Datos Genómicos Clínicos (${sc.clinical.setting}):
- Patógeno vigilado: ${sc.clinical.pathogen} (${sc.clinical.isolatesCount} casos clínicos reportados).
- Gen de resistencia crítico (ARG): ${sc.clinical.criticalArg} con frecuencia basal del ${sc.clinical.argFrequencyPct}%.

2. Datos de Prescripción Farmacoepidemiológica (Trujillo):
- Antibiótico principal: ${mainAb.name} con dispensación de ${mainAb.dddRate} DDD/1000 hab/día (${mainAb.targetContext}).

3. Epidemiología en Aguas Residuales (WBE - ${sc.wbe.collectorId}):
- Gen detectado en efluente: ${sc.wbe.argDetected} con ${sc.wbe.argCopiesPerLiter.toExponential(1)} copias/L (+${sc.wbe.argBaselineIncreasePct}% sobre línea base).
- Antibiótico residual en desagüe: ${sc.wbe.residualAntibiotic} a ${sc.wbe.residualConcentrationNgL} ng/L (Razón Selectiva R_sel = ${pnecRatio}x sobre umbral PNEC de ${sc.wbe.pnecSelectiveThresholdNgL} ng/L).

Ejecuta el análisis del Gemelo Digital SP-7, modela la dispersión proyectada a 30, 60 y 90 días y emite las directivas PROA y de saneamiento para Sedalib.`;
  };

  const handlePresetSelect = (preset: RegionalScenario) => {
    // Clone preset so live sliders can modify it cleanly
    const cloned: RegionalScenario = JSON.parse(JSON.stringify(preset));
    setActivePresetId(cloned.id);
    onSelectScenario(cloned);
    const updatedPrompt = buildDynamicPrompt(cloned, proaInterventionActive);
    setCustomPrompt(updatedPrompt);
  };

  const handleSliderChange = (
    field: "isolates" | "ddd" | "wbeNgL",
    value: number
  ) => {
    const updated: RegionalScenario = JSON.parse(JSON.stringify(selectedScenario));
    if (field === "isolates") {
      updated.clinical.isolatesCount = value;
      // Slightly adjust baseline resistance frequency proportionally
      updated.clinical.argFrequencyPct = Math.min(
        85,
        +(Math.max(4, value * 0.65)).toFixed(1)
      );
    } else if (field === "ddd") {
      if (updated.prescription.antibiotics.length > 0) {
        updated.prescription.antibiotics[0].dddRate = value;
        updated.prescription.antibiotics[0].status =
          value > 20 ? "critical" : value > 10 ? "elevated" : "normal";
      }
    } else if (field === "wbeNgL") {
      updated.wbe.residualConcentrationNgL = value;
      const ratio = value / (updated.wbe.pnecSelectiveThresholdNgL || 64);
      updated.wbe.argBaselineIncreasePct = Math.round(ratio * 25);
    }
    const newPrompt = buildDynamicPrompt(updated, proaInterventionActive);
    updated.rawPrompt = newPrompt;
    setCustomPrompt(newPrompt);
    onSelectScenario(updated);
  };

  const handleResetToPreset = () => {
    const original =
      PRESET_SCENARIOS.find((p) => p.id === activePresetId) || PRESET_SCENARIOS[0];
    handlePresetSelect(original);
    onToggleProaIntervention(false);
    setTemperature(0.2);
    setTopP(0.95);
  };

  const handleExecute = () => {
    onRunSimulation(customPrompt, temperature, topP);
  };

  const currentPnecRatio = +(
    selectedScenario.wbe.residualConcentrationNgL /
    (selectedScenario.wbe.pnecSelectiveThresholdNgL || 64)
  ).toFixed(2);

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-[#0d0d12] border border-zinc-800 space-y-5 shadow-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[11px] uppercase font-mono tracking-wider text-blue-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            PASO 1: SELECCIONA UN ESCENARIO DE TRUJILLO O MUEVE LOS SENSORES EN VIVO
          </span>
          <h2 className="text-base sm:text-lg font-bold text-zinc-100 mt-0.5">
            Centro de Control de Escenarios Epidemiológicos (Trujillo, La Libertad)
          </h2>
        </div>

        <button
          onClick={handleResetToPreset}
          className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-medium transition-colors cursor-pointer"
          title="Restaurar valores originales del escenario"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
          <span>Restaurar Valores Originales</span>
        </button>
      </div>

      {/* 3 Visual Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {PRESET_SCENARIOS.map((sc, idx) => {
          const isSelected = activePresetId === sc.id;
          return (
            <button
              key={sc.id}
              id={`preset-tab-${sc.id}`}
              onClick={() => handlePresetSelect(sc)}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                isSelected
                  ? "bg-gradient-to-b from-zinc-800/90 to-[#14141d] border-blue-500 ring-1 ring-blue-500/40 shadow-md"
                  : "bg-[#14141a] border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900/60"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? "bg-blue-950 text-blue-300 border-blue-700"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800"
                    }`}
                  >
                    ESCENARIO {idx + 1}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                    Alerta: +{sc.earlyWarningDays} días antes
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-100 leading-snug">
                  {sc.shortTitle}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                  {sc.plainSummary}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-300 truncate max-w-[180px]">
                  📍 {sc.region.split("—")[1] || sc.region}
                </span>
                <span
                  className={`font-bold ${
                    isSelected ? "text-blue-400" : "text-zinc-500"
                  }`}
                >
                  {isSelected ? "● Activo" : "Seleccionar →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Plain Spanish Story Box of Selected Scenario */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 via-[#14141f] to-[#14141a] border border-blue-900/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              💡 ¿Qué está pasando en este escenario? (Explicación Sencilla):
            </span>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800">
              Población vigilada: {selectedScenario.population.toLocaleString()} hab.
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
            {selectedScenario.plainSummary}
          </p>
        </div>

        {/* Quick Intervention Toggle (Answers RQ3 Live!) */}
        <div className="shrink-0 p-3 rounded-lg bg-[#0d0d12] border border-zinc-800 flex flex-col gap-2 min-w-[260px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <ShieldCheck
                className={`w-4 h-4 ${
                  proaInterventionActive ? "text-emerald-400" : "text-zinc-500"
                }`}
              />
              <span>Defensa PROA + Sedalib</span>
            </span>
            <button
              onClick={() => {
                const next = !proaInterventionActive;
                onToggleProaIntervention(next);
                setCustomPrompt(buildDynamicPrompt(selectedScenario, next));
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                proaInterventionActive
                  ? "bg-emerald-600 text-white border-emerald-400 shadow-sm shadow-emerald-950"
                  : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
              }`}
            >
              {proaInterventionActive ? "ACTIVA (-44.6% Riesgo)" : "DESACTIVADA"}
            </button>
          </div>
          <p className="text-[11px] text-zinc-400 leading-snug">
            {proaInterventionActive
              ? "✅ Aplicando restricción de antibióticos en hospital y filtros en desagüe (aplana la curva en el gráfico)."
              : "⚠️ Sin intervención: las superbacterias crecen libremente hacia el colapso en 90 días."}
          </p>
        </div>
      </div>

      {/* Interactive Live Sliders ("¿Qué pasa si cambiamos los valores en Trujillo?") */}
      <div className="p-4 rounded-xl bg-[#14141a] border border-zinc-800/90 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs sm:text-sm font-bold text-zinc-100">
              Simulador en Vivo: Mueve las perillas para probar qué pasa en Trujillo
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400">
            Al mover cualquier barra, las tarjetas y el gráfico de abajo reaccionan al instante
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Slider 1: Hospital Cases */}
          <div className="p-3 rounded-lg bg-[#0d0d12] border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-400 flex items-center gap-1.5">
                <Hospital className="w-3.5 h-3.5" />
                1. Enfermos en Hospital:
              </span>
              <span className="font-mono font-bold text-zinc-100 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {selectedScenario.clinical.isolatesCount} pacientes
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={selectedScenario.clinical.isolatesCount}
              onChange={(e) => handleSliderChange("isolates", Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>1 caso (Silencioso)</span>
              <span>100 casos (Brote masivo)</span>
            </div>
          </div>

          {/* Slider 2: Pharmacy DDD */}
          <div className="p-3 rounded-lg bg-[#0d0d12] border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5" />
                2. Recetas en Farmacias:
              </span>
              <span className="font-mono font-bold text-zinc-100 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {selectedScenario.prescription.antibiotics[0]?.dddRate || 10} DDD
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={45}
              step={0.5}
              value={selectedScenario.prescription.antibiotics[0]?.dddRate || 10}
              onChange={(e) => handleSliderChange("ddd", Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>1 DDD (Uso bajo)</span>
              <span>45 DDD (Abuso extremo)</span>
            </div>
          </div>

          {/* Slider 3: Wastewater Antibiotic ng/L */}
          <div className="p-3 rounded-lg bg-[#0d0d12] border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-red-400 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5" />
                3. Antibiótico en Desagüe:
              </span>
              <span className="font-mono font-bold text-zinc-100 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {selectedScenario.wbe.residualConcentrationNgL} ng/L ({currentPnecRatio}x)
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={2000}
              step={10}
              value={selectedScenario.wbe.residualConcentrationNgL}
              onChange={(e) => handleSliderChange("wbeNgL", Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>20 ng/L (Agua limpia)</span>
              <span>2000 ng/L (Peligro tóxico)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar: Collapsible Technical Prompt + Big Execute CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <button
          onClick={() => setShowTechnicalPrompt(!showTechnicalPrompt)}
          className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 bg-[#14141a] px-3 py-2 rounded-lg border border-zinc-800 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Code2 className="w-4 h-4 text-blue-400" />
          <span>
            {showTechnicalPrompt
              ? "Ocultar Prompt Técnico y Parámetros IA"
              : "Ver / Editar Prompt Técnico de Entrada (Avanzado)"}
          </span>
          {showTechnicalPrompt ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Big Friendly Execute Simulation Button */}
        <button
          id="btn-run-simulation"
          onClick={handleExecute}
          disabled={isSimulating}
          className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-sans font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg cursor-pointer ${
            isSimulating
              ? "bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed"
              : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-950/70 active:scale-[0.99]"
          }`}
        >
          <Play
            className={`w-4 h-4 fill-current ${isSimulating ? "animate-pulse" : ""}`}
          />
          <span>
            {isSimulating
              ? "Procesando con IA en el Gemelo Digital..."
              : "Ejecutar Diagnóstico Completo con IA"}
          </span>
        </button>
      </div>

      {/* Collapsible Advanced Prompt & AI Parameters */}
      {showTechnicalPrompt && (
        <div className="p-4 rounded-xl bg-[#070709] border border-zinc-800 space-y-3 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-zinc-300 font-bold">
              Payload Técnico Enviado al Motor Gemini (Editable):
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500">Temperatura (Determinismo):</span>
                <input
                  type="number"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value) || 0.2)}
                  className="w-14 px-1.5 py-0.5 rounded bg-[#14141a] border border-zinc-700 text-emerald-400 font-mono text-center font-bold text-xs"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500">Top-P:</span>
                <input
                  type="number"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value) || 0.95)}
                  className="w-14 px-1.5 py-0.5 rounded bg-[#14141a] border border-zinc-700 text-blue-400 font-mono text-center font-bold text-xs"
                />
              </div>
            </div>
          </div>

          <textarea
            id="prompt-input-textarea"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={7}
            className="w-full p-3 rounded-lg bg-[#0d0d12] border border-zinc-800 focus:border-blue-500 text-xs font-mono text-zinc-200 leading-relaxed resize-y outline-none"
          />
        </div>
      )}
    </div>
  );
};
