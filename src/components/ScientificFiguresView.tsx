import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  LineChart,
  Line,
  AreaChart,
  Area,
  Cell,
} from 'recharts';
import { Download, FileImage, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { exportContainerAsHighResPNG, exportContainerAsSVG } from '../utils/exportUtils';

// Datos para las 6 Figuras Oficiales de la Revista Facultad de Ingeniería UdeA (Redin)
const DATA_FIG3_PNEC = [
  { dia: 'Día 1', covicorti_c04: 8.2, cortijo_s01: 12.4, central_hrdt: 2.1, este_e02: 0.35, umbral: 1.0 },
  { dia: 'Día 30', covicorti_c04: 10.5, cortijo_s01: 15.1, central_hrdt: 3.2, este_e02: 0.38, umbral: 1.0 },
  { dia: 'Día 60', covicorti_c04: 13.28, cortijo_s01: 18.75, central_hrdt: 3.84, este_e02: 0.41, umbral: 1.0 },
  { dia: 'Día 90', covicorti_c04: 11.4, cortijo_s01: 16.2, central_hrdt: 2.95, este_e02: 0.33, umbral: 1.0 },
  { dia: 'Día 120', covicorti_c04: 9.8, cortijo_s01: 13.8, central_hrdt: 2.4, este_e02: 0.31, umbral: 1.0 },
  { dia: 'Día 150', covicorti_c04: 12.1, cortijo_s01: 17.4, central_hrdt: 3.5, este_e02: 0.36, umbral: 1.0 },
  { dia: 'Día 180', covicorti_c04: 10.9, cortijo_s01: 14.9, central_hrdt: 2.8, este_e02: 0.34, umbral: 1.0 },
];

const DATA_FIG4_BASELINES = [
  { metodo: 'Vigilancia Clásica (Cultivos)', mediana: -14.2, min: -18.0, max: -12.0, color: '#DC2626' },
  { metodo: 'Modelo ARIMA Univariado', mediana: 3.2, min: 2.0, max: 4.5, color: '#D97706' },
  { metodo: 'Red Neuronal LSTM / TFT', mediana: 7.4, min: 5.0, max: 10.0, color: '#2563EB' },
  { metodo: 'Gemelo Digital SP-7 (Propuesto)', mediana: 17.4, min: 14.2, max: 20.8, color: '#0D9488' },
];

const DATA_FIG5_PROYECCION_90D = [
  { dia: 'Día 0', sinControl: 24.5, conSP7: 24.5, limiteUCI: 45.0 },
  { dia: 'Día 15', sinControl: 36.2, conSP7: 29.1, limiteUCI: 45.0 },
  { dia: 'Día 30', sinControl: 48.7, conSP7: 32.8, limiteUCI: 45.0 },
  { dia: 'Día 45', sinControl: 56.4, conSP7: 35.1, limiteUCI: 45.0 },
  { dia: 'Día 60', sinControl: 61.9, conSP7: 36.5, limiteUCI: 45.0 },
  { dia: 'Día 75', sinControl: 65.6, conSP7: 37.3, limiteUCI: 45.0 },
  { dia: 'Día 90', sinControl: 68.2, conSP7: 37.8, limiteUCI: 45.0 },
];

const DATA_FIG6_SHAP = [
  { variable: 'Razón Presión R_sel (PNEC)', impacto_shap: 0.412, color: '#1E3A8A' },
  { variable: 'Consumo Hospitalario (DDD)', impacto_shap: 0.268, color: '#0284C7' },
  { variable: 'Prevalencia Clínica Basal (%)', impacto_shap: 0.145, color: '#0D9488' },
  { variable: 'Copias Génicas WBE (ARG/L)', impacto_shap: 0.110, color: '#D97706' },
  { variable: 'Concentración Fármaco (ng/L)', impacto_shap: 0.045, color: '#64748B' },
  { variable: 'Caudal Efluente (m³/h)', impacto_shap: 0.020, color: '#94A3B8' },
];

interface FigureMeta {
  id: string;
  numero: string;
  titulo: string;
  subtitulo: string;
  interpretabilidad: string;
  explicabilidad: string;
  filename: string;
}

const FIGURES_META: FigureMeta[] = [
  {
    id: 'fig-1-container',
    numero: 'Figura 1 (Formato Revista Redin UdeA)',
    titulo: 'Arquitectura Ciberfísica de Cuatro Capas del Gemelo Digital Híbrido SP-7',
    subtitulo: 'Flujo bidireccional desde los nodos centinela de Trujillo hasta las directivas clínicas PROA',
    interpretabilidad:
      'El diagrama muestra las 4 capas acopladas del sistema SP-7: (Capa 1) Red física de 5 nodos centinela en Trujillo con telemetría WBE, DDD y WGS; (Capa 2) Microservicios de ingesta en Node.js/Docker; (Capa 3) Motor analítico híbrido que une la ecuación PNEC, el pipeline CRISP-DM y el modelo Gemini 3.8 Flash; y (Capa 4) Panel de decisiones PROA y alertas para Sedalib.',
    explicabilidad:
      'La arquitectura desacoplada en 4 capas resuelve el cuello de botella de la vigilancia tradicional: mientras la Capa 1 captura señales ambientales continuas en el alcantarillado antes de que los pacientes lleguen al hospital, la Capa 3 filtra el ruido mediante el umbral mecanístico R_sel y el modelo Random Forest/SHAP, emitiendo órdenes preventivas en la Capa 4 con una latencia inferior a 250 ms.',
    filename: 'Figura1_Arquitectura_Ciberfisica_SP7_Redin_300DPI',
  },
  {
    id: 'fig-2-container',
    numero: 'Figura 2 (Formato Revista Redin UdeA)',
    titulo: 'Ubicación de los Cinco Nodos Centinela, Hospitales y Colectores en Trujillo Metropolitana',
    subtitulo: 'Cobertura poblacional (~1.15M hab.) y carga genética dominante por cuenca hidrográfica urbana',
    interpretabilidad:
      'El mapa esquemático representa los 5 nodos vigilados en Trujillo: Hospital Regional Docente (HRDT, 320k hab., blaNDM-5/blaKPC), Hospital Belén (280k hab., blaCTX-M-15), Colector Covicorti C-04 (180k hab., blaKPC-2), Colector El Cortijo S-01 (95k hab., qnrS/gyrA) y Sector Este E-02 (140k hab., ermB), convergiendo hacia la PTAR Central de Sedalib.',
    explicabilidad:
      'La topología hidráulica de Trujillo dirige los efluentes de los hospitales terciarios (HRDT y Belén) hacia los colectores troncales C-01 y C-04. Al colocar sensores moleculares (ddPCR) y químicos (LC-MS/MS) en estas intersecciones antes de la PTAR de Sedalib, se localiza exactamente el barrio o complejo hospitalario de origen de un clon resistente.',
    filename: 'Figura2_Mapa_Red_Centinela_Trujillo_Redin_300DPI',
  },
  {
    id: 'fig-3-container',
    numero: 'Figura 3 (Formato Revista Redin UdeA)',
    titulo: 'Evolución de la Razón de Presión Selectiva (R_sel) durante 180 Días en Colectores de Trujillo',
    subtitulo: 'Comparación frente al umbral biológico crítico R_sel = 1.0 (Bengtsson-Palme & Larsson)',
    interpretabilidad:
      'Las curvas muestran la evolución de R_sel a lo largo de 180 días. El Colector El Cortijo S-01 (línea roja, ciprofloxacino) alcanza picos extremos de R_sel = 18.75, el Colector Covicorti C-04 (línea naranja) llega a 13.28 y el Colector Central HRDT (línea azul, meropenem) llega a 3.84, superando reiteradamente la línea punteada del umbral seguro (R_sel = 1.0). Solo el Sector Este E-02 permanece por debajo de 1.0.',
    explicabilidad:
      'De acuerdo con la Ecuación 1 (R_sel = C_medida / PNEC_umbral), todo valor superior a 1.0 indica que la concentración residual del antibiótico en el agua residual inhibe a las bacterias silvestres sensibles y selecciona activamente a las mutantes resistentes, convirtiendo a los colectores S-01 y C-04 en biorreactores de transferencia horizontal de plásmidos.',
    filename: 'Figura3_Dinamica_PNEC_Presion_Selectiva_Redin_300DPI',
  },
  {
    id: 'fig-4-container',
    numero: 'Figura 4 (Formato Revista Redin UdeA)',
    titulo: 'Comparación de la Ventana de Anticipación de SP-7 frente a Líneas Base de Vigilancia',
    subtitulo: 'Mediana e intervalo de confianza al 95% (Prueba de rangos con signo de Wilcoxon, p < 0.001)',
    interpretabilidad:
      'El gráfico compara los días de anticipación respecto al inicio del brote hospitalario (Día 0). La vigilancia clásica por cultivos presenta un retardo reactivo de -14.2 días; el modelo estadístico ARIMA anticipa +3.2 días (p = 0.084, no significativo); la red neuronal LSTM/TFT anticipa +7.4 días (p = 0.012); mientras que el Gemelo Digital SP-7 alcanza una mediana de +17.4 días (IC 95%: 14.2 a 20.8 días, p < 0.001).',
    explicabilidad:
      'La ventaja de +17.4 días del Gemelo Digital SP-7 se explica porque la excreción fecal de genes de resistencia hacia el alcantarillado ocurre desde la fase asintomática comunitaria, semanas antes de que los pacientes sufran fallo terapéutico, ingresen a UCI y completen las 48-72 horas de incubación microbiológica requeridas por un hemocultivo.',
    filename: 'Figura4_Comparativa_Baselines_Wilcoxon_Redin_300DPI',
  },
  {
    id: 'fig-5-container',
    numero: 'Figura 5 (Formato Revista Redin UdeA)',
    titulo: 'Proyección a 90 Días de Resistencia a Carbapenémicos Con y Sin Directiva PROA (Monte Carlo)',
    subtitulo: 'Impacto del Gemelo SP-7 sobre K. pneumoniae (blaKPC-3) en el eje hospitalario de Trujillo',
    interpretabilidad:
      'La curva roja muestra que, sin intervención, la prevalencia de resistencia a carbapenémicos sube del 24.5% (Día 0) al 68.2% (Día 90), superando el límite crítico de UCI (45%). En cambio, la curva verde (con directiva PROA + tratamiento en colector activada tras la alerta del día 18) frena el ascenso y estabiliza la prevalencia en 37.8%, logrando una reducción relativa del 44.6% (-30.4 puntos porcentuales).',
    explicabilidad:
      'En la Ecuación 2 del modelo dinámico P(t), la restricción de carbapenémicos en el hospital reduce el factor farmacológico F_ddd y la ozonólisis focalizada en el colector reduce el factor ambiental F_env. Al abatir ambos multiplicadores de forma coordinada, se rompe el ciclo de retroalimentación positiva del clon ST258 antes de saturar la UCI.',
    filename: 'Figura5_Proyeccion_90d_MonteCarlo_PROA_Redin_300DPI',
  },
  {
    id: 'fig-6-container',
    numero: 'Figura 6 (Formato Revista Redin UdeA)',
    titulo: 'Explicabilidad Global (TreeSHAP / Sobol): Importancia de cada Variable sobre la Alerta Temprana',
    subtitulo: 'Contribución relativa de los predictores biofísicos y epidemiológicos en el motor analítico SP-7',
    interpretabilidad:
      'El gráfico de barras horizontales ordena las variables según su peso explicativo (SHAP / Sobol S1) sobre la emisión de alertas: la Razón de Presión Selectiva R_sel lidera con 41.2% (0.412), seguida por el Consumo Hospitalario DDD con 26.8% (0.268), la Prevalencia Clínica Basal con 14.5% (0.145) y las Copias Génicas en Agua Residual con 11.0% (0.110). El caudal hidráulico apenas aporta el 2.0%.',
    explicabilidad:
      'Mediante descomposición exacta TreeSHAP sobre el modelo Random Forest, se demuestra que el gemelo no opera como una caja negra: las alertas están gobernadas en un 68.0% por la interacción entre el cociente biológico R_sel y la presión de prescripción DDD, validando la consistencia mecanística de las Ecuaciones 1 y 2.',
    filename: 'Figura6_Interpretabilidad_XAI_SHAP_Redin_300DPI',
  },
];

export const ScientificFiguresView: React.FC = () => {
  const renderChartContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="space-y-3 py-2">
            {[
              {
                capa: 'CAPA 4: GOBERNANZA CLÍNICA Y AMBIENTAL ONE HEALTH (PROA + SEDALIB)',
                detalle: 'Directivas de restricción de carbapenémicos en HRDT/Belén • Ozonólisis y filtrado en colectores • Exportación HD 300 DPI con XAI',
                bg: 'bg-blue-900 text-white border-blue-950',
              },
              {
                capa: 'CAPA 3: MOTOR ANALÍTICO HÍBRIDO (BIOFÍSICO PNEC + CRISP-DM + GEMINI 3.8 + SHAP)',
                detalle: 'Ecuación R_sel = C/PNEC • Proyección P(t) a 90 días (Monte Carlo) • Random Forest + TreeSHAP • Inferencia Causal Gemini 3.8 Flash',
                bg: 'bg-teal-800 text-white border-teal-900',
              },
              {
                capa: 'CAPA 2: ORQUESTACIÓN Y MICROSERVICIOS CIBERFÍSICOS (DOCKER / EXPRESS)',
                detalle: 'Sincronización asíncrona < 250 ms • Validación de esquemas JSON • Cascada de alta disponibilidad 100% (Puertos 3000 / 3005)',
                bg: 'bg-slate-800 text-white border-slate-900',
              },
              {
                capa: 'CAPA 1: RED CENTINELA DE 5 NODOS EN TRUJILLO (TELEMETRÍA TRIPARTITA)',
                detalle: '1. Genómica WGS/mNGS (HRDT/Belén) • 2. Consumo Farmacológico DDD (Farmacias) • 3. Aguas Residuales WBE ddPCR (Colectores C-04, S-01, C-01, E-02)',
                bg: 'bg-amber-800 text-white border-amber-900',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-full rounded-xl p-4 border shadow-sm text-center ${item.bg}`}>
                  <div className="text-xs font-extrabold tracking-wide uppercase">{item.capa}</div>
                  <div className="text-xs opacity-90 mt-1 font-medium">{item.detalle}</div>
                </div>
                {idx < 3 && (
                  <div className="text-blue-900 font-bold text-xs my-1">
                    ▲ ▼ Acoplamiento Bidireccional en Tiempo Real
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2">
            {[
              { nodo: 'Nodo 1: Hospital Regional (HRDT)', pob: '320,000 hab.', gen: 'blaNDM-5 / blaKPC-3', rsel: 'R_sel = 3.84 (Crítico)', color: 'border-red-300 bg-red-50/70' },
              { nodo: 'Nodo 2: Hospital Belén Trujillo', pob: '280,000 hab.', gen: 'blaCTX-M-15 (BLEE)', rsel: 'R_sel = 2.45 (Alto)', color: 'border-orange-300 bg-orange-50/70' },
              { nodo: 'Nodo 3: Colector Covicorti (C-04)', pob: '180,000 hab.', gen: 'blaKPC-2 / Clon ST258', rsel: 'R_sel = 13.28 (Crítico)', color: 'border-red-300 bg-red-50/70' },
              { nodo: 'Nodo 4: Colector El Cortijo (S-01)', pob: '95,000 hab.', gen: 'qnrS1 / gyrA S83L', rsel: 'R_sel = 18.75 (Extremo)', color: 'border-rose-400 bg-rose-50/80' },
              { nodo: 'Nodo 5: Colector Sector Este (E-02)', pob: '140,000 hab.', gen: 'ermB / mecA', rsel: 'R_sel = 0.35 (Seguro)', color: 'border-emerald-300 bg-emerald-50/70' },
              { nodo: 'Nodo Convergente: PTAR Sedalib', pob: '1,150,000 hab. (Total)', gen: 'Monitoreo Metagenómico', rsel: 'Estación Depuradora Final', color: 'border-blue-300 bg-blue-50/70' },
            ].map((n, i) => (
              <div key={i} className={`rounded-xl border-2 p-3.5 ${n.color}`}>
                <div className="text-xs font-extrabold text-slate-900">{n.nodo}</div>
                <div className="text-xs text-slate-600 mt-1">Población: <strong>{n.pob}</strong></div>
                <div className="text-xs text-slate-700 mt-0.5">Gen marcador: <code className="font-bold">{n.gen}</code></div>
                <div className="text-xs font-bold text-blue-950 mt-1.5 pt-1.5 border-t border-slate-200/80">{n.rsel}</div>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DATA_FIG3_PNEC} margin={{ top: 15, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                <XAxis dataKey="dia" tick={{ fill: '#1E293B', fontSize: 12, fontWeight: 600 }} />
                <YAxis
                  tick={{ fill: '#1E293B', fontSize: 12 }}
                  label={{ value: 'Razón R_sel (C / PNEC)', angle: -90, position: 'insideLeft', fill: '#1E293B', fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip />
                <Legend />
                <ReferenceLine y={1.0} stroke="#DC2626" strokeDasharray="6 4" strokeWidth={2} label={{ value: 'Umbral PNEC (R_sel = 1.0)', fill: '#DC2626', fontSize: 11, fontWeight: 700 }} />
                <Line type="monotone" dataKey="cortijo_s01" name="Colector Cortijo S-01 (Ciprofloxacino)" stroke="#DC2626" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="covicorti_c04" name="Colector Covicorti C-04 (Ceftriaxona/KPC)" stroke="#EA580C" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="central_hrdt" name="Colector Central HRDT (Meropenem)" stroke="#1E3A8A" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="este_e02" name="Sector Este E-02 (Control Basal)" stroke="#0D9488" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 3:
        return (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_FIG4_BASELINES} layout="vertical" margin={{ top: 15, right: 35, left: 40, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                <XAxis
                  type="number"
                  domain={[-20, 24]}
                  tick={{ fill: '#1E293B', fontSize: 12, fontWeight: 600 }}
                  label={{ value: 'Días respecto al brote en UCI (Positivo = Anticipación Temprana)', position: 'insideBottom', offset: -5, fill: '#1E293B', fontSize: 11, fontWeight: 700 }}
                />
                <YAxis type="category" dataKey="metodo" width={180} tick={{ fill: '#1E293B', fontSize: 11, fontWeight: 700 }} />
                <Tooltip />
                <ReferenceLine x={0} stroke="#DC2626" strokeWidth={2} label={{ value: 'Día 0 (Brote UCI)', fill: '#DC2626', fontSize: 11, fontWeight: 700 }} />
                <Bar dataKey="mediana" name="Ventana de Anticipación (Mediana en días)" radius={[0, 6, 6, 0]}>
                  {DATA_FIG4_BASELINES.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 4:
        return (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_FIG5_PROYECCION_90D} margin={{ top: 15, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                <XAxis dataKey="dia" tick={{ fill: '#1E293B', fontSize: 12, fontWeight: 600 }} />
                <YAxis
                  domain={[15, 75]}
                  tick={{ fill: '#1E293B', fontSize: 12 }}
                  label={{ value: 'Prevalencia de Resistencia (%)', angle: -90, position: 'insideLeft', fill: '#1E293B', fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip />
                <Legend />
                <ReferenceLine y={45} stroke="#1E3A8A" strokeDasharray="5 5" strokeWidth={2} label={{ value: 'Umbral Saturación UCI (45%)', fill: '#1E3A8A', fontSize: 11, fontWeight: 700 }} />
                <Area type="monotone" dataKey="sinControl" name="Sin Intervención (Tendencia Basal: 68.2%)" stroke="#DC2626" fill="#FEE2E2" strokeWidth={3} />
                <Area type="monotone" dataKey="conSP7" name="Con Directiva PROA SP-7 (Mitigada: 37.8% | -44.6%)" stroke="#0D9488" fill="#CCFBF1" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      case 5:
      default:
        return (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_FIG6_SHAP} layout="vertical" margin={{ top: 10, right: 30, left: 45, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                <XAxis
                  type="number"
                  domain={[0, 0.5]}
                  tick={{ fill: '#1E293B', fontSize: 12, fontWeight: 600 }}
                  label={{ value: 'Índice de Importancia Explicativa (TreeSHAP / Sobol S1)', position: 'insideBottom', offset: -5, fill: '#1E293B', fontSize: 11, fontWeight: 700 }}
                />
                <YAxis type="category" dataKey="variable" width={190} tick={{ fill: '#1E293B', fontSize: 11, fontWeight: 700 }} />
                <Tooltip />
                <Bar dataKey="impacto_shap" name="Contribución a la Alerta Temprana" radius={[0, 6, 6, 0]}>
                  {DATA_FIG6_SHAP.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Cabecera informativa */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
            Formato Oficial: Revista Facultad de Ingeniería — Universidad de Antioquia (Redin)
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Catálogo Completo de las 6 Figuras del Artículo Científico (Grabación HD 300 DPI + XAI)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Todas las figuras incluyen su bloque obligatorio de <strong>Interpretabilidad</strong> y <strong>Explicabilidad Causal</strong> tanto en pantalla como al grabar el archivo en alta calidad.
          </p>
        </div>
      </div>

      {/* Listado de las 6 Figuras */}
      {FIGURES_META.map((fig, idx) => (
        <div
          key={fig.id}
          id={fig.id}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* Barra superior de título y botones de grabación */}
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                {fig.numero}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{fig.titulo}</h3>
              <p className="text-xs text-slate-600 mt-0.5">{fig.subtitulo}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  exportContainerAsHighResPNG(
                    fig.id,
                    fig.filename,
                    `${fig.numero}: ${fig.titulo}`,
                    fig.interpretabilidad,
                    fig.explicabilidad
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-900 text-white hover:bg-blue-800 transition shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Grabar Figura PNG (300 DPI)
              </button>
              <button
                onClick={() =>
                  exportContainerAsSVG(
                    fig.id,
                    fig.filename,
                    `${fig.numero}: ${fig.titulo}`,
                    fig.interpretabilidad,
                    fig.explicabilidad
                  )
                }
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                <FileImage className="w-4 h-4 text-teal-700" />
                Grabar SVG Vectorial
              </button>
            </div>
          </div>

          {/* Lienzo del Gráfico */}
          <div className="p-6 bg-white">{renderChartContent(idx)}</div>

          {/* Bloques de Interpretabilidad y Explicabilidad Causal */}
          <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/60 border-t border-slate-100">
            <div className="rounded-xl bg-blue-50/80 border border-blue-200 p-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-950 mb-1.5">
                <BookOpen className="w-4 h-4 text-blue-800" />
                Interpretabilidad (¿Qué muestra esta figura?)
              </div>
              <p className="text-xs text-slate-800 leading-relaxed">{fig.interpretabilidad}</p>
            </div>
            <div className="rounded-xl bg-teal-50/80 border border-teal-200 p-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-teal-950 mb-1.5">
                <Sparkles className="w-4 h-4 text-teal-800" />
                Explicabilidad Causal (¿Por qué ocurre biofísica y matemáticamente?)
              </div>
              <p className="text-xs text-slate-800 leading-relaxed">{fig.explicabilidad}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
