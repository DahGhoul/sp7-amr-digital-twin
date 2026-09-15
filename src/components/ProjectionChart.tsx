import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import { DigitalTwinJsonState } from "../types";

interface ProjectionChartProps {
  baseResistancePct: number;
  projectedIncreasePct90d?: number;
  jsonState?: DigitalTwinJsonState | null;
  pathogenName?: string;
  antibioticName?: string;
}

export const ProjectionChart: React.FC<ProjectionChartProps> = ({
  baseResistancePct = 8.3,
  projectedIncreasePct90d = 34.5,
  jsonState,
  pathogenName = "Klebsiella pneumoniae",
  antibioticName = "Carbapenémicos / Ceftriaxona",
}) => {
  const inc90 = jsonState?.projected_resistance_increase_pct_90d || projectedIncreasePct90d || 35;
  const base = Math.max(2, baseResistancePct);

  // Modeling trajectory points (Day 0, Day 15, Day 30, Day 45, Day 60, Day 75, Day 90)
  const trajectoryData = [
    {
      day: "Día 0 (Base)",
      horizon: "Actual",
      resistenciaClinica: +base.toFixed(1),
      falloTerapeutico: +(base * 0.95).toFixed(1),
      cargaWBE: 100,
      presionAmbiental: 85,
    },
    {
      day: "Día 15",
      horizon: "Corto Plazo",
      resistenciaClinica: +(base * (1 + (inc90 * 0.003))).toFixed(1),
      falloTerapeutico: +(base * (1 + (inc90 * 0.004))).toFixed(1),
      cargaWBE: 135,
      presionAmbiental: 92,
    },
    {
      day: "Día 30",
      horizon: "Horizonte 30d (Dispersión Clonal)",
      resistenciaClinica: +(base * (1 + (inc90 * 0.008))).toFixed(1),
      falloTerapeutico: +(base * (1 + (inc90 * 0.009))).toFixed(1),
      cargaWBE: 190,
      presionAmbiental: 110,
    },
    {
      day: "Día 45",
      horizon: "Transmisión Intermedia",
      resistenciaClinica: +(base * (1 + (inc90 * 0.013))).toFixed(1),
      falloTerapeutico: +(base * (1 + (inc90 * 0.015))).toFixed(1),
      cargaWBE: 260,
      presionAmbiental: 125,
    },
    {
      day: "Día 60",
      horizon: "Horizonte 60d (Escape Comunitario)",
      resistenciaClinica: +(base * (1 + (inc90 * 0.018))).toFixed(1),
      falloTerapeutico: +(base * (1 + (inc90 * 0.021))).toFixed(1),
      cargaWBE: 340,
      presionAmbiental: 140,
    },
    {
      day: "Día 75",
      horizon: "Pre-Pico Endémico",
      resistenciaClinica: +(base * (1 + (inc90 * 0.024))).toFixed(1),
      falloTerapeutico: +(base * (1 + (inc90 * 0.027))).toFixed(1),
      cargaWBE: 410,
      presionAmbiental: 150,
    },
    {
      day: "Día 90",
      horizon: "Horizonte 90d (Fallo Empírico Crítico)",
      resistenciaClinica: +(base * (1 + (inc90 * 0.030))).toFixed(1),
      falloTerapeutico: +(base * (1 + (inc90 * 0.034))).toFixed(1),
      cargaWBE: 480,
      presionAmbiental: 160,
    },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-lg bg-[#0d0d12] border border-zinc-800 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-zinc-800 border border-zinc-700 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-zinc-100 uppercase tracking-wide">
              Modelo Híbrido Dinámico: Proyección Temporal a 30, 60 y 90 Días
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono">
              Acoplamiento de cinética en efluentes (WBE), dispensación DDD y dispersión clonal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#14141a] border border-zinc-800 text-zinc-300">
            Fallo 90d: <strong className="text-red-500">{trajectoryData[6].falloTerapeutico}%</strong>
          </span>
        </div>
      </div>

      {/* Chart visualization */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trajectoryData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFallo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="day" stroke="#52525b" tick={{ fill: "#a1a1aa", fontSize: 10, fontFamily: "monospace" }} />
            <YAxis
              stroke="#52525b"
              tick={{ fill: "#a1a1aa", fontSize: 10, fontFamily: "monospace" }}
              unit="%"
              domain={[0, (dataMax: number) => Math.min(100, Math.ceil(dataMax * 1.35))]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#14141a",
                borderColor: "#27272a",
                borderRadius: "0.375rem",
                color: "#f4f4f5",
                fontSize: "11px",
                fontFamily: "monospace",
              }}
              labelStyle={{ fontWeight: "bold", color: "#60a5fa", marginBottom: "4px" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "8px" }}
              formatter={(value) => {
                if (value === "falloTerapeutico") return "Tasa Proyectada Fallo Empírico (%)";
                if (value === "resistenciaClinica") return "Resistencia Fenotípica Clínica (%)";
                return value;
              }}
            />
            <Area
              type="monotone"
              dataKey="falloTerapeutico"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFallo)"
            />
            <Area
              type="monotone"
              dataKey="resistenciaClinica"
              stroke="#3b82f6"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorRes)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Horizon summary pill cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 rounded bg-[#14141a] border border-zinc-800 border-l-2 border-l-blue-500 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">Horizonte 30 Días</span>
            <Clock className="w-3 h-3 text-zinc-500" />
          </div>
          <p className="text-xs text-zinc-200 font-semibold font-mono">Dispersión Clonal Temprana</p>
          <p className="text-[10px] text-zinc-400 font-mono">
            Incremento proyectado: <strong className="text-amber-400">+{+(inc90 * 0.25).toFixed(1)}%</strong> en reservorios zonales.
          </p>
        </div>

        <div className="p-3 rounded bg-[#14141a] border border-zinc-800 border-l-2 border-l-amber-500 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Horizonte 60 Días</span>
            <AlertTriangle className="w-3 h-3 text-amber-500" />
          </div>
          <p className="text-xs text-zinc-200 font-semibold font-mono">Escape Comunitario</p>
          <p className="text-[10px] text-zinc-400 font-mono">
            Probabilidad de fijación comunitaria estimada en <strong className="text-amber-400">Alta</strong>.
          </p>
        </div>

        <div className="p-3 rounded bg-[#14141a] border border-zinc-800 border-l-2 border-l-red-500 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-red-400 uppercase">Horizonte 90 Días</span>
            <ShieldCheck className="w-3 h-3 text-red-500" />
          </div>
          <p className="text-xs text-zinc-200 font-semibold font-mono">Fallo Terapéutico Crítico</p>
          <p className="text-[10px] text-zinc-400 font-mono">
            Ineficacia empírica estimada en: <strong className="text-red-400">{trajectoryData[6].falloTerapeutico}%</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
