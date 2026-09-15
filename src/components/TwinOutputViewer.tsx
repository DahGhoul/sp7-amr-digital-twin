import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, Terminal, FileText, CheckCircle2, AlertOctagon, Download, Share2, ShieldAlert, Cpu } from "lucide-react";
import { DigitalTwinJsonState, SimulationResponse } from "../types";

interface TwinOutputViewerProps {
  simulation: SimulationResponse | null;
  isLoading: boolean;
}

export const TwinOutputViewer: React.FC<TwinOutputViewerProps> = ({
  simulation,
  isLoading,
}) => {
  const [viewMode, setViewMode] = useState<"structured" | "raw" | "json">("structured");
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8 rounded-lg bg-[#0d0d12] border border-zinc-800 flex flex-col items-center justify-center space-y-4 min-h-[350px]">
        <div className="relative flex items-center justify-center w-12 h-12 rounded bg-blue-950/40 border border-blue-800/50 text-blue-400">
          <Cpu className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <h4 className="text-sm font-bold text-zinc-100 font-mono uppercase tracking-wide">
            Ejecutando Inferencia Determinista en Gemelo Digital SP-7
          </h4>
          <p className="text-xs text-zinc-400 max-w-md font-mono">
            Acoplando genómica clínica, dispensación DDD y colectores WBE con Gemini (Temp 0.2)...
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 bg-[#14141a] px-3 py-1.5 rounded border border-zinc-800">
          <span className="text-blue-400 font-bold">Pipeline:</span>
          <span>1. Correlación Cruzada & PNEC</span>
          <span>→</span>
          <span>2. Modelo Híbrido 30/60/90d</span>
          <span>→</span>
          <span>3. Directivas PROA</span>
        </div>
      </div>
    );
  }

  if (!simulation || !simulation.rawOutput) {
    return (
      <div className="p-8 rounded-lg bg-[#0d0d12] border border-dashed border-zinc-800 text-center space-y-3 min-h-[220px] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded bg-[#14141a] border border-zinc-800 flex items-center justify-center text-zinc-500">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide font-mono">
            Ninguna Simulación Ejecutada Aún
          </h4>
          <p className="text-xs text-zinc-500 max-w-sm mt-1 font-mono">
            Selecciona un escenario arriba y presiona &quot;Ejecutar Análisis del Gemelo Digital&quot; para iniciar la inferencia determinista.
          </p>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(simulation.rawOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const blob = new Blob([simulation.rawOutput], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Gemelo-Digital-RAM-SP7-Reporte-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const jsonState = simulation.jsonState;

  return (
    <div className="p-4 sm:p-5 rounded-lg bg-[#0d0d12] border border-zinc-800 space-y-4 shadow-sm">
      {/* Top Banner with State JSON summary badges */}
      {jsonState && (
        <div className="p-3 rounded-lg bg-[#14141a] border border-zinc-800 flex flex-wrap items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded border ${
                jsonState.early_warning_active
                  ? "bg-red-950/60 text-red-400 border-red-800/60"
                  : "bg-green-950/60 text-green-400 border-green-800/60"
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-zinc-100">
                  {jsonState.simulation_id || "SIM-SP7"}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                    jsonState.early_warning_active
                      ? "bg-red-950 text-red-400 border-red-800 animate-pulse"
                      : "bg-green-950 text-green-400 border-green-800"
                  }`}
                >
                  {jsonState.early_warning_active ? "ALERTA TEMPRANA ACTIVA" : "ESTADO CONTROLADO"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Riesgo Regional:{" "}
                <strong
                  className={
                    jsonState.regional_risk_score > 75
                      ? "text-red-400 font-mono"
                      : jsonState.regional_risk_score > 50
                      ? "text-amber-400 font-mono"
                      : "text-green-400 font-mono"
                  }
                >
                  {jsonState.regional_risk_score} / 100
                </strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {jsonState.recommended_action_code && (
              <span className="px-2 py-1 rounded bg-[#0d0d12] text-blue-400 border border-zinc-800 font-bold">
                Acción: <strong>{jsonState.recommended_action_code}</strong>
              </span>
            )}
            {typeof jsonState.projected_resistance_increase_pct_90d === "number" && (
              <span className="px-2 py-1 rounded bg-red-950/60 text-red-300 border border-red-800/50">
                +<strong>{jsonState.projected_resistance_increase_pct_90d}%</strong> (90d)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Toolbar & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-1 bg-[#14141a] p-1 rounded border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setViewMode("structured")}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
              viewMode === "structured"
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Vista Estructurada
          </button>
          <button
            onClick={() => setViewMode("raw")}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
              viewMode === "raw"
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Texto Plano
          </button>
          <button
            onClick={() => setViewMode("json")}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
              viewMode === "json"
                ? "bg-zinc-800 text-blue-400 border border-zinc-700 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            JSON State
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copiar Respuesta</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-blue-400 border border-zinc-700 text-xs font-mono transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Reporte</span>
          </button>
        </div>
      </div>

      {/* Main output display */}
      {viewMode === "structured" && (
        <div className="prose prose-invert max-w-none prose-headings:text-zinc-100 prose-h3:text-blue-400 prose-h3:border-b prose-h3:border-zinc-800 prose-h3:pb-2 prose-h3:mt-6 prose-h3:mb-3 prose-p:text-zinc-300 prose-p:leading-relaxed prose-li:text-zinc-300 prose-strong:text-zinc-100 prose-table:border prose-table:border-zinc-800 prose-th:bg-[#14141a] prose-th:text-zinc-200 prose-th:p-2.5 prose-td:p-2.5 prose-td:border-t prose-td:border-zinc-800 text-sm">
          <ReactMarkdown>{simulation.rawOutput}</ReactMarkdown>
        </div>
      )}

      {viewMode === "raw" && (
        <pre className="p-4 rounded-lg bg-[#070709] border border-zinc-800 text-xs font-mono text-zinc-300 whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
          {simulation.rawOutput}
        </pre>
      )}

      {viewMode === "json" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Terminal className="w-4 h-4 text-blue-400" />
              Objeto de Estado del Gemelo Digital (JSON)
            </span>
            <span className="text-[10px] text-zinc-500">
              {jsonState ? "JSON válido estructurado" : "Extrayendo objeto JSON..."}
            </span>
          </div>
          <pre className="p-4 rounded-lg bg-[#070709] border border-zinc-800 text-xs font-mono text-zinc-300 whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-[450px] overflow-y-auto">
            {jsonState
              ? JSON.stringify(jsonState, null, 2)
              : simulation.rawOutput.match(/\{[\s\S]*\}/)?.[0] || "No se detectó bloque JSON"}
          </pre>
        </div>
      )}
    </div>
  );
};
