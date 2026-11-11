import React, { useState, useRef } from 'react';
import { useClinicalStorage } from './hooks/useClinicalStorage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { EthicalBanner } from './components/common/EthicalBanner';
import { TherapistProfileModal } from './components/modals/TherapistProfileModal';

// Modules
import { ModuleOverview } from './components/modules/ModuleOverview';
import { Module1ClinicalAI } from './components/modules/Module1ClinicalAI';
import { Module2PatientProfile } from './components/modules/Module2PatientProfile';
import { Module3Pharmacology } from './components/modules/Module3Pharmacology';
import { Module4SymptomDrugAnalyzer } from './components/modules/Module4SymptomDrugAnalyzer';
import { Module5DrugInteractions } from './components/modules/Module5DrugInteractions';
import { Module6ClinicalMonitoring } from './components/modules/Module6ClinicalMonitoring';
import { Module7ClinicalScales } from './components/modules/Module7ClinicalScales';
import { Module8PredictiveTracking } from './components/modules/Module8PredictiveTracking';
import { Module9ReportGenerator } from './components/modules/Module9ReportGenerator';
import { Module10PsychotherapyLibrary } from './components/modules/Module10PsychotherapyLibrary';
import { Module11PastoralMode } from './components/modules/Module11PastoralMode';

export default function App() {
  const {
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
  } = useClinicalStorage();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTherapistModalOpen, setIsTherapistModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importDataJSON(file);
      e.target.value = '';
    }
  };

  const handleUpdatePatientNotes = (patientId: string, notes: string) => {
    if (selectedPatient.id === patientId) {
      updatePatient({ ...selectedPatient, notes });
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col`}>
      {/* Hidden file input for importing clinical backup */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Mandatory Ethical & Deontological Disclaimer Banner */}
      <EthicalBanner />

      {/* Top Navigation Bar conforming to Top Bar Contract */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        patients={patients}
        selectedPatient={selectedPatient}
        onSelectPatientId={setSelectedPatientId}
        therapistProfile={therapistProfile}
        onOpenTherapistModal={() => setIsTherapistModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      {/* App Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          selectedPatient={selectedPatient}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onExportJSON={exportDataJSON}
          onImportClick={() => fileInputRef.current?.click()}
          onResetData={resetToSampleData}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 pb-24 lg:pb-8">
          {activeModule === 'overview' && (
            <ModuleOverview
              patients={patients}
              selectedPatient={selectedPatient}
              onSelectPatientId={setSelectedPatientId}
              setActiveModule={setActiveModule}
            />
          )}

          {activeModule === 'module1_clinical_ai' && (
            <Module1ClinicalAI
              selectedPatient={selectedPatient}
              onUpdatePatientNotes={handleUpdatePatientNotes}
            />
          )}

          {activeModule === 'module2_patients' && (
            <Module2PatientProfile
              patient={selectedPatient}
              onUpdatePatient={updatePatient}
              onAddSession={addSessionToPatient}
              onAddNewPatient={addPatient}
            />
          )}

          {activeModule === 'module3_pharmacology' && <Module3Pharmacology />}

          {activeModule === 'module4_symptom_drug' && (
            <Module4SymptomDrugAnalyzer selectedPatient={selectedPatient} />
          )}

          {activeModule === 'module5_interactions' && (
            <Module5DrugInteractions selectedPatient={selectedPatient} />
          )}

          {activeModule === 'module6_monitoring' && (
            <Module6ClinicalMonitoring
              patient={selectedPatient}
              onAddSession={addSessionToPatient}
            />
          )}

          {activeModule === 'module7_scales' && (
            <Module7ClinicalScales
              patient={selectedPatient}
              onSaveScaleRecord={addScaleRecordToPatient}
            />
          )}

          {activeModule === 'module8_predictive' && (
            <Module8PredictiveTracking patient={selectedPatient} />
          )}

          {activeModule === 'module9_reports' && (
            <Module9ReportGenerator
              patient={selectedPatient}
              therapistProfile={therapistProfile}
            />
          )}

          {activeModule === 'module10_library' && <Module10PsychotherapyLibrary />}

          {activeModule === 'module11_pastoral' && (
            <Module11PastoralMode
              patient={selectedPatient}
              onUpdatePatient={updatePatient}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Thumb Navigation */}
      <MobileBottomNav
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
      />

      {/* Therapist Profile Credential Modal */}
      <TherapistProfileModal
        isOpen={isTherapistModalOpen}
        onClose={() => setIsTherapistModalOpen(false)}
        profile={therapistProfile}
        onSaveProfile={setTherapistProfile}
      />
    </div>
  );
}
