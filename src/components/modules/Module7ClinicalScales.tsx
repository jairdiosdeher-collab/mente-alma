import React, { useState } from 'react';
import { CLINICAL_SCALES, ScaleDefinition } from '../../data/scalesData';
import { Patient, ScaleRecord } from '../../types/clinical';
import {
  ClipboardList,
  CheckCircle2,
  AlertOctagon,
  Clock,
  RotateCcw,
  Plus,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface Module7ClinicalScalesProps {
  patient: Patient;
  onSaveScaleRecord: (patientId: string, record: Omit<ScaleRecord, 'id'>) => void;
}

export const Module7ClinicalScales: React.FC<Module7ClinicalScalesProps> = ({
  patient,
  onSaveScaleRecord,
}) => {
  const [selectedScaleId, setSelectedScaleId] = useState<'phq9' | 'gad7' | 'sleep' | 'adherence'>('phq9');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submittedResult, setSubmittedResult] = useState<{
    score: number;
    severity: string;
    description: string;
    actionRequired: string;
    color: string;
    suicideAlert?: boolean;
  } | null>(null);

  const activeScale: ScaleDefinition = CLINICAL_SCALES[selectedScaleId];

  // Past evaluations for the selected scale
  const history = (patient.scaleRecords || []).filter((r) => r.scaleId === selectedScaleId);

  const handleSelectOption = (qId: string, val: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleCalculateScore = (e: React.FormEvent) => {
    e.preventDefault();
    const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0);
    const interp = activeScale.interpretScore(totalScore, answers);
    setSubmittedResult({ score: totalScore, ...interp });

    // Save to patient file
    onSaveScaleRecord(patient.id, {
      scaleId: selectedScaleId,
      scaleName: activeScale.acronym,
      date: new Date().toISOString().split('T')[0],
      totalScore,
      maxScore: activeScale.questions.length * (selectedScaleId === 'adherence' ? 1 : selectedScaleId === 'sleep' ? 4 : 3),
      severity: interp.severity,
      interpretation: interp.description,
      itemAnswers: answers,
      suicideRiskFlag: interp.suicideAlert,
    });
  };

  const handleResetTest = () => {
    setAnswers({});
    setSubmittedResult(null);
  };

  const allQuestionsAnswered = activeScale.questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-400">Módulo 7</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Psicometría Clínica Estandarizada</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5">
            Escalas Clínicas Validadas (PHQ-9, GAD-7, Sueño, Adherencia)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Administración autoinformada con cálculo automático de severidad, alertas de riesgo y registro cronológico.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          <span>Paciente: {patient.fullName}</span>
        </div>
      </div>

      {/* Scale Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {(Object.keys(CLINICAL_SCALES) as (keyof typeof CLINICAL_SCALES)[]).map((key) => {
          const sc = CLINICAL_SCALES[key];
          const isSelected = selectedScaleId === key;
          return (
            <button
              key={key}
              onClick={() => {
                setSelectedScaleId(key as any);
                handleResetTest();
              }}
              className={`p-3 rounded-xl border text-left transition min-h-[50px] ${
                isSelected
                  ? 'bg-teal-950/40 border-teal-500/60 text-white shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <div className="text-xs font-bold truncate">{sc.acronym}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{sc.name.split('(')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Test Runner & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Questionnaire */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">{activeScale.name}</h3>
              <p className="text-[11px] text-slate-400 italic mt-0.5">{activeScale.instructions}</p>
              <span className="text-[10px] text-teal-400 block mt-1 font-mono">{activeScale.authorAndReference}</span>
            </div>

            <form onSubmit={handleCalculateScore} className="space-y-4">
              {activeScale.questions.map((q) => {
                const currentVal = answers[q.id];
                const isItem9 = q.id === 'q9';

                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border transition ${
                      isItem9
                        ? 'bg-rose-950/15 border-rose-800/40'
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <div className="text-xs font-medium text-slate-200 mb-2 flex items-start gap-1.5">
                      {isItem9 && <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                      <span>{q.text}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {q.options.map((opt) => {
                        const isChosen = currentVal === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelectOption(q.id, opt.value)}
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition text-center min-h-[36px] ${
                              isChosen
                                ? 'bg-teal-600 text-white font-bold shadow-sm'
                                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetTest}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>

                <button
                  type="submit"
                  disabled={!allQuestionsAnswered}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 font-semibold text-xs text-white rounded-xl transition shadow-md shadow-teal-900/20 flex items-center gap-1.5 min-h-[44px]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Calcular Puntaje y Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results & Historical Evolution */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Result Card */}
          {submittedResult ? (
            <div className="bg-slate-900 border border-teal-500/50 rounded-2xl p-5 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400">Resultado Obtenido</span>
                  <div className="text-2xl font-bold font-mono text-white mt-0.5">
                    {submittedResult.score} <span className="text-xs text-slate-400 font-normal">puntos</span>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    submittedResult.color === 'rose'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : submittedResult.color === 'amber'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {submittedResult.severity}
                </div>
              </div>

              {submittedResult.suicideAlert && (
                <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-start gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-rose-300 block">Alerta de Seguridad (Ítem 9 Positivo):</strong>
                    El paciente puntuó &gt; 0 en pensamientos de muerte o autolesión. Requiere evaluación inmediata del riesgo suicida (intención, plan, letalidad, red de apoyo).
                  </div>
                </div>
              )}

              <div className="text-xs space-y-2">
                <div>
                  <span className="font-bold text-slate-300 block mb-0.5">Interpretación Clínica:</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{submittedResult.description}</p>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-teal-400 block mb-0.5">Conducta Terapéutica Sugerida:</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{submittedResult.actionRequired}</p>
                </div>
              </div>

              <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Puntaje guardado automáticamente en el expediente del paciente.</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
              Responde las preguntas del cuestionario y haz clic en "Calcular Puntaje" para obtener la interpretación diagnóstica estandarizada.
            </div>
          )}

          {/* Historical Evolution for this scale */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Historial de {activeScale.acronym} ({history.length})</span>
              </h3>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No hay registros previos de esta escala en el expediente.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {history.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>Puntaje: {rec.totalScore}/{rec.maxScore}</span>
                        <span className="text-[10px] text-teal-400 font-mono">({rec.severity})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">{rec.date}</span>
                    </div>

                    {rec.suicideRiskFlag && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold shrink-0">
                        Ítem 9 ⚠
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
