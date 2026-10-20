import { RegionalScenario } from "../types";

export const GLOSSARY_ITEMS = [
  {
    term: "RAM (Resistencia a los Antimicrobianos)",
    short: "Superbacterias",
    simple: "Cuando las bacterias aprenden a defenderse de los antibióticos y las medicinas dejan de hacer efecto en los pacientes.",
    technical: "Capacidad evolutiva de microorganismos patógenos (mediada por mutaciones o transferencia horizontal de plásmidos) para sobrevivir a concentraciones terapéuticas de antimicrobianos.",
  },
  {
    term: "WBE (Epidemiología de Aguas Residuales)",
    short: "Sensores en el Desagüe",
    simple: "Analizar el agua de las alcantarillas de Trujillo (Sedalib) para detectar qué bacterias y qué medicinas está eliminando toda la población antes de que lleguen al hospital.",
    technical: "Biomonitoreo cuantitativo en colectores de efluentes urbanos mediante qPCR digital (copias génicas/L) y espectrometría de masas (LC-MS/MS).",
  },
  {
    term: "PNEC y Razón Selectiva (R_sel)",
    short: "Límite de Peligro Ambiental",
    simple: "Es el límite máximo de antibiótico que puede haber en el agua sin que las bacterias muten. Si R_sel pasa de 1.0x, el desagüe se convierte en una 'fábrica' de superbacterias.",
    technical: "Concentración Prevista Sin Efecto para Selección de Resistencia (R_sel = C_medida / PNEC_umbral). Valores > 1.0 indican presión evolutiva activa.",
  },
  {
    term: "DDD (Dosis Diaria Definida)",
    short: "Nivel de Consumo en Farmacias",
    simple: "Mide cuántas personas de cada 1,000 habitantes en Trujillo están tomando un antibiótico cada día. Si es muy alto, hay abuso de recetas o automedicación.",
    technical: "Métrica estandarizada por la OMS (DDD / 1,000 habitantes / día) para cuantificar la presión farmacológica comunitaria y hospitalaria.",
  },
  {
    term: "ARG (blaKPC, blaNDM, qnrS, mcr-1)",
    short: "Genes de Escudo Bacteriano",
    simple: "Es el 'código genético' o escudo que tiene la bacteria para destruir al antibiótico. Por ejemplo, blaKPC destruye a los antibióticos más fuertes de UCI.",
    technical: "Determinantes genéticos de resistencia antimicrobiana (Antimicrobial Resistance Genes) codificados en cromosomas o plásmidos conjugativos.",
  },
  {
    term: "PROA (Optimización de Antimicrobianos)",
    short: "Protocolo de Acción Médica",
    simple: "El comité de doctores del hospital que restringe los antibióticos mal recetados y cambia el tratamiento a tiempo gracias al aviso del Gemelo Digital.",
    technical: "Programa de Optimización del Uso de Antimicrobianos hospitalario encargado de ejecutar directivas de contención y rotación farmacológica.",
  },
];

export const PRESET_SCENARIOS: RegionalScenario[] = [
  {
    id: "caso-1",
    shortTitle: "Brote Silencioso en Hospital Regional & Covicorti",
    title: "Caso 1: Alerta Temprana por Subreporte Clínico (HRDT / Covicorti)",
    subtitle: "Discrepancia crítica entre Desagües WBE y Hospital Regional Docente de Trujillo (blaKPC-3 / ST258 en Colector C-04)",
    plainSummary:
      "En la UCI del Hospital Regional (HRDT) solo se ha detectado 1 paciente con la superbacteria Klebsiella, por lo que todo parece tranquilo. Sin embargo, los sensores del desagüe en Covicorti detectaron que el gen maligno aumentó un +340% en el agua. ¡Hay un brote silencioso circulando en el barrio que llegará al hospital en ~18 días!",
    region: "Trujillo Norte-Oeste — HRDT & Colector Covicorti (C-04)",
    population: 385000,
    category: "subreporte_wbe",
    earlyWarningDays: 18,
    proaActionSummary: "Restringir Meropenem empírico en UCI del HRDT, activar tamizaje rectal de ingreso y rotar a Ceftazidima-Avibactam.",
    sedalibActionSummary: "Aplicar filtros de carbón activado y cloración intensiva en la descarga del Colector C-04 (Covicorti).",
    clinical: {
      pathogen: "Klebsiella pneumoniae",
      isolatesCount: 12,
      criticalArg: "blaKPC-3 (Carbapenemasa)",
      argFrequencyPct: 8.3,
      lineageST: "ST258 Hipervirulento (1 caso UCI)",
      setting: "UCI Hospital Regional Docente de Trujillo (HRDT)",
      notes: "Solo 1 caso confirmado formalmente en UCI; la vigilancia tradicional no ve lo que ocurre afuera.",
      plainExplanation: "En el hospital solo han visto 1 caso grave hasta hoy, pero la bacteria ya tiene el gen 'blaKPC-3' que desactiva los antibióticos de emergencia.",
    },
    prescription: {
      antibiotics: [
        {
          name: "Meropenem / Imipenem",
          dddRate: 1.2,
          targetContext: "UCI & Hospitalización HRDT",
          status: "normal",
        },
        {
          name: "Ceftriaxona (Inyectable)",
          dddRate: 14.5,
          targetContext: "Boticas y Atención Primaria Trujillo",
          status: "elevated",
        },
      ],
      plainExplanation: "En las boticas y postas de Trujillo se está inyectando demasiada Ceftriaxona (14.5 DDD), lo que debilita la flora bacteriana normal de la gente.",
    },
    wbe: {
      collectorId: "Colector Covicorti C-04 (Sedalib)",
      catchmentBasin: "Cuenca Urbana Covicorti - HRDT (385,000 hab)",
      argDetected: "blaKPC-3 (Plásmido IncFII)",
      argCopiesPerLiter: 480000,
      argBaselineIncreasePct: 340,
      residualAntibiotic: "Ciprofloxacino / Betalactámicos",
      residualConcentrationNgL: 850,
      pnecSelectiveThresholdNgL: 64,
      hypervirulentLineageDetected: "ST258 Hipervirulento",
      plainExplanation: "¡Aquí saltó la alarma! El desagüe de Covicorti tiene 13.3 veces más antibiótico del límite seguro (850 vs 64 ng/L) y las copias del gen resistente subieron +340%.",
    },
    rawPrompt: `[DATOS DE ENTRADA REGIONAL - GEMELO DIGITAL SP-7 TRUJILLO]
Región: Trujillo Norte-Oeste - Cuenca Colector Covicorti (C-04) y Hospital Regional Docente de Trujillo (HRDT)
Población estimada en cuenca: 385,000 habitantes (Área Metropolitana de Trujillo: 1.15M hab)

1. Datos Genómicos Clínicos (Últimos 14 días - HRDT):
- Aislamientos clínicos de Klebsiella pneumoniae reportados: 12 casos.
- Frecuencia de resistencia a carbapenémicos (blaKPC-3): 8.3% (1 caso aislado en UCI del HRDT).

2. Datos de Prescripción (Dispensación Farmacéutica en Trujillo):
- Consumo de Meropenem / Imipenem: 1.2 DDD/1000 hab/día (rango normal hospitalario).
- Consumo de Ceftriaxona: 14.5 DDD/1000 hab/día (elevado en atención primaria y boticas).

3. Epidemiología en Aguas Residuales (WBE - Muestreo Colector Covicorti C-04 Sedalib):
- Detección de gen blaKPC-3: 4.8 x 10^5 copias de genes/L (aumento del 340% respecto a la línea base del mes anterior).
- Concentración residual de ciprofloxacino: 850 ng/L (supera en 13.28x el umbral selectivo PNEC de 64 ng/L).
- Detección de linaje hipervirulento ST258 en aguas residuales.

Ejecuta el análisis del Gemelo Digital SP-7, modela la dispersión proyectada a 30, 60 y 90 días y emite las directivas PROA y de saneamiento para Sedalib.`,
  },
  {
    id: "caso-2",
    shortTitle: "Abuso de Antibióticos en Postas & El Cortijo",
    title: "Caso 2: Sobreprescripción Comunitaria & Presión en Colector El Cortijo",
    subtitle: "Pico excesivo de Ciprofloxacino oral e infecciones urinarias resistentes (E. coli / qnrS en Colector Sur S-01)",
    plainSummary:
      "En las postas médicas y farmacias de Trujillo Sur / Víctor Larco se está vendiendo demasiado Ciprofloxacino sin urocultivo previo. Todo ese antibiótico termina en el desagüe de El Cortijo (1,200 ng/L, 18.7 veces por encima del límite seguro), provocando que el 38% de las infecciones urinarias ya no se curen con el tratamiento normal.",
    region: "Trujillo Sur — Víctor Larco & Colector El Cortijo (S-01)",
    population: 295000,
    category: "sobreprescripcion",
    earlyWarningDays: 16,
    proaActionSummary: "Suspender receta empírica de Ciprofloxacino en infecciones urinarias ambulatorias; rotar protocolo a Fosfomicina o Nitrofurantoína.",
    sedalibActionSummary: "Activar oxidación avanzada en la entrada de la PTAR El Cortijo para degradar fluoroquinolonas activas.",
    clinical: {
      pathogen: "Escherichia coli uropatógena (BLEE / UPEC)",
      isolatesCount: 45,
      criticalArg: "gyrA S83L + qnrS1",
      argFrequencyPct: 38.0,
      lineageST: "ST131 Clonal Pandémico",
      setting: "Consultas Externas y Postas Médicas de Trujillo",
      notes: "38% de pacientes con infección urinaria regresan porque el antibiótico común falló.",
      plainExplanation: "Casi 4 de cada 10 pacientes (38%) que van al médico por infección urinaria tienen una bacteria E. coli que ya no muere con Ciprofloxacino.",
    },
    prescription: {
      antibiotics: [
        {
          name: "Ciprofloxacino oral 500mg",
          dddRate: 28.4,
          targetContext: "Postas Médicas & Farmacias Comunitarias",
          status: "critical",
        },
        {
          name: "Nitrofurantoína (Alternativa)",
          dddRate: 3.1,
          targetContext: "Consulta Externa",
          status: "normal",
        },
      ],
      plainExplanation: "¡Abuso crítico de pastillas! Se están consumiendo 28.4 dosis diarias por cada 1,000 habitantes porque se vende sin receta o sin examen de orina.",
    },
    wbe: {
      collectorId: "Colector El Cortijo S-01 (Sedalib)",
      catchmentBasin: "Cuenca Sur / Víctor Larco - PTAR El Cortijo (295,000 hab)",
      argDetected: "qnrS1 + blaCTX-M-15",
      argCopiesPerLiter: 1200000,
      argBaselineIncreasePct: 185,
      residualAntibiotic: "Fluoroquinolonas activas",
      residualConcentrationNgL: 1200,
      pnecSelectiveThresholdNgL: 64,
      plainExplanation: "El agua del desagüe en El Cortijo tiene 1,200 ng/L de antibiótico (18.7 veces el límite seguro). Las bacterias en la tubería están entrenándose para resistir.",
    },
    rawPrompt: `[DATOS DE ENTRADA REGIONAL - GEMELO DIGITAL SP-7 TRUJILLO]
Región: Trujillo Sur / Víctor Larco - Colector El Cortijo (S-01)
Población estimada en cuenca: 295,000 habitantes

1. Datos Genómicos Clínicos:
- Aislamientos de Escherichia coli uropatógena (BLEE): 45 casos ambulatorios.
- Resistencia a Quinolonas (mutaciones gyrA S83L + gen qnrS1): 38% de los urocultivos.

2. Datos de Prescripción:
- Ciprofloxacino oral dispensado en postas médicas y boticas de Trujillo: 28.4 DDD/1000 hab/día (pico crítico por infecciones urinarias no tipificadas).

3. Epidemiología en Aguas Residuales (WBE - Colector El Cortijo S-01):
- Carga de gen qnrS1: 1.2 x 10^6 copias/L en el colector de ingreso a PTAR El Cortijo.
- Concentración de fluoroquinolonas activas en efluente: 1,200 ng/L (18.75x sobre el umbral PNEC de 64 ng/L).

Simula el escenario a 90 días en Trujillo, evalúa la caída de eficacia del tratamiento de primera línea y emite las directivas PROA y ambientales.`,
  },
  {
    id: "caso-3",
    shortTitle: "Alerta Máxima en Hospital Belén & Centro",
    title: "Caso 3: Co-detección de Metalobetalactamasas y Colistina (Hospital Belén)",
    subtitle: "Riesgo de Pandrogorresistencia (blaNDM-1 + mcr-1 en Efluente Hospitalario Central C-01)",
    plainSummary:
      "Escenario de máxima prioridad: En el eje del Hospital Belén y Centro Histórico de Trujillo se detectaron simultáneamente dos genes de resistencia extrema (blaNDM-1 y mcr-1). Esto amenaza con desactivar incluso la Colistina, el antibiótico de último recurso cuando todos los demás fallan.",
    region: "Trujillo Centro — Hospital Belén & Colector Central (C-01)",
    population: 470000,
    category: "escape_clonal",
    earlyWarningDays: 21,
    proaActionSummary: "Aislamiento estricto de contacto en Hospital Belén, bloqueo de Colistina empírica y auditoría genómica urgente en quemados/UCI.",
    sedalibActionSummary: "Neutralización química inmediata (UV + Peróxido) en la caja de registro hospitalaria antes de conectar al colector público C-01.",
    clinical: {
      pathogen: "Pseudomonas aeruginosa & Enterobacter hormaechei",
      isolatesCount: 28,
      criticalArg: "blaNDM-1 + mcr-1 (Pan-resistencia)",
      argFrequencyPct: 14.2,
      lineageST: "ST235 / ST77",
      setting: "Hospital Belén de Trujillo (Áreas Críticas y Cirugía)",
      notes: "Aparición de cepas resistentes tanto a carbapenémicos como a polimixinas (colistina).",
      plainExplanation: "Se detectaron 28 casos en áreas críticas con dos escudos genéticos a la vez (blaNDM-1 y mcr-1). Si se juntan, casi ningún antibiótico común las detiene.",
    },
    prescription: {
      antibiotics: [
        {
          name: "Colistina IV (Último Recurso)",
          dddRate: 0.8,
          targetContext: "Terapia de Rescate Hospital Belén",
          status: "elevated",
        },
        {
          name: "Meropenem IV",
          dddRate: 4.6,
          targetContext: "Hospitalización General",
          status: "critical",
        },
      ],
      plainExplanation: "El uso elevado de Meropenem (4.6 DDD) y de Colistina de rescate dentro del hospital está empujando a las bacterias más agresivas a sobrevivir.",
    },
    wbe: {
      collectorId: "Colector Metropolitano Central C-01",
      catchmentBasin: "Centro Histórico Trujillo & Complejo Hospitalario (470,000 hab)",
      argDetected: "blaNDM-1 (3.1×10⁵) + mcr-1 (8.4×10⁴ copias/L)",
      argCopiesPerLiter: 394000,
      argBaselineIncreasePct: 262,
      residualAntibiotic: "Meropenem + Polimixinas residuales",
      residualConcentrationNgL: 1450,
      pnecSelectiveThresholdNgL: 1000,
      hypervirulentLineageDetected: "ST235 Pan-Resistente",
      plainExplanation: "El desagüe que sale de la zona hospitalaria central supera el límite seguro de Meropenem (1,450 vs 1,000 ng/L) y transporta bacterias de alto riesgo.",
    },
    rawPrompt: `[DATOS DE ENTRADA REGIONAL - GEMELO DIGITAL SP-7 TRUJILLO]
Región: Trujillo Centro - Complejo Hospital Belén y Colector Central (C-01)
Población estimada en cuenca: 470,000 habitantes

1. Datos Genómicos Clínicos (Últimos 14 días - Hospital Belén):
- Aislamientos clínicos de Pseudomonas aeruginosa y Enterobacter hormaechei: 28 casos.
- Frecuencia de metalobetalactamasas (blaNDM-1) y resistencia a colistina (mcr-1): 14.2% en áreas críticas.

2. Datos de Prescripción (Dispensación Farmacéutica):
- Consumo de Colistina IV: 0.8 DDD/1000 hab/día (alerta por uso de último recurso).
- Consumo de Meropenem IV: 4.6 DDD/1000 hab/día (elevado en hospitalización).

3. Epidemiología en Aguas Residuales (WBE - Colector Central C-01):
- Detección de gen blaNDM-1: 3.1 x 10^5 copias/L y mcr-1: 8.4 x 10^4 copias/L (+262% sobre base).
- Concentración residual de Meropenem en efluente hospitalario: 1,450 ng/L (supera PNEC de 1,000 ng/L).
- Detección de linaje de alto riesgo ST235.

Ejecuta el análisis del Gemelo Digital SP-7, modela la dispersión proyectada a 30, 60 y 90 días en Trujillo, y define las directivas PROA urgentes.`,
  },
];

export const REGIONAL_NODES_DATA = [
  {
    id: "node-c04",
    scenarioId: "caso-1",
    name: "HRDT & Covicorti (C-04)",
    collector: "Colector Covicorti C-04",
    population: "385,000 hab",
    catchment: "Hospital Regional Docente de Trujillo & Urb. Covicorti",
    currentPnecRatio: 13.28,
    measuredConcentration: "850 ng/L",
    antibiotic: "Ciprofloxacino / Cefalosporinas",
    arg: "blaKPC-3 (Carbapenemasa)",
    geneCopies: "4.8 × 10⁵ copias/L",
    status: "CRITICAL",
    riskScore: 88,
    plainStatus: "Brote silencioso detectado en el desagüe 18 días antes de saturar la UCI del Hospital Regional.",
    color: "rose",
  },
  {
    id: "node-s01",
    scenarioId: "caso-2",
    name: "El Cortijo & Sur (S-01)",
    collector: "Colector Sur S-01",
    population: "295,000 hab",
    catchment: "Víctor Larco, Moche & Ingreso PTAR El Cortijo",
    currentPnecRatio: 18.75,
    measuredConcentration: "1,200 ng/L",
    antibiotic: "Fluoroquinolonas (Ciprofloxacino)",
    arg: "qnrS1 + gyrA S83L",
    geneCopies: "1.2 × 10⁶ copias/L",
    status: "HIGH",
    riskScore: 76,
    plainStatus: "Alto consumo de pastillas para infección urinaria en postas; el agua supera 18.7 veces el límite seguro.",
    color: "amber",
  },
  {
    id: "node-c01",
    scenarioId: "caso-3",
    name: "Hospital Belén & Centro (C-01)",
    collector: "Colector Central C-01",
    population: "470,000 hab",
    catchment: "Centro Histórico de Trujillo & Hospital Belén",
    currentPnecRatio: 1.45,
    measuredConcentration: "1,450 ng/L",
    antibiotic: "Meropenem / Colistina",
    arg: "blaNDM-1 + mcr-1",
    geneCopies: "3.9 × 10⁵ copias/L",
    status: "CRITICAL",
    riskScore: 92,
    plainStatus: "Alerta máxima en efluentes hospitalarios: presencia de bacterias resistentes a medicinas de último recurso.",
    color: "red",
  },
  {
    id: "node-e02",
    scenarioId: "caso-1",
    name: "El Porvenir & Este (E-02)",
    collector: "Colector Este E-02",
    population: "220,000 hab",
    catchment: "Distritos El Porvenir y Florencia de Mora",
    currentPnecRatio: 0.42,
    measuredConcentration: "88 ng/L",
    antibiotic: "Azitromicina / Amoxicilina",
    arg: "ermB (Bajo riesgo)",
    geneCopies: "4.2 × 10⁴ copias/L",
    status: "LOW",
    riskScore: 24,
    plainStatus: "Sector bajo control. El nivel de antibióticos en el desagüe está por debajo del límite de peligro (0.42x).",
    color: "emerald",
  },
  {
    id: "node-ptar",
    scenarioId: "caso-2",
    name: "PTAR Covicorti / Cortijo (Sedalib)",
    collector: "Estaciones Depuradoras Sedalib",
    population: "1.15M hab (Total Cuenca)",
    catchment: "Lagunas de Estabilización Covicorti y El Cortijo",
    currentPnecRatio: 4.6,
    measuredConcentration: "420 ng/L",
    antibiotic: "Mezcla de Betalactámicos y Quinolonas",
    arg: "Multigénico (blaCTX-M / blaKPC)",
    geneCopies: "8.5 × 10⁵ copias/L",
    status: "HIGH",
    riskScore: 68,
    plainStatus: "Punto final donde se juntan los desagües de Trujillo. Requiere filtrado terciario antes de verter al ambiente.",
    color: "amber",
  },
];
