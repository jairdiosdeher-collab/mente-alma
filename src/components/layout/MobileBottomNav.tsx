import React from 'react';
import { ActiveModule } from '../../hooks/useClinicalStorage';
import { LayoutDashboard, Sparkles, User, Pill, Layers } from 'lucide-react';

interface MobileBottomNavProps {
  activeModule: ActiveModule;
  setActiveModule: (m: ActiveModule) => void;
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeModule,
  setActiveModule,
  onOpenMobileMenu,
}) => {
  const tabs = [
    { id: 'overview' as ActiveModule, label: 'Inicio', icon: LayoutDashboard },
    { id: 'module1_clinical_ai' as ActiveModule, label: 'IA Clínica', icon: Sparkles },
    { id: 'module2_patients' as ActiveModule, label: 'Paciente', icon: User },
    { id: 'module3_pharmacology' as ActiveModule, label: 'Fármacos', icon: Pill },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-safe no-print">
      <div className="grid grid-cols-5 items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors ${
                isActive ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={tab.label}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More / All Modules Button */}
        <button
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Ver todos los módulos"
        >
          <Layers className="w-5 h-5 text-teal-300" />
          <span className="text-[10px] tracking-tight mt-1">Módulos</span>
        </button>
      </div>
    </nav>
  );
};
