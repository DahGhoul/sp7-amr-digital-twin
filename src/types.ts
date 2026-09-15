export interface ClinicalTelemetry {
  pathogen: string;
  isolatesCount: number;
  criticalArg: string;
  argFrequencyPct: number;
  lineageST: string;
  setting: string;
  notes?: string;
}

export interface PrescriptionTelemetry {
  antibiotics: Array<{
    name: string;
    dddRate: number; // DDD / 1000 hab / día
    targetContext: string;
    status: "normal" | "elevated" | "critical";
  }>;
}

export interface WbeTelemetry {
  collectorId: string;
  catchmentBasin: string;
  argDetected: string;
  argCopiesPerLiter: number;
  argBaselineIncreasePct: number;
  residualAntibiotic: string;
  residualConcentrationNgL: number;
  pnecSelectiveThresholdNgL: number;
  hypervirulentLineageDetected?: string;
}

export interface RegionalScenario {
  id: string;
  title: string;
  subtitle: string;
  region: string;
  population: number;
  category: "subreporte_wbe" | "sobreprescripcion" | "escape_clonal" | "custom";
  clinical: ClinicalTelemetry;
  prescription: PrescriptionTelemetry;
  wbe: WbeTelemetry;
  rawPrompt: string;
}

export interface DigitalTwinJsonState {
  simulation_id: string;
  timestamp: string;
  regional_risk_score: number; // 0-100
  early_warning_active: boolean;
  critical_nodes: string[];
  projected_resistance_increase_pct_90d: number;
  recommended_action_code: string;
}

export interface SimulationResponse {
  success: boolean;
  rawOutput: string;
  jsonState: DigitalTwinJsonState | null;
  modelUsed: string;
  meta: {
    temperature: number;
    topP: number;
    timestamp: string;
  };
  error?: string;
}

export interface RiskTableRow {
  sector: string;
  pathogenArg: string;
  riskLevel: "Bajo" | "Medio" | "Alto" | "Crítico";
  determiningFactor: string;
  keyIndicator: string;
}
