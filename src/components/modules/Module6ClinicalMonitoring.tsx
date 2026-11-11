import React, { useState } from 'react';
import { Patient, PatientSession } from '../../types/clinical';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Plus,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface Module6ClinicalMonitoringProps {
  patient: Patient;
  onAddSession: (patientId: string, session: Omit<PatientSession, 'id' | 'sessionNumber'>) => void;
}

export const Module6ClinicalMonitoring: React.FC<Module6ClinicalMonitoringProps> = ({
  patient,
  onAddSession,
}) => {
  const sessions = patient.sessions || [];

  // Form for fast logging
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [mood, setMood] = useState(7);
  const [anxiety, setAnxiety] = useState(4);
  const [sleep, setSleep] = useState(7);
  const [energy, setEnergy] = useState(6);
  const [stress, setStress] = useState(4);
  const [adherence, setAdherence] = useState(95);
  const [notes, setNotes] = useState('');

  const handleSaveQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSession(patient.id, {
      date: new Date().toISOString().split('T')[0],
      mood,
      anxiety,
      sleep,
      energy,
      stress,
      adherencePercentage: adherence,
      clinicalNotes: notes || 'Registro rápido de seguimiento clínico.',
      interventions: ['Monitoreo psicofisiológico'],
      homeworkAssigned: 'Continuar registros habituales.',
    });
    setShowQuickLog(false);
    setNotes('');
  };

  // Trend analysis
  const hasEnoughData = sessions.length >= 2;
  const firstSession = sessions[0];
  const lastSession = sessions[sessions.length - 1];

  const moodDelta = hasEnoughData ? lastSession.mood - firstSession.mood : 0;
  const anxietyDelta = hasEnoughData ? lastSession.anxiety - firstSession.anxiety : 0;
  const adherenceDelta = hasEnoughData ? lastSession.adherencePercentage - firstSession.adherencePercentage : 0;

  // Alerts
  const alerts: { title: string; desc: string; type: 'warning' | 'info' | 'positive' }[] = [];
  if (lastSession?.anxiety >= 8) {
    alerts.push({
      title: 'Pico de Ansiedad Detectado (≥ 8/10)',
      desc: 'El paciente reporta elevada hiperactivación somática en la última evaluación. Revisar técnicas de desactivación fisiológica.',
      type: 'warning',
    });
  }
  if (lastSession?.adherencePercentage < 75) {
    alerts.push({
      title: 'Alerta de Baja Adherencia Farmacológica (< 75%)',
      desc: 'Riesgo de síndrome de retirada o falta de eficacia del antidepresivo/estabilizador. Priorizar psicoeducación.',
      type: 'warning',
    });
  }
  if (moodDelta >= 3) {
    alerts.push({
      title: 'Respuesta Positiva Consolidada (+3 puntos de Ánimo)',
      desc: 'Progreso clínico significativo respecto a la línea de base inicial. Reforzar autoeficacia.',
      type: 'positive',
    });
  }

  // SVG Line Chart Generator
  const renderLineChart = (
    dataKey: 'mood' | 'anxiety' | 'sleep' | 'energy' | 'stress',
    title: string,
    colorStroke: string,
    colorFill: string
  ) => {
    if (sessions.length === 0) return null;

    const width = 500;
    const height = 140;
    const padding = 25;

    const points = sessions.map((s, idx) => {
      const x = padding + (idx / Math.max(sessions.length - 1, 1)) * (width - 2 * padding);
      const val = s[dataKey]; // 1-10
      const y = height - padding - ((val - 1) / 9) * (height - 2 * padding);
      return { x, y, val, date: s.date };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white">{title}</span>
          <span className="text-[11px] font-mono text-slate-400">
            Último: <strong className="text-white">{lastSession?.[dataKey] ?? 'N/A'}/10</strong>
          </span>
        </div>

        <div className="relative w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
            {/* Horizontal Grid lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#334155" strokeDasharray="3 3" opacity={0.4} />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#334155" strokeDasharray="3 3" opacity={0.4} />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeDasharray="3 3" opacity={0.4} />

            {/* Area fill */}
            <path
              d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
              fill={colorFill}
              opacity={0.2}
            />

            {/* Line */}
            <path d={pathD} fill="none" stroke={colorStroke} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

            {/* Points */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r={4} fill="#0f172a" stroke={colorStroke} strokeWidth={2} />
                <text x={p.x} y={p.y - 8} textAnchor="middle" fill="#f8fafc" fontSize={9} fontFamily="monospace" fontWeight="bold">
                  {p.val}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
          <span>{sessions[0]?.date}</span>
          <span>{lastSession?.date}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-400">Módulo 6</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Analítica Longitudinal</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5">
            Seguimiento Clínico y Métricas de Evolución
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tendencias psicofisiológicas: Estado de ánimo, ansiedad, sueño, energía, estrés y adherencia a lo largo de las sesiones.
          </p>
        </div>

        <button
          onClick={() => setShowQuickLog(!showQuickLog)}
          className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white transition flex items-center gap-1.5 min-h-[44px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showQuickLog ? 'Cerrar Registro' : 'Registrar Métrica Rápida'}</span>
        </button>
      </div>

      {/* Quick Log Drawer */}
      {showQuickLog && (
        <form onSubmit={handleSaveQuickLog} className="bg-slate-900 border border-teal-500/40 rounded-2xl p-5 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Registrar Mediciones del Día ({new Date().toLocaleDateString()})</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Ánimo (1-10)</span>
              <input
                type="number"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full text-center text-base font-bold font-mono text-teal-400 bg-transparent focus:outline-none"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Ansiedad (1-10)</span>
              <input
                type="number"
                min="1"
                max="10"
                value={anxiety}
                onChange={(e) => setAnxiety(Number(e.target.value))}
                className="w-full text-center text-base font-bold font-mono text-amber-400 bg-transparent focus:outline-none"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Sueño (1-10)</span>
              <input
                type="number"
                min="1"
                max="10"
                value={sleep}
                onChange={(e) => setSleep(Number(e.target.value))}
                className="w-full text-center text-base font-bold font-mono text-indigo-400 bg-transparent focus:outline-none"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Energía (1-10)</span>
              <input
                type="number"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full text-center text-base font-bold font-mono text-emerald-400 bg-transparent focus:outline-none"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Estrés (1-10)</span>
              <input
                type="number"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => setStress(Number(e.target.value))}
                className="w-full text-center text-base font-bold font-mono text-rose-400 bg-transparent focus:outline-none"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Adherencia (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                value={adherence}
                onChange={(e) => setAdherence(Number(e.target.value))}
                className="w-full text-center text-base font-bold font-mono text-teal-300 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Breve nota cualitativa sobre la medición..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowQuickLog(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg"
            >
              Guardar Medición
            </button>
          </div>
        </form>
      )}

      {/* Tendency Indicators Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Tendencia del Ánimo</span>
            <div className="flex items-center gap-1.5 mt-1">
              {moodDelta > 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : moodDelta < 0 ? (
                <TrendingDown className="w-4 h-4 text-rose-400" />
              ) : (
                <Minus className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-sm font-bold text-white">
                {moodDelta > 0 ? `+${moodDelta} Pts (Mejoría)` : moodDelta < 0 ? `${moodDelta} Pts` : 'Estable'}
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono">Línea base: {firstSession?.mood || 'N/A'}</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Tendencia de la Ansiedad</span>
            <div className="flex items-center gap-1.5 mt-1">
              {anxietyDelta < 0 ? (
                <TrendingDown className="w-4 h-4 text-emerald-400" />
              ) : anxietyDelta > 0 ? (
                <TrendingUp className="w-4 h-4 text-rose-400" />
              ) : (
                <Minus className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-sm font-bold text-white">
                {anxietyDelta < 0 ? `${anxietyDelta} Pts (Reducción)` : anxietyDelta > 0 ? `+${anxietyDelta} Pts` : 'Estable'}
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono">Línea base: {firstSession?.anxiety || 'N/A'}</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Adherencia Actual</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm font-bold font-mono text-emerald-400">{lastSession?.adherencePercentage ?? 90}%</span>
              <span className="text-[11px] text-slate-400">tomas cumplidas</span>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono">Delta: {adherenceDelta >= 0 ? `+${adherenceDelta}%` : `${adherenceDelta}%`}</span>
        </div>
      </div>

      {/* Active Clinical Alerts if any */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((al, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                al.type === 'warning'
                  ? 'bg-rose-950/20 border-rose-800/60 text-rose-200'
                  : 'bg-teal-950/20 border-teal-800/60 text-teal-200'
              }`}
            >
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${al.type === 'warning' ? 'text-rose-400' : 'text-teal-400'}`} />
              <div>
                <h4 className="font-bold text-white">{al.title}</h4>
                <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">{al.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      {sessions.length === 0 ? (
        <div className="p-10 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
          No hay suficientes sesiones para graficar curvas de evolución. Utiliza el botón "Registrar Métrica Rápida" arriba.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderLineChart('mood', 'Estado de Ánimo (Escala 1 - 10)', '#2dd4bf', '#0d9488')}
          {renderLineChart('anxiety', 'Nivel de Ansiedad (Escala 1 - 10)', '#f59e0b', '#b45309')}
          {renderLineChart('sleep', 'Calidad del Sueño (Escala 1 - 10)', '#818cf8', '#4338ca')}
          {renderLineChart('energy', 'Nivel de Energía y Vitalidad', '#10b981', '#059669')}
        </div>
      )}
    </div>
  );
};
