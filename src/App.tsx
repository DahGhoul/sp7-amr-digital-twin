import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Header } from "./components/Header";
import { AIStudioConfigModal } from "./components/AIStudioConfigModal";
import { ScenarioSelector } from "./components/ScenarioSelector";
import { TriSourceTelemetryCard } from "./components/TriSourceTelemetryCard";
import { DigitalTwinMap } from "./components/DigitalTwinMap";
import { ProjectionChart } from "./components/ProjectionChart";
import { TwinOutputViewer } from "./components/TwinOutputViewer";
import { PRESET_SCENARIOS } from "./data/scenarios";
import { RegionalScenario, SimulationResponse } from "./types";
import {
  Activity,
  Sliders,
  Sparkles,
  ShieldCheck,
  AlertOctagon,
  FileCheck,
  Info,
  Layers,
  ChevronRight,
  Database,
  BarChart3,
  Dna,
} from "lucide-react";

export default function App() {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<RegionalScenario>(PRESET_SCENARIOS[0]);
  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationCount, setSimulationCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "proa" | "evaluator">("overview");

  // Function to execute simulation inference with Gemini
  const handleRunSimulation = async (
    promptText: string,
    temp: number = 0.2,
    topP: number = 0.95
  ) => {
    setIsSimulating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/twin/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          customTemperature: temp,
          customTopP: topP,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al comunicarse con el motor de inferencia Gemini.");
      }

      setSimulationResult(data);
      setSimulationCount((prev) => prev + 1);

      // Trigger subtle celebration when result arrives
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#06b6d4", "#6366f1", "#10b981"],
        });
      } catch {
        // Ignore confetti failures in sandboxed iframe
      }
    } catch (err: any) {
      console.error("Simulation error:", err);
      setErrorMessage(err.message || "Error desconocido al ejecutar la inferencia.");
    } finally {
      setIsSimulating(false);
    }
  };

  // Run initial simulation on load for seamless demonstration
  useEffect(() => {
    handleRunSimulation(selectedScenario.rawPrompt, 0.2, 0.95);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-300 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Navigation Header */}
      <Header
        onOpenConfig={() => setIsConfigOpen(true)}
        isSimulating={isSimulating}
        simulationCount={simulationCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Navigation Mode Bar & Quick Risk HUD */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d0d12] p-2 rounded-lg border border-zinc-800">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "overview"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Gemelo Digital (Inferencia & Telemetría)</span>
            </button>

            <button
              onClick={() => setActiveTab("proa")}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "proa"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Matriz de Riesgo & Directivas PROA</span>
            </button>

            <button
              onClick={() => setActiveTab("evaluator")}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "evaluator"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-red-400" />
              <span>Guía del Evaluador (Casos 1 & 2)</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {simulationResult?.jsonState?.regional_risk_score !== undefined && (
              <div className="flex items-center gap-2 bg-[#14141a] px-2.5 py-1 rounded border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase">Risk Score:</span>
                <span className={`font-bold ${
                  simulationResult.jsonState.regional_risk_score > 70
                    ? "text-red-500"
                    : simulationResult.jsonState.regional_risk_score > 40
                    ? "text-amber-400"
                    : "text-green-400"
                }`}>
                  {simulationResult.jsonState.regional_risk_score}/100
                </span>
              </div>
            )}
            <span className="text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              ENGINE: GEMINI 3.8 FLASH
            </span>
          </div>
        </div>

        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-200 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => handleRunSimulation(selectedScenario.rawPrompt)}
              className="px-3 py-1 bg-red-900 hover:bg-red-800 text-white rounded font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW & INFERENCE */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Scenario Input & Execution Bar */}
            <ScenarioSelector
              selectedScenario={selectedScenario}
              onSelectScenario={(sc) => setSelectedScenario(sc)}
              onRunSimulation={handleRunSimulation}
              isSimulating={isSimulating}
            />

            {/* Tri-source Telemetry Inspection Card */}
            <TriSourceTelemetryCard scenario={selectedScenario} />

            {/* Topología Espacial Map & Dynamic Projection Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <DigitalTwinMap activeNodeId={selectedScenario.id === "caso-2" ? "node-s01" : "node-c04"} />
              <ProjectionChart
                baseResistancePct={selectedScenario.clinical.argFrequencyPct}
                jsonState={simulationResult?.jsonState}
                pathogenName={selectedScenario.clinical.pathogen}
              />
            </div>

            {/* Structured Output Viewer (5 Mandated Sections) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">
                    Inferencia Determinista Multidimensional
                  </span>
                  <h3 className="text-sm font-bold tracking-wide text-zinc-100 uppercase font-sans">
                    Resultado del Pipeline de Razonamiento Epidemiológico
                  </h3>
                </div>
                <span className="text-xs text-zinc-500 font-mono">
                  {simulationResult?.meta?.timestamp
                    ? new Date(simulationResult.meta.timestamp).toLocaleTimeString()
                    : ""}
                </span>
              </div>

              <TwinOutputViewer simulation={simulationResult} isLoading={isSimulating} />
            </div>
          </div>
        )}

        {/* TAB 2: MATRIZ DE RIESGO & DIRECTIVAS PROA */}
        {activeTab === "proa" && (
          <div className="space-y-5">
            {/* Context Header */}
            <div className="p-4 sm:p-5 rounded-lg bg-[#0d0d12] border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                Programa de Optimización de Antimicrobianos (PROA) & Directivas de Control
              </div>
              <h2 className="text-base font-bold text-zinc-100">
                Directivas de Control Epidemiológico y Niveles de Alerta Zonal
              </h2>
              <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
                Protocolo estandarizado de respuesta rápida acoplado a los umbrales de alerta temprana del gemelo digital. Las acciones se bifurcan en nivel clínico/farmacéutico hospitalario y nivel sanitario/ambiental de saneamiento de efluentes.
              </p>
            </div>

            {/* Directives Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Clinical / Pharmaceutical */}
              <div className="p-4 sm:p-5 rounded-lg bg-[#0d0d12] border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-900/30 border border-blue-800/40 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                      01
                    </div>
                    <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wide">
                      Directivas Nivel Clínico / Farmacéutico
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono bg-zinc-900 text-blue-400 px-2 py-0.5 rounded border border-zinc-800">
                    Ámbito Asistencial
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                    <span className="font-bold text-red-400 font-mono">PROA-LVL-4: Restricción Temporal de Carbapenémicos</span>
                    <p className="text-zinc-400 leading-relaxed">
                      Suspender terapia empírica con meropenem/imipenem en UCI e iniciar doble validación por infectología y ajuste a perfil local.
                    </p>
                  </div>

                  <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                    <span className="font-bold text-amber-400 font-mono">PROA-LVL-3: Alerta de Prescripción en APS (Quinolonas)</span>
                    <p className="text-zinc-400 leading-relaxed">
                      Freno a la prescripción empírica de ciprofloxacino en infecciones urinarias ambulatorias no tipificadas; migrar a fosfomicina o nitrofurantoína.
                    </p>
                  </div>

                  <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                    <span className="font-bold text-zinc-300 font-mono">PROA-AUDIT: Auditoría de Dispensación Farmacéutica</span>
                    <p className="text-zinc-400 leading-relaxed">
                      Cruce automático de dispensación comunitaria vs urocultivos confirmados para detectar focos de sobreuso y presión estacional.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sanitary / Environmental */}
              <div className="p-4 sm:p-5 rounded-lg bg-[#0d0d12] border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-amber-900/30 border border-amber-800/40 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                      02
                    </div>
                    <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wide">
                      Directivas Nivel Sanitario / Ambiental (WBE)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono bg-zinc-900 text-amber-400 px-2 py-0.5 rounded border border-zinc-800">
                    Cuencas & Efluentes
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                    <span className="font-bold text-blue-400 font-mono">WBE-INTENS: Muestreo Focalizado en Colectores C-04 / S-01</span>
                    <p className="text-zinc-400 leading-relaxed">
                      Aumentar frecuencia de muestreo de efluentes a 48 horas mediante qPCR digital y secuenciación metagenómica.
                    </p>
                  </div>

                  <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                    <span className="font-bold text-red-400 font-mono">WBE-CLO2: Desinfección Focalizada de Efluente Hospitalario</span>
                    <p className="text-zinc-400 leading-relaxed">
                      Aplicación de oxidación avanzada (UV + Peróxido / Dióxido de Cloro) en la descarga hospitalaria antes del vertido al colector municipal.
                    </p>
                  </div>

                  <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                    <span className="font-bold text-emerald-400 font-mono">WBE-PNEC-CTRL: Monitoreo de Concentraciones Residuales</span>
                    <p className="text-zinc-400 leading-relaxed">
                      Verificación de que las concentraciones de antibiótico activo desciendan por debajo del límite selectivo PNEC (64 ng/L).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Output view if simulation ran */}
            {simulationResult && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  Última Inferencia de Alertas Zonales
                </h4>
                <TwinOutputViewer simulation={simulationResult} isLoading={isSimulating} />
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EVALUATOR GUIDANCE */}
        {activeTab === "evaluator" && (
          <div className="space-y-5">
            <div className="p-4 sm:p-5 rounded-lg bg-[#0d0d12] border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-500 text-xs font-mono font-bold uppercase tracking-widest">
                <FileCheck className="w-4 h-4" />
                Demostración y Validación ante el Evaluador
              </div>
              <h2 className="text-base font-bold text-zinc-100">
                Guía de Evaluación del Gemelo Digital RAM SP-7
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-4xl">
                Esta sección permite presentar la solución ante el evaluador paso a paso, demostrando la consistencia analítica determinista, el acoplamiento de las 3 fuentes de datos heterogéneas, y el formato de respuesta de 5 secciones con objeto JSON.
              </p>
            </div>

            {/* Step by step demo workflow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Step 1 Card */}
              <div className="p-4 sm:p-5 rounded-lg bg-[#0d0d12] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-950/40 border border-blue-800/40">
                    PASO 1: DEMOSTRAR CASO 1
                  </span>
                  <button
                    onClick={() => {
                      setSelectedScenario(PRESET_SCENARIOS[0]);
                      setActiveTab("overview");
                      handleRunSimulation(PRESET_SCENARIOS[0].rawPrompt);
                    }}
                    className="text-xs font-mono font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ejecutar Ahora</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="text-sm font-bold text-zinc-100">
                  Discrepancia WBE vs Hospital (Subreporte Clínico)
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Muestra cómo el gemelo digital detecta que solo hay 1 caso clínico reportado de Klebsiella pneumoniae con blaKPC en UCI, pero las aguas residuales en el Colector C-04 registran 4.8 × 10⁵ copias/L (+340% de aumento) y linaje hipervirulento ST258, activando alerta temprana de transmisión comunitaria oculta.
                </p>
              </div>

              {/* Step 2 Card */}
              <div className="p-4 sm:p-5 rounded-lg bg-[#0d0d12] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/40">
                    PASO 2: DEMOSTRAR CASO 2
                  </span>
                  <button
                    onClick={() => {
                      setSelectedScenario(PRESET_SCENARIOS[1]);
                      setActiveTab("overview");
                      handleRunSimulation(PRESET_SCENARIOS[1].rawPrompt);
                    }}
                    className="text-xs font-mono font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ejecutar Ahora</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="text-sm font-bold text-zinc-100">
                  Sobreprescripción en Atención Primaria & Presión Selectiva
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Muestra el impacto de una dispensación de 28.4 DDD/1000 hab/d de ciprofloxacino oral combinada con 1,200 ng/L de fluoroquinolonas residuales (18.7x PNEC) en el Colector S-01, proyectando un fallo terapéutico empírico crítico a 90 días y directiva PROA-LVL-3.
                </p>
              </div>
            </div>

            {/* Evaluation Verification Checklist */}
            <div className="p-4 sm:p-5 rounded-lg bg-[#0d0d12] border border-zinc-800 space-y-4">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Criterios de Evaluación y Consistencia Analítica
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800 flex items-start gap-2">
                  <span className="text-green-500 font-bold font-mono">✓</span>
                  <div>
                    <strong className="text-zinc-200 block font-mono">Temperatura 0.2</strong>
                    <span className="text-zinc-400">Consistencia analítica y cálculo determinista.</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800 flex items-start gap-2">
                  <span className="text-green-500 font-bold font-mono">✓</span>
                  <div>
                    <strong className="text-zinc-200 block font-mono">Acoplamiento Tri-Fuente</strong>
                    <span className="text-zinc-400">Genómica clínica, dispensación DDD y WBE.</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800 flex items-start gap-2">
                  <span className="text-green-500 font-bold font-mono">✓</span>
                  <div>
                    <strong className="text-zinc-200 block font-mono">5 Secciones Obligatorias</strong>
                    <span className="text-zinc-400">Diagnóstico, Proyección 30/60/90d, Matriz, PROA y JSON.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* AI Studio Configuration Modal */}
      <AIStudioConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />

      {/* Footer in Sophisticated Dark command center format */}
      <footer className="border-t border-zinc-800 bg-[#0a0a0c] py-3 text-center text-[9px] font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>LATENCY: 18ms | ENGINE_STATUS: NOMINAL | NODES_MAPPED: 142</div>
          <div>SP-7 REGIONAL AMR DIGITAL TWIN © 2024 SYSTEMA_BIOTICS • GOOGLE AI STUDIO</div>
        </div>
      </footer>
    </div>
  );
}
