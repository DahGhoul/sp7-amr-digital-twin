import { useState } from "react";
import { X, Copy, Check, Sliders, Sparkles, BookOpen, ShieldCheck, Terminal } from "lucide-react";

interface AIStudioConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIStudioConfigModal: React.FC<AIStudioConfigModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const systemInstructionText = `Actúas como el núcleo analítico y motor de inferencia de un Gemelo Digital Híbrido Regional para la Vigilancia de la Resistencia a los Antimicrobianos (RAM - SP-7).

Tu función principal es acoplar, cruzar y modelar dinámicamente tres fuentes de datos heterogéneas:
1. Vigilancia Genómica Clínica: Detección de genes de resistencia (ARGs como blaKPC, blaNDM, mecA, mcr-1, vanA), linajes/secuencias tipo (ST) y tasas de resistencia fenotípica hospitalaria.
2. Datos de Prescripción y Dispensación: Consumo de antimicrobianos expresado en Dosis Diarias Definidas (DDD) por 1000 habitantes/día en farmacias comunitarias y centros de salud.
3. Epidemiología Basada en Aguas Residuales (WBE): Carga cuantificada de genes de resistencia (copias/L) y concentraciones de antibióticos residuales (ng/L) en efluentes y colectores urbanos zonales.

Al recibir un estado regional o evento de entrada, debes ejecutar el siguiente pipeline de razonamiento y generar la respuesta con este formato estricto:

### 1. Diagnóstico del Estado Actual del Gemelo Digital
- Análisis de Correlación Cruzada: Identificar concordancias o anomalías (ej. presencia de patógeno en aguas residuales sin reporte clínico formal, sugiriendo subreporte o transmisión comunitaria asintomática).
- Nivel de Presión Selectiva Ambiental: Evaluación de si las concentraciones de antibiótico en efluentes superan las Concentraciones Mínimas Inhibitorias Seleccionadas (PNEC).

### 2. Proyección Predictiva (Modelo Híbrido Dinámico)
- Horizonte a 30 días: Estimación de dispersión clonal o incremento porcentual de casos.
- Horizonte a 60 días: Probabilidad de escape hospitalario a nivel comunitario.
- Horizonte a 90 días: Tasa proyectada de fallo terapéutico empírico para la familia de antibióticos comprometida.

### 3. Matriz de Riesgo y Alertas Zonales
Presenta una tabla Markdown con las columnas:
| Sector / Distrito | Patógeno / ARG Crítico | Nivel de Riesgo (Bajo/Medio/Alto/Crítico) | Factor Determinante | Indicador Clave |

### 4. Recomendaciones de Intervención Epidemiológica (Directivas de Control)
- Nivel Clínico / Farmacéutico: Restricción temporal, cambio en protocolos empíricos o auditoría PROA (Programa de Optimización de Antimicrobianos).
- Nivel Sanitario / Ambiental: Muestreo intensificado en colectores específicos o desinfección focalizada de efluentes hospitalarios.

### 5. Objeto de Estado del Gemelo Digital (JSON)
Entrega un bloque JSON estructurado con los valores simulados:
\`\`\`json
{
  "simulation_id": "SIM-XXXX",
  "timestamp": "ISO-8601",
  "regional_risk_score": 0-100,
  "early_warning_active": true/false,
  "critical_nodes": ["Sector..."],
  "projected_resistance_increase_pct_90d": 0.0,
  "recommended_action_code": "PROA-LVL-X"
}
\`\`\`

Mantén un lenguaje técnico, preciso, epidemiológico y computacional.`;

  const promptCase1 = `[DATOS DE ENTRADA REGIONAL - GEMELO DIGITAL SP-7]
Región: Sector Norte - Cuenca Urbana Colector C-04
Población estimada: 180,000 habitantes

1. Datos Genómicos Clínicos (Últimos 14 días):
- Aislamientos clínicos de Klebsiella pneumoniae reportados: 12 casos.
- Frecuencia de carbapenémicos (blaKPC): 8.3% (1 caso aislado en UCI Hospital Regional).

2. Datos de Prescripción (Dispensación Farmacéutica):
- Consumo de Meropenem / Imipenem: 1.2 DDD/1000 hab/día (rango normal).
- Consumo de Ceftriaxona: 14.5 DDD/1000 hab/día (elevado en atención primaria).

3. Epidemiología en Aguas Residuales (WBE - Muestreo Colector C-04):
- Detección de gen blaKPC-2: 4.8 x 10^5 copias de genes/L (aumento del 340% respecto a la línea base del mes anterior).
- Concentración residual de ciprofloxacino: 850 ng/L (supera umbral selectivo).
- Detección de linaje hipervirulento ST258 en aguas residuales.

Ejecuta el análisis del Gemelo Digital, modela la dispersión proyectada y emite las alertas correspondientes.`;

  const promptCase2 = `[DATOS DE ENTRADA REGIONAL - GEMELO DIGITAL SP-7]
Región: Sector Sur / Distrito Periférico Colector S-01
Población estimada: 95,000 habitantes

1. Datos Genómicos Clínicos:
- Aislamientos de Escherichia coli uropatógena: 45 casos.
- Resistencia a Quinolonas (mutaciones gyrA / parC): 38% de los cultivos.

2. Datos de Prescripción:
- Ciprofloxacino oral dispensado en postas médicas: 28.4 DDD/1000 hab/día (pico estacional por infecciones urinarias no tipificadas).

3. Epidemiología en Aguas Residuales (WBE):
- Carga de gen qnrS: 1.2 x 10^6 copias/L en la salida de la planta de tratamiento local.
- Concentración de fluoroquinolonas activas en efluente: 1,200 ng/L.

Simula el escenario a 90 días, evalúa la viabilidad del tratamiento empírico de primera línea y define las directivas PROA necesarias.`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono">
      <div className="bg-[#0d0d12] border border-zinc-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-[#0d0d12]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-zinc-800 border border-zinc-700 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">Configuración de Parámetros en Google AI Studio</h2>
              <p className="text-[10px] text-zinc-500 font-mono">Guía de replicación determinista para el evaluador SP-7</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-zinc-300">
          {/* Parameter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded bg-[#14141a] border border-zinc-800">
              <span className="text-[10px] text-zinc-500 font-mono block uppercase">Modelo</span>
              <span className="text-xs font-bold text-blue-400 font-mono mt-0.5 block">
                Gemini 1.5 Pro / 2.0 / 3.7
              </span>
            </div>
            <div className="p-3 rounded bg-[#14141a] border border-zinc-800">
              <span className="text-[10px] text-zinc-500 font-mono block uppercase">Temperature</span>
              <span className="text-xs font-bold text-green-400 font-mono mt-0.5 block">
                0.2 (Determinista)
              </span>
            </div>
            <div className="p-3 rounded bg-[#14141a] border border-zinc-800">
              <span className="text-[10px] text-zinc-500 font-mono block uppercase">Top P</span>
              <span className="text-xs font-bold text-zinc-200 font-mono mt-0.5 block">
                0.95
              </span>
            </div>
            <div className="p-3 rounded bg-[#14141a] border border-zinc-800">
              <span className="text-[10px] text-zinc-500 font-mono block uppercase">Safety Settings</span>
              <span className="text-xs font-bold text-amber-400 font-mono mt-0.5 block">
                Default / Block some
              </span>
            </div>
          </div>

          {/* System Instructions Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                System Instructions (Pegar en Google AI Studio)
              </label>
              <button
                onClick={() => handleCopy(systemInstructionText, "sys_inst")}
                className="flex items-center gap-1.5 text-[11px] text-blue-400 hover:text-blue-300 font-mono px-2 py-1 rounded bg-zinc-800 border border-zinc-700 transition-colors cursor-pointer"
              >
                {copiedKey === "sys_inst" ? (
                  <>
                    <Check className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Copiar System Instructions</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <pre className="p-3.5 rounded bg-[#070709] border border-zinc-800 text-[11px] font-mono text-zinc-300 max-h-52 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {systemInstructionText}
              </pre>
            </div>
          </div>

          {/* Prompt 1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                Caso 1: Alerta Temprana por Subreporte Clínico (WBE vs Hospital)
              </span>
              <button
                onClick={() => handleCopy(promptCase1, "case1")}
                className="flex items-center gap-1.5 text-[11px] text-red-400 hover:text-red-300 font-mono px-2 py-1 rounded bg-zinc-800 border border-zinc-700 transition-colors cursor-pointer"
              >
                {copiedKey === "case1" ? (
                  <>
                    <Check className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Copiar Prompt 1</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 rounded bg-[#070709] border border-zinc-800 text-[11px] font-mono text-zinc-300 max-h-36 overflow-y-auto whitespace-pre-wrap">
              {promptCase1}
            </pre>
          </div>

          {/* Prompt 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Caso 2: Sobreprescripción en Atención Primaria & Presión Selectiva
              </span>
              <button
                onClick={() => handleCopy(promptCase2, "case2")}
                className="flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 font-mono px-2 py-1 rounded bg-zinc-800 border border-zinc-700 transition-colors cursor-pointer"
              >
                {copiedKey === "case2" ? (
                  <>
                    <Check className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Copiar Prompt 2</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 rounded bg-[#070709] border border-zinc-800 text-[11px] font-mono text-zinc-300 max-h-36 overflow-y-auto whitespace-pre-wrap">
              {promptCase2}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0d0d12] border-t border-zinc-800 flex items-center justify-between font-mono">
          <span className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            Integración de Inferencia nativa con Gemini API (Google AI Studio)
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 text-xs font-mono transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
