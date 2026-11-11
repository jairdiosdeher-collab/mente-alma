import React, { useState } from 'react';
import { PHARMACOLOGY_DATABASE } from '../../data/pharmacologyData';
import { checkMedicationInteractions } from '../../data/drugInteractionsData';
import { DrugInteractionResult, Patient } from '../../types/clinical';
import {
  Activity,
  Plus,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  AlertOctagon,
  Pill,
} from 'lucide-react';

interface Module5DrugInteractionsProps {
  selectedPatient: Patient;
}

export const Module5DrugInteractions: React.FC<Module5DrugInteractionsProps> = ({
  selectedPatient,
}) => {
  const [selectedMeds, setSelectedMeds] = useState<string[]>(
    selectedPatient.currentMedications.length >= 2
      ? selectedPatient.currentMedications
      : ['Sertralina', 'Venlafaxina', 'Clonazepam']
  );
  const [drugToAdd, setDrugToAdd] = useState('');

  const interactions: DrugInteractionResult[] = checkMedicationInteractions(selectedMeds);

  const handleAddMed = (medName: string) => {
    if (medName && !selectedMeds.includes(medName)) {
      setSelectedMeds([...selectedMeds, medName]);
      setDrugToAdd('');
    }
  };

  const handleRemoveMed = (medName: string) => {
    setSelectedMeds(selectedMeds.filter((m) => m !== medName));
  };

  const handleLoadPatientMeds = () => {
    if (selectedPatient.currentMedications?.length > 0) {
      setSelectedMeds(selectedPatient.currentMedications);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-400">Módulo 5</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Seguridad Farmacológica Cruzada</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5">
            Interacciones Farmacológicas y Efectos Acumulativos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Evaluación cruzada de combinaciones farmacológicas con semáforo de riesgo (🟢 Bajo, 🟡 Moderado, 🔴 Alto).
          </p>
        </div>

        <button
          onClick={handleLoadPatientMeds}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-teal-300 border border-slate-700 transition flex items-center gap-1.5 self-start sm:self-auto min-h-[44px]"
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Cargar Fármacos de {selectedPatient.fullName.split(' ')[0]}</span>
        </button>
      </div>

      {/* Selector & Chips Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Agregar Medicamento al Análisis Cruzado
            </label>
            <div className="flex items-center gap-2">
              <select
                value={drugToAdd}
                onChange={(e) => setDrugToAdd(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
              >
                <option value="">Seleccionar de la base de datos...</option>
                {PHARMACOLOGY_DATABASE.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.categoryLabel})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleAddMed(drugToAdd)}
                disabled={!drugToAdd}
                className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold rounded-lg transition min-h-[40px] flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium self-end sm:self-center">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Bajo</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Moderado</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Alto Riesgo</span>
            </span>
          </div>
        </div>

        {/* Selected Drugs Chips */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Fármacos en Análisis ({selectedMeds.length}):
          </span>
          {selectedMeds.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No hay fármacos seleccionados. Selecciona al menos 2 medicamentos.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedMeds.map((med) => (
                <div
                  key={med}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <Pill className="w-3.5 h-3.5 text-teal-400" />
                  <span className="font-semibold">{med}</span>
                  <button
                    onClick={() => handleRemoveMed(med)}
                    className="p-1 text-slate-400 hover:text-rose-400 rounded transition ml-1"
                    title="Remover fármaco"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interaction Results List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Resultados de Interacciones Cruzadas ({interactions.length})
          </h3>
        </div>

        {selectedMeds.length < 2 ? (
          <div className="p-8 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
            Selecciona al menos 2 medicamentos para generar el cruce de interacciones farmacológicas.
          </div>
        ) : (
          <div className="space-y-3.5">
            {interactions.map((inter, i) => {
              const isHigh = inter.severity === 'high';
              const isMod = inter.severity === 'moderate';

              return (
                <div
                  key={i}
                  className={`bg-slate-900 rounded-2xl p-5 border transition-all ${
                    isHigh
                      ? 'border-rose-700/70 bg-rose-950/15'
                      : isMod
                      ? 'border-amber-700/60 bg-amber-950/10'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Top Header of Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isHigh
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : isMod
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isHigh ? (
                          <AlertOctagon className="w-4 h-4" />
                        ) : isMod ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">
                            {inter.drugA} + {inter.drugB}
                          </span>
                        </div>
                        <h4
                          className={`text-xs font-semibold mt-0.5 ${
                            isHigh ? 'text-rose-300' : isMod ? 'text-amber-300' : 'text-slate-300'
                          }`}
                        >
                          {inter.title}
                        </h4>
                      </div>
                    </div>

                    <div className="self-start sm:self-auto">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isHigh
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : isMod
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {isHigh ? '🔴 Riesgo Alto' : isMod ? '🟡 Riesgo Moderado' : '🟢 Riesgo Bajo'}
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="mt-3.5 space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Mecanismo Farmacológico:</span>
                      <p className="text-slate-200 mt-0.5 leading-relaxed">{inter.mechanism}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block mb-1">Riesgos Potenciales y Acumulativos:</span>
                      <ul className="space-y-1">
                        {inter.potentialRisks.map((r, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-slate-300">
                            <span className={isHigh ? 'text-rose-400' : isMod ? 'text-amber-400' : 'text-emerald-400'}>
                              •
                            </span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 mt-2">
                      <span className="font-bold text-teal-400 block mb-0.5">
                        Recomendación para la Coordinación Terapéutica:
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {inter.clinicalRecommendation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
