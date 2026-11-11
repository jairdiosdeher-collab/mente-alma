import React, { useState } from 'react';
import { PHARMACOLOGY_DATABASE } from '../../data/pharmacologyData';
import { DrugCategory, Medication } from '../../types/clinical';
import {
  Pill,
  Search,
  Filter,
  AlertOctagon,
  ShieldAlert,
  Brain,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const Module3Pharmacology: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DrugCategory | 'all'>('all');
  const [expandedDrugId, setExpandedDrugId] = useState<string | null>('sertralina');

  const categories: { id: DrugCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'antidepressant', label: 'Antidepresivos' },
    { id: 'anxiolytic', label: 'Ansiolíticos' },
    { id: 'antipsychotic', label: 'Antipsicóticos' },
    { id: 'mood_stabilizer', label: 'Estabilizadores del Ánimo' },
    { id: 'hypnotic', label: 'Hipnóticos' },
    { id: 'stimulant', label: 'Estimulantes' },
    { id: 'anticonvulsant', label: 'Anticonvulsivos' },
  ];

  const filteredMeds = PHARMACOLOGY_DATABASE.filter((med) => {
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      med.name.toLowerCase().includes(query) ||
      med.brandNames.some((b) => b.toLowerCase().includes(query)) ||
      med.categoryLabel.toLowerCase().includes(query) ||
      med.approvedIndications.some((i) => i.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  const toggleExpand = (id: string) => {
    setExpandedDrugId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-400">Módulo 3</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Vademécum Clínico para Terapeutas</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5">
            Analizador Farmacológico
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Consulta rápida de mecanismos de acción, efectos adversos, contraindicaciones y consideraciones directas para la sesión psicoterapéutica.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          <span>{filteredMeds.length} fármacos listados</span>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
            placeholder="Buscar por fármaco (ej. Sertralina, Clonazepam), nombre comercial (Zoloft, Rivotril) o indicación (Insomnio, Pánico)..."
          />
        </div>

        {/* Categories as clean interactive button tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition min-h-[36px] ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medication List */}
      {filteredMeds.length === 0 ? (
        <div className="p-8 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-400">
          No se encontraron medicamentos que coincidan con la búsqueda. Intente con otro término o seleccione "Todos".
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredMeds.map((med) => {
            const isExpanded = expandedDrugId === med.id;
            return (
              <div
                key={med.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-150"
              >
                {/* Collapsed Header Summary */}
                <div
                  onClick={() => toggleExpand(med.id)}
                  className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/60 transition"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white">{med.name}</h3>
                        <span className="text-[11px] text-slate-400">({med.brandNames.join(', ')})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 flex-wrap">
                        <span className="text-teal-400 font-medium">{med.categoryLabel}</span>
                        <span>·</span>
                        <span className="truncate max-w-md">{med.mechanismOfAction}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400 hidden md:inline">
                      {isExpanded ? 'Ocultar detalles' : 'Ver ficha clínica'}
                    </span>
                    <button className="p-1 text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4 text-xs animate-in fade-in duration-150">
                    {/* Mechanism & Metabolism */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3">
                      <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-bold text-teal-400 block mb-1">Mecanismo de Acción</span>
                        <p className="text-slate-300 leading-relaxed text-[11px]">{med.mechanismOfAction}</p>
                      </div>

                      <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-bold text-slate-300 block mb-1">Farmacocinética & Metabolismo</span>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                          <strong>Vida Media:</strong> {med.halfLife}<br />
                          <strong>Metabolismo:</strong> {med.metabolism}
                        </p>
                      </div>
                    </div>

                    {/* Approved Indications */}
                    <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-bold text-slate-300 block mb-1.5">Indicaciones Aprobadas (Ficha Técnica)</span>
                      <div className="flex flex-wrap gap-1.5">
                        {med.approvedIndications.map((ind, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-800 text-slate-200 border border-slate-700 rounded text-[11px]"
                          >
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Frequent and Severe Adverse Effects */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-bold text-amber-300 block mb-1.5 flex items-center gap-1.5">
                          <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                          <span>Efectos Adversos Frecuentes</span>
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {med.frequentAdverseEffects.map((ae, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-400">•</span>
                              <span>{ae}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-bold text-rose-300 block mb-1.5 flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                          <span>Efectos Graves y Contraindicaciones</span>
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {med.severeAdverseEffects.map((se, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-rose-400">⚠</span>
                              <span>{se}</span>
                            </li>
                          ))}
                          {med.contraindications.map((ci, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-rose-200">
                              <span className="font-bold">✕ Contraindicado:</span>
                              <span>{ci}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Warnings & Black Box */}
                    {med.warningsAndBlackBox?.length > 0 && (
                      <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-[11px] text-rose-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-rose-400">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Advertencias Críticas de Monitorización</span>
                        </div>
                        {med.warningsAndBlackBox.map((w, i) => (
                          <p key={i}>• {w}</p>
                        ))}
                      </div>
                    )}

                    {/* Psychotherapeutic Considerations (FOCAL POINT FOR THERAPISTS) */}
                    <div className="p-4 bg-gradient-to-r from-teal-950/40 to-slate-950 border border-teal-800/40 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                        <Brain className="w-4 h-4 text-teal-400" />
                        <span>Consideraciones para la Consulta Psicoterapéutica</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed text-xs">
                        {med.psychotherapeuticConsiderations}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
