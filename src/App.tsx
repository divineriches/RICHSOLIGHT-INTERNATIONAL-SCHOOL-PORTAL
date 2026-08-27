/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Navbar } from './components/Navbar';
import { PublicResultChecker } from './components/PublicResultChecker';
import { ScoreEntryPortal } from './components/ScoreEntryPortal';
import { BroadsheetView } from './components/BroadsheetView';
import { StudentManager } from './components/StudentManager';
import { ClassManager } from './components/ClassManager';
import { SubjectManager } from './components/SubjectManager';
import { SettingsPortal } from './components/SettingsPortal';
import { GraduationCap, ShieldCheck, Printer, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, schoolInfo } = usePortal();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'public-checker' && <PublicResultChecker />}
        {activeTab === 'admin-scores' && <ScoreEntryPortal />}
        {activeTab === 'admin-broadsheet' && <BroadsheetView />}
        {activeTab === 'admin-students' && <StudentManager />}
        {activeTab === 'admin-classes' && <ClassManager />}
        {activeTab === 'admin-subjects' && <SubjectManager />}
        {activeTab === 'admin-settings' && <SettingsPortal />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-900">{schoolInfo.name}</span>
            <span>&bull;</span>
            <span>Continuous Assessment & Exam Reporting Portal</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center space-x-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Standard 80-Mark Scheme (CA1: 10, CA2: 10, Midterm: 20, Exam: 40)</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <PortalProvider>
      <MainContent />
    </PortalProvider>
  );
}
