import { useState } from "react";
import { REGIONAL_NODES_DATA } from "../data/scenarios";
import { Droplets, Activity, AlertOctagon, ShieldAlert, CheckCircle2, ChevronRight, Eye } from "lucide-react";

interface DigitalTwinMapProps {
  activeNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  activeNodeId = "node-c04",
  onSelectNode,
}) => {
  const [selectedNode, setSelectedNode] = useState(
    REGIONAL_NODES_DATA.find((n) => n.id === activeNodeId) || REGIONAL_NODES_DATA[0]
  );

  const handleNodeClick = (node: typeof REGIONAL_NODES_DATA[0]) => {
    setSelectedNode(node);
    if (onSelectNode) onSelectNode(node.id);
  };

  return (
    <div className="p-4 sm:p-5 rounded-lg bg-[#0d0d12] border border-zinc-800 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-red-900/30 border border-red-800/40 text-red-400 flex items-center justify-center font-mono font-bold text-xs">
            <Droplets className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-zinc-100 uppercase tracking-wide">
              Topología Espacial de Colectores y Cuencas Urbanas
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono">
              Red regional de vigilancia WBE acoplada a nodos hospitalarios
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Crítico / Escape
          </span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Alto
          </span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Normal
          </span>
        </div>
      </div>

      {/* Grid: Map layout + Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Spatial visual representation */}
        <div className="lg:col-span-8 bg-[#070709] rounded-lg p-4 border border-zinc-800 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

          {/* SVG Flow diagram */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-zinc-800" strokeWidth="1.5" strokeDasharray="3 3">
            {/* Connection lines between nodes to PTAR */}
            <path d="M 120 70 L 320 220" />
            <path d="M 450 70 L 320 220" />
            <path d="M 100 230 L 320 220" />
            <path d="M 480 230 L 320 220" />
          </svg>

          {/* Interactive Nodes */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {REGIONAL_NODES_DATA.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const isCritical = node.status === "CRITICAL";
              const isHigh = node.status === "HIGH";

              return (
                <button
                  key={node.id}
                  id={`node-btn-${node.id}`}
                  onClick={() => handleNodeClick(node)}
                  className={`text-left p-3 rounded border transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-zinc-800/90 border-red-500/80 ring-1 ring-red-500/50 shadow-sm"
                      : "bg-[#14141a] border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-zinc-200">{node.name}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isCritical
                          ? "bg-red-500 shadow-sm shadow-red-500 animate-pulse"
                          : isHigh
                          ? "bg-amber-500"
                          : "bg-green-500"
                      }`}
                    ></span>
                  </div>

                  <div className="text-[10px] text-zinc-400 space-y-0.5 font-mono">
                    <div className="truncate text-zinc-300">{node.collector}</div>
                    <div className="text-blue-400 flex items-center gap-1">
                      <span>ARG:</span>
                      <span className="font-bold">{node.arg}</span>
                    </div>
                    <div className="text-zinc-400 flex items-center justify-between">
                      <span>Presión:</span>
                      <span className={node.currentPnecRatio > 1 ? "text-red-400 font-bold" : "text-green-400"}>
                        {node.currentPnecRatio}x PNEC
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* PTAR Central Effluent Collector Discharge banner */}
          <div className="relative z-10 mt-4 p-2 rounded bg-[#14141a] border border-zinc-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span className="text-zinc-300 font-medium text-[11px]">Cuenca Fluvial Colectora Central (Bio-Monitoreo WBE)</span>
            </div>
            <span className="text-green-500 text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Telemetría Nominal
            </span>
          </div>
        </div>

        {/* Node Detail Inspector */}
        <div className="lg:col-span-4 bg-[#14141a] rounded-lg p-4 border border-zinc-800 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                Detalle del Nodo Colector
              </span>
              <h4 className="text-xs font-bold text-zinc-100">{selectedNode.name}</h4>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded border ${
                selectedNode.status === "CRITICAL"
                  ? "bg-red-950/60 text-red-400 border-red-800/60 font-bold"
                  : selectedNode.status === "HIGH"
                  ? "bg-amber-950/60 text-amber-400 border-amber-800/60"
                  : "bg-green-950/60 text-green-400 border-green-800/60"
              }`}
            >
              Riesgo {selectedNode.status}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-800/80">
              <span className="text-zinc-500">Colector / Cuenca:</span>
              <span className="text-zinc-200">{selectedNode.collector}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/80">
              <span className="text-zinc-500">Población Servida:</span>
              <span className="text-zinc-200">{selectedNode.population}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/80">
              <span className="text-zinc-500">Gen Resistencia (ARG):</span>
              <span className="text-red-400 font-bold">{selectedNode.arg}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/80">
              <span className="text-zinc-500">Carga Genómica WBE:</span>
              <span className="text-zinc-100">{selectedNode.geneCopies}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/80">
              <span className="text-zinc-500">Antibiótico Residual:</span>
              <span className="text-amber-400">{selectedNode.measuredConcentration}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Ratio PNEC Selectivo:</span>
              <span className="text-red-400 font-bold">{selectedNode.currentPnecRatio}x PNEC</span>
            </div>
          </div>

          {/* Regional Risk Meter */}
          <div className="pt-2 border-t border-zinc-800 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-500">Score de Riesgo Zonal:</span>
              <span className="font-bold text-zinc-100">{selectedNode.riskScore} / 100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  selectedNode.riskScore > 75
                    ? "bg-red-500"
                    : selectedNode.riskScore > 50
                    ? "bg-amber-500"
                    : "bg-green-500"
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
