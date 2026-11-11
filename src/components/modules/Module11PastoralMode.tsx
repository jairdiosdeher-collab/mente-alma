import React, { useState } from 'react';
import { Patient, SpiritualJournalEntry } from '../../types/clinical';
import { PASTORAL_RESOURCES } from '../../data/pastoralData';
import {
  HeartHandshake,
  BookOpen,
  Sparkles,
  Check,
  Plus,
  ShieldCheck,
  Lock,
  Sun,
  Flame,
  Feather,
} from 'lucide-react';

interface Module11PastoralModeProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
}

export const Module11PastoralMode: React.FC<Module11PastoralModeProps> = ({
  patient,
  onUpdatePatient,
}) => {
  const [activeTab, setActiveTab] = useState<'devocionales' | 'gratitud' | 'metas' | 'pautas'>('devocionales');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');

  // Gratitude entry form
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [spiritualReflection, setSpiritualReflection] = useState('');
  const [virtueGoal, setVirtueGoal] = useState('Paciencia y mansedumbre ante la adversidad');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Stored entries in localStorage
  const storageKey = `pastoral_journal_${patient.id}`;
  const [journalEntries, setJournalEntries] = useState<SpiritualJournalEntry[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleToggleConsent = () => {
    onUpdatePatient({
      ...patient,
      pastoralModeAuthorized: !patient.pastoralModeAuthorized,
    });
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitude1 && !spiritualReflection) return;

    const newEntry: SpiritualJournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
      patientId: patient.id,
      gratitudePoints: [gratitude1, gratitude2, gratitude3].filter(Boolean),
      reflectionText: spiritualReflection,
      personalVirtueGoal: virtueGoal,
    };

    const updated = [newEntry, ...journalEntries];
    setJournalEntries(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    setGratitude1('');
    setGratitude2('');
    setGratitude3('');
    setSpiritualReflection('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const filteredResources = PASTORAL_RESOURCES.filter(
    (res) => selectedTheme === 'all' || res.theme === selectedTheme
  );

  // If patient has not authorized pastoral mode
  if (!patient.pastoralModeAuthorized) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 text-center py-12">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-400">
            <span>Módulo 11 (Opcional)</span>
            <span>·</span>
            <span>Acceso Restringido por Consentimiento</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Consentimiento Pastoral Requerido
          </h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            Por estrictas normas éticas y de respeto a la libertad de conciencia, los recursos espirituales y devocionales se mantienen <strong>completamente independientes</strong> de la psicoterapia clínica y solo se habilitan previa solicitud expresa del consultante.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl max-w-md mx-auto text-left text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-white font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Condiciones de Activación:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            1. El paciente manifiesta libremente su fe o inclinación espiritual.<br />
            2. Se respeta la distinción entre tratamiento médico/psicológico y apoyo pastoral.<br />
            3. No se sustituyen intervenciones clínicas por prácticas religiosas.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={handleToggleConsent}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white transition shadow-sm min-h-[44px]"
          >
            Habilitar Modo Pastoral con Consentimiento de {patient.fullName.split(' ')[0]}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-400">Módulo 11 (Optativo)</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Cuidado Integral de la Persona</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5">
            Acompañamiento Pastoral & Recursos Espirituales
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Espacio de reflexión, gratitud y devocionales basado en la fe, mantenido de forma estrictamente separada del diagnóstico clínico.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-teal-400 bg-teal-950/40 border border-teal-800/60 px-2.5 py-1 rounded-lg">
            Consentimiento activo
          </span>
          <button
            onClick={handleToggleConsent}
            className="text-xs text-slate-400 hover:text-rose-400 transition underline ml-2"
          >
            Desactivar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('devocionales')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'devocionales'
              ? 'bg-amber-950/50 border border-amber-600/50 text-amber-300 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Devocionales & Reflexiones
        </button>
        <button
          onClick={() => setActiveTab('gratitud')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'gratitud'
              ? 'bg-amber-950/50 border border-amber-600/50 text-amber-300 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Registro de Gratitud Diaria ({journalEntries.length})
        </button>
        <button
          onClick={() => setActiveTab('pautas')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'pautas'
              ? 'bg-amber-950/50 border border-amber-600/50 text-amber-300 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Pautas Éticas para Consejería
        </button>
      </div>

      {/* Tab 1: Devocionales */}
      {activeTab === 'devocionales' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedTheme('all')}
              className={`px-3 py-1 rounded-lg text-xs transition ${
                selectedTheme === 'all'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Todos los Temas
            </button>
            <button
              onClick={() => setSelectedTheme('ansiedad_paz')}
              className={`px-3 py-1 rounded-lg text-xs transition ${
                selectedTheme === 'ansiedad_paz'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Ansiedad & Paz
            </button>
            <button
              onClick={() => setSelectedTheme('duelo_esperanza')}
              className={`px-3 py-1 rounded-lg text-xs transition ${
                selectedTheme === 'duelo_esperanza'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Duelo & Quebranto
            </button>
            <button
              onClick={() => setSelectedTheme('perdon_gracia')}
              className={`px-3 py-1 rounded-lg text-xs transition ${
                selectedTheme === 'perdon_gracia'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Perdón & Gracia
            </button>
            <button
              onClick={() => setSelectedTheme('proposito_fuerza')}
              className={`px-3 py-1 rounded-lg text-xs transition ${
                selectedTheme === 'proposito_fuerza'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Propósito & Fuerzas
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 hover:border-amber-700/50 transition-all"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
                    {res.themeLabel}
                  </span>
                  <h3 className="text-sm font-bold text-white">{res.title}</h3>
                </div>

                {/* Scripture Quote */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-amber-900/30 space-y-1">
                  <span className="font-mono text-[11px] font-bold text-amber-300 block">
                    {res.scriptureReference}
                  </span>
                  <p className="text-xs text-slate-200 italic leading-relaxed">
                    {res.scriptureText}
                  </p>
                </div>

                {/* Pastoral Reflection */}
                <div className="text-xs text-slate-300 leading-relaxed space-y-1">
                  <span className="font-bold text-white text-[11px] block">Reflexión Pastoral:</span>
                  <p>{res.reflection}</p>
                </div>

                {/* Guided Prayer */}
                <div className="p-3 bg-gradient-to-r from-amber-950/20 to-slate-950 rounded-xl border border-amber-800/30 text-xs text-amber-200/90 leading-relaxed italic">
                  <span className="font-bold text-amber-300 text-[10px] uppercase not-italic block mb-0.5">
                    Oración / Contemplación Guiada:
                  </span>
                  «{res.guidedPrayerOrContemplation}»
                </div>

                {/* Practical Action */}
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-200">Acción Práctica:</strong> {res.practicalAction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Gratitud Diaria & Registro */}
      {activeTab === 'gratitud' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* New Entry Form */}
          <form onSubmit={handleSaveJournal} className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Nuevo Registro de Gratitud & Crecimiento</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Anotar 3 bendiciones cotidianas entrena la mente en el reconocimiento de la gracia.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-slate-300 font-semibold block text-[11px]">3 Motivos de Gratitud a Dios hoy:</span>
              <input
                type="text"
                required
                value={gratitude1}
                onChange={(e) => setGratitude1(e.target.value)}
                placeholder="1. Por ejemplo: La compañía de mi familia esta mañana..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
              <input
                type="text"
                value={gratitude2}
                onChange={(e) => setGratitude2(e.target.value)}
                placeholder="2. Por la paz que sentí en la caminata..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
              <input
                type="text"
                value={gratitude3}
                onChange={(e) => setGratitude3(e.target.value)}
                placeholder="3. Por un momento de descanso reconfortante..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Reflexión Espiritual Personal o Petición
              </label>
              <textarea
                rows={3}
                value={spiritualReflection}
                onChange={(e) => setSpiritualReflection(e.target.value)}
                placeholder="¿Qué ha hablado Dios a tu corazón hoy en medio de tus desafíos?..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Meta Personal de Virtud para la Semana
              </label>
              <input
                type="text"
                value={virtueGoal}
                onChange={(e) => setVirtueGoal(e.target.value)}
                placeholder="Ej. Practicar la paciencia, perdonar una ofensa, ser generoso..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 font-semibold text-white rounded-xl transition flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Entrada Registrada</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Guardar en Diario Espiritual</span>
                </>
              )}
            </button>
          </form>

          {/* Historical Entries */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Historial de Registros Espirituales ({journalEntries.length})
            </h3>

            {journalEntries.length === 0 ? (
              <div className="p-8 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                Aún no hay entradas de gratitud registradas para este paciente. Completa el formulario de la izquierda.
              </div>
            ) : (
              <div className="space-y-3">
                {journalEntries.map((entry) => (
                  <div key={entry.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                      <span className="font-mono text-[11px] text-amber-400">{entry.date}</span>
                      <span className="text-[10px] text-slate-500">Privado</span>
                    </div>

                    {entry.gratitudePoints?.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-semibold text-white text-[11px]">Motivos de Gratitud:</span>
                        <ul className="space-y-0.5 text-slate-300 text-[11px]">
                          {entry.gratitudePoints.map((gp, i) => (
                            <li key={i}>• {gp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {entry.reflectionText && (
                      <div className="pt-1">
                        <span className="font-semibold text-white text-[11px]">Reflexión:</span>
                        <p className="text-slate-300 text-[11px] italic mt-0.5 leading-relaxed">{entry.reflectionText}</p>
                      </div>
                    )}

                    {entry.personalVirtueGoal && (
                      <div className="pt-1 text-[10px] text-teal-400">
                        <strong>Meta de virtud:</strong> {entry.personalVirtueGoal}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Pautas Éticas */}
      {activeTab === 'pautas' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs text-slate-300 leading-relaxed max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Guía Deontológica para la Integración Pastoral y Psicológica</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <strong className="text-white block mb-0.5">1. No Espiritualizar el Síntoma Médico ni la Enfermedad Mental</strong>
              <p className="text-[11px] text-slate-400">
                Una depresión mayor, un trastorno bipolar o un ataque de pánico tienen bases neuroquímicas y psicofisiológicas reales. Nunca se debe culpar al paciente diciéndole que su sufrimiento se debe a "falta de fe", "pecado oculto" o "debilidad espiritual".
              </p>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <strong className="text-white block mb-0.5">2. Respeto Inquebrantable a la Prescripción Psiquiátrica</strong>
              <p className="text-[11px] text-slate-400">
                La consejería pastoral debe respaldar activamente la adherencia farmacológica. Los medicamentos psiquiátricos son una bendición de la ciencia médica que Dios utiliza para restablecer el equilibrio biológico. Nunca aconsejar abandonar la medicación.
              </p>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <strong className="text-white block mb-0.5">3. Enfoque en la Gracia frente a la Culpa Tóxica</strong>
              <p className="text-[11px] text-slate-400">
                Muchos pacientes creyentes sufren de perfeccionismo religioso o escrupulosidad. La intervención pastoral debe orientarse al amor incondicional, la compasión, la reconciliación y el descanso del alma, no al aumento de exigencias inalcanzables.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
