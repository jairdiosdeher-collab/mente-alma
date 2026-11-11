export interface ScaleQuestion {
  id: string;
  text: string;
  options: { label: string; value: number }[];
}

export interface ScaleDefinition {
  id: 'phq9' | 'gad7' | 'sleep' | 'adherence';
  name: string;
  acronym: string;
  authorAndReference: string;
  instructions: string;
  questions: ScaleQuestion[];
  interpretScore: (score: number, answers?: Record<string, number>) => {
    severity: string;
    description: string;
    actionRequired: string;
    color: 'emerald' | 'amber' | 'rose' | 'blue';
    suicideAlert?: boolean;
  };
}

export const CLINICAL_SCALES: Record<string, ScaleDefinition> = {
  phq9: {
    id: 'phq9',
    name: 'Cuestionario de Salud del Paciente (Depresión)',
    acronym: 'PHQ-9',
    authorAndReference: 'Kroenke, Spitzer & Williams (2001). Validación para cribado y severidad depresiva.',
    instructions: 'Durante las últimas 2 semanas, ¿con qué frecuencia le han molestado los siguientes problemas?',
    questions: [
      {
        id: 'q1',
        text: '1. Poco interés o placer en hacer las cosas (anhedonia)',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'q2',
        text: '2. Sentirse desanimado/a, deprimido/a o sin esperanzas',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'q3',
        text: '3. Dificultad para conciliar el sueño, despertares o dormir demasiado',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'q4',
        text: '4. Sentirse cansado/a o con poca energía',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'q5',
        text: '5. Poco apetito o comer en exceso',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'q6',
        text: '6. Sentirse mal consigo mismo/a o que ha defraudado a su familia',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'q7',
        text: '7. Dificultad para concentrarse en leer o ver televisión',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'q8',
        text: '8. Enlentecimiento psicomotor notable o inquietud/agitación',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'q9',
        text: '9. Pensamientos de que estaría mejor muerto/a o de lastimarse a sí mismo/a de alguna manera',
        options: [
          { label: 'Para nada (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
    ],
    interpretScore: (score: number, answers?: Record<string, number>) => {
      const suicideRiskFlag = answers ? (answers['q9'] || 0) > 0 : false;

      if (score <= 4) {
        return {
          severity: 'Mínima o Ausente',
          description: 'Puntuación dentro de límites normales. Ausencia de sintomatología depresiva clínicamente significativa.',
          actionRequired: 'Mantener seguimiento habitual preventivo.',
          color: 'emerald',
          suicideAlert: suicideRiskFlag,
        };
      } else if (score <= 9) {
        return {
          severity: 'Depresión Leve',
          description: 'Presencia de síntomas aislados que generan malestar moderado pero mantienen funcionalidad básica.',
          actionRequired: 'Psicoeducación, higiene de sueño y técnicas de resolución de problemas.',
          color: 'blue',
          suicideAlert: suicideRiskFlag,
        };
      } else if (score <= 14) {
        return {
          severity: 'Depresión Moderada',
          description: 'Sintomatología con afectación en áreas laborales, sociales o afectivas cotidianas.',
          actionRequired: 'Intervención activa con TCC / Activación Conductual. Valorar evaluación psiquiátrica si no hay mejoría en 4-6 semanas.',
          color: 'amber',
          suicideAlert: suicideRiskFlag,
        };
      } else if (score <= 19) {
        return {
          severity: 'Depresión Moderadamente Grave',
          description: 'Compromiso funcional evidente. Alta angustia psicológica, anergia y desmotivación.',
          actionRequired: 'Psicoterapia intensiva + Interconsulta psiquiátrica urgente para valoración farmacoterapéutica.',
          color: 'rose',
          suicideAlert: suicideRiskFlag,
        };
      } else {
        return {
          severity: 'Depresión Grave / Severa',
          description: 'Cuadro clínico crítico. Alto riesgo de descompensación mayor.',
          actionRequired: 'Protocolo clínico integral inmediato. Red de apoyo familiar activada y supervisión estrecha.',
          color: 'rose',
          suicideAlert: suicideRiskFlag,
        };
      }
    },
  },

  gad7: {
    id: 'gad7',
    name: 'Escala del Trastorno de Ansiedad Generalizada',
    acronym: 'GAD-7',
    authorAndReference: 'Spitzer et al. (2006). Medida autoadministrada de cribado de severidad para TAG.',
    instructions: 'Durante las últimas 2 semanas, ¿con qué frecuencia le han molestado los siguientes problemas?',
    questions: [
      {
        id: 'g1',
        text: '1. Sentirse nervioso/a, intranquilo/a o con los nervios de punta',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'g2',
        text: '2. No poder parar o controlar las preocupaciones',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'g3',
        text: '3. Preocuparse demasiado por diferentes cosas',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'g4',
        text: '4. Dificultad para relajarse',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'g5',
        text: '5. Estar tan inquieto/a que le resulta difícil quedarse quieto/a',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'g6',
        text: '6. Sentirse fácilmente irritado/a o enojado/a',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
      {
        id: 'g7',
        text: '7. Sentir miedo como si algo terrible fuera a suceder',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Varios días (1)', value: 1 },
          { label: 'Más de la mitad de los días (2)', value: 2 },
          { label: 'Casi todos los días (3)', value: 3 },
        ],
      },
    ],
    interpretScore: (score: number) => {
      if (score <= 4) {
        return {
          severity: 'Ansiedad Mínima',
          description: 'Nivel normal adaptativo de respuesta al estrés ambiental.',
          actionRequired: 'Reforzar hábitos saludables de manejo de estrés.',
          color: 'emerald',
        };
      } else if (score <= 9) {
        return {
          severity: 'Ansiedad Leve',
          description: 'Tensión emocional y preocupaciones moderadas sin deterioro severo.',
          actionRequired: 'Técnicas de respiración diafragmática y psicoeducación sobre el bucle cognitivo de la preocupación.',
          color: 'blue',
        };
      } else if (score <= 14) {
        return {
          severity: 'Ansiedad Moderada',
          description: 'Punto de corte clínicamente significativo para Trastorno de Ansiedad Generalizada.',
          actionRequired: 'TCC formal: reestructuración de intolerancia a la incertidumbre y desensibilización.',
          color: 'amber',
        };
      } else {
        return {
          severity: 'Ansiedad Severa',
          description: 'Hiperactivación autonómica intensa, rumiación continua y fatiga secundaria grave.',
          actionRequired: 'Protocolo de estabilización rápida psicoterapéutica y consulta de psicofarmacología.',
          color: 'rose',
        };
      }
    },
  },

  sleep: {
    id: 'sleep',
    name: 'Índice de Severidad del Insomnio y Calidad de Sueño',
    acronym: 'ISI / PSQI Adaptado',
    authorAndReference: 'Bastien, Vallières & Morin (2001). Criterios clínicos de evaluación del sueño.',
    instructions: 'Evalúe la naturaleza y severidad de su descanso nocturno durante el último mes:',
    questions: [
      {
        id: 's1',
        text: '1. Dificultad para conciliar el sueño (dormirse al acostarse)',
        options: [
          { label: 'Ninguna (0)', value: 0 },
          { label: 'Leve (1)', value: 1 },
          { label: 'Moderada (2)', value: 2 },
          { label: 'Severa (3)', value: 3 },
          { label: 'Muy severa (4)', value: 4 },
        ],
      },
      {
        id: 's2',
        text: '2. Dificultad para mantener el sueño (despertares frecuentes)',
        options: [
          { label: 'Ninguna (0)', value: 0 },
          { label: 'Leve (1)', value: 1 },
          { label: 'Moderada (2)', value: 2 },
          { label: 'Severa (3)', value: 3 },
          { label: 'Muy severa (4)', value: 4 },
        ],
      },
      {
        id: 's3',
        text: '3. Problemas de despertar demasiado temprano por la mañana',
        options: [
          { label: 'Ninguno (0)', value: 0 },
          { label: 'Leve (1)', value: 1 },
          { label: 'Moderado (2)', value: 2 },
          { label: 'Severo (3)', value: 3 },
          { label: 'Muy severo (4)', value: 4 },
        ],
      },
      {
        id: 's4',
        text: '4. ¿Qué tan satisfecho/a o insatisfecho/a está con su patrón actual de sueño?',
        options: [
          { label: 'Muy satisfecho (0)', value: 0 },
          { label: 'Satisfecho (1)', value: 1 },
          { label: 'Indiferente (2)', value: 2 },
          { label: 'Insatisfecho (3)', value: 3 },
          { label: 'Muy insatisfecho (4)', value: 4 },
        ],
      },
      {
        id: 's5',
        text: '5. ¿En qué medida considera que su problema de sueño interfiere en su funcionamiento diario?',
        options: [
          { label: 'Para nada (0)', value: 0 },
          { label: 'Un poco (1)', value: 1 },
          { label: 'Algo (2)', value: 2 },
          { label: 'Mucho (3)', value: 3 },
          { label: 'Extremadamente (4)', value: 4 },
        ],
      },
    ],
    interpretScore: (score: number) => {
      if (score <= 7) {
        return {
          severity: 'Sin Insomnio Clínico',
          description: 'Higiene del sueño preservada y descanso reparador.',
          actionRequired: 'Mantener hábitos regulares de desconexión nocturna.',
          color: 'emerald',
        };
      } else if (score <= 14) {
        return {
          severity: 'Insomnio Subclínico / Leve',
          description: 'Dificultades intermitentes en la conciliación o despertar temprano.',
          actionRequired: 'Aplicar reglas de higiene del sueño (control de pantallas, horarios fijos de despertar).',
          color: 'blue',
        };
      } else if (score <= 21) {
        return {
          severity: 'Insomnio Clínico Moderado',
          description: 'Afectación directa en la energía diurna, irritabilidad y cognición.',
          actionRequired: 'TCC para el Insomnio (TCC-I): control de estímulos y restricción del tiempo en cama.',
          color: 'amber',
        };
      } else {
        return {
          severity: 'Insomnio Clínico Severo',
          description: 'Deterioro marcado de la arquitectura del sueño con fatiga crónica e hiperalerta nocturna.',
          actionRequired: 'Abordaje urgente multidisciplinar para evitar complicaciones neuropsiquiátricas.',
          color: 'rose',
        };
      }
    },
  },

  adherence: {
    id: 'adherence',
    name: 'Escala de Adherencia Terapéutica y Farmacológica',
    acronym: 'Morisky-Green Adaptada',
    authorAndReference: 'Morisky, Green & Levine (1986). Cuestionario validado de adherencia al tratamiento.',
    instructions: 'Responda con total sinceridad sobre la forma en que toma su medicación prescrita:',
    questions: [
      {
        id: 'a1',
        text: '1. ¿Se olvida alguna vez de tomar sus medicamentos prescritos?',
        options: [
          { label: 'No (0 puntos)', value: 0 },
          { label: 'Sí (1 punto)', value: 1 },
        ],
      },
      {
        id: 'a2',
        text: '2. ¿Toma los medicamentos a las horas indicadas por el profesional?',
        options: [
          { label: 'Sí (0 puntos)', value: 0 },
          { label: 'No (1 punto)', value: 1 },
        ],
      },
      {
        id: 'a3',
        text: '3. Cuando se encuentra bien, ¿deja alguna vez de tomar su medicación?',
        options: [
          { label: 'No (0 puntos)', value: 0 },
          { label: 'Sí (1 punto)', value: 1 },
        ],
      },
      {
        id: 'a4',
        text: '4. Si alguna vez se siente mal o tiene un efecto molesto, ¿deja de tomarla sin avisar?',
        options: [
          { label: 'No (0 puntos)', value: 0 },
          { label: 'Sí (1 punto)', value: 1 },
        ],
      },
    ],
    interpretScore: (score: number) => {
      if (score === 0) {
        return {
          severity: 'Adherencia Óptima / Alta',
          description: 'El paciente cumple rigurosamente con la posología y comprende la importancia del tratamiento continuo.',
          actionRequired: 'Reforzar positivamente la constancia en sesión.',
          color: 'emerald',
        };
      } else if (score === 1 || score === 2) {
        return {
          severity: 'Adherencia Media / Irregular',
          description: 'Existen olvidos ocasionales o modificación voluntaria de horarios.',
          actionRequired: 'Indagar barreras prácticas (alarmas, pastilleros, rutinas de vida) y creencias sobre el fármaco.',
          color: 'amber',
        };
      } else {
        return {
          severity: 'Adherencia Baja / Crítica',
          description: 'Abandono frecuente o suspensión unilateral de la pauta médica.',
          actionRequired: 'Alerta clínica inmediata: riesgo de síndrome de discontinuación, recaída aguda y desconfianza.',
          color: 'rose',
        };
      }
    },
  },
};
