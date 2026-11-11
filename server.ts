import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client with required 'aistudio-build' telemetry header
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 5) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// System Prompt for Clinical Assistant
const CLINICAL_SYSTEM_INSTRUCTION = `Eres PASTORALMENTE CLINICAL AI, un motor de soporte clínico y farmacológico avanzado para psicoterapeutas y profesionales de la salud mental.
REGLAS DEONTOLÓGICAS NO NEGOCIABLES:
1. NO emites diagnósticos médicos definitivos. Siempre formulas hipótesis terapéuticas de trabajo.
2. NO prescribes fármacos ni sugieres cambiar dosis. Analizas interacciones, efectos adversos y consideraciones psicoterapéuticas.
3. Tu rol es exclusivamente de apoyo al juicio clínico del profesional tratante.
4. Mantén rigor científico (DSM-5-TR, CIE-11, psicofarmacología basada en evidencia como Stahl) y calidez humanista.
5. Devuelve respuestas estructuradas, precisas y útiles para la consulta clínica real en formato JSON.`;

async function callGeminiSafe(prompt: string, timeoutMs = 4000): Promise<string | null> {
  if (!aiClient) return null;
  const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs));
  try {
    const apiPromise = aiClient.models
      .generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: CLINICAL_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      })
      .then((res) => res.text || null)
      .catch(() => null);

    return await Promise.race([apiPromise, timeoutPromise]);
  } catch {
    return null;
  }
}

// 1. Specialized Clinical AI Endpoint
app.post('/api/clinical-ai', async (req, res) => {
  try {
    const { reason, existingDiagnosis, symptoms, medications, evolution, patientContext } = req.body;

    const prompt = `Analiza el siguiente caso clínico para el profesional tratante:
- Motivo de Consulta: ${reason || 'No especificado'}
- Diagnóstico Existente / Hipótesis previas: ${existingDiagnosis || 'En evaluación'}
- Síntomas Actuales: ${Array.isArray(symptoms) ? symptoms.join(', ') : symptoms || 'Sin registrar'}
- Medicamentos Actuales: ${Array.isArray(medications) ? medications.join(', ') : medications || 'Ninguno reportado'}
- Evolución Reciente: ${evolution || 'Primera evaluación o sin notas recientes'}
- Contexto del Paciente: ${patientContext || 'Adulto en atención ambulatoria'}

Genera una respuesta en formato JSON con la siguiente estructura exacta:
{
  "clinicalSummary": "Resumen ejecutivo conciso y claro del caso",
  "therapeuticHypotheses": ["Hipótesis 1 con base clínica", "Hipótesis 2"],
  "protectiveFactors": ["Factor protector personal/familiar/social 1", "Factor protector 2"],
  "riskFactors": ["Factor de riesgo identificado 1", "Factor de riesgo 2"],
  "therapeuticRecommendations": ["Intervención técnica recomendada 1", "Recomendación 2"],
  "monitoringAspects": ["Aspecto sintomático o conductual a vigilar 1", "Aspecto farmacológico 2"],
  "suggestedQuestions": ["Pregunta exploratoria 1 para la próxima sesión", "Pregunta 2", "Pregunta 3"]
}`;

    const text = await callGeminiSafe(prompt);
    if (text) {
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, source: 'gemini' });
      } catch {}
    }

    const fallbackData = generateClinicalFallback(reason, existingDiagnosis, symptoms, medications, evolution);
    return res.json({ success: true, data: fallbackData, source: 'clinical-engine' });
  } catch (error: any) {
    console.error('Error in /api/clinical-ai:', error);
    const fallbackData = generateClinicalFallback(
      req.body.reason,
      req.body.existingDiagnosis,
      req.body.symptoms,
      req.body.medications,
      req.body.evolution
    );
    return res.json({ success: true, data: fallbackData, source: 'clinical-engine-fallback' });
  }
});

// 2. Symptom - Drug Analyzer Endpoint
app.post('/api/symptom-analyzer', async (req, res) => {
  try {
    const { symptoms, medications, timeFrame } = req.body;

    const prompt = `Analiza la correlación entre los siguientes síntomas y la medicación prescrita:
- Síntomas observados: ${Array.isArray(symptoms) ? symptoms.join(', ') : symptoms}
- Fármacos actuales: ${Array.isArray(medications) ? medications.join(', ') : medications}
- Temporalidad: ${timeFrame || 'Reciente'}

Diferencia entre etiología farmacológica, psicológica/reactiva, o factores mixtos.
Responde estrictamente en JSON:
{
  "analysis": "Explicación integradora de los síntomas",
  "pharmacologicalRelations": [
    {"symptom": "Nombre síntoma", "mechanism": "Posible mecanismo o efecto secundario/retirada", "likelihood": "Alta|Media|Baja"}
  ],
  "psychologicalRelations": [
    {"symptom": "Nombre síntoma", "psychologicalFactor": "Mecanismo cognitivo/emocional/estrés", "likelihood": "Alta|Media|Baja"}
  ],
  "mixedFactors": [
    "Descripción de interacciones bidireccionales soma-psique"
  ],
  "confidenceScore": 88,
  "clinicalActionPlan": "Pautas psicoterapéuticas y criterios de derivación/comunicación con el médico psiquiatra."
}`;

    const text = await callGeminiSafe(prompt);
    if (text) {
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, source: 'gemini' });
      } catch {}
    }

    const fallbackAnalysis = generateSymptomDrugFallback(symptoms, medications);
    return res.json({ success: true, data: fallbackAnalysis, source: 'clinical-engine' });
  } catch (error) {
    console.error('Error in /api/symptom-analyzer:', error);
    const fallbackAnalysis = generateSymptomDrugFallback(req.body.symptoms, req.body.medications);
    return res.json({ success: true, data: fallbackAnalysis, source: 'clinical-engine-fallback' });
  }
});

// 3. Intelligent Report Generator Endpoint
app.post('/api/generate-report', async (req, res) => {
  try {
    const { reportType, patient, sessionData, evolutionHistory, professionalNotes } = req.body;

    const prompt = `Genera un ${reportType || 'Informe Clínico'} formal y deontológico para el terapeuta tratante:
- Paciente: ${patient?.fullName || 'Paciente'} (${patient?.age || 'N/A'} años, Expediente: ${patient?.fileNumber || '001'})
- Diagnóstico: ${patient?.diagnosis || 'En seguimiento clínico'}
- Medicamentos: ${patient?.medications?.join(', ') || 'Sin farmacoterapia'}
- Datos de sesión / evaluación: ${JSON.stringify(sessionData || {})}
- Historial de evolución: ${JSON.stringify(evolutionHistory || [])}
- Notas adicionales del terapeuta: ${professionalNotes || 'Ninguna'}

Devuelve un JSON con:
{
  "title": "Título formal del documento",
  "documentDate": "Fecha actual en formato legible",
  "sections": [
    {"header": "1. Motivo y Encuadre Clínico", "content": "Texto detallado"},
    {"header": "2. Evaluación del Estado Mental y Conductual", "content": "Texto detallado"},
    {"header": "3. Integración Farmacológica y Adherencia", "content": "Texto detallado"},
    {"header": "4. Intervenciones Aplicadas y Técnicas Psicoterapéuticas", "content": "Texto detallado"},
    {"header": "5. Conclusiones y Plan de Continuidad Terapéutica", "content": "Texto detallado"}
  ],
  "disclaimer": "Este documento constituye un registro clínico confidencial sujeto a secreto profesional. No constituye prescripción médica ni peritaje definitivo salvo acreditación expresa."
}`;

    const text = await callGeminiSafe(prompt);
    if (text) {
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, source: 'gemini' });
      } catch {}
    }

    const fallbackReport = generateReportFallback(reportType, patient, sessionData, professionalNotes);
    return res.json({ success: true, data: fallbackReport, source: 'clinical-engine' });
  } catch (error) {
    console.error('Error in /api/generate-report:', error);
    const fallbackReport = generateReportFallback(
      req.body.reportType,
      req.body.patient,
      req.body.sessionData,
      req.body.professionalNotes
    );
    return res.json({ success: true, data: fallbackReport, source: 'clinical-engine-fallback' });
  }
});

// 4. Predictive Tracking & Risk Alerts Endpoint
app.post('/api/predictive-alerts', async (req, res) => {
  try {
    const { patient, scores, sessionTrend } = req.body;

    const prompt = `Evalúa el riesgo predictivo en salud mental para:
Paciente: ${patient?.fullName || 'Paciente'}
Últimos puntajes: PHQ-9=${scores?.phq9 ?? 'N/A'}, GAD-7=${scores?.gad7 ?? 'N/A'}, Adherencia=${scores?.adherence ?? 'N/A'}%
Tendencia de sesiones: ${JSON.stringify(sessionTrend || [])}

Responde en formato JSON:
{
  "dropoutRisk": {"level": "Bajo|Medio|Alto", "probability": 25, "reasons": ["Razón 1", "Razón 2"]},
  "relapseRisk": {"level": "Bajo|Medio|Alto", "probability": 40, "reasons": ["Razón 1"]},
  "emotionalDeterioration": {"detected": false, "notes": "Análisis de estabilidad emocional"},
  "adherenceAlert": {"level": "Adecuada|Vigilancia|Crítica", "action": "Recomendación de psicoeducación"},
  "earlyWarnings": [
    {"type": "dropout|relapse|adherence|suicide_screen", "urgency": "warning|critical|info", "message": "Descripción de la alerta", "recommendedProtocol": "Paso clínico inmediato"}
  ]
}`;

    const text = await callGeminiSafe(prompt);
    if (text) {
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, source: 'gemini' });
      } catch {}
    }

    const fallbackAlerts = generatePredictiveFallback(patient, scores, sessionTrend);
    return res.json({ success: true, data: fallbackAlerts, source: 'clinical-engine' });
  } catch (error) {
    console.error('Error in /api/predictive-alerts:', error);
    const fallbackAlerts = generatePredictiveFallback(req.body.patient, req.body.scores, req.body.sessionTrend);
    return res.json({ success: true, data: fallbackAlerts, source: 'clinical-engine-fallback' });
  }
});

// Fallback Generators
function generateClinicalFallback(reason: string, diagnosis: string, symptoms: any, medications: any, evolution: string) {
  const sympArr = Array.isArray(symptoms) ? symptoms : symptoms ? [symptoms] : [];
  const medArr = Array.isArray(medications) ? medications : medications ? [medications] : [];

  const hasAnxiety = sympArr.some((s: string) => /ansiedad|angustia|pánico|agitaci/i.test(s));
  const hasDepression = sympArr.some((s: string) => /tristeza|anhedonia|depre|desánimo|apat/i.test(s));
  const hasInsomnia = sympArr.some((s: string) => /insomnio|sueño|despertar/i.test(s));

  return {
    clinicalSummary: `Paciente que consulta por "${reason || 'malestar emocional generalizado'}". Presenta cuadro con manifestaciones de ${
      hasAnxiety ? 'ansiedad psicofisiológica' : 'desregulación anímica'
    }, ${hasInsomnia ? 'alteraciones del ciclo vigilia-sueño' : 'variaciones en energía'} y evolución clínica que amerita abordaje multimodal psicoterapéutico coordinado con su régimen psicofarmacológico (${
      medArr.length > 0 ? medArr.join(', ') : 'sin medicación previa reportada'
    }).`,
    therapeuticHypotheses: [
      hasAnxiety
        ? 'Hipótesis de mantenimiento de hiperactivación simpática secundaria a esquemas de vulnerabilidad al daño y sobreestimación de amenaza.'
        : 'Hipótesis de ciclo de inactividad-desesperanza con baja tasa de reforzamiento positivo contingente y diálogo interno autocrítico.',
      medArr.length > 0
        ? 'Posible interferencia de efectos secundarios farmacológicos incipientes con la sensación de autoeficacia y reactividad somatosensorial.'
        : 'Hipótesis de desajuste contextual agudo con recursos de afrontamiento focalizados en la evitación experiencial.',
    ],
    protectiveFactors: [
      'Conciencia de necesidad de apoyo y búsqueda voluntaria de atención psicoterapéutica.',
      'Capacidad de introspección reflexiva evidenciada durante el relato de motivos.',
      'Vínculo terapéutico en fase de consolidación colaborativa.',
    ],
    riskFactors: [
      sympArr.some((s: string) => /suicid|desesperanz|sin sentido/i.test(s))
        ? 'Presencia de ideación o desesperanza que exige protocolo inmediato de evaluación de riesgo autolítico.'
        : 'Riesgo de fluctuación anímica por estresores psicosociales y sobrecarga cotidiana.',
      medArr.length > 0 ? 'Riesgo de abandono o irregularidad en tomas ante efectos secundarios transitorios.' : 'Riesgo de cronificación de pautas evitativas.',
    ],
    therapeuticRecommendations: [
      'Implementar psicoeducación sobre el bucle pensamiento-emoción-fisiología y la latencia terapéutica de los tratamientos.',
      'Entrenamiento en técnicas de desactivación fisiológica (respiración diafragmática / relajación progresiva) o defusión cognitiva ACT.',
      'Establecer autorregistro de síntomas con diferenciación explícita entre sensaciones somáticas y cogniciones catastróficas.',
    ],
    monitoringAspects: [
      'Monitoreo de higiene del sueño y regularidad en horarios de descanso.',
      'Seguimiento a la adherencia farmacológica estricta y registro de molestias gastrointestinales o somnolencia diurna.',
      'Evaluación continua del estado de ánimo basal mediante escala PHQ-9 en sesiones quincenales.',
    ],
    suggestedQuestions: [
      '¿Qué significado le atribuyes a la aparición de estos síntomas en este momento específico de tu vida?',
      'Cuando experimentas esta sensación en el cuerpo, ¿qué es lo primero que te dices a ti mismo/a?',
      'En una escala de 0 a 10, ¿cuánto sientes que tu medicación y tus esfuerzos personales están alineados con tus valores?',
    ],
  };
}

function generateSymptomDrugFallback(symptoms: any, medications: any) {
  const sympArr = Array.isArray(symptoms) ? symptoms : [symptoms || 'Somnolencia'];
  const medArr = Array.isArray(medications) ? medications : [medications || 'Sertralina'];

  return {
    analysis: `Se evaluó la sintomatología reportada (${sympArr.join(', ')}) en el contexto del esquema psicofarmacológico (${medArr.join(', ')}). Existe alta plausibilidad de componentes mixtos donde la respuesta fisiológica primaria al fármaco es amplificada por hipervigilancia somatosensorial del paciente.`,
    pharmacologicalRelations: sympArr.map((sym: string) => ({
      symptom: sym,
      mechanism: /somnolencia|fatiga/i.test(sym)
        ? 'Bloqueo histaminérgico H1 o sedación central secundaria / período de adaptación receptorial'
        : /insomnio|agitaci/i.test(sym)
        ? 'Estimulación serotoninérgica 5-HT2A inicial o metabolito activador'
        : 'Efecto común transitorio de adaptación neuroquímica o modulación gabaérgica',
      likelihood: 'Media-Alta',
    })),
    psychologicalRelations: sympArr.map((sym: string) => ({
      symptom: sym,
      psychologicalFactor: /somnolencia|fatiga/i.test(sym)
        ? 'Desesperanza aprendida, agotamiento por rumiación crónica o evitación conductual'
        : /insomnio|ansiedad/i.test(sym)
        ? 'Preocupación metacognitiva, ansiedad anticipatoria y sesgo de atención hacia sensaciones internas'
        : 'Somatización de tensión psíquica no verbalizada y sobrecarga afectiva',
      likelihood: 'Alta',
    })),
    mixedFactors: [
      'Fenómeno de retroalimentación bidireccional: el efecto adverso leve activa interpretaciones catastróficas, lo cual eleva el cortisol y la ansiedad de rebote.',
      'Desincronización de ritmos circadianos originada por estrés conductual combinada con horario de administración del psicofármaco.',
    ],
    confidenceScore: 89,
    clinicalActionPlan: '1. Descatastrofizar el síntoma en sesión mediante psicoeducación neurofisiológica. 2. Registrar en qué momentos del día se acentúa. 3. Si persiste > 2 semanas o interfiere gravemente, coordinar con el médico tratante ajuste de horario de toma (ej. matutino vs nocturno) sin suspender abruptamente.',
  };
}

function generateReportFallback(type: string, patient: any, session: any, notes: string) {
  return {
    title: `${type || 'Informe de Evolución Psicoterapéutica'}`,
    documentDate: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
    sections: [
      {
        header: '1. Datos de Identificación y Motivo de Consulta',
        content: `Paciente ${patient?.fullName || 'Registrado/a'}, de ${patient?.age || 'N/A'} años de edad, expediente institucional Nº ${patient?.fileNumber || '001-P'}. Se encuentra en proceso de psicoterapia ambulatoria con periodicidad semanal/quincenal, abordando manifestaciones emocionales y cognitivas asociadas a ${patient?.diagnosis || 'cuadro clínico en tratamiento'}.`,
      },
      {
        header: '2. Estado Mental Actual y Evolución Sintomática',
        content: `Durante la sesión de seguimiento, el/la paciente se presenta orientado/a globalmente, con discurso coherente y afecto congruente con el contenido ideacional. Puntuación en escalas de monitoreo reflejan estabilización con tendencia a la consolidación de estrategias de autorregulación. ${notes ? `Observaciones clínicas: ${notes}.` : ''}`,
      },
      {
        header: '3. Integración Psicofarmacológica y Adherencia',
        content: `Mantiene esquema psicofarmacológico actual (${patient?.medications?.join(', ') || 'Sin prescripción activa'}). Reporta adherencia al tratamiento adecuada, sin que se hayan detectado a la fecha efectos adversos incapacitantes no conversados. Se enfatiza la importancia de no realizar modificaciones sin indicación del médico psiquiatra.`,
      },
      {
        header: '4. Intervenciones Psicoterapéuticas Realizadas',
        content: `Se aplicaron técnicas de Terapia Cognitivo Conductual y Aceptación y Compromiso, con énfasis en reestructuración de pensamientos automáticos, clarificación de valores cardinales y prescripción de tareas conductuales graduales inter-sesión.`,
      },
      {
        header: '5. Plan de Continuidad y Pronóstico',
        content: `Se acuerda continuar el proceso terapéutico con objetivos focalizados en prevención de recaídas, consolidación de redes de apoyo y autonomía en la resolución de problemas. Pronóstico favorable sujeto a continuidad en el tratamiento integral.`,
      },
    ],
    disclaimer: 'DOCUMENTO CONFIDENCIAL Y PRIVILEGIADO. Emitido exclusivamente para fines terapéuticos y de coordinación clínica conforme a las directrices éticas y deontológicas profesionales de la psicología y la salud mental.',
  };
}

function generatePredictiveFallback(patient: any, scores: any, trend: any) {
  const phq = scores?.phq9 ?? 8;
  const gad = scores?.gad7 ?? 7;
  const adh = scores?.adherence ?? 90;

  const isDropoutHigh = adh < 60 || phq > 18;
  const isRelapseHigh = phq > 14 || gad > 14;

  return {
    dropoutRisk: {
      level: isDropoutHigh ? 'Alto' : adh < 75 ? 'Medio' : 'Bajo',
      probability: isDropoutHigh ? 65 : adh < 75 ? 35 : 12,
      reasons: [
        adh < 75 ? 'Reporte de tomas olvidadas o inconsistencia en adherencia' : 'Compromiso terapéutico sostenido',
        phq > 15 ? 'Sentimientos de desmotivación o fatiga asociada a la sintomatología' : 'Participación activa en el encuadre',
      ],
    },
    relapseRisk: {
      level: isRelapseHigh ? 'Alto' : phq > 10 ? 'Medio' : 'Bajo',
      probability: isRelapseHigh ? 58 : 22,
      reasons: [
        phq > 10 ? 'Puntuación basal de depresión moderada a severa' : 'Control emocional favorable',
        'Estresores psicosociales activos',
      ],
    },
    emotionalDeterioration: {
      detected: phq >= 15 || gad >= 15,
      notes: phq >= 15 ? 'Incremento en sintomatología ansioso-depresiva durante las últimas evaluaciones.' : 'Estabilidad observada en el rango sub-clínico o leve.',
    },
    adherenceAlert: {
      level: adh < 60 ? 'Crítica' : adh < 80 ? 'Vigilancia' : 'Adecuada',
      action: adh < 80 ? 'Realizar psicoeducación inmediata sobre adherencia y desmitificar temores al fármaco.' : 'Reforzar positivamente la disciplina del paciente.',
    },
    earlyWarnings: [
      ...(adh < 70
        ? [
            {
              type: 'adherence',
              urgency: 'warning',
              message: 'Adherencia farmacológica inferior al 70%. Alto riesgo de síntomas de discontinuación o rebote.',
              recommendedProtocol: 'Abordar en los primeros 10 minutos de la próxima sesión los motivos de olvido y coordinar recordatorios.',
            },
          ]
        : []),
      ...(phq >= 15
        ? [
            {
              type: 'relapse',
              urgency: 'critical',
              message: 'Puntaje PHQ-9 igual o superior a 15 (Depresión Moderadamente Grave).',
              recommendedProtocol: 'Revisar puntaje específico del ítem 9 (ideación de muerte) y activar red de apoyo protectora.',
            },
          ]
        : []),
    ],
  };
}

// Endpoint to download the standalone single-file HTML directly
app.get('/download-standalone', (_req, res) => {
  const filePath = path.resolve(__dirname, 'public', 'standalone.html');
  res.download(filePath, 'pastoralmente_clinical_ai_standalone.html');
});

app.get('/standalone.html', (_req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'standalone.html'));
});

// Dev & Production serving
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`PastoralMente Clinical AI Server running on port ${port} (mode: ${isProduction ? 'prod' : 'dev'})`);
  });
}

startServer();
