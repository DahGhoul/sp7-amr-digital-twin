import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// System instructions exactly as specified for the RAM SP-7 Digital Twin
export const SYSTEM_INSTRUCTION_RAM_SP7 = `Actúas como el núcleo analítico y motor de inferencia de un Gemelo Digital Híbrido Regional para la Vigilancia de la Resistencia a los Antimicrobianos (RAM - SP-7).

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

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no está configurada en el entorno del servidor.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "RAM-SP7-Digital-Twin-Core",
    timestamp: new Date().toISOString(),
    ai_model_target: "gemini-3.7-flash",
    configured_params: {
      temperature: 0.2,
      topP: 0.95,
      systemInstructionLoaded: true,
    },
  });
});

// Run Simulation Inference Endpoint
app.post("/api/twin/simulate", async (req, res) => {
  try {
    const { prompt, customTemperature, customTopP } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "El parámetro 'prompt' es requerido." });
    }

    const ai = getGeminiClient();
    
    // Model selection based on guidelines: gemini-3.7-flash for text reasoning
    const model = "gemini-3.7-flash";
    const temperature = typeof customTemperature === "number" ? customTemperature : 0.2;
    const topP = typeof customTopP === "number" ? customTopP : 0.95;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_RAM_SP7,
        temperature: temperature,
        topP: topP,
      },
    });

    const rawOutput = response.text || "";

    // Extract JSON block if present
    let jsonState: any = null;
    const jsonMatch = rawOutput.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        jsonState = JSON.parse(jsonMatch[1]);
      } catch {
        // Look for any raw json { ... }
        const braceMatch = rawOutput.match(/\{[\s\S]*"simulation_id"[\s\S]*\}/);
        if (braceMatch) {
          try {
            jsonState = JSON.parse(braceMatch[0]);
          } catch {
            // fallback
          }
        }
      }
    }

    // If still null, try finding any JSON
    if (!jsonState) {
      const anyJsonMatch = rawOutput.match(/\{[\s\S]*"regional_risk_score"[\s\S]*\}/);
      if (anyJsonMatch) {
        try {
          jsonState = JSON.parse(anyJsonMatch[0]);
        } catch {
          // pass
        }
      }
    }

    return res.json({
      success: true,
      rawOutput: rawOutput,
      jsonState: jsonState,
      modelUsed: model,
      meta: {
        temperature: temperature,
        topP: topP,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error running simulation in Gemini:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Error al procesar la inferencia en el Gemelo Digital.",
    });
  }
});

// Deterministic PNEC analysis and projection mathematical engine
app.post("/api/twin/pnec-calc", (req, res) => {
  try {
    const { antibiotic, concentrationNgL, geneCopiesPerL, baseResistancePct, dddRate } = req.body;
    
    // Selective thresholds (Predicted No Effect Concentrations for resistance selection - PNEC-MIC/PNEC-ENV)
    // Ref: Bengtsson-Palme & Larsson (2016) / EUCAST
    const pnecThresholds: Record<string, { pnec_ng_L: number; family: string; mic_breakpoint_mg_L: number }> = {
      ciprofloxacino: { pnec_ng_L: 64, family: "Fluoroquinolonas", mic_breakpoint_mg_L: 0.5 },
      fluoroquinolonas: { pnec_ng_L: 100, family: "Fluoroquinolonas", mic_breakpoint_mg_L: 1.0 },
      ceftriaxona: { pnec_ng_L: 500, family: "Cefalosporinas 3G", mic_breakpoint_mg_L: 2.0 },
      meropenem: { pnec_ng_L: 1000, family: "Carbapenémicos", mic_breakpoint_mg_L: 2.0 },
      imipenem: { pnec_ng_L: 500, family: "Carbapenémicos", mic_breakpoint_mg_L: 2.0 },
      azitromicina: { pnec_ng_L: 250, family: "Macrólidos", mic_breakpoint_mg_L: 1.0 },
      amoxicilina: { pnec_ng_L: 250, family: "Penicilinas", mic_breakpoint_mg_L: 8.0 },
      vancomicina: { pnec_ng_L: 8000, family: "Glicopéptidos", mic_breakpoint_mg_L: 4.0 },
    };

    const key = (antibiotic || "ciprofloxacino").toLowerCase().trim();
    const matchedPnec = pnecThresholds[key] || { pnec_ng_L: 100, family: "Antimicrobiano General", mic_breakpoint_mg_L: 1.0 };
    
    const conc = Number(concentrationNgL) || 0;
    const pnecRatio = conc / matchedPnec.pnec_ng_L;
    const isExceedingPNEC = pnecRatio > 1.0;
    
    // Dynamic trajectory calculation
    const baseRes = Number(baseResistancePct) || 10;
    const ddd = Number(dddRate) || 10;
    const geneCopies = Number(geneCopiesPerL) || 100000;

    // Pressure multiplier
    const envFactor = Math.min(3.5, Math.max(1.0, Math.log10(pnecRatio > 0.1 ? pnecRatio * 10 : 1)));
    const dddFactor = Math.min(2.5, Math.max(1.0, ddd / 10));
    const wbeFactor = Math.min(3.0, Math.max(1.0, Math.log10(geneCopies / 10000)));

    const proj30d = Math.min(99, +(baseRes * (1 + 0.18 * envFactor * dddFactor)).toFixed(1));
    const proj60d = Math.min(99, +(baseRes * (1 + 0.42 * envFactor * dddFactor * wbeFactor)).toFixed(1));
    const proj90d = Math.min(99, +(baseRes * (1 + 0.78 * envFactor * dddFactor * wbeFactor)).toFixed(1));

    const therapeuticFailureProb90d = Math.min(95, +(proj90d * 0.88).toFixed(1));

    return res.json({
      antibiotic: key,
      family: matchedPnec.family,
      pnecThreshold_ng_L: matchedPnec.pnec_ng_L,
      measuredConcentration_ng_L: conc,
      pnecRatio: +pnecRatio.toFixed(2),
      isExceedingPNEC,
      selectivePressureLevel: pnecRatio > 5 ? "Crítica" : pnecRatio > 1 ? "Alta" : pnecRatio > 0.5 ? "Moderada" : "Baja",
      projections: {
        day0: baseRes,
        day30: proj30d,
        day60: proj60d,
        day90: proj90d,
        therapeuticFailureProb90d: therapeuticFailureProb90d,
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Vite Middleware configuration for Full-Stack Development / Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[RAM SP-7 Gemelo Digital] Servidor activo en http://0.0.0.0:${PORT}`);
  });
}

startServer();
