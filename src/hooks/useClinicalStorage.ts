import { useState, useEffect } from 'react';
import { Patient, TherapistProfile, ScaleRecord, PatientSession } from '../types/clinical';
import { INITIAL_PATIENTS } from '../data/initialPatients';

const PATIENTS_STORAGE_KEY = 'pastoralmente_patients_v1';
const THERAPIST_STORAGE_KEY = 'pastoralmente_therapist_v1';
const THEME_STORAGE_KEY = 'pastoralmente_theme_v1';

export const DEFAULT_THERAPIST_PROFILE: TherapistProfile = {
  name: 'Dra. Sofía Alarcón Valenzuela',
  title: 'Psicóloga Clínica & Psicoterapeuta',
  licenseNumber: 'COL-PSI-28491 / SSA-9982',
  specialty: 'Terapia Cognitivo-Conductual y Psicofarmacología Clínica',
  clinicName: 'Centro de Salud Mental y Bienestar PastoralMente',
  clinicAddress: 'Paseo de la Castellana 140, Madrid / Consulta Telemática',
  email: 'dra.alarcon@pastoralmente.clinic',
  signatureText: 'Dra. Sofía Alarcón V. — Psicoterapeuta Colegiada',
};

export type ActiveModule =
  | 'overview'
  | 'module1_clinical_ai'
  | 'module2_patients'
  | 'module3_pharmacology'
  | 'module4_symptom_drug'
  | 'module5_interactions'
  | 'module6_monitoring'
  | 'module7_scales'
  | 'module8_predictive'
  | 'module9_reports'
  | 'module10_library'
  | 'module11_pastoral';

export function useClinicalStorage() {
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const stored = localStorage.getItem(PATIENTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading patients from localStorage', e);
    }
    return INITIAL_PATIENTS;
  });

  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    return patients[0]?.id || 'p-001';
  });

  const [therapistProfile, setTherapistProfile] = useState<TherapistProfile>(() => {
    try {
      const stored = localStorage.getItem(THERAPIST_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading therapist from localStorage', e);
    }
    return DEFAULT_THERAPIST_PROFILE;
  });

  const [activeModule, setActiveModule] = useState<ActiveModule>('overview');

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored !== null) return stored === 'true';
    } catch {}
    return true; // Default dark mode for elegant clinical UI
  });

  // Persist patients
  useEffect(() => {
    try {
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
    } catch (e) {
      console.error('Error persisting patients', e);
    }
  }, [patients]);

  // Persist therapist profile
  useEffect(() => {
    try {
      localStorage.setItem(THERAPIST_STORAGE_KEY, JSON.stringify(therapistProfile));
    } catch (e) {
      console.error('Error persisting therapist', e);
    }
  }, [therapistProfile]);

  // Persist theme
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, String(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  }, [isDarkMode]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const updatePatient = (updated: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const addPatient = (newPatient: Omit<Patient, 'id'>) => {
    const id = `p-${Date.now()}`;
    const fullPatient: Patient = {
      ...newPatient,
      id,
    };
    setPatients((prev) => [fullPatient, ...prev]);
    setSelectedPatientId(id);
    return id;
  };

  const deletePatient = (id: string) => {
    if (patients.length <= 1) return;
    const remaining = patients.filter((p) => p.id !== id);
    setPatients(remaining);
    setSelectedPatientId(remaining[0].id);
  };

  const addSessionToPatient = (patientId: string, session: Omit<PatientSession, 'id' | 'sessionNumber'>) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const sessionNumber = (p.sessions?.length || 0) + 1;
        const newSession: PatientSession = {
          ...session,
          id: `s-${Date.now()}`,
          sessionNumber,
        };
        const updatedSessions = [...(p.sessions || []), newSession];

        // Recalculate average adherence and progress
        const latestAdherence = session.adherencePercentage;
        return {
          ...p,
          sessions: updatedSessions,
          adherencePercentage: latestAdherence,
        };
      })
    );
  };

  const addScaleRecordToPatient = (patientId: string, record: Omit<ScaleRecord, 'id'>) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const newRecord: ScaleRecord = {
          ...record,
          id: `sc-${Date.now()}`,
        };
        const updatedRecords = [newRecord, ...(p.scaleRecords || [])];
        return {
          ...p,
          scaleRecords: updatedRecords,
        };
      })
    );
  };

  const resetToSampleData = () => {
    setPatients(INITIAL_PATIENTS);
    setSelectedPatientId(INITIAL_PATIENTS[0].id);
    setTherapistProfile(DEFAULT_THERAPIST_PROFILE);
    localStorage.removeItem(PATIENTS_STORAGE_KEY);
    localStorage.removeItem(THERAPIST_STORAGE_KEY);
  };

  const exportDataJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      patients,
      therapistProfile,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PastoralMente_Clinical_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.patients && Array.isArray(parsed.patients)) {
          setPatients(parsed.patients);
          if (parsed.patients[0]?.id) setSelectedPatientId(parsed.patients[0].id);
        }
        if (parsed.therapistProfile) {
          setTherapistProfile(parsed.therapistProfile);
        }
      } catch (err) {
        console.error('Invalid backup file', err);
      }
    };
    reader.readAsText(file);
  };

  return {
    patients,
    selectedPatient,
    selectedPatientId,
    setSelectedPatientId,
    updatePatient,
    addPatient,
    deletePatient,
    addSessionToPatient,
    addScaleRecordToPatient,
    therapistProfile,
    setTherapistProfile,
    activeModule,
    setActiveModule,
    isDarkMode,
    setIsDarkMode,
    resetToSampleData,
    exportDataJSON,
    importDataJSON,
  };
}
