import React, { useState, useRef } from 'react';
import { usePortal } from '../context/PortalContext';
import { SchoolInfo, GradingScale } from '../types';
import {
  Settings,
  Building2,
  Sliders,
  Database,
  Save,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Award,
  AlertTriangle,
} from 'lucide-react';

export const SettingsPortal: React.FC = () => {
  const {
    schoolInfo,
    updateSchoolInfo,
    gradingScales,
    updateGradingScale,
    resetToSeedData,
    clearAllData,
    exportDatabaseJSON,
    importDatabaseJSON,
  } = usePortal();

  // Local state for School Info form
  const [formData, setFormData] = useState<SchoolInfo>(schoolInfo);
  const [localScales, setLocalScales] = useState<GradingScale[]>(gradingScales);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveSchoolInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolInfo(formData);
    setSuccessNotice('School profile information saved successfully!');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleScaleChange = (id: string, field: 'minPercent' | 'grade' | 'remark', val: any) => {
    setLocalScales(prev =>
      prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            [field]: field === 'minPercent' ? Number(val) || 0 : val,
          };
        }
        return s;
      })
    );
  };

  const handleSaveScales = () => {
    updateGradingScale(localScales);
    setSuccessNotice('Grading scale benchmark criteria updated!');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const text = evt.target?.result as string;
      const success = importDatabaseJSON(text);
      if (success) {
        setSuccessNotice('Portal database imported successfully!');
        setImportError(null);
        setTimeout(() => setSuccessNotice(null), 3000);
      } else {
        setImportError('Invalid JSON backup file. Please check file structure.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System Configuration</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Institution Profile & Assessment Rules
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customise school branding, current active academic session, principal's signature title,
          grading thresholds, and data backups.
        </p>

        {successNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {importError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{importError}</span>
          </div>
        )}
      </div>

      {/* 1. School Information Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center space-x-2.5 border-b border-slate-200 pb-3 mb-5">
          <Building2 className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900">School Identity & Letterhead Header</h2>
        </div>

        <form onSubmit={handleSaveSchoolInfo} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Official School Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">School Motto</label>
              <input
                type="text"
                value={formData.motto}
                onChange={e => setFormData({ ...formData, motto: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Physical Campus Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Emblem / Logo Abbreviation
              </label>
              <input
                type="text"
                value={formData.logoBadgeText || ''}
                onChange={e => setFormData({ ...formData, logoBadgeText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                placeholder="e.g. AIMA"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Official Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Official Phone Number(s)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Active Academic Session
              </label>
              <input
                type="text"
                value={formData.currentSession}
                onChange={e => setFormData({ ...formData, currentSession: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                placeholder="2025/2026"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Current Term
              </label>
              <select
                value={formData.currentTerm}
                onChange={e =>
                  setFormData({
                    ...formData,
                    currentTerm: e.target.value as 'First Term' | 'Second Term' | 'Third Term',
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Next Term Resumption Date
              </label>
              <input
                type="text"
                value={formData.resumptionDate}
                onChange={e => setFormData({ ...formData, resumptionDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                placeholder="e.g. Monday, 12th Jan 2026"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Principal / Head of School Full Name
              </label>
              <input
                type="text"
                value={formData.principalName}
                onChange={e => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Principal's Official Designation Title
              </label>
              <input
                type="text"
                value={formData.principalTitle}
                onChange={e => setFormData({ ...formData, principalTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save School Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Mark Scheme & Grading Scales */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
          <div className="flex items-center space-x-2.5">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">
              Grading Benchmark & Mark Weighting
            </h2>
          </div>
          <button
            onClick={handleSaveScales}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Apply Grading Scales</span>
          </button>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-xs text-slate-700">
          <h4 className="font-bold text-slate-900 mb-1">Standard 80-Mark Weighting Structure:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mt-2 font-mono">
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 block">1st CA Test</span>
              <span className="font-bold text-slate-900 text-sm">10 Marks</span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 block">2nd CA Test</span>
              <span className="font-bold text-slate-900 text-sm">10 Marks</span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Midterm Test</span>
              <span className="font-bold text-slate-900 text-sm">20 Marks</span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Terminal Exam</span>
              <span className="font-bold text-slate-900 text-sm">40 Marks</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center">
            Total Course Marks = 80 &bull; Scaled Percentage (%) = (Score / 80) &times; 100
          </p>
        </div>

        {/* Grading Scales Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase">
                <th className="p-2.5 border border-slate-200">Letter Grade</th>
                <th className="p-2.5 border border-slate-200">Min Percentage (%)</th>
                <th className="p-2.5 border border-slate-200">Academic Remark</th>
              </tr>
            </thead>
            <tbody>
              {localScales.map(scale => (
                <tr key={scale.id} className="hover:bg-slate-50">
                  <td className="p-2.5 border border-slate-200 font-bold text-slate-900 text-sm">
                    {scale.grade}
                  </td>
                  <td className="p-2.5 border border-slate-200">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scale.minPercent}
                      onChange={e => handleScaleChange(scale.id, 'minPercent', e.target.value)}
                      className="w-20 px-2 py-1 rounded border border-slate-300 font-bold text-slate-900"
                    />
                    <span className="text-slate-500 ml-1.5">% and above</span>
                  </td>
                  <td className="p-2.5 border border-slate-200">
                    <input
                      type="text"
                      value={scale.remark}
                      onChange={e => handleScaleChange(scale.id, 'remark', e.target.value)}
                      className="w-full px-2 py-1 rounded border border-slate-300 font-medium text-slate-900"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Database Backup & Reset */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center space-x-2.5 border-b border-slate-200 pb-3 mb-5">
          <Database className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900">
            Database Maintenance & Data Backup
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-xs mb-1">Export Portal JSON</h3>
              <p className="text-[11px] text-slate-500">
                Download full backup of all enrolled students, classes, subjects, and grade reports.
              </p>
            </div>
            <button
              onClick={exportDatabaseJSON}
              className="mt-4 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Backup</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-xs mb-1">Import Portal JSON</h3>
              <p className="text-[11px] text-slate-500">
                Restore database from a previously downloaded JSON file backup.
              </p>
            </div>
            <div>
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleFileImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload & Restore</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-amber-950 text-xs mb-1">Reset to Starter Demo</h3>
              <p className="text-[11px] text-amber-800">
                Re-populate database with default demo classes, sample subjects, and test student records.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Reset entire portal to seed sample data? Any unsaved local edits will be replaced.')) {
                  resetToSeedData();
                  setSuccessNotice('Database restored to initial starter sample state!');
                  setTimeout(() => setSuccessNotice(null), 3000);
                }
              }}
              className="mt-4 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold text-amber-900 bg-white border border-amber-300 hover:bg-amber-100 transition-colors shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Sample Data</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-rose-950 text-xs mb-1">Clear All Data</h3>
              <p className="text-[11px] text-rose-700">
                Permanently wipe all enrolled students, classes, subjects, and examination score reports.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to permanently CLEAR ALL DATA (students, classes, subjects, score reports)?')) {
                  clearAllData();
                  setSuccessNotice('All student, class, subject, and score data have been cleared successfully!');
                  setTimeout(() => setSuccessNotice(null), 3000);
                }
              }}
              className="mt-4 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold text-rose-700 bg-white border border-rose-300 hover:bg-rose-100 transition-colors shadow-sm cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
