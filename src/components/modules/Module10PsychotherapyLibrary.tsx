import React, { useState } from 'react';
import { PSYCHOTHERAPY_LIBRARY } from '../../data/psychotherapyLibraryData';
import { PsychotherapyTechnique } from '../../types/clinical';
import {
  BookOpen,
  Search,
  CheckCircle,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const Module10PsychotherapyLibrary: React.FC = () => {
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('tcc-reestructuracion');

  const modalities = [
    { id: 'all', label: 'Todas las Terapias' },
    { id: 'TCC', label: 'Terapia Cognitivo Conductual (TCC)' },
    { id: 'ACT', label: 'Terapia de Aceptación y Compromiso (ACT)' },
    { id: 'Esquemas', label: 'Terapia de Esquemas' },
    { id: 'Entrevista Motivacional', label: 'Entrevista Motivacional' },
    { id: 'Psicología Positiva', label: 'Psicología Positiva' },
  ];

  const filteredTechniques = PSYCHOTHERAPY_LIBRARY.filter((tech) => {
    const matchesModality = selectedModality === 'all' || tech.modality === selectedModality;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      tech.title.toLowerCase().includes(query) ||
      tech.summary.toLowerCase().includes(query) ||
      tech.recommendedCases.some((c) => c.toLowerCase().includes(query));
    return matchesModality && matchesQuery;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-400">Módulo 10</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Compendio de Evidencia Clínica</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5">
            Biblioteca de Técnicas de Psicoterapia
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Protocolos operativos de TCC, ACT, Esquemas, Entrevista Motivacional y Psicología Positiva con transcripciones de diálogo en consulta.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          <span>{filteredTechniques.length} intervenciones disponibles</span>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:ring-1 focus:ring-teal-400 focus:outline-none"
            placeholder="Buscar por técnica (ej. Reestructuración, Defusión, Valores, Niño Vulnerable, OARS)..."
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {modalities.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setSelectedModality(mod.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition min-h-[36px] ${
                selectedModality === mod.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              {mod.label}
            </button>
          ))}
        </div>
      </div>

      {/* Techniques List */}
      <div className="space-y-4">
        {filteredTechniques.map((tech) => {
          const isExpanded = expandedId === tech.id;
          return (
            <div
              key={tech.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-150"
            >
              {/* Card Header */}
              <div
                onClick={() => toggleExpand(tech.id)}
                className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/60 transition"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                        {tech.modality}
                      </span>
                      <h3 className="text-sm font-bold text-white">{tech.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{tech.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    {isExpanded ? 'Ocultar protocolo' : 'Ver protocolo y diálogo'}
                  </span>
                  <button className="p-1 text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Protocol Details */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-800 space-y-4 text-xs animate-in fade-in duration-150">
                  {/* Objective */}
                  <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-bold text-teal-400 block mb-1">Objetivo Terapéutico</span>
                    <p className="text-slate-300 leading-relaxed text-xs">{tech.objective}</p>
                  </div>

                  {/* Step by Step Procedure */}
                  <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider block">
                      Procedimiento Clínico Paso a Paso
                    </span>
                    <ul className="space-y-2 text-slate-300">
                      {tech.stepByStepProcedure.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Cases */}
                  <div className="p-3.5 bg-slate-950/50 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-300 block mb-1.5">Casos e Indicaciones Recomendadas</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tech.recommendedCases.map((rc, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-800 text-teal-300 border border-slate-700 rounded-lg text-xs"
                        >
                          {rc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Clinical Dialogue Example */}
                  <div className="p-4 bg-gradient-to-r from-slate-950 to-teal-950/30 rounded-xl border border-teal-800/40 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                      <MessageSquare className="w-4 h-4 text-teal-400" />
                      <span>Ejemplo Práctico de Diálogo en Consulta</span>
                    </div>

                    <div className="space-y-3">
                      {tech.clinicalExampleDialogue.map((dia, idx) => (
                        <div key={idx} className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-teal-400 shrink-0">Terapeuta:</span>
                            <span className="text-slate-200 italic">«{dia.therapist}»</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-slate-400 shrink-0">Paciente:</span>
                            <span className="text-slate-300">«{dia.patient}»</span>
                          </div>
                          <div className="pt-1 text-[11px] text-teal-400/90 font-medium">
                            <span className="text-slate-500 font-normal">Intención clínica: </span>
                            {dia.therapeuticIntent}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
