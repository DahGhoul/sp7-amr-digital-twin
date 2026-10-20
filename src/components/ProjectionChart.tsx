import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { DigitalTwinJsonState } from "../types";

interface ProjectionChartProps {
  baseResistancePct: number;
  projectedIncreasePct90d?: number;
  jsonState?: DigitalTwinJsonState | null;
  pathogenName?: string;
  wbeNgL?: number;
  pnecThreshold?: number;
  proaInterventionActive?: boolean;
  onToggleProa?: (active: boolean) => void;
}

export const ProjectionChart: React.FC<ProjectionChartProps> = ({
  baseResistancePct = 8.3,
  projectedIncreasePct90d = 38.0,
  jsonState,
  pathogenName = "Klebsiella pneumoniae",
  wbeNgL = 850,
  pnecThreshold = 64,
  proaInterventionActive = false,
  onToggleProa,
}) => {
  const ratioFactor = Math.max(0.5, Math.min(3.5, wbeNgL / (pnecThreshold * 6)));
  const rawInc90 =
    jsonState?.projected_resistance_increase_pct_90d ||
    projectedIncreasePct90d * ratioFactor;
  const inc90 = Math.min(88, Math.max(15, rawInc90));
  const base = Math.max(2, baseResistancePct);

  // Modeling trajectory points (Day 0 to Day 90) comparing WITHOUT vs WITH SP-7 intervention (-44.6% reduction)
  const trajectoryData = [
    {
      day: "Hoy (Día 0)",
      sinIntervencion: +base.toFixed(1),
      conGemeloSP7: +base.toFixed(1),
    },
    {
      day: "Día 15",
      sinIntervencion: +Math.min(96, base + inc90 * 0.14).toFixed(1),
      conGemeloSP7: +Math.min(90, base + inc90 * 0.07).toFixed(1),
    },
    {
      day: "Día 30",
      sinIntervencion: +Math.min(96, base + inc90 * 0.32).toFixed(1),
      conGemeloSP7: +Math.min(90, base + inc90 * 0.15).toFixed(1),
    },
    {
      day: "Día 45",
      sinIntervencion: +Math.min(96, base + inc90 * 0.52).toFixed(1),
      conGemeloSP7: +Math.min(90, base + inc90 * 0.24).toFixed(1),
    },
    {
      day: "Día 60",
      sinIntervencion: +Math.min(96, base + inc90 * 0.72).toFixed(1),
      conGemeloSP7: +Math.min(90, base + inc90 * 0.33).toFixed(1),
    },
    {
      day: "Día 75",
      sinIntervencion: +Math.min(96, base + inc90 * 0.87).toFixed(1),
      conGemeloSP7: +Math.min(90, base + inc90 * 0.40).toFixed(1),
    },
    {
      day: "Día 90",
      sinIntervencion: +Math.min(96, base + inc90).toFixed(1),
      conGemeloSP7: +Math.min(90, base + inc90 * 0.46).toFixed(1),
    },
  ];

  const finalUncontrolled = trajectoryData[6].sinIntervencion;
  const finalMitigated = trajectoryData[6].conGemeloSP7;
  const savedPct = +(finalUncontrolled - finalMitigated).toFixed(1);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#0d0d12] border border-zinc-800 space-y-4 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/50 text-blue-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-zinc-100 uppercase tracking-wide">
              Predicción del Futuro: ¿Qué pasará en 30, 60 y 90 Días?
            </h3>
            <p className="text-[11px] text-zinc-400">
              Compara la línea roja (si no hacemos nada) vs. la línea verde (usando el Gemelo Digital)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleProa && (
            <button
              onClick={() => onToggleProa(!proaInterventionActive)}
              className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                proaInterventionActive
                  ? "bg-emerald-950/70 text-emerald-300 border-emerald-700 font-bold"
                  : "bg-[#14141a] text-zinc-300 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{proaInterventionActive ? "Mitigación Activa" : "Simular Mitigación"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Top KPI Callout */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="p-2.5 rounded-lg bg-red-950/25 border border-red-900/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-red-300 uppercase font-mono block">
              🔴 Si NO se hace nada (Día 90)
            </span>
            <span className="text-xs text-zinc-300">Tratamientos que fallarán:</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-red-400 font-mono">
            {finalUncontrolled}%
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-emerald-950/25 border border-emerald-900/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-300 uppercase font-mono block">
              🟢 Con Gemelo SP-7 (Día 90)
            </span>
            <span className="text-xs text-zinc-300">Se reduce el peligro a:</span>
          </div>
          <div className="text-right">
            <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono block leading-none">
              {finalMitigated}%
            </span>
            <span className="text-[10px] text-emerald-300 font-mono">
              (-{savedPct}% evitado)
            </span>
          </div>
        </div>
      </div>

      {/* Chart visualization */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trajectoryData}
            margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorCon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="day"
              stroke="#52525b"
              tick={{ fill: "#a1a1aa", fontSize: 10, fontFamily: "monospace" }}
            />
            <YAxis
              stroke="#52525b"
              tick={{ fill: "#a1a1aa", fontSize: 10, fontFamily: "monospace" }}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#14141a",
                borderColor: "#27272a",
                borderRadius: "0.5rem",
                color: "#f4f4f5",
                fontSize: "12px",
              }}
              labelStyle={{ fontWeight: "bold", color: "#60a5fa", marginBottom: "4px" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }}
              formatter={(value) => {
                if (value === "sinIntervencion")
                  return "🔴 Sin Intervención (% Fallo de Antibióticos)";
                if (value === "conGemeloSP7")
                  return "🟢 Con Acción del Gemelo SP-7 (Curva Aplanada)";
                return value;
              }}
            />
            <Area
              type="monotone"
              dataKey="sinIntervencion"
              stroke="#ef4444"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorSin)"
            />
            <Area
              type="monotone"
              dataKey="conGemeloSP7"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorCon)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Horizon summary pill cards in plain Spanish */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        <div className="p-2.5 rounded-lg bg-[#14141a] border border-zinc-800 border-l-2 border-l-blue-500 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">
              En 30 Días
            </span>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-xs text-zinc-100 font-bold">Contagio en el Barrio</p>
          <p className="text-[11px] text-zinc-400 leading-snug">
            La bacteria sube a{" "}
            <strong className="text-amber-400">
              {trajectoryData[2].sinIntervencion}%
            </strong>{" "}
            en el desagüe antes de verse en clínicas.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-[#14141a] border border-zinc-800 border-l-2 border-l-amber-500 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
              En 60 Días
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-xs text-zinc-100 font-bold">Llegada a Emergencias</p>
          <p className="text-[11px] text-zinc-400 leading-snug">
            Empiezan a llegar pacientes al hospital cuyas pastillas ya no hacen efecto (
            <strong className="text-amber-400">
              {trajectoryData[4].sinIntervencion}%
            </strong>
            ).
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-[#14141a] border border-zinc-800 border-l-2 border-l-red-500 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-red-400 uppercase">
              En 90 Días
            </span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xs text-zinc-100 font-bold">Impacto del Gemelo</p>
          <p className="text-[11px] text-zinc-400 leading-snug">
            Actuando a tiempo, bajamos el fallo de{" "}
            <strong className="text-red-400">{finalUncontrolled}%</strong> a{" "}
            <strong className="text-emerald-400">{finalMitigated}%</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
