import React from 'react';
import { ActiveModule } from '../../hooks/useClinicalStorage';
import { Patient } from '../../types/clinical';
import {
  Sparkles,
  User,
  Pill,
  GitCompare,
  Activity,
  ClipboardList,
  AlertTriangle,
  FileText,
  BookOpen,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Clock,
  FileDown,
} from 'lucide-react';

interface ModuleOverviewProps {
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatientId: (id: string) => void;
  setActiveModule: (m: ActiveModule) => void;
}

export const ModuleOverview: React.FC<ModuleOverviewProps> = ({
  patients,
  selectedPatient,
  onSelectPatientId,
  setActiveModule,
}) => {
  // Aggregate stats
  const totalPatients = patients.length;
  const highRiskPatients = patients.filter((p) => p.riskLevel === 'Alto').length;
  const avgAdherence = Math.round(
    patients.reduce((acc, p) => acc + (p.adherencePercentage || 0), 0) / (totalPatients || 1)
  );
  const totalSessionsCount = patients.reduce((acc, p) => acc + (p.sessions?.length || 0), 0);

  // Quick module launch cards
  const moduleCards = [
    {
      id: 'module1_clinical_ai' as ActiveModule,
      title: 'Módulo 1: IA Clínica Especializada',
      desc: 'Formulación de hipótesis, factores protectores/riesgo y preguntas guía de sesión.',
      icon: Sparkles,
      color: 'teal',
    },
    {
      id: 'module2_patients' as ActiveModule,
      title: 'Módulo 2: Perfil Integral del Paciente',
      desc: 'Ficha completa, antecedentes, evolución y bitácora clínica confidencial.',
      icon: User,
      color: 'blue',
    },
    {
      id: 'module3_pharmacology' as ActiveModule,
      title: 'Módulo 3: Analizador Farmacológico',
      desc: 'Compendio interactivo de 7 clases terapéuticas y consideraciones psicoterapéuticas.',
      icon: Pill,
      color: 'emerald',
    },
    {
      id: 'module4_symptom_drug' as ActiveModule,
      title: 'Módulo 4: Análisis Síntoma-Medicamento',
      desc: 'Diferencial clínico entre etiología farmacológica, reactiva psicológica o mixta.',
      icon: GitCompare,
      color: 'purple',
    },
    {
      id: 'module5_interactions' as ActiveModule,
      title: 'Módulo 5: Interacciones y Riesgos',
      desc: 'Matriz cruzada de interacciones farmacológicas con alertas por colores 🟢🟡🔴.',
      icon: Activity,
      color: 'amber',
    },
    {
      id: 'module6_monitoring' as ActiveModule,
      title: 'Módulo 6: Seguimiento Clínico',
      desc: 'Gráficas longitudinales de estado de ánimo, ansiedad, sueño, energía y estrés.',
      icon: TrendingUp,
      color: 'indigo',
    },
    {
      id: 'module7_scales' as ActiveModule,
      title: 'Módulo 7: Escalas Clínicas',
      desc: 'Evaluación estandarizada con PHQ-9, GAD-7, Índice de Sueño y Morisky-Green.',
      icon: ClipboardList,
      color: 'cyan',
    },
    {
      id: 'module8_predictive' as ActiveModule,
      title: 'Módulo 8: Seguimiento Predictivo',
      desc: 'Detección temprana de riesgo de abandono terapéutico, recaída y falta de adherencia.',
      icon: AlertTriangle,
      color: 'rose',
    },
    {
      id: 'module9_reports' as ActiveModule,
      title: 'Módulo 9: Generador de Informes',
      desc: 'Notas de evolución, informes psicológicos periciales y exportación limpia a PDF.',
      icon: FileText,
      color: 'teal',
    },
    {
      id: 'module10_library' as ActiveModule,
      title: 'Módulo 10: Biblioteca Psicoterapia',
      desc: 'Guías paso a paso de TCC, ACT, Esquemas, Entrevista Motivacional y Psicología Positiva.',
      icon: BookOpen,
      color: 'sky',
    },
    {
      id: 'module11_pastoral' as ActiveModule,
      title: 'Módulo 11: Modo Pastoral Optativo',
      desc: 'Recursos espirituales, devocionales y gratitud (requiere consentimiento del paciente).',
      icon: HeartHandshake,
      color: 'gold',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/70 border border-slate-800 rounded-2xl p-5 md:p-7 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium text-teal-400 mb-2">
            <span>Panel de Control Psicoterapéutico</span>
            <span>·</span>
            <span>Práctica Clínica Basada en Evidencia</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight text-balance">
            PastoralMente Clinical AI — Integración Psicológica y Farmacológica
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
            Plataforma diseñada para potenciar la precisión diagnóstica del terapeuta, vigilar interacciones farmacológicas, evaluar adherencia y estructurar intervenciones con rigor deontológico y calidez humana.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveModule('module1_clinical_ai')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 font-semibold text-xs text-white rounded-xl shadow-sm transition flex items-center gap-2 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Nueva Consulta con IA Clínica</span>
            </button>
            <button
              onClick={() => setActiveModule('module9_reports')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-xl border border-slate-700 transition flex items-center gap-2 min-h-[44px]"
            >
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Generar Informe / Nota SOAP</span>
            </button>

            <a
              href="/download-standalone"
              download="pastoralmente_clinical_ai.html"
              className="px-4 py-2 bg-teal-950/70 hover:bg-teal-900/80 text-xs font-semibold text-teal-200 rounded-xl border border-teal-600/60 transition flex items-center gap-2 min-h-[44px] shadow-sm"
              title="Descargar la plataforma completa en un único archivo HTML listo para abrir sin internet ni servidor"
            >
              <FileDown className="w-4 h-4 text-teal-400" />
              <span>Descargar Archivo Único .html</span>
            </a>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-medium text-slate-400">Pacientes en Seguimiento</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{totalPatients}</span>
            <span className="text-[11px] text-teal-400">Activos en consulta</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-medium text-slate-400">Casos de Alto Riesgo</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">{highRiskPatients}</span>
            <span className="text-[11px] text-slate-400">Monitoreo estrecho</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-medium text-slate-400">Adherencia Media Global</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{avgAdherence}%</span>
            <span className="text-[11px] text-slate-400">Farmacológica</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-medium text-slate-400">Sesiones Registradas</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-200 tabular-nums">{totalSessionsCount}</span>
            <span className="text-[11px] text-slate-400">Historial acumulado</span>
          </div>
        </div>
      </div>

      {/* Current Selected Patient Focal Anchor */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Expediente en foco:</span>
              <span className="font-mono text-xs text-teal-400 font-bold">{selectedPatient.fileNumber}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedPatient.riskLevel === 'Alto'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : selectedPatient.riskLevel === 'Moderado'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                Riesgo {selectedPatient.riskLevel}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">{selectedPatient.fullName}</h2>
            <p className="text-xs text-slate-300 mt-0.5">{selectedPatient.primaryDiagnosis}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModule('module2_patients')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-lg border border-slate-700 transition flex items-center gap-1.5 min-h-[44px]"
            >
              <span>Ver Ficha Completa</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium block mb-1">Medicación Actual Prescrita</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {selectedPatient.currentMedications?.length > 0 ? (
                selectedPatient.currentMedications.map((m, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-slate-800 text-teal-300 border border-slate-700 rounded text-[11px]"
                  >
                    {m}
                  </span>
                ))
              ) : (
                <span className="text-slate-500">Sin fármacos registrados</span>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium block mb-1">Progreso y Adherencia</span>
            <div className="space-y-2 mt-1">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Progreso Terapéutico</span>
                  <span className="font-mono text-teal-400">{selectedPatient.therapeuticProgressPercentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full transition-all"
                    style={{ width: `${selectedPatient.therapeuticProgressPercentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Adherencia Farmacológica</span>
                  <span className="font-mono text-emerald-400">{selectedPatient.adherencePercentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${selectedPatient.adherencePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium block mb-1">Última Escala Administrada</span>
            {selectedPatient.scaleRecords?.length > 0 ? (
              <div className="mt-1">
                <div className="text-slate-200 font-semibold">{selectedPatient.scaleRecords[0].scaleName}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                  <span>Puntaje: <strong className="text-white font-mono">{selectedPatient.scaleRecords[0].totalScore}</strong>/{selectedPatient.scaleRecords[0].maxScore}</span>
                  <span className="text-teal-400 font-medium">{selectedPatient.scaleRecords[0].severity}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{selectedPatient.scaleRecords[0].date}</span>
                </div>
              </div>
            ) : (
              <span className="text-slate-500 mt-1 block">Sin evaluaciones registradas aún.</span>
            )}
          </div>
        </div>
      </div>

      {/* Grid of all 11 modules for direct navigation */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">Todos los Módulos Clínicos Disponibles</h3>
          <span className="text-xs text-slate-400">11 módulos 100% operativos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {moduleCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => setActiveModule(card.id)}
                className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/40 rounded-xl p-4 text-left transition group flex flex-col justify-between min-h-[120px]"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 group-hover:scale-105 transition-transform shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                      {card.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-teal-400 group-hover:translate-x-1 transition-transform">
                  <span>Acceder al módulo</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
