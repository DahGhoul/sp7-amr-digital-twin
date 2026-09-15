import { RegionalScenario } from "../types";

export const PRESET_SCENARIOS: RegionalScenario[] = [
  {
    id: "caso-1",
    title: "Caso 1: Alerta Temprana por Subreporte Clínico",
    subtitle: "Discrepancia crítica WBE vs Reporte Hospitalario (blaKPC-2 / ST258 en Colector C-04)",
    region: "Sector Norte - Cuenca Urbana Colector C-04",
    population: 180000,
    category: "subreporte_wbe",
    clinical: {
      pathogen: "Klebsiella pneumoniae",
      isolatesCount: 12,
      criticalArg: "blaKPC",
      argFrequencyPct: 8.3,
      lineageST: "ST258 (1 caso UCI)",
      setting: "UCI Hospital Regional Norte",
      notes: "Solo 1 caso confirmado formalmente en UCI; vigilancia clínica subestima circulación real.",
    },
    prescription: {
      antibiotics: [
        {
          name: "Meropenem / Imipenem",
          dddRate: 1.2,
          targetContext: "Ámbito Hospitalario",
          status: "normal",
        },
        {
          name: "Ceftriaxona",
          dddRate: 14.5,
          targetContext: "Atención Primaria & Centros de Salud",
          status: "elevated",
        },
      ],
    },
    wbe: {
      collectorId: "Colector C-04",
      catchmentBasin: "Cuenca Urbana Norte (180,000 hab)",
      argDetected: "blaKPC-2",
      argCopiesPerLiter: 480000,
      argBaselineIncreasePct: 340,
      residualAntibiotic: "Ciprofloxacino",
      residualConcentrationNgL: 850,
      pnecSelectiveThresholdNgL: 64,
      hypervirulentLineageDetected: "ST258 hipervirulento",
    },
    rawPrompt: `[DATOS DE ENTRADA REGIONAL - GEMELO DIGITAL SP-7]
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

Ejecuta el análisis del Gemelo Digital, modela la dispersión proyectada y emite las alertas correspondientes.`,
  },
  {
    id: "caso-2",
    title: "Caso 2: Sobreprescripción en Atención Primaria & Presión Selectiva",
    subtitle: "Pico estacional de Quinolonas e ITU comunitaria (E. coli / qnrS en Colector S-01)",
    region: "Sector Sur / Distrito Periférico Colector S-01",
    population: 95000,
    category: "sobreprescripcion",
    clinical: {
      pathogen: "Escherichia coli uropatógena (UPEC)",
      isolatesCount: 45,
      criticalArg: "mutaciones gyrA / parC + qnrS",
      argFrequencyPct: 38.0,
      lineageST: "ST131 clonal",
      setting: "Consultas Ambulatorias y Postas Médicas",
      notes: "38% de urocultivos con resistencia a quinolonas de primera línea.",
    },
    prescription: {
      antibiotics: [
        {
          name: "Ciprofloxacino oral",
          dddRate: 28.4,
          targetContext: "Postas Médicas & Farmacias Comunitarias",
          status: "critical",
        },
      ],
    },
    wbe: {
      collectorId: "Colector S-01 / Salida PTAR",
      catchmentBasin: "Distrito Periférico Sur (95,000 hab)",
      argDetected: "qnrS (resistencia plasmídica a quinolonas)",
      argCopiesPerLiter: 1200000,
      argBaselineIncreasePct: 185,
      residualAntibiotic: "Fluoroquinolonas activas",
      residualConcentrationNgL: 1200,
      pnecSelectiveThresholdNgL: 64,
    },
    rawPrompt: `[DATOS DE ENTRADA REGIONAL - GEMELO DIGITAL SP-7]
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

Simula el escenario a 90 días, evalúa la viabilidad del tratamiento empírico de primera línea y define las directivas PROA necesarias.`,
  },
  {
    id: "caso-3",
    title: "Caso 3: Co-detección de Metalobetalactamasas y Colistina",
    subtitle: "Riesgo de Pandrogorresistencia (blaNDM-5 + mcr-1 en Efluente Hospitalario H-02)",
    region: "Sector Metropolitano Central - Colector C-01",
    population: 320000,
    category: "escape_clonal",
    clinical: {
      pathogen: "Pseudomonas aeruginosa & Enterobacter cloacae",
      isolatesCount: 28,
      criticalArg: "blaNDM-5 & mcr-1",
      argFrequencyPct: 14.2,
      lineageST: "ST235 / ST77",
      setting: "Servicio de Quemados y Hemato-oncología",
      notes: "Aparición de cepas refractarias a carbapenémicos y polimixinas.",
    },
    prescription: {
      antibiotics: [
        {
          name: "Colistina IV",
          dddRate: 0.8,
          targetContext: "Terapia de Rescate Hospitalaria",
          status: "elevated",
        },
        {
          name: "Ceftazidima/Avibactam",
          dddRate: 2.1,
          targetContext: "Terapia Dirigida",
          status: "normal",
        },
      ],
    },
    wbe: {
      collectorId: "Colector Central C-01",
      catchmentBasin: "Cuenca Urbana Central y Complejo Hospitalario",
      argDetected: "blaNDM-5 (3.1x10^5) + mcr-1 (8.4x10^4 copias/L)",
      argCopiesPerLiter: 394000,
      argBaselineIncreasePct: 220,
      residualAntibiotic: "Meropenem residual",
      residualConcentrationNgL: 1450,
      pnecSelectiveThresholdNgL: 1000,
      hypervirulentLineageDetected: "ST235 Pan-R",
    },
    rawPrompt: `[DATOS DE ENTRADA REGIONAL - GEMELO DIGITAL SP-7]
Región: Sector Metropolitano Central - Colector C-01
Población estimada: 320,000 habitantes

1. Datos Genómicos Clínicos (Últimos 14 días):
- Aislamientos clínicos de Pseudomonas aeruginosa y Enterobacter: 28 casos.
- Frecuencia de metalobetalactamasas (blaNDM-5) y resistencia a colistina (mcr-1): 14.2% en áreas críticas.

2. Datos de Prescripción (Dispensación Farmacéutica):
- Consumo de Colistina IV: 0.8 DDD/1000 hab/día (alerta por uso de último recurso).
- Consumo de Ceftazidima/Avibactam: 2.1 DDD/1000 hab/día.

3. Epidemiología en Aguas Residuales (WBE - Colector C-01):
- Detección de gen blaNDM-5: 3.1 x 10^5 copias/L y mcr-1: 8.4 x 10^4 copias/L.
- Concentración residual de Meropenem en efluente hospitalario: 1,450 ng/L (supera PNEC).
- Detección de linaje de alto riesgo ST235.

Ejecuta el análisis del Gemelo Digital, modela la dispersión proyectada a 30, 60 y 90 días, y define las directivas PROA urgentes.`,
  },
];

export const REGIONAL_NODES_DATA = [
  {
    id: "node-c04",
    name: "Sector Norte (C-04)",
    collector: "Colector C-04",
    population: "180k hab",
    catchment: "Cuenca Residencial & Hospital Norte",
    currentPnecRatio: 13.28,
    measuredConcentration: "850 ng/L",
    antibiotic: "Ciprofloxacino",
    arg: "blaKPC-2",
    geneCopies: "4.8 × 10⁵ copias/L",
    status: "CRITICAL",
    riskScore: 88,
    color: "rose",
  },
  {
    id: "node-s01",
    name: "Sector Sur (S-01)",
    collector: "Colector S-01",
    population: "95k hab",
    catchment: "Distrito Periférico & PTAR Sur",
    currentPnecRatio: 18.75,
    measuredConcentration: "1,200 ng/L",
    antibiotic: "Fluoroquinolonas",
    arg: "qnrS",
    geneCopies: "1.2 × 10⁶ copias/L",
    status: "HIGH",
    riskScore: 76,
    color: "amber",
  },
  {
    id: "node-c01",
    name: "Sector Centro (C-01)",
    collector: "Colector C-01",
    population: "320k hab",
    catchment: "Complejo Hospitalario Metropolitano",
    currentPnecRatio: 1.45,
    measuredConcentration: "1,450 ng/L",
    antibiotic: "Meropenem",
    arg: "blaNDM-5 + mcr-1",
    geneCopies: "3.9 × 10⁵ copias/L",
    status: "CRITICAL",
    riskScore: 92,
    color: "red",
  },
  {
    id: "node-e02",
    name: "Sector Este (E-02)",
    collector: "Colector E-02",
    population: "140k hab",
    catchment: "Zona Suburbana Este",
    currentPnecRatio: 0.35,
    measuredConcentration: "88 ng/L",
    antibiotic: "Azitromicina",
    arg: "ermB",
    geneCopies: "4.2 × 10⁴ copias/L",
    status: "LOW",
    riskScore: 24,
    color: "emerald",
  },
  {
    id: "node-ptar",
    name: "PTAR Central (Bio-Descarga)",
    collector: "Emisario Submarino / Río",
    population: "735k hab total",
    catchment: "Afluente Combinado Regional",
    currentPnecRatio: 4.6,
    measuredConcentration: "420 ng/L",
    antibiotic: "Mezcla de Betalactámicos y Quinolonas",
    arg: "Multigénico (blaTEM/blaCTX-M)",
    geneCopies: "8.5 × 10⁵ copias/L",
    status: "HIGH",
    riskScore: 68,
    color: "amber",
  },
];
