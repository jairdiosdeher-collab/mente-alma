import React, { useState, useEffect } from 'react';
import { Patient } from '../../types/clinical';
import { requestPredictiveAlerts, PredictiveAlertsResponse } from '../../services/apiService';
import {
  AlertTriangle,
  Sparkles,
  TrendingDown,
  UserX,
  ShieldAlert,
  CheckCircle,
  RefreshCw,
  BellRing,
} from 'lucide-react';

interface Module8PredictiveTrackingProps {
  patient: Patient;
}

export const Module8PredictiveTracking: React.FC<Module8PredictiveTrackingProps> = ({
  patient,
}) => {
  const [loading, setLoading] = useState(false);
  const [predictiveData, setPredictiveData] = useState<PredictiveAlertsResponse | null>(null);

  const runPrediction = async () => {
    setLoading(true);
    try {
      const phq = patient.scaleRecords?.find((s) => s.scaleId === 'phq9')?.totalScore ?? 10;
      const gad = patient.scaleRecords?.find((s) => s.scaleId === 'gad7')?.totalScore ?? 8;
      const adh = patient.adherencePercentage ?? 85;

      const data = await requestPredictiveAlerts(
        patient,
        { phq9: phq, gad7: gad, adherence: adh },
        patient.sessions
      );
      setPredictiveData(data);
    } catch (err) {
      console.error('Error running predictive model', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPrediction();
  }, [patient.id]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-400">Módulo 8</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Inteligencia Preventiva en Salud Mental</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5">
            Seguimiento Predictivo & Alertas Tempranas
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detección algorítmica de riesgo de deserción terapéutica, recaídas anímicas agudas y discontinuación farmacológica.
          </p>
        </div>

        <button
          onClick={runPrediction}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-teal-300 border border-slate-700 transition flex items-center gap-1.5 self-start sm:self-auto min-h-[44px]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Recalcular Indicadores</span>
        </button>
      </div>

      {loading && (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mb-3" />
          <h3 className="text-sm font-semibold text-white">Evaluando Patrones de Riesgo Predictivo...</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Examinando tendencias longitudinales en sesiones, fluctuaciones en adherencia y antecedentes de crisis.
          </p>
        </div>
      )}

      {!loading && predictiveData && (
        <div className="space-y-5">
          {/* 4 Predictive Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Abandono Terapéutico (Dropout) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <UserX className="w-4 h-4 text-amber-400" />
                  <span>Riesgo de Abandono</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    predictiveData.dropoutRisk.level === 'Alto'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : predictiveData.dropoutRisk.level === 'Medio'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {predictiveData.dropoutRisk.level}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white">
                  {predictiveData.dropoutRisk.probability}%
                </span>
                <span className="text-[10px] text-slate-400">probabilidad estimada</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                {predictiveData.dropoutRisk.reasons.map((r, i) => (
                  <li key={i} className="truncate">• {r}</li>
                ))}
              </ul>
            </div>

            {/* 2. Riesgo de Recaída */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  <span>Riesgo de Recaída</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    predictiveData.relapseRisk.level === 'Alto'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : predictiveData.relapseRisk.level === 'Medio'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {predictiveData.relapseRisk.level}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white">
                  {predictiveData.relapseRisk.probability}%
                </span>
                <span className="text-[10px] text-slate-400">vulnerabilidad</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                {predictiveData.relapseRisk.reasons.map((r, i) => (
                  <li key={i} className="truncate">• {r}</li>
                ))}
              </ul>
            </div>

            {/* 3. Deterioro Emocional */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-indigo-400" />
                  <span>Deterioro Emocional</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    predictiveData.emotionalDeterioration.detected
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {predictiveData.emotionalDeterioration.detected ? 'Detectado' : 'Estable'}
                </span>
              </div>
              <div className="text-xs text-slate-300 pt-1 leading-relaxed">
                {predictiveData.emotionalDeterioration.notes}
              </div>
            </div>

            {/* 4. Alerta de Adherencia */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <BellRing className="w-4 h-4 text-teal-400" />
                  <span>Alerta Adherencia</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    predictiveData.adherenceAlert.level === 'Crítica'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : predictiveData.adherenceAlert.level === 'Vigilancia'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {predictiveData.adherenceAlert.level}
                </span>
              </div>
              <div className="text-xs text-slate-300 pt-1 leading-relaxed">
                {predictiveData.adherenceAlert.action}
              </div>
            </div>
          </div>

          {/* Early Warnings Protocol List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-teal-400" />
              <span>Alertas Tempranas y Protocolos de Contención Sugeridos</span>
            </h3>

            {predictiveData.earlyWarnings?.length === 0 ? (
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No se registran señales críticas inminentes de descompensación en el paciente en este momento.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {predictiveData.earlyWarnings.map((warn, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      warn.urgency === 'critical'
                        ? 'bg-rose-950/20 border-rose-800/80 text-rose-200'
                        : 'bg-amber-950/20 border-amber-800/80 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Alerta: {warn.message}</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded uppercase tracking-wider bg-slate-950 border border-slate-700">
                        Prioridad {warn.urgency}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-slate-200">
                      <strong className="text-teal-400 block mb-0.5">Protocolo Clínico Inmediato:</strong>
                      {warn.recommendedProtocol}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
