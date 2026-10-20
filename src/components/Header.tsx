import {
  Activity,
  BarChart3,
  Table2,
  FileText,
  Sliders,
  Building2,
  CheckCircle2,
} from "lucide-react";

export type ActiveViewTab = "simulator" | "figures" | "tables" | "report";

interface HeaderProps {
  activeTab: ActiveViewTab;
  onSelectTab: (tab: ActiveViewTab) => void;
  onOpenConfig: () => void;
  isSimulating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenConfig,
  isSimulating,
}) => {
  const navItems: Array<{
    id: ActiveViewTab;
    label: string;
    sublabel: string;
    icon: any;
  }> = [
    {
      id: "simulator",
      label: "1. Panel del Gemelo Digital",
      sublabel: "Simulador interactivo",
      icon: Activity,
    },
    {
      id: "figures",
      label: "2. Figuras y Gráficos (HD)",
      sublabel: "Grabar 300 DPI + Explicabilidad",
      icon: BarChart3,
    },
    {
      id: "tables",
      label: "3. Tablas del Artículo",
      sublabel: "Grabar CSV/PNG + Interpretabilidad",
      icon: Table2,
    },
    {
      id: "report",
      label: "4. Reporte IA y Glosario",
      sublabel: "Informe completo y JSON",
      icon: FileText,
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Institutional Strip */}
      <div className="bg-[#1E3A8A] text-white text-xs py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Building2 className="w-3.5 h-3.5 text-sky-300" />
            <span>
              Universidad Nacional de Trujillo (UNT) — Escuela Profesional de Ingeniería de Sistemas
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-sky-100">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              Vigilancia Epidemiológica en Trujillo (1.15M hab.)
            </span>
            <button
              onClick={onOpenConfig}
              className="underline hover:text-white cursor-pointer flex items-center gap-1"
            >
              <Sliders className="w-3 h-3" />
              Parámetros Técnicos IA
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#1E3A8A] text-white flex flex-col items-center justify-center font-bold shadow-xs shrink-0">
            <span className="text-sm leading-none tracking-tight">SP-7</span>
            <span className="text-[9px] font-normal text-sky-200 mt-0.5">
              GEMELO
            </span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Gemelo Digital Híbrido para Vigilancia de Resistencia Antimicrobiana
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoreo integrado de Hospitales (HRDT / Belén), Farmacias y Aguas Residuales (Sedalib)
            </p>
          </div>
        </div>

        {/* Clean 4-Tab Navigation */}
        <nav className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3.5 py-2 rounded-lg text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  isActive
                    ? "bg-white text-[#1E3A8A] shadow-xs border border-slate-200/80 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-[#1E3A8A]" : "text-slate-400"
                  }`}
                />
                <div>
                  <div className="text-xs leading-none">{item.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5 hidden xl:block">
                    {item.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
