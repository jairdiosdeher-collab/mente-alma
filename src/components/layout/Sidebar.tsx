import React from 'react';
import { ActiveModule } from '../../hooks/useClinicalStorage';
import { Patient } from '../../types/clinical';
import {
  LayoutDashboard,
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
  Download,
  Upload,
  RefreshCw,
  FileDown,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeModule: ActiveModule;
  setActiveModule: (m: ActiveModule) => void;
  selectedPatient: Patient;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onExportJSON: () => void;
  onImportClick: () => void;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  selectedPatient,
  isOpenMobile,
  onCloseMobile,
  onExportJSON,
  onImportClick,
  onResetData,
}) => {
  const navSections = [
    {
      title: 'Panel Principal',
      items: [
        { id: 'overview' as ActiveModule, label: 'Dashboard Resumen', icon: LayoutDashboard },
        { id: 'module1_clinical_ai' as ActiveModule, label: '1. IA Clínica Especializada', icon: Sparkles },
      ],
    },
    {
      title: 'Expediente & Seguimiento',
      items: [
        { id: 'module2_patients' as ActiveModule, label: '2. Perfil Integral Paciente', icon: User },
        { id: 'module6_monitoring' as ActiveModule, label: '6. Seguimiento Clínico', icon: Activity },
        { id: 'module7_scales' as ActiveModule, label: '7. Escalas PHQ-9 & GAD-7', icon: ClipboardList },
        { id: 'module8_predictive' as ActiveModule, label: '8. Seguimiento Predictivo', icon: AlertTriangle },
        { id: 'module9_reports' as ActiveModule, label: '9. Informes Clínicos PDF', icon: FileText },
      ],
    },
    {
      title: 'Psicofarmacología',
      items: [
        { id: 'module3_pharmacology' as ActiveModule, label: '3. Analizador Fármacos', icon: Pill },
        { id: 'module4_symptom_drug' as ActiveModule, label: '4. Síntoma - Medicamento', icon: GitCompare },
        { id: 'module5_interactions' as ActiveModule, label: '5. Interacciones y Riesgos', icon: Activity },
      ],
    },
    {
      title: 'Recursos Terapéuticos',
      items: [
        { id: 'module10_library' as ActiveModule, label: '10. Biblioteca Psicoterapia', icon: BookOpen },
        {
          id: 'module11_pastoral' as ActiveModule,
          label: '11. Modo Pastoral (Optativo)',
          icon: HeartHandshake,
          isPastoral: true,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } no-print`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <span className="font-semibold text-sm text-white">Navegación Clínica</span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Cerrar navegación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Patient Summary Chip */}
        <div className="p-3.5 mx-3 mt-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
            <span>Expediente activo:</span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                selectedPatient.riskLevel === 'Alto'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                  : selectedPatient.riskLevel === 'Moderado'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
              }`}
            >
              Riesgo {selectedPatient.riskLevel}
            </span>
          </div>
          <div className="font-semibold text-xs text-white truncate">{selectedPatient.fullName}</div>
          <div className="text-[11px] text-teal-400 truncate mt-0.5">{selectedPatient.primaryDiagnosis}</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
            <span>Adherencia: <strong className="text-slate-200">{selectedPatient.adherencePercentage}%</strong></span>
            <span>·</span>
            <span>Sesiones: <strong className="text-slate-200">{selectedPatient.sessions?.length || 0}</strong></span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navSections.map((sec, idx) => (
            <div key={idx}>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-2 mb-1">
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveModule(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition text-left min-h-[40px] ${
                        isActive
                          ? 'bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                      <span className="truncate flex-1">{item.label}</span>
                      {item.isPastoral && selectedPatient.pastoralModeAuthorized && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" title="Autorizado por paciente" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Data Tools & Reset */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
          {/* Direct Standalone HTML Download Link */}
          <a
            href="/download-standalone"
            download="pastoralmente_clinical_ai.html"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-teal-200 bg-teal-950/70 border border-teal-600/60 hover:bg-teal-900/70 transition shadow-sm"
            title="Descargar la aplicación completa en un único archivo HTML autónomo para abrir offline"
          >
            <FileDown className="w-3.5 h-3.5 text-teal-400" />
            <span>Descargar Archivo Único .HTML</span>
          </a>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onExportJSON}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] text-slate-300 bg-slate-800/70 hover:bg-slate-700 transition"
              title="Descargar copia de seguridad en archivo JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
            <button
              onClick={onImportClick}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] text-slate-300 bg-slate-800/70 hover:bg-slate-700 transition"
              title="Restaurar datos desde archivo JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importar</span>
            </button>
          </div>
          <button
            onClick={onResetData}
            className="w-full flex items-center justify-center gap-1.5 py-1 text-[10px] text-slate-400 hover:text-slate-200 transition"
            title="Restablecer expedientes a los casos de demostración iniciales"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Restaurar datos de muestra</span>
          </button>
        </div>
      </aside>
    </>
  );
};
