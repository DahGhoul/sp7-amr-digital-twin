import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Copy,
  Check,
  Terminal,
  FileText,
  Download,
  Cpu,
  BookOpen,
  Eye,
  BrainCircuit,
} from "lucide-react";
import { RegionalScenario, SimulationResponse } from "../types";
import { GLOSSARY_ITEMS } from "../data/scenarios";

interface TwinOutputViewerProps {
  simulation: SimulationResponse | null;
  isLoading: boolean;
  scenario?: RegionalScenario;
}

export const TwinOutputViewer: React.FC<TwinOutputViewerProps> = ({
  simulation,
  isLoading,
  scenario,
}) => {
  const [viewMode, setViewMode] = useState<"report" | "json" | "glossary">(
    "report"
  );
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="p-10 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center space-y-4 min-h-[300px] shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#1E3A8A] flex items-center justify-center">
          <Cpu className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <h4 className="text-base font-bold text-slate-900">
            Procesando Simulación Epidemiológica en Trujillo...
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Sincronizando datos de hospitales, farmacias y colectores de Sedalib con el motor analítico SP-7.
          </p>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    if (!simulation?.rawOutput) return;
    navigator.clipboard.writeText(simulation.rawOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!simulation?.rawOutput) return;
    const fullContent = `${simulation.rawOutput}\n\n---\n### Interpretabilidad y Explicabilidad del Reporte\n- **Interpretabilidad:** ${scenario?.plainSummary || ""}\n- **Explicabilidad Causal:** Modelo acoplado PNEC-WBE-DDD calibrado para la cuenca metropolitana de Trujillo (UNT, 2026).\n`;
    const blob = new Blob([fullContent], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Reporte_Gemelo_Digital_SP7_Trujillo.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const jsonState = simulation?.jsonState;

  return (
    <div className="space-y-6">
      {/* Top Sub-Navigation & Export Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setViewMode("report")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "report"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Informe Epidemiológico Completo (IA)</span>
          </button>

          <button
            onClick={() => setViewMode("json")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "json"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Objeto JSON del Gemelo</span>
          </button>

          <button
            onClick={() => setViewMode("glossary")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "glossary"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Glosario Sencillo de Siglas</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copiar Reporte</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Grabar Reporte (.MD)</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: FULL REPORT WITH EXPLAINABILITY */}
      {viewMode === "report" && simulation && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {/* Interpretability & Explainability Header Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/60 p-4 rounded-xl border border-blue-200">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] uppercase">
                <Eye className="w-4 h-4" />
                <span>Interpretabilidad del Reporte Clínico</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {scenario?.plainSummary}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase">
                <BrainCircuit className="w-4 h-4" />
                <span>Explicabilidad del Motor de Inferencia (T = 0.2)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                El motor cruza la razón matemática <strong>R_sel = C_medida / PNEC</strong> con la tasa de dispensación DDD y el conteo de copias génicas/L para emitir directivas deterministas auditables por el comité PROA.
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-h3:text-[#1E3A8A] prose-h3:border-b prose-h3:border-slate-200 prose-h3:pb-2 prose-h3:mt-6 prose-h3:mb-3 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-900 prose-table:border prose-table:border-slate-200 prose-th:bg-slate-100 prose-th:text-slate-900 prose-th:p-3 prose-td:p-3 prose-td:border-t prose-td:border-slate-200 text-sm">
            <ReactMarkdown>{simulation.rawOutput}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* VIEW 2: JSON STATE */}
      {viewMode === "json" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">
              Objeto de Estado Estructurado (JSON para Interoperabilidad MINSA / Sedalib)
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Esquema Validado
            </span>
          </div>
          <pre className="p-4 rounded-xl bg-slate-900 text-emerald-300 text-xs font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed">
            {jsonState
              ? JSON.stringify(jsonState, null, 2)
              : "No se detectó bloque JSON"}
          </pre>
        </div>
      )}

      {/* VIEW 3: FRIENDLY GLOSSARY */}
      {viewMode === "glossary" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Glosario de Términos Científicos Explicados en Simple
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Guía rápida para entender cada sigla del Gemelo Digital sin necesidad de ser médico o microbiólogo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GLOSSARY_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#1E3A8A]">
                    {item.term}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                    {item.short}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong>En simple:</strong> {item.simple}
                </p>
                <p className="text-xs text-slate-500 pt-1.5 border-t border-slate-200">
                  <strong>Definición técnica:</strong> {item.technical}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
