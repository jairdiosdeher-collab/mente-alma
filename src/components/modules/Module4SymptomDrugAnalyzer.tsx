import React, { useState } from 'react';
import { Patient } from '../../types/clinical';
import { requestSymptomAnalysis, SymptomAnalysisResponse } from '../../services/apiService';
import {
  GitCompare,
  Sparkles,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface Module4SymptomDrugAnalyzerProps {
  selectedPatient: Patient;
}

export const Module4SymptomDrugAnalyzer: React.FC<Module4SymptomDrugAnalyzerProps> = ({
  selectedPatient,
}) => {
  const commonSymptoms = [
    'Somnolencia diurna',
    'Insomnio de conciliación',
    'Fatiga y anergia',
    'Ansiedad de rebote',
    'Agitación e inquietud motriz',
    'Embotamiento afectivo',
    'Cefalea tensional',
    'Temblor distal fino',
    'Baja libido / Anorgasmia',
    'Aumento de apetito',
  ];

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Somnolencia diurna',
    'Ansiedad de rebote',
  ]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [medsInput, setMedsInput] = useState(
    selectedPatient.currentMedications.join(', ') || 'Sertralina 50mg, Clonazepam 0.5mg'
  );
  const [timeFrame, setTimeFrame] = useState('Últimas 2 semanas (inicio reciente)');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomAnalysisResponse | null>(null);

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleAddCustomSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms((prev) => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleRunAnalysis = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    setResult(null);

    const medArr = medsInput.split(',').map((m) => m.trim()).filter(Boolean);

    try {
      const data = await requestSymptomAnalysis(selectedSymptoms, medArr, timeFrame);
      setResult(data);
    } catch (err) {
      console.error('Error running symptom drug analysis', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-400">Módulo 4</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Diagnóstico Diferencial Psicofarmacológico</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5">
            Análisis Síntoma - Medicamento
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Diferenciación científica entre efectos adversos de fármacos, factores reactivos psicológicos y fenómenos mixtos bidireccionales.
          </p>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5">
            {/* Quick Symptom Chips Picker */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Seleccionar Síntomas Observados
              </label>
              <div className="flex flex-wrap gap-1.5">
                {commonSymptoms.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition min-h-[32px] ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-700'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {sym}
                    </button>
                  );
                })}
              </div>

              {/* Add custom symptom input */}
              <form onSubmit={handleAddCustomSymptom} className="mt-2.5 flex items-center gap-1.5">
                <input
                  type="text"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  placeholder="Agregar otro síntoma..."
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 min-h-[36px]"
                >
                  Agregar
                </button>
              </form>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Medicamentos del Paciente
              </label>
              <input
                type="text"
                value={medsInput}
                onChange={(e) => setMedsInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                placeholder="Fármacos actuales (separados por coma)..."
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Temporalidad y Contexto de Aparición
              </label>
              <select
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
              >
                <option value="Inició en los primeros 7 días tras ajuste de dosis">Primeros 7 días tras ajuste de fármaco</option>
                <option value="Últimas 2 a 4 semanas de forma fluctuante">Últimas 2 a 4 semanas de forma fluctuante</option>
                <option value="Aparición súbita tras estresor laboral o familiar">Aparición súbita tras estresor psicosocial</option>
                <option value="Crónico (más de 3 meses)">Crónico (más de 3 meses)</option>
              </select>
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={loading || selectedSymptoms.length === 0}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 font-semibold text-white rounded-lg transition shadow-md shadow-teal-900/20 flex items-center justify-center gap-2 min-h-[44px]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Diferenciando Causas...</span>
                </>
              ) : (
                <>
                  <GitCompare className="w-4 h-4" />
                  <span>Analizar Relación Síntoma-Fármaco</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div className="lg:col-span-7">
          {loading && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[380px] text-center">
              <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mb-3" />
              <h3 className="text-sm font-semibold text-white">Evaluando Farmacodinamia vs Psicopatología...</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Cruzando receptores farmacológicos, períodos de adaptación y patrones somáticos disfuncionales.
              </p>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[380px] text-center">
              <GitCompare className="w-10 h-10 text-slate-600 mb-2" />
              <h3 className="text-sm font-semibold text-slate-300">Selecciona síntomas para el análisis diferencial</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Determina si una queja en consulta es un efecto secundario esperado del psicofármaco, un síntoma de base o una interacción mixta.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              {/* Confidence Score Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Nivel de Confianza del Análisis</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xl font-bold font-mono text-teal-400">{result.confidenceScore}%</span>
                    <span className="text-xs text-slate-300">Concordancia farmacodinámica y clínica</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-teal-400 flex items-center justify-center font-mono font-bold text-xs text-teal-300">
                  {result.confidenceScore}%
                </div>
              </div>

              {/* Analysis Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-xs font-bold text-white block mb-1">Integración Clínica</span>
                <p className="text-xs text-slate-300 leading-relaxed">{result.analysis}</p>
              </div>

              {/* Pharmacological Relations */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-amber-400 block flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Posibles Relaciones Farmacológicas (Efecto Adverso o Adaptación)</span>
                </span>
                <div className="space-y-2">
                  {result.pharmacologicalRelations.map((rel, i) => (
                    <div key={i} className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-white font-semibold">
                        <span>• {rel.symptom}</span>
                        <span className="text-[10px] text-amber-400 font-mono">Probabilidad: {rel.likelihood}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] mt-1">{rel.mechanism}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Psychological Relations */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-teal-400 block flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Posibles Relaciones Psicológicas (Somatización y Reactividad)</span>
                </span>
                <div className="space-y-2">
                  {result.psychologicalRelations.map((rel, i) => (
                    <div key={i} className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-white font-semibold">
                        <span>• {rel.symptom}</span>
                        <span className="text-[10px] text-teal-400 font-mono">Probabilidad: {rel.likelihood}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] mt-1">{rel.psychologicalFactor}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mixed Factors & Action Plan */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-800/40 rounded-xl p-4 space-y-2.5 text-xs">
                <span className="font-bold text-indigo-300 block flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Factores Mixtos & Retroalimentación Bidireccional</span>
                </span>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {result.mixedFactors.map((mf, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold">⇄</span>
                      <span>{mf}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-indigo-900/40 mt-2">
                  <span className="font-bold text-white block mb-1">Plan de Acción Sugerido para el Terapeuta:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{result.clinicalActionPlan}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
