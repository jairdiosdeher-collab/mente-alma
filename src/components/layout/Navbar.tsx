import React from 'react';
import { ActiveModule } from '../../hooks/useClinicalStorage';
import { Patient, TherapistProfile } from '../../types/clinical';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import {
  BrainCircuit,
  Users,
  Sun,
  Moon,
  UserCheck,
  Menu,
  FileDown,
} from 'lucide-react';

interface NavbarProps {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatientId: (id: string) => void;
  therapistProfile: TherapistProfile;
  onOpenTherapistModal: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  setActiveModule,
  patients,
  selectedPatient,
  onSelectPatientId,
  therapistProfile,
  onOpenTherapistModal,
  isDarkMode,
  onToggleTheme,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 h-14 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between gap-4 no-print">
      {/* Zone 1: Single text element wordmark + mobile hamburger */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveModule('overview')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform shrink-0">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white whitespace-nowrap shrink-0">
            PastoralMente <span className="font-light text-teal-400 text-xs tracking-normal">Clinical AI</span>
          </span>
        </button>
      </div>

      {/* Zone 2: Navigation Links for desktop */}
      <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-slate-400 shrink-0">
        <button
          onClick={() => setActiveModule('overview')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeModule === 'overview' ? 'text-teal-400 font-semibold border-b border-teal-400' : ''
          }`}
        >
          Dashboard General
        </button>
        <button
          onClick={() => setActiveModule('module1_clinical_ai')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeModule === 'module1_clinical_ai' ? 'text-teal-400 font-semibold border-b border-teal-400' : ''
          }`}
        >
          IA Clínica
        </button>
        <button
          onClick={() => setActiveModule('module2_patients')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeModule === 'module2_patients' ? 'text-teal-400 font-semibold border-b border-teal-400' : ''
          }`}
        >
          Ficha Paciente
        </button>
        <button
          onClick={() => setActiveModule('module3_pharmacology')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeModule === 'module3_pharmacology' ? 'text-teal-400 font-semibold border-b border-teal-400' : ''
          }`}
        >
          Farmacología
        </button>
        <button
          onClick={() => setActiveModule('module7_scales')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeModule === 'module7_scales' ? 'text-teal-400 font-semibold border-b border-teal-400' : ''
          }`}
        >
          Escalas PHQ/GAD
        </button>
        <button
          onClick={() => setActiveModule('module9_reports')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeModule === 'module9_reports' ? 'text-teal-400 font-semibold border-b border-teal-400' : ''
          }`}
        >
          Informes PDF
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action Area & Patient Quick Selector */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Patient Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-200">
          <Users className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <select
            value={selectedPatient.id}
            onChange={(e) => onSelectPatientId(e.target.value)}
            className="bg-transparent text-xs text-white focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[180px] truncate"
            aria-label="Seleccionar paciente activo"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                {p.fullName} ({p.fileNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Standalone HTML File Download Button */}
        <a
          href="/download-standalone"
          download="pastoralmente_clinical_ai.html"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-500/15 border border-teal-500/30 hover:bg-teal-500/25 text-teal-300 text-xs font-semibold transition shrink-0 whitespace-nowrap min-h-[36px]"
          title="Descargar la aplicación completa en un único archivo index.html autónomo"
        >
          <FileDown className="w-3.5 h-3.5 text-teal-400" />
          <span>Descargar .HTML</span>
        </a>

        {/* PWA Install Trigger */}
        <PWAInstallButton />

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          aria-label="Alternar modo oscuro y claro"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>

        {/* Therapist Profile Button */}
        <button
          onClick={onOpenTherapistModal}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-teal-900/30 border border-teal-700/40 hover:bg-teal-900/50 text-xs text-teal-200 transition min-h-[44px] shrink-0"
          title="Ver perfil profesional y cédula colegiada"
        >
          <UserCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="hidden sm:inline font-medium truncate max-w-[120px]">
            {therapistProfile.name.split(' ')[0]} {therapistProfile.name.split(' ')[1] || ''}
          </span>
        </button>
      </div>
    </header>
  );
};
