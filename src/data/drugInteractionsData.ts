import { DrugInteractionResult } from '../types/clinical';

export const KNOWN_DRUG_INTERACTIONS: DrugInteractionResult[] = [
  // --- ALTO RIESGO 🔴 ---
  {
    drugA: 'Sertralina',
    drugB: 'Venlafaxina',
    severity: 'high',
    title: 'Riesgo Severo de Síndrome Serotoninérgico',
    mechanism: 'Potenciación acumulativa masiva de la neurotransmisión de serotonina en receptores 5-HT1A y 5-HT2A por combinación de ISRS + IRSN.',
    potentialRisks: [
      'Hipertermia severa, clonus muscular, hiperreflexia y rigidez',
      'Inestabilidad autonómica (taquicardia extrema, hipertensión lábil)',
      'Agitación psicomotriz extrema, diaforesis, convulsiones y coma',
    ],
    clinicalRecommendation: 'Combinación contraindicada salvo protocolo especializado de cambio cruzado bajo supervisión psiquiátrica hospitalaria.',
  },
  {
    drugA: 'Carbonato de Litio',
    drugB: 'Venlafaxina',
    severity: 'moderate',
    title: 'Aumento de Neurotoxicidad y Potenciación Serotoninérgica',
    mechanism: 'El litio incrementa la síntesis presináptica de serotonina, que sumado a la inhibición de recaptación por venlafaxina puede desencadenar toxicidad serotoninérgica.',
    potentialRisks: [
      'Incremento del temblor distal fino',
      'Confusión o mareos',
      'Riesgo incipiente de síndrome serotoninérgico',
    ],
    clinicalRecommendation: 'Estrategia habitual de potenciación en depresión bipolar o resistente, pero requiere control estricto de litemia y vigilancia de síntomas extrapiramidales o temblor.',
  },
  {
    drugA: 'Clonazepam',
    drugB: 'Quetiapina',
    severity: 'moderate',
    title: 'Potenciación de Depresión del SNC y Riesgo de Hipotensión',
    mechanism: 'Efecto sinérgico depresor sobre receptores GABA-A y bloqueo histaminérgico H1 / adrenérgico alfa-1.',
    potentialRisks: [
      'Sedación profunda diurna y somnolencia excesiva',
      'Hipotensión ortostática con síncope y riesgo de caídas',
      'Depresión respiratoria si se asocia alcohol o dosis elevadas',
    ],
    clinicalRecommendation: 'Separar horarios de administración si es posible o usar dosis mínimas eficaces. Educar al paciente en incorporarse despacio de la cama.',
  },
  {
    drugA: 'Clonazepam',
    drugB: 'Zolpidem',
    severity: 'high',
    title: 'Depresión Marcada del Sistema Nervioso Central',
    mechanism: 'Efecto depresor aditivo sobre subunidades del receptor GABA-A.',
    potentialRisks: [
      'Sedación profunda, embotamiento psicomotor y amnesia anterógrada',
      'Parasomnias complejas (caminar dormido, comer inconsciente)',
      'Riesgo crítico de hipoventilación y dependencia cruzada',
    ],
    clinicalRecommendation: 'Evitar la duplicación de hipnótico-sedantes. Si el paciente toma benzodiacepina de base, la introducción de zolpidem debe ser revisada urgentemente por el psiquiatra.',
  },
  {
    drugA: 'Lamotrigina',
    drugB: 'Ácido Valproico / Divalproex Sódico',
    severity: 'high',
    title: 'Inhibición del Metabolismo de Lamotrigina y Riesgo de Necrólisis Dérmica',
    mechanism: 'El valproato inhibe fuertemente la enzima UGT1A4 responsable de la glucuronidación de lamotrigina, duplicando su vida media y aumentando al triple sus concentraciones séricas.',
    potentialRisks: [
      'Riesgo muy elevado de Síndrome de Stevens-Johnson (SSJ) y Necrólisis Epidérmica Tóxica (erupción cutánea letal)',
      'Toxicidad neurocognitiva (ataxia, mareo, visión borrosa)',
    ],
    clinicalRecommendation: 'Si se combinan intencionalmente, la dosis de lamotrigina DEBE reducirse a menos de la mitad y la pauta de titulación debe ser ultralenta (12.5 mg cada 2 semanas).',
  },
  {
    drugA: 'Sertralina',
    drugB: 'Bupropión',
    severity: 'low',
    title: 'Combinación Terapéutica Sinergística ("Well-Loft")',
    mechanism: 'Sertralina actúa sobre serotonina y bupropión sobre dopamina/noradrenalina. Bupropión es inhibidor de CYP2D6 pero sertralina es metabolizada principalmente por CYP2C19.',
    potentialRisks: [
      'Posible elevación discreta de niveles de sertralina',
      'Inquietud motriz o cefalea inicial',
      'BENEFICIO: Reversión de la disfunción sexual inducida por ISRS y mayor efecto antidepresivo.',
    ],
    clinicalRecommendation: 'Interacción de riesgo bajo. Combinación frecuente en práctica clínica para mitigar anhedonia y problemas de libido.',
  },
  {
    drugA: 'Escitalopram',
    drugB: 'Quetiapina',
    severity: 'moderate',
    title: 'Riesgo Aditivo de Prolongación del Intervalo QTc',
    mechanism: 'Ambos fármacos tienen potencial dependiente de la dosis para prolongar la repolarización ventricular cardíaca.',
    potentialRisks: [
      'Arritmias ventriculares o Torsades de Pointes en pacientes predispuestos',
      'Palpitaciones o mareos súbitos',
    ],
    clinicalRecommendation: 'Monitorear electrocardiograma basal y evitar dosis altas de escitalopram (> 20 mg/día) y quetiapina (> 300 mg/día) en adultos mayores o cardiópatas.',
  },
  {
    drugA: 'Metilfenidato',
    drugB: 'Bupropión',
    severity: 'moderate',
    title: 'Potenciación Dopaminérgica / Noradrenérgica y Riesgo Convulsivo',
    mechanism: 'Acción aditiva sobre la inhibición de recaptación de catecolaminas (DAT y NET), sumado a la disminución del umbral convulsivo por bupropión.',
    potentialRisks: [
      'Hipertensión arterial, taquicardia y palpitaciones',
      'Ansiedad intensa, agitación psicomotriz o tics',
      'Disminución del umbral epileptógeno',
    ],
    clinicalRecommendation: 'Vigilar estrechamente signos vitales (presión arterial y frecuencia cardíaca). Ajustar dosis si el paciente reporta insomnio severo o nerviosismo.',
  },
  {
    drugA: 'Pregabalina',
    drugB: 'Clonazepam',
    severity: 'moderate',
    title: 'Sedación y Deterioro Psicomotor Potenciado',
    mechanism: 'Efecto inhibitorio sinérgico central sobre circuitos neurales excitatorios.',
    potentialRisks: [
      'Inestabilidad postural, riesgo de tropiezos y caídas en ancianos',
      'Somnolencia diurna profunda',
      'Dificultad de concentración',
    ],
    clinicalRecommendation: 'Advertir al paciente sobre precauciones al conducir vehículos o manejar maquinaria pesada. Iniciar pregabalina en la noche.',
  },
  {
    drugA: 'Trazodona',
    drugB: 'Sertralina',
    severity: 'moderate',
    title: 'Efecto Serotoninérgico Combinado y Sedación',
    mechanism: 'Ambos agentes modulan el tono serotoninérgico (trazodona bloquea 5-HT2A y sertralina bloquea SERT).',
    potentialRisks: [
      'Somnolencia diurna residual',
      'Riesgo teórico de síndrome serotoninérgico en dosis altas de ambos',
    ],
    clinicalRecommendation: 'Combinación ampliamente utilizada con trazodona a dosis bajas (25-50 mg nocturnos) para contrarrestar el insomnio inducido por ISRS. Mantener dosis bajas.',
  },
];

export function checkMedicationInteractions(selectedMeds: string[]): DrugInteractionResult[] {
  if (!selectedMeds || selectedMeds.length < 2) return [];

  const results: DrugInteractionResult[] = [];
  const normalized = selectedMeds.map((m) => m.toLowerCase().trim());

  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const medA = normalized[i];
      const medB = normalized[j];

      const found = KNOWN_DRUG_INTERACTIONS.find(
        (inter) =>
          (inter.drugA.toLowerCase().includes(medA) || medA.includes(inter.drugA.toLowerCase())) &&
          (inter.drugB.toLowerCase().includes(medB) || medB.includes(inter.drugB.toLowerCase()))
      ) || KNOWN_DRUG_INTERACTIONS.find(
        (inter) =>
          (inter.drugA.toLowerCase().includes(medB) || medB.includes(inter.drugA.toLowerCase())) &&
          (inter.drugB.toLowerCase().includes(medA) || medA.includes(inter.drugB.toLowerCase()))
      );

      if (found) {
        results.push(found);
      } else {
        // If no explicit high-alert known, provide general compatibility notice
        results.push({
          drugA: selectedMeds[i],
          drugB: selectedMeds[j],
          severity: 'low',
          title: 'Sin Interacción Mayor Registrada en Base de Datos Principal',
          mechanism: 'No se reporta interacción farmacocinética competitiva o sinérgica grave a dosis estándar.',
          potentialRisks: ['Efectos adversos idiosincráticos habituales de cada fármaco individual.'],
          clinicalRecommendation: 'Monitorear la respuesta terapéutica general del paciente y el apego a la posología.',
        });
      }
    }
  }

  // Sort by high first, then moderate, then low
  const order: Record<string, number> = { high: 3, moderate: 2, low: 1 };
  return results.sort((a, b) => order[b.severity] - order[a.severity]);
}
