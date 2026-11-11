import React, { useState } from 'react';
import { Patient } from '../../types/clinical';
import { requestClinicalAI, ClinicalAIResponse } from '../../services/apiService';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Brain,
  Shield,
  AlertTriangle,
  Lightbulb,
  Eye,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

interface Module1ClinicalAIProps {
  selectedPatient: Patient;
  onUpdatePatientNotes?: (patientId: string, notes: string) => void;
}

export const Module1ClinicalAI: React.FC<Module1ClinicalAIProps> = ({
  selectedPatient,
  onUpdatePatientNotes,
}) => {
  const [reason, setReason] = useState(
    'Sensación de opresión en el pecho, insomnio y llanto fácil tras ruptura afectiva.'
  );
  const [existingDiagnosis, setExistingDiagnosis] = useState(selectedPatient.primaryDiagnosis);
  const [symptomsInput, setSymptomsInput] = useState(
    'Insomnio de conciliación, llanto frecuente, palpitaciones esporádicas, rumiación nocturna, anhedonia leve'
  );
  const [medicationsInput, setMedicationsInput] = useState(
    selectedPatient.currentMedications.join(', ') || 'Sertralina 50mg/día'
  );
  const [evolution, setEvolution] = useState(
    'En la cuarta semana de tratamiento. Mejoría en el apetito pero persiste dificultad para conciliar el sueño antes de las 02:00.'
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClinicalAIResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedToNotes, setSavedToNotes] = useState(false);

  // Quick auto-populate from active patient
  const handleLoadFromPatient = () => {
    setExistingDiagnosis(selectedPatient.primaryDiagnosis);
    setMedicationsInput(selectedPatient.currentMedications.join(', '));
    setReason(selectedPatient.personalHistory || 'Consulta de seguimiento clínico');
    setSymptomsInput('Ansiedad somática, fatiga, alteración del patrón de sueño');
    setEvolution(
      selectedPatient.sessions?.length > 0
        ? selectedPatient.sessions[selectedPatient.sessions.length - 1].clinicalNotes
        : 'En seguimiento clínico inicial.'
    );
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const sympArr = symptomsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const medArr = medicationsInput.split(',').map((m) => m.trim()).filter(Boolean);

    try {
      const data = await requestClinicalAI({
        reason,
        existingDiagnosis,
        symptoms: sympArr,
        medications: medArr,
        evolution,
        patientContext: `Paciente: ${selectedPatient.fullName}, ${selectedPatient.age} años.`,
      });
      setResult(data);
    } catch (err) {
      console.error('Error generating clinical AI analysis', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `PASTORALMENTE CLINICAL AI - ANÁLISIS DE CASO
Paciente: ${selectedPatient.fullName}
RESUMEN CLÍNICO:
${result.clinicalSummary}

HIPÓTESIS TERAPÉUTICAS:
${result.therapeuticHypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}

FACTORES PROTECTORES:
${result.protectiveFactors.map((f, i) => `• ${f}`).join('\n')}

FACTORES DE RIESGO:
${result.riskFactors.map((r, i) => `• ${r}`).join('\n')}

RECOMENDACIONES TERAPÉUTICAS:
${result.therapeuticRecommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

ASPECTOS A MONITOREAR:
${result.monitoringAspects.map((m, i) => `• ${m}`).join('\n')}

PREGUNTAS SUGERIDAS PARA LA PRÓXIMA SESIÓN:
${result.suggestedQuestions.map((q, i) => `¿ ${q}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSaveToPatient = () => {
    if (!result || !onUpdatePatientNotes) return;
    const appendText = `\n\n[Análisis IA Clínica - ${new Date().toLocaleDateString()}]:\n${result.clinicalSummary}\nHipótesis: ${result.therapeuticHypotheses.join('; ')}`;
    const currentNotes = selectedPatient.notes || '';
    onUpdatePatientNotes(selectedPatient.id, currentNotes + appendText);
    setSavedToNotes(true);
    setTimeout(() => setSavedToNotes(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-400">Módulo 1</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Motor de Razonamiento Clínico</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5">
            IA Clínica Especializada
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generación automatizada de hipótesis de trabajo, evaluación de riesgos, recomendaciones y preguntas socráticas.
          </p>
        </div>

        <button
          onClick={handleLoadFromPatient}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-teal-300 border border-slate-700 transition flex items-center gap-1.5 self-start sm:self-auto min-h-[44px]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Cargar datos de {selectedPatient.fullName.split(' ')[0]}</span>
        </button>
      </div>

      {/* Main Grid: Form Left, AI Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <form onSubmit={handleRunAnalysis} className="lg:col-span-5 space-y-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Motivo de Consulta y Queja Principal
              </label>
              <textarea
                rows={2}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                placeholder="Describa el motivo expresado por el consultante..."
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Diagnóstico Existente / Sospecha Previa
              </label>
              <input
                type="text"
                value={existingDiagnosis}
                onChange={(e) => setExistingDiagnosis(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                placeholder="Ej. Trastorno Depresivo Mayor (DSM-5) / En evaluación"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Síntomas Actuales (separados por comas)
              </label>
              <input
                type="text"
                required
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                placeholder="Insomnio, anhedonia, taquicardia, rumiación..."
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Medicamentos Prescritos Actuales
              </label>
              <input
                type="text"
                value={medicationsInput}
                onChange={(e) => setMedicationsInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                placeholder="Ej. Sertralina 50mg, Clonazepam 0.5mg..."
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Evolución Reciente y Respuesta a Intervenciones
              </label>
              <textarea
                rows={3}
                value={evolution}
                onChange={(e) => setEvolution(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                placeholder="Respuesta a las tareas para casa, efectos secundarios observados, fluctuaciones..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 font-semibold text-white rounded-lg transition shadow-md shadow-teal-900/20 flex items-center justify-center gap-2 min-h-[44px]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Razonando Caso Clínico...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generar Análisis Clínico Integral</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* AI Results Output Container */}
        <div className="lg:col-span-7">
          {loading && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 animate-pulse mb-3">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">Integrando Psicología y Farmacología...</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Analizando correlación sintomática, factores protectores, riesgos potenciales y formulando preguntas socráticas para la consulta.
              </p>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
              <Brain className="w-10 h-10 text-slate-600 mb-2" />
              <h3 className="text-sm font-semibold text-slate-300">Esperando solicitud de análisis</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Ingresa los datos clínicos a la izquierda o haz clic en "Cargar datos de paciente" para generar la formulación asistida por IA.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              {/* Output Actions Bar */}
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-teal-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-400" />
                  <span>Análisis Clínico Estructurado</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition flex items-center gap-1 min-h-[36px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                  {onUpdatePatientNotes && (
                    <button
                      onClick={handleSaveToPatient}
                      className="px-2.5 py-1 text-xs bg-teal-900/40 hover:bg-teal-900/70 text-teal-300 rounded-lg border border-teal-700/60 transition flex items-center gap-1 min-h-[36px]"
                    >
                      {savedToNotes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCheck className="w-3.5 h-3.5" />}
                      <span>{savedToNotes ? 'Guardado en Ficha' : 'Guardar en Ficha'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 1. Resumen Clínico */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-300 mb-1.5">
                  <Brain className="w-4 h-4 text-teal-400" />
                  <span>Resumen Clínico Ejecutivo</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {result.clinicalSummary}
                </p>
              </div>

              {/* 2. Hipótesis Terapéuticas */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Hipótesis Terapéuticas de Trabajo</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {result.therapeuticHypotheses.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-teal-400 font-bold shrink-0">{i + 1}.</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Factores Protectores y Factores de Riesgo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Factores Protectores</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.protectiveFactors.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 mb-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Factores de Riesgo</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.riskFactors.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400">⚠</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 4. Recomendaciones Terapéuticas */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
                  <Check className="w-4 h-4 text-teal-400" />
                  <span>Recomendaciones Psicoterapéuticas</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {result.therapeuticRecommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Aspectos a Monitorear */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span>Aspectos Clave a Monitorear</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.monitoringAspects.map((asp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-mono">→</span>
                      <span>{asp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 6. Preguntas sugeridas para la próxima sesión */}
              <div className="bg-gradient-to-br from-slate-900 to-teal-950/40 border border-teal-800/40 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-300 mb-2">
                  <HelpCircle className="w-4 h-4 text-teal-400" />
                  <span>Preguntas Socráticas Sugeridas para la Próxima Sesión</span>
                </div>
                <div className="space-y-2 text-xs text-slate-200 italic">
                  {result.suggestedQuestions.map((q, i) => (
                    <div key={i} className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800/80">
                      «{q}»
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
