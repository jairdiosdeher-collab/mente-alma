import React, { useState } from 'react';
import { Patient, TherapistProfile } from '../../types/clinical';
import { requestReportGeneration, ReportGenerationResponse } from '../../services/apiService';
import {
  FileText,
  Printer,
  Sparkles,
  RefreshCw,
  Download,
  Check,
  Building,
  User,
  ShieldCheck,
  Calendar,
  Save,
  Clock,
} from 'lucide-react';

interface Module9ReportGeneratorProps {
  patient: Patient;
  therapistProfile: TherapistProfile;
}

interface SavedReport {
  id: string;
  reportType: string;
  date: string;
  patientName: string;
  report: ReportGenerationResponse;
}

export const Module9ReportGenerator: React.FC<Module9ReportGeneratorProps> = ({
  patient,
  therapistProfile,
}) => {
  const [reportType, setReportType] = useState('Nota de Evolución Clínica (SOAP)');
  const [professionalNotes, setProfessionalNotes] = useState(
    'Paciente asiste con adecuada disposición al trabajo introspectivo. Buena respuesta a las técnicas de defusión cognitiva y avance notable en regulación emocional.'
  );
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportGenerationResponse | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReport[]>(() => {
    try {
      const stored = localStorage.getItem('pastoralmente_saved_reports_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [savedNotice, setSavedNotice] = useState(false);

  const reportTypes = [
    'Nota de Evolución Clínica (SOAP)',
    'Informe Psicológico Integral',
    'Resumen Ejecutivo de Sesión',
    'Informe de Seguimiento y Continuidad Terapéutica',
  ];

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const lastSession = patient.sessions?.[patient.sessions.length - 1];
      const data = await requestReportGeneration(
        reportType,
        patient,
        lastSession,
        patient.sessions,
        professionalNotes
      );
      setReport(data);
    } catch (err) {
      console.error('Error generating report', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintOrExportPDF = () => {
    window.print();
  };

  const handleSaveToHistory = () => {
    if (!report) return;
    const item: SavedReport = {
      id: `rep-${Date.now()}`,
      reportType,
      date: new Date().toLocaleDateString(),
      patientName: patient.fullName,
      report,
    };
    const updated = [item, ...savedReports];
    setSavedReports(updated);
    try {
      localStorage.setItem('pastoralmente_saved_reports_v1', JSON.stringify(updated));
    } catch {}
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleLoadSavedReport = (item: SavedReport) => {
    setReport(item.report);
    setReportType(item.reportType);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header - No Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-400">Módulo 9</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Documentación Clínica Formal</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5">
            Generador Inteligente de Informes y Notas SOAP
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Redacción automatizada con inteligencia artificial asistida, formato imprimible para interconsultas y exportación PDF.
          </p>
        </div>

        {report && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleSaveToHistory}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 rounded-lg transition flex items-center gap-1.5 min-h-[44px]"
            >
              {savedNotice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedNotice ? 'Guardado en Historial' : 'Guardar en Historial'}</span>
            </button>
            <button
              onClick={handlePrintOrExportPDF}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white rounded-lg transition shadow-sm flex items-center gap-1.5 min-h-[44px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Exportar PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Control Panel Form - No Print */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 no-print text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Tipo de Documento a Generar
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
            >
              {reportTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Paciente Asignado al Informe
            </label>
            <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 flex items-center justify-between">
              <span className="font-semibold text-white">{patient.fullName}</span>
              <span className="text-[11px] text-teal-400 font-mono">{patient.fileNumber}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Observaciones Adicionales del Terapeuta Tratante
          </label>
          <textarea
            rows={2}
            value={professionalNotes}
            onChange={(e) => setProfessionalNotes(e.target.value)}
            placeholder="Añade notas puntuales para enriquecer el informe..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-teal-400 focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition shadow-md shadow-teal-900/20 flex items-center gap-2 min-h-[44px]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generando Documento Clínico...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Redactar Documento Clínico</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Printable Report Document Surface */}
      {report && (
        <div className="bg-white text-slate-900 rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-xl space-y-6 print:border-none print:shadow-none print:p-0">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-950 uppercase">
                {therapistProfile.clinicName}
              </h1>
              <p className="text-xs text-slate-700 mt-0.5 font-medium">{therapistProfile.specialty}</p>
              <div className="text-[11px] text-slate-600 space-y-0.5 mt-1">
                <p>{therapistProfile.clinicAddress}</p>
                <p>Colegiatura / Cédula: <strong>{therapistProfile.licenseNumber}</strong> · Correo: {therapistProfile.email}</p>
              </div>
            </div>

            <div className="text-right sm:self-start">
              <span className="text-[11px] text-slate-600 font-mono block">FECHA DE EMISIÓN:</span>
              <span className="text-xs font-bold text-slate-950 font-mono">{report.documentDate}</span>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center py-2">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 uppercase underline decoration-teal-600 underline-offset-4">
              {report.title}
            </h2>
          </div>

          {/* Patient Header Block */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-600 text-[10px] block font-semibold">PACIENTE:</span>
              <span className="font-bold text-slate-900">{patient.fullName}</span>
            </div>
            <div>
              <span className="text-slate-600 text-[10px] block font-semibold">EXPEDIENTE Nº:</span>
              <span className="font-mono font-bold text-slate-900">{patient.fileNumber}</span>
            </div>
            <div>
              <span className="text-slate-600 text-[10px] block font-semibold">EDAD / GÉNERO:</span>
              <span className="text-slate-900">{patient.age} años ({patient.gender})</span>
            </div>
            <div>
              <span className="text-slate-600 text-[10px] block font-semibold">DIAGNÓSTICO:</span>
              <span className="font-medium text-slate-900">{patient.primaryDiagnosis}</span>
            </div>
          </div>

          {/* Report Sections */}
          <div className="space-y-5 text-xs text-slate-800 leading-relaxed">
            {report.sections.map((sec, i) => (
              <div key={i} className="space-y-1">
                <h3 className="font-bold text-slate-950 uppercase tracking-wide text-[11px] border-b border-slate-200 pb-1">
                  {sec.header}
                </h3>
                <p className="text-slate-800 pt-1 text-justify">{sec.content}</p>
              </div>
            ))}
          </div>

          {/* Professional Signature Block */}
          <div className="pt-8 mt-6 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-[10px] text-slate-500 max-w-md italic">
              {report.disclaimer}
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div className="w-48 border-b border-slate-800 mx-auto sm:ml-auto mb-1.5" />
              <p className="font-bold text-xs text-slate-950">{therapistProfile.name}</p>
              <p className="text-[11px] text-slate-700">{therapistProfile.title}</p>
              <p className="text-[10px] font-mono text-slate-600">{therapistProfile.licenseNumber}</p>
            </div>
          </div>
        </div>
      )}

      {/* Saved Reports History - No Print */}
      {savedReports.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 no-print">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>Historial de Informes Emitidos Guardados ({savedReports.length})</span>
          </h3>

          <div className="space-y-2 text-xs">
            {savedReports.map((saved) => (
              <div
                key={saved.id}
                className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
              >
                <div>
                  <span className="font-bold text-white block">{saved.reportType}</span>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Paciente: {saved.patientName}</span>
                    <span>·</span>
                    <span className="font-mono text-[10px]">{saved.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleLoadSavedReport(saved)}
                  className="px-3 py-1.5 text-xs text-teal-400 hover:text-teal-300 font-semibold bg-slate-900 border border-slate-700 rounded-lg transition"
                >
                  Ver / Imprimir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
