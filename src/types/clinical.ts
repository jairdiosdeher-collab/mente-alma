export type DrugCategory =
  | 'antidepressant'
  | 'anxiolytic'
  | 'antipsychotic'
  | 'mood_stabilizer'
  | 'hypnotic'
  | 'stimulant'
  | 'anticonvulsant';

export interface Medication {
  id: string;
  name: string;
  brandNames: string[];
  category: DrugCategory;
  categoryLabel: string;
  mechanismOfAction: string;
  approvedIndications: string[];
  offLabelIndications?: string[];
  frequentAdverseEffects: string[];
  severeAdverseEffects: string[];
  contraindications: string[];
  warningsAndBlackBox: string[];
  psychotherapeuticConsiderations: string;
  halfLife: string;
  metabolism: string;
}

export type RiskLevel = 'Bajo' | 'Moderado' | 'Alto' | 'Crítico';

export interface PatientSession {
  id: string;
  sessionNumber: number;
  date: string;
  mood: number; // 1-10
  anxiety: number; // 1-10
  sleep: number; // 1-10
  energy: number; // 1-10
  stress: number; // 1-10
  adherencePercentage: number; // 0-100
  clinicalNotes: string;
  interventions: string[];
  homeworkAssigned: string;
}

export interface ScaleRecord {
  id: string;
  scaleId: 'phq9' | 'gad7' | 'sleep' | 'adherence';
  scaleName: string;
  date: string;
  totalScore: number;
  maxScore: number;
  severity: string;
  interpretation: string;
  itemAnswers: Record<string, number>;
  suicideRiskFlag?: boolean;
}

export interface Patient {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  fileNumber: string;
  admissionDate: string;
  contactEmail?: string;
  contactPhone?: string;
  emergencyContact: string;
  primaryDiagnosis: string;
  secondaryDiagnosis?: string;
  icd11Code?: string;
  currentMedications: string[]; // names of medications
  riskLevel: RiskLevel;
  therapeuticProgressPercentage: number;
  adherencePercentage: number;
  allergies: string[];
  personalHistory: string;
  familyHistory: string;
  pastoralModeAuthorized: boolean;
  sessions: PatientSession[];
  scaleRecords: ScaleRecord[];
  notes: string;
}

export interface DrugInteractionResult {
  drugA: string;
  drugB: string;
  severity: 'low' | 'moderate' | 'high';
  title: string;
  mechanism: string;
  potentialRisks: string[];
  clinicalRecommendation: string;
}

export interface PsychotherapyTechnique {
  id: string;
  modality: 'TCC' | 'ACT' | 'Esquemas' | 'Entrevista Motivacional' | 'Psicología Positiva';
  title: string;
  summary: string;
  objective: string;
  stepByStepProcedure: string[];
  recommendedCases: string[];
  contraindicatedCases?: string[];
  clinicalExampleDialogue: {
    therapist: string;
    patient: string;
    therapeuticIntent: string;
  }[];
}

export interface PastoralResource {
  id: string;
  theme: 'ansiedad_paz' | 'duelo_esperanza' | 'perdon_gracia' | 'proposito_fuerza' | 'gratitud_contentamiento';
  themeLabel: string;
  title: string;
  scriptureReference: string;
  scriptureText: string;
  reflection: string;
  guidedPrayerOrContemplation: string;
  practicalAction: string;
}

export interface SpiritualJournalEntry {
  id: string;
  date: string;
  patientId: string;
  gratitudePoints: string[];
  reflectionText: string;
  personalVirtueGoal: string;
}

export interface TherapistProfile {
  name: string;
  title: string;
  licenseNumber: string; // Cédula profesional / Colegiado
  specialty: string;
  clinicName: string;
  clinicAddress: string;
  email: string;
  signatureText: string;
}
