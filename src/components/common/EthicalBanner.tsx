import React, { useState } from 'react';
import { ShieldAlert, Info, X } from 'lucide-react';

export const EthicalBanner: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="w-full text-left py-1 px-4 bg-slate-900/60 border-b border-slate-800 text-[11px] text-teal-400/80 hover:text-teal-300 transition flex items-center justify-between no-print"
      >
        <span className="flex items-center gap-1.5 truncate">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Aviso deontológico: Herramienta de soporte y apoyo profesional clínico (hacer clic para ver detalles).</span>
        </span>
        <span className="text-[10px] text-slate-500 underline ml-2 shrink-0">Expandir</span>
      </button>
    );
  }

  return (
    <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 text-xs text-slate-300 no-print transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 md:mt-0" />
          <p className="text-[11px] leading-snug">
            <strong className="text-white font-medium">Marco Deontológico y Legal:</strong> Esta plataforma es un entorno de apoyo clínico y formativo para psicoterapeutas y profesionales de la salud. <span className="text-amber-200">No emite diagnósticos médicos definitivos, no prescribe medicamentos ni sustituye la valoración médica o psiquiátrica.</span> Las decisiones terapéuticas son responsabilidad exclusiva del profesional actuante.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto text-[11px]">
          <span className="text-slate-400 hidden lg:inline">Confidencialidad y Secreto Profesional activo</span>
          <button
            onClick={() => setCollapsed(true)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded transition"
            title="Minimizar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
