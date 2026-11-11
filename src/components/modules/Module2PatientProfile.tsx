import React, { useState } from 'react';
import { Patient, PatientSession, RiskLevel } from '../../types/clinical';
import {
  User,
  Plus,
  Calendar,
  AlertTriangle,
  Pill,
  ClipboardList,
  HeartHandshake,
  FilePlus,
  X,
  Check,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface Module2PatientProfileProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
  onAddSession: (patientId: string, session: Omit<PatientSession, 'id' | 'sessionNumber'>) => void;
  onAddNewPatient: (patient: Omit<Patient, 'id'>) => void;
}

export const Module2PatientProfile: React.FC<Module2PatientProfileProps> = ({
  patient,
  onUpdatePatient,
  onAddSession,
  onAddNewPatient,
}) => {
  // Modal states
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(false);

  // New session form
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState(6);
  const [anxiety, setAnxiety] = useState(5);
  const [sleep, setSleep] = useState(6);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [adherence, setAdherence] = useState(90);
  const [notes, setNotes] = useState('');
  const [interventions, setInterventions] = useState('');
  const [homework, setHomework] = useState('');

  // New patient form
  const [newFullName, setNewFullName] = useState('');
  const [newAge, setNewAge] = useState(30);
  const [newGender, setNewGender] = useState('Femenino');
  const [newFileNumber, setNewFileNumber] = useState(`EXP-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newMeds, setNewMeds] = useState('');
  const [newRisk, setNewRisk] = useState<RiskLevel>('Moderado');
  const [newHistory, setNewHistory] = useState('');
  const [newPastoralAuth, setNewPastoralAuth] = useState(false);

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSession(patient.id, {
      date: sessionDate,
      mood,
      anxiety,
      sleep,
      energy,
      stress,
      adherencePercentage: adherence,
      clinicalNotes: notes,
      interventions: interventions.split(',').map((s) => s.trim()).filter(Boolean),
      homeworkAssigned: homework,
    });
    setShowSessionModal(false);
    setNotes('');
    setInterventions('');
    setHomework('');
  };

  const handleSaveNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newDiagnosis) return;

    onAddNewPatient({
      fullName: newFullName,
      age: Number(newAge),
      gender: newGender,
      fileNumber: newFileNumber,
      admissionDate: new Date().toISOString().split('T')[0],
      emergencyContact: 'Pendiente de registrar',
      primaryDiagnosis: newDiagnosis,
      currentMedications: newMeds.split(',').map((m) => m.trim()).filter(Boolean),
      riskLevel: newRisk,
      therapeuticProgressPercentage: 20,
      adherencePercentage: 85,
      allergies: [],
      personalHistory: newHistory,
      familyHistory: 'Sin antecedentes relevantes declarados.',
      pastoralModeAuthorized: newPastoralAuth,
      sessions: [],
      scaleRecords: [],
      notes: 'Paciente nuevo ingresado a consulta.',
    });

    setShowNewPatientModal(false);
    setNewFullName('');
    setNewDiagnosis('');
    setNewMeds('');
    setNewHistory('');
  };

  const togglePastoral = () => {
    onUpdatePatient({
      ...patient,
      pastoralModeAuthorized: !patient.pastoralModeAuthorized,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-400">Módulo 2</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Expediente Clínico Electrónico</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5">
            Perfil Integral del Paciente
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewPatientModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition flex items-center gap-1.5 min-h-[44px]"
          >
            <Plus className="w-3.5 h-3.5 text-teal-400" />
            <span>Nuevo Paciente</span>
          </button>
          <button
            onClick={() => setShowSessionModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white transition flex items-center gap-1.5 min-h-[44px] shadow-sm shadow-teal-900/30"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Registrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Clinical Bio Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5">
        {/* Name and Indicators */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-white">{patient.fullName}</h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                  {patient.fileNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    patient.riskLevel === 'Alto'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : patient.riskLevel === 'Moderado'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  Riesgo {patient.riskLevel}
                </span>
              </div>
              <p className="text-xs text-teal-300 mt-1 font-medium">{patient.primaryDiagnosis}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span>{patient.age} años · {patient.gender}</span>
                <span>·</span>
                <span>Ingreso: {patient.admissionDate}</span>
                {patient.contactEmail && (
                  <>
                    <span>·</span>
                    <span className="truncate">{patient.contactEmail}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Pastoral Mode Consent Toggle */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Modo Pastoral</span>
                <span className="text-[10px] text-slate-400">Consentimiento informado</span>
              </div>
            </div>
            <button
              onClick={togglePastoral}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                patient.pastoralModeAuthorized ? 'bg-teal-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  patient.pastoralModeAuthorized ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 4 Health Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Estado General</span>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  patient.riskLevel === 'Alto' ? 'bg-rose-500' : 'bg-emerald-400'
                }`}
              />
              <span>{patient.riskLevel === 'Alto' ? 'Vigilancia Activa' : 'Compensado / Estable'}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Respuesta al tratamiento</span>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Nivel de Riesgo Clínico</span>
            <div className="text-sm font-bold font-mono text-amber-400">{patient.riskLevel}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">DSM-5 / CIE-11</span>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Progreso Terapéutico</span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold font-mono text-teal-400">{patient.therapeuticProgressPercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{ width: `${patient.therapeuticProgressPercentage}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Adherencia Farmacológica</span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold font-mono text-emerald-400">{patient.adherencePercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${patient.adherencePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Clinical History & Active Medications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-teal-400" />
              <span>Antecedentes Biográficos y Médicos</span>
            </h3>
            <div>
              <span className="text-slate-400 font-medium block">Historia Personal:</span>
              <p className="text-slate-300 mt-0.5 leading-relaxed">{patient.personalHistory || 'Sin datos registrados.'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Antecedentes Familiares:</span>
              <p className="text-slate-300 mt-0.5 leading-relaxed">{patient.familyHistory || 'Sin antecedentes familiares reportados.'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Contacto de Emergencia:</span>
              <p className="text-slate-300 mt-0.5">{patient.emergencyContact || 'No especificado'}</p>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-400" />
              <span>Farmacoterapia y Alergias</span>
            </h3>
            <div>
              <span className="text-slate-400 font-medium block mb-1.5">Medicamentos en Curso:</span>
              <div className="flex flex-wrap gap-1.5">
                {patient.currentMedications?.length > 0 ? (
                  patient.currentMedications.map((med, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-teal-950/50 text-teal-300 border border-teal-800/60 rounded-lg text-xs"
                    >
                      {med}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">Sin psicofármacos reportados</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-medium block mb-1">Alergias o Reacciones Adversas Previas:</span>
              <div className="flex flex-wrap gap-1.5">
                {patient.allergies?.length > 0 ? (
                  patient.allergies.map((all, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-rose-950/50 text-rose-300 border border-rose-800/60 rounded text-[11px]"
                    >
                      {all}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">Ninguna alergia medicamentosa conocida</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-medium block mb-0.5">Notas del Terapeuta:</span>
              <p className="text-slate-300 italic text-[11px] leading-relaxed">{patient.notes || 'Sin anotaciones privadas.'}</p>
            </div>
          </div>
        </div>

        {/* Sessions Log List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Bitácora Longitudinal de Sesiones ({patient.sessions?.length || 0})</span>
            </h3>
            <button
              onClick={() => setShowSessionModal(true)}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Entrada</span>
            </button>
          </div>

          {patient.sessions?.length === 0 ? (
            <div className="p-6 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
              No hay sesiones registradas en este expediente. Haz clic en "Registrar Sesión" para iniciar el seguimiento.
            </div>
          ) : (
            <div className="space-y-2.5">
              {patient.sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Sesión #{sess.sessionNumber}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400 font-mono text-[11px]">{sess.date}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                      {sess.clinicalNotes}
                    </p>
                    {sess.homeworkAssigned && (
                      <p className="text-teal-300/90 text-[10px]">
                        <strong>Tarea:</strong> {sess.homeworkAssigned}
                      </p>
                    )}
                  </div>

                  {/* Session Metrics Bar */}
                  <div className="flex items-center gap-2 shrink-0 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px]">
                    <div title="Estado de Ánimo (1-10)">
                      <span className="text-slate-400 text-[10px]">Ánimo: </span>
                      <span className="font-mono font-bold text-teal-400">{sess.mood}</span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <div title="Ansiedad (1-10)">
                      <span className="text-slate-400 text-[10px]">Ans: </span>
                      <span className="font-mono font-bold text-amber-400">{sess.anxiety}</span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <div title="Sueño (1-10)">
                      <span className="text-slate-400 text-[10px]">Sueño: </span>
                      <span className="font-mono font-bold text-indigo-400">{sess.sleep}</span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <div title="Adherencia Farmacológica">
                      <span className="text-slate-400 text-[10px]">Adh: </span>
                      <span className="font-mono font-bold text-emerald-400">{sess.adherencePercentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Session */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Registrar Nueva Sesión Clínica</h3>
                <p className="text-[11px] text-slate-400">Paciente: {patient.fullName} ({patient.fileNumber})</p>
              </div>
              <button
                onClick={() => setShowSessionModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fecha de la Sesión</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Adherencia Medicación (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={adherence}
                    onChange={(e) => setAdherence(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sliders for the 5 key metrics */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Calificación de Variables Clínicas (1 - 10)
                </span>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>Estado de Ánimo:</span>
                    <span className="font-mono font-bold text-teal-400">{mood}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={mood}
                    onChange={(e) => setMood(Number(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>Nivel de Ansiedad:</span>
                    <span className="font-mono font-bold text-amber-400">{anxiety}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={anxiety}
                    onChange={(e) => setAnxiety(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>Calidad del Sueño:</span>
                    <span className="font-mono font-bold text-indigo-400">{sleep}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sleep}
                    onChange={(e) => setSleep(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>Nivel de Energía:</span>
                    <span className="font-mono font-bold text-emerald-400">{energy}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energy}
                    onChange={(e) => setEnergy(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>Estrés Percibido:</span>
                    <span className="font-mono font-bold text-rose-400">{stress}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stress}
                    onChange={(e) => setStress(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notas de Evolución Clínica</label>
                <textarea
                  rows={3}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  placeholder="Relato de la sesión, discurso del paciente, avances y dificultades..."
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Intervenciones Aplicadas (comas)</label>
                <input
                  type="text"
                  value={interventions}
                  onChange={(e) => setInterventions(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  placeholder="TCC reestructuración, defusión cognitiva ACT, respiración diafragmática..."
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tarea Terapéutica Asignada</label>
                <input
                  type="text"
                  value={homework}
                  onChange={(e) => setHomework(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  placeholder="Autorregistro de pensamientos o higiene de sueño..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 font-semibold text-white transition min-h-[44px]"
                >
                  Guardar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Patient */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Alta de Nuevo Paciente</h3>
                <p className="text-[11px] text-slate-400">Creación de ficha clínica confidencial</p>
              </div>
              <button
                onClick={() => setShowNewPatientModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPatient} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  placeholder="Ej. Martín Vega Mendoza"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Edad</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Género</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  >
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="No binario">No binario</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nº Expediente</label>
                  <input
                    type="text"
                    required
                    value={newFileNumber}
                    onChange={(e) => setNewFileNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Diagnóstico Primario</label>
                <input
                  type="text"
                  required
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  placeholder="Ej. Trastorno de Pánico (CIE-11: 6B01)"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Medicamentos Actuales (comas)</label>
                <input
                  type="text"
                  value={newMeds}
                  onChange={(e) => setNewMeds(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  placeholder="Ej. Sertralina, Clonazepam (o dejar vacío)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nivel de Riesgo Inicial</label>
                  <select
                    value={newRisk}
                    onChange={(e) => setNewRisk(e.target.value as RiskLevel)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  >
                    <option value="Bajo">Bajo</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Alto">Alto</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="pastoralAuth"
                    checked={newPastoralAuth}
                    onChange={(e) => setNewPastoralAuth(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-400"
                  />
                  <label htmlFor="pastoralAuth" className="text-slate-300 text-xs cursor-pointer">
                    Autoriza Modo Pastoral
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Antecedentes Clínicos Relevantes</label>
                <textarea
                  rows={2}
                  value={newHistory}
                  onChange={(e) => setNewHistory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  placeholder="Motivo de inicio, detonantes recientes o antecedentes médicos..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 font-semibold text-white transition min-h-[44px]"
                >
                  Crear Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
