import { useState } from "react";
import { PRESET_SCENARIOS } from "../data/scenarios";
import { RegionalScenario } from "../types";
import { Play, Sparkles, Sliders, Edit3, RotateCcw, AlertTriangle, CheckCircle, ChevronRight } from "lucide-react";

interface ScenarioSelectorProps {
  selectedScenario: RegionalScenario;
  onSelectScenario: (scenario: RegionalScenario) => void;
  onRunSimulation: (promptText: string, temp: number, topP: number) => void;
  isSimulating: boolean;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  selectedScenario,
  onSelectScenario,
  onRunSimulation,
  isSimulating,
}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedScenario.id);
  const [customPrompt, setCustomPrompt] = useState<string>(selectedScenario.rawPrompt);
  const [temperature, setTemperature] = useState<number>(0.2);
  const [topP, setTopP] = useState<number>(0.95);
  const [isEditingPrompt, setIsEditingPrompt] = useState<boolean>(false);

  const handleTabChange = (scenario: RegionalScenario) => {
    setActiveTab(scenario.id);
    onSelectScenario(scenario);
    setCustomPrompt(scenario.rawPrompt);
    setIsEditingPrompt(false);
  };

  const handleExecute = () => {
    onRunSimulation(customPrompt, temperature, topP);
  };

  const handleResetParams = () => {
    setTemperature(0.2);
    setTopP(0.95);
  };

  return (
    <div className="p-4 sm:p-5 rounded-lg bg-[#0d0d12] border border-zinc-800 space-y-4 shadow-sm">
      {/* Title & Preset Selector Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">
            CASOS DE PRUEBA DE DEMOSTRACIÓN (USER PROMPTS)
          </span>
          <h2 className="text-sm sm:text-base font-bold text-zinc-100 mt-0.5 uppercase tracking-wide">
            Selección y Configuración de Entrada Regional
          </h2>
        </div>

        {/* Preset Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#14141a] p-1 rounded border border-zinc-800">
          {PRESET_SCENARIOS.map((sc, index) => {
            const isSelected = activeTab === sc.id;
            return (
              <button
                key={sc.id}
                id={`preset-tab-${sc.id}`}
                onClick={() => handleTabChange(sc)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-red-500" : "bg-zinc-600"}`}></span>
                <span>Caso {index + 1}: {sc.title.split(":")[0]}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsEditingPrompt(!isEditingPrompt)}
            className={`px-2.5 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer flex items-center gap-1 ${
              isEditingPrompt
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Editar prompt manualmente"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Modo Libre</span>
          </button>
        </div>
      </div>

      {/* Prompt Preview / Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <label className="font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <span>Payload de Entrada [DATOS REGIONALES SP-7]</span>
          </label>
          <span className="text-[10px] text-zinc-500">
            {isEditingPrompt ? "Modo edición activo" : "Listo para inferencia"}
          </span>
        </div>

        <div className="relative">
          <textarea
            id="prompt-input-textarea"
            value={customPrompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value);
              setIsEditingPrompt(true);
            }}
            rows={6}
            className="w-full p-3.5 rounded bg-[#070709] border border-zinc-800 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 text-xs font-mono text-zinc-200 leading-relaxed resize-y outline-none transition-colors"
            placeholder="Pega o escribe los datos regionales..."
          />
        </div>
      </div>

      {/* Analytical Parameter Bar & Execution CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        {/* Parameters (Temperature 0.2, Top P 0.95) */}
        <div className="flex flex-wrap items-center gap-3 bg-[#14141a] p-2 rounded border border-zinc-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[11px] uppercase">Temp:</span>
            <input
              type="number"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value) || 0.2)}
              className="w-14 px-1.5 py-0.5 rounded bg-[#0a0a0c] border border-zinc-700 text-green-400 font-mono text-center font-bold text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[11px] uppercase">Top P:</span>
            <input
              type="number"
              min="0.1"
              max="1.0"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value) || 0.95)}
              className="w-14 px-1.5 py-0.5 rounded bg-[#0a0a0c] border border-zinc-700 text-blue-400 font-mono text-center font-bold text-xs"
            />
          </div>

          <button
            onClick={handleResetParams}
            className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono transition-colors cursor-pointer border-l border-zinc-800 pl-2"
            title="Restablecer valores deterministas estándar (0.2 / 0.95)"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset (0.2 / 0.95)</span>
          </button>
        </div>

        {/* Action Button in Sophisticated Dark Red Accent */}
        <button
          id="btn-run-simulation"
          onClick={handleExecute}
          disabled={isSimulating}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
            isSimulating
              ? "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-500 text-white shadow-red-950/60 active:scale-[0.99]"
          }`}
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isSimulating ? "animate-pulse" : ""}`} />
          <span>
            {isSimulating ? "Ejecutando Modelado..." : "Ejecutar Análisis del Gemelo Digital"}
          </span>
        </button>
      </div>
    </div>
  );
};

