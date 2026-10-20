import { useState, useEffect } from "react";
import { REGIONAL_NODES_DATA, PRESET_SCENARIOS } from "../data/scenarios";
import { RegionalScenario } from "../types";
import {
  Droplets,
  Activity,
  CheckCircle2,
  MapPin,
  Info,
  ArrowRight,
} from "lucide-react";

interface DigitalTwinMapProps {
  activeNodeId?: string;
  onSelectScenario?: (scenario: RegionalScenario) => void;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  activeNodeId = "node-c04",
  onSelectScenario,
}) => {
  const [selectedNode, setSelectedNode] = useState(
    REGIONAL_NODES_DATA.find((n) => n.id === activeNodeId) || REGIONAL_NODES_DATA[0]
  );

  useEffect(() => {
    const found = REGIONAL_NODES_DATA.find((n) => n.id === activeNodeId);
    if (found) setSelectedNode(found);
  }, [activeNodeId]);

  const handleNodeClick = (node: (typeof REGIONAL_NODES_DATA)[0]) => {
    setSelectedNode(node);
    if (onSelectScenario && node.scenarioId) {
      const targetSc = PRESET_SCENARIOS.find((s) => s.id === node.scenarioId);
      if (targetSc) {
        onSelectScenario(JSON.parse(JSON.stringify(targetSc)));
      }
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#0d0d12] border border-zinc-800 space-y-4 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/50 text-red-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-zinc-100 uppercase tracking-wide">
              Mapa de Sensores en Trujillo (Hospitales y Colectores Sedalib)
            </h3>
            <p className="text-[11px] text-zinc-400">
              Haz clic en cualquier zona de Trujillo para inspeccionar su desagüe y hospital
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            Peligro Crítico
          </span>
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            Alerta Alta
          </span>
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Seguro
          </span>
        </div>
      </div>

      {/* Grid: Map layout + Node Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Spatial visual representation of Trujillo */}
        <div className="xl:col-span-7 bg-[#070709] rounded-xl p-4 border border-zinc-800 relative overflow-hidden flex flex-col justify-between min-h-[310px]">
          <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

          {/* Interactive Nodes of Trujillo */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {REGIONAL_NODES_DATA.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const isCritical = node.status === "CRITICAL";
              const isHigh = node.status === "HIGH";

              return (
                <button
                  key={node.id}
                  id={`node-btn-${node.id}`}
                  onClick={() => handleNodeClick(node)}
                  className={`text-left p-3 rounded-lg border transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-zinc-800/95 border-blue-500 ring-1 ring-blue-500/50 shadow-md"
                      : "bg-[#14141a]/95 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-sans text-xs font-bold text-zinc-100">
                      {node.name}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                        isCritical
                          ? "bg-red-950 text-red-300 border border-red-800 animate-pulse"
                          : isHigh
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      }`}
                    >
                      {isCritical ? "CRÍTICO" : isHigh ? "ALTO" : "NORMAL"}
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-400 space-y-1 font-mono">
                    <div className="truncate text-zinc-300 font-sans text-[11px]">
                      {node.catchment}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-800/70">
                      <span className="text-blue-400 font-bold truncate max-w-[115px]">
                        {node.arg.split(" ")[0]}
                      </span>
                      <span
                        className={
                          node.currentPnecRatio > 1
                            ? "text-red-400 font-bold"
                            : "text-emerald-400 font-bold"
                        }
                      >
                        {node.currentPnecRatio}x límite
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* PTAR Central Effluent Collector Discharge banner */}
          <div className="relative z-10 mt-3 p-2.5 rounded-lg bg-[#14141a] border border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400 animate-pulse shrink-0" />
              <span className="text-zinc-200 font-medium text-xs">
                Red Colectora Metropolitana Sedalib (Covicorti + El Cortijo)
              </span>
            </div>
            <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sensores Online
            </span>
          </div>
        </div>

        {/* Node Detail Inspector */}
        <div className="xl:col-span-5 bg-[#14141a] rounded-xl p-4 border border-zinc-800 flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-blue-400 font-mono font-bold block">
                  ZONA SELECCIONADA EN EL MAPA
                </span>
                <h4 className="text-sm font-bold text-zinc-100">{selectedNode.name}</h4>
              </div>
              <span
                className={`text-[10px] font-mono px-2.5 py-1 rounded-full border font-bold ${
                  selectedNode.status === "CRITICAL"
                    ? "bg-red-950/80 text-red-300 border-red-800"
                    : selectedNode.status === "HIGH"
                    ? "bg-amber-950/80 text-amber-300 border-amber-800"
                    : "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                }`}
              >
                Riesgo {selectedNode.riskScore}/100
              </span>
            </div>

            {/* Plain Spanish Summary of the Selected Zone */}
            <div className="p-2.5 rounded-lg bg-[#0d0d12] border border-zinc-800 space-y-1">
              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Diagnóstico de esta zona:
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {selectedNode.plainStatus}
              </p>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400 font-sans">Colector Sedalib:</span>
                <span className="text-zinc-200 font-bold">{selectedNode.collector}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400 font-sans">Vecinos en esta cuenca:</span>
                <span className="text-zinc-200">{selectedNode.population}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400 font-sans">Gen Detectado:</span>
                <span className="text-red-400 font-bold">{selectedNode.arg}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400 font-sans">Antibiótico en Agua:</span>
                <span className="text-amber-400">{selectedNode.measuredConcentration}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400 font-sans">Exceso sobre el Límite:</span>
                <span className="text-red-400 font-bold">
                  {selectedNode.currentPnecRatio} veces (PNEC)
                </span>
              </div>
            </div>
          </div>

          {/* Regional Risk Meter */}
          <div className="pt-2 border-t border-zinc-800 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Nivel de Peligro Zonal:</span>
              <span className="font-bold text-zinc-100 font-mono">
                {selectedNode.riskScore} / 100
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  selectedNode.riskScore > 75
                    ? "bg-red-500"
                    : selectedNode.riskScore > 50
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${selectedNode.riskScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
