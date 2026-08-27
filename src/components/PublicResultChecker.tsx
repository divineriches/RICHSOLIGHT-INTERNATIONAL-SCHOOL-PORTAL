import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Student } from '../types';
import { ReportCardPrintView } from './ReportCardPrintView';
import confetti from 'canvas-confetti';
import {
  Search,
  Printer,
  Sparkles,
  GraduationCap,
  Calendar,
  Layers,
  AlertCircle,
  CheckCircle,
  FileText,
  UserCheck,
  Building2,
} from 'lucide-react';

export const PublicResultChecker: React.FC = () => {
  const {
    schoolInfo,
    classes,
    students,
    reports,
    getStudentByRegNumber,
    selectedStudentForPrint,
    setSelectedStudentForPrint,
  } = usePortal();

  const [searchMethod, setSearchMethod] = useState<'reg' | 'dropdown'>('reg');
  const [regNumberInput, setRegNumberInput] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSession, setSelectedSession] = useState(schoolInfo.currentSession);
  const [selectedTerm, setSelectedTerm] = useState<'First Term' | 'Second Term' | 'Third Term'>(
    schoolInfo.currentTerm
  );

  React.useEffect(() => {
    if ((!selectedClassId || !classes.some(c => c.id === selectedClassId)) && classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const [activeResult, setActiveResult] = useState<Student | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Filter students for dropdown
  const filteredStudents = students.filter(
    s => s.classId === selectedClassId && s.status === 'Active'
  );

  const handleCheckResult = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError(null);
    setIsSearching(true);

    setTimeout(() => {
      let foundStudent: Student | undefined;

      if (searchMethod === 'reg') {
        if (!regNumberInput.trim()) {
          setSearchError('Please enter a valid Student Registration Number (e.g. STD/2026/001)');
          setIsSearching(false);
          return;
        }
        foundStudent = getStudentByRegNumber(regNumberInput);
      } else {
        if (!selectedStudentId) {
          setSearchError('Please select a student from the class roster');
          setIsSearching(false);
          return;
        }
        foundStudent = students.find(s => s.id === selectedStudentId);
      }

      if (!foundStudent) {
        setSearchError(
          `No student record found matching "${
            searchMethod === 'reg' ? regNumberInput : 'selected criteria'
          }". Please verify the registration number.`
        );
        setIsSearching(false);
        return;
      }

      // Check if report exists for this session & term
      const report = reports.find(
        r =>
          r.studentId === foundStudent!.id &&
          r.session === selectedSession &&
          r.term === selectedTerm
      );

      if (!report || Object.keys(report.scores || {}).length === 0) {
        setSearchError(
          `No examination scores have been published yet for ${foundStudent.firstName} ${foundStudent.lastName} for ${selectedSession} (${selectedTerm}).`
        );
        setIsSearching(false);
        return;
      }

      // Success
      setActiveResult(foundStudent);
      setIsSearching(false);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
        });
      } catch {
        // Confetti fallback
      }
    }, 300);
  };

  const handleDemoStudentClick = (regNo: string) => {
    setSearchMethod('reg');
    setRegNumberInput(regNo);
    setSearchError(null);
    setIsSearching(true);

    setTimeout(() => {
      const student = getStudentByRegNumber(regNo);
      if (student) {
        setActiveResult(student);
        try {
          confetti({
            particleCount: 60,
            spread: 50,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
      setIsSearching(false);
    }, 200);
  };

  // If a student was selected via props or another tab
  if (selectedStudentForPrint) {
    const student = students.find(s => s.id === selectedStudentForPrint.studentId);
    if (student) {
      return (
        <ReportCardPrintView
          student={student}
          session={selectedStudentForPrint.session}
          term={selectedStudentForPrint.term}
          onBack={() => setSelectedStudentForPrint(null)}
        />
      );
    }
  }

  // If an active result is being viewed
  if (activeResult) {
    return (
      <ReportCardPrintView
        student={activeResult}
        session={selectedSession}
        term={selectedTerm}
        onBack={() => setActiveResult(null)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-slate-700">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold uppercase tracking-wider mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>Public Exam & Result Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Check & Print Student Result
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Welcome to the official online reporting portal of{' '}
            <strong className="text-white">{schoolInfo.name}</strong>. Enter your Registration
            Number or select your class details to view and print your verified terminal report sheet.
          </p>
        </div>
      </div>

      {/* Main Search Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
        {/* Toggle Search Method */}
        <div className="flex border-b border-slate-200 pb-4 mb-6 gap-3">
          <button
            type="button"
            onClick={() => {
              setSearchMethod('reg');
              setSearchError(null);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              searchMethod === 'reg'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Search by Registration Number</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchMethod('dropdown');
              setSearchError(null);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              searchMethod === 'dropdown'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Browse by Class Roster</span>
          </button>
        </div>

        <form onSubmit={handleCheckResult} className="space-y-6">
          {/* Academic Session & Term Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Academic Session</span>
              </label>
              <select
                value={selectedSession}
                onChange={e => setSelectedSession(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium text-slate-900"
              >
                <option value="2025/2026">2025/2026 Academic Session</option>
                <option value="2024/2025">2024/2025 Academic Session</option>
                <option value="2023/2024">2023/2024 Academic Session</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                <span>Examination Term</span>
              </label>
              <select
                value={selectedTerm}
                onChange={e =>
                  setSelectedTerm(e.target.value as 'First Term' | 'Second Term' | 'Third Term')
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium text-slate-900"
              >
                <option value="First Term">First Term (Terminal)</option>
                <option value="Second Term">Second Term (Mid-Session)</option>
                <option value="Third Term">Third Term (Annual / Promotion)</option>
              </select>
            </div>
          </div>

          {/* Search Inputs based on method */}
          {searchMethod === 'reg' ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Student Registration Number</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. STD/2026/001"
                  value={regNumberInput}
                  onChange={e => setRegNumberInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-base font-mono font-bold uppercase tracking-wider text-slate-900 placeholder:text-slate-400 placeholder:font-sans placeholder:normal-case"
                  required
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Enter the student's unique ID as assigned on their admission slip or ID card.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Select Class</span>
                </label>
                <select
                  value={selectedClassId}
                  onChange={e => {
                    setSelectedClassId(e.target.value);
                    setSelectedStudentId('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium text-slate-900"
                >
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Select Student</span>
                </label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium text-slate-900"
                  required
                >
                  <option value="">-- Choose a Student --</option>
                  {filteredStudents.map(std => (
                    <option key={std.id} value={std.id}>
                      {std.lastName}, {std.firstName} ({std.regNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Error Message */}
          {searchError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start space-x-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Result Not Found</p>
                <p className="mt-0.5 text-rose-700">{searchError}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSearching}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 hover:to-amber-400 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-70"
          >
            {isSearching ? (
              <span className="inline-flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Verifying and Retrieving Report...</span>
              </span>
            ) : (
              <>
                <Search className="w-5 h-5 text-slate-950" />
                <span>Check and View Result</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Test Section */}
        {students.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quick Test / Sample Student Result Slips:
              </span>
              <span className="text-[11px] text-slate-400">Click to instantly test</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {students.slice(0, 6).map(std => {
                const cls = classes.find(c => c.id === std.classId);
                return (
                  <button
                    key={std.id}
                    onClick={() => handleDemoStudentClick(std.regNumber)}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-lg text-xs transition-all text-left group cursor-pointer"
                  >
                    <span className="font-mono font-bold text-slate-900 group-hover:text-amber-900">
                      {std.regNumber}
                    </span>
                    <span className="text-slate-600 group-hover:text-amber-800 font-medium">
                      &bull; {std.firstName} {std.lastName}
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-amber-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {cls?.section || 'Class'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Feature & Score Breakdown Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
            80M
          </div>
          <h3 className="font-bold text-slate-900 text-sm mb-1">Standard 80-Mark Scheme</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Continuous Assessment 1 (10), CA 2 (10), Midterm Test (20), and Terminal Exam (40).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3">
            <Printer className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm mb-1">Official Print Formatting</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Clean A4 report card layout complete with school crest, class teacher notes, principal
            stamps, and behavioral ratings.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm mb-1">Instant Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automatic position ranking, subject averages, and letter grades computed directly on
            entry.
          </p>
        </div>
      </div>
    </div>
  );
};
