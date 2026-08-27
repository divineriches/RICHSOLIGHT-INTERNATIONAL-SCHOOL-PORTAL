import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { ScoreBreakdown, Student, StudentReport } from '../types';
import {
  calculateScoreBreakdown,
  MAX_CA1,
  MAX_CA2,
  MAX_MIDTERM,
  MAX_EXAM,
  MAX_SUBJECT_TOTAL,
} from '../utils/grading';
import {
  PenTool,
  Save,
  CheckCircle2,
  User,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Printer,
  FileText,
  RotateCcw,
  Sliders,
  School,
} from 'lucide-react';

export const ScoreEntryPortal: React.FC = () => {
  const {
    schoolInfo,
    classes,
    subjects,
    students,
    reports,
    gradingScales,
    saveReport,
    updateStudentSubjectScore,
    setSelectedStudentForPrint,
    setActiveTab,
  } = usePortal();

  // Mode: 'by-subject' or 'by-student'
  const [entryMode, setEntryMode] = useState<'by-subject' | 'by-student'>('by-subject');

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedSession, setSelectedSession] = useState(schoolInfo.currentSession);
  const [selectedTerm, setSelectedTerm] = useState<'First Term' | 'Second Term' | 'Third Term'>(
    schoolInfo.currentTerm
  );

  useEffect(() => {
    if ((!selectedClassId || !classes.some(c => c.id === selectedClassId)) && classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  useEffect(() => {
    if ((!selectedSubjectId || !subjects.some(s => s.id === selectedSubjectId)) && subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  // For by-student mode
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Local grid state for by-subject mode: studentId -> { ca1, ca2, midterm, exam }
  const [subjectScoresGrid, setSubjectScoresGrid] = useState<
    Record<string, { ca1: number; ca2: number; midterm: number; exam: number }>
  >({});

  // Local state for by-student mode
  const [studentFullReport, setStudentFullReport] = useState<StudentReport | null>(null);

  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Filter students by class
  const classStudents = students.filter(
    s => s.classId === selectedClassId && s.status === 'Active'
  );

  // Load subject scores when class/subject/session/term changes
  useEffect(() => {
    const newGrid: Record<string, { ca1: number; ca2: number; midterm: number; exam: number }> = {};

    for (const student of classStudents) {
      const rep = reports.find(
        r =>
          r.studentId === student.id &&
          r.session === selectedSession &&
          r.term === selectedTerm
      );

      if (rep && rep.scores && rep.scores[selectedSubjectId]) {
        const sc = rep.scores[selectedSubjectId];
        newGrid[student.id] = {
          ca1: sc.ca1,
          ca2: sc.ca2,
          midterm: sc.midterm,
          exam: sc.exam,
        };
      } else {
        newGrid[student.id] = {
          ca1: 0,
          ca2: 0,
          midterm: 0,
          exam: 0,
        };
      }
    }

    setSubjectScoresGrid(newGrid);
  }, [selectedClassId, selectedSubjectId, selectedSession, selectedTerm, reports]);

  // Load student full report when selected in by-student mode
  useEffect(() => {
    if (!selectedStudentId && classStudents.length > 0) {
      setSelectedStudentId(classStudents[0].id);
    }
  }, [classStudents, selectedStudentId]);

  useEffect(() => {
    if (selectedStudentId) {
      const rep = reports.find(
        r =>
          r.studentId === selectedStudentId &&
          r.session === selectedSession &&
          r.term === selectedTerm
      );

      if (rep) {
        setStudentFullReport(JSON.parse(JSON.stringify(rep)));
      } else {
        // Initialize empty report
        const initialScores: Record<string, ScoreBreakdown> = {};
        for (const sub of subjects) {
          initialScores[sub.id] = calculateScoreBreakdown(0, 0, 0, 0, gradingScales);
        }

        const newRep: StudentReport = {
          id: `rep-${selectedStudentId}-${Date.now().toString(36)}`,
          studentId: selectedStudentId,
          classId: selectedClassId,
          session: selectedSession,
          term: selectedTerm,
          scores: initialScores,
          attendance: {
            daysPresent: 60,
            daysSchoolOpened: 65,
          },
          behavioralTraits: {
            punctuality: 4,
            attentiveness: 4,
            neatness: 4,
            honesty: 5,
            leadership: 4,
            teamwork: 4,
            sportsParticipation: 4,
          },
          classTeacherRemark: 'Satisfactory progress shown this term.',
          principalRemark: 'Good effort, encouraged to keep striving.',
          published: true,
          generatedDate: new Date().toISOString().split('T')[0],
        };
        setStudentFullReport(newRep);
      }
    }
  }, [selectedStudentId, selectedSession, selectedTerm, reports, selectedClassId, subjects, gradingScales]);

  // Handle score change in grid
  const handleScoreChange = (
    studentId: string,
    field: 'ca1' | 'ca2' | 'midterm' | 'exam',
    value: string
  ) => {
    const num = Math.max(0, Number(value) || 0);
    const maxVal =
      field === 'ca1'
        ? MAX_CA1
        : field === 'ca2'
        ? MAX_CA2
        : field === 'midterm'
        ? MAX_MIDTERM
        : MAX_EXAM;

    const clamped = Math.min(maxVal, num);

    setSubjectScoresGrid(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { ca1: 0, ca2: 0, midterm: 0, exam: 0 }),
        [field]: clamped,
      },
    }));
  };

  // Save all grid scores
  const handleSaveGridScores = () => {
    (Object.entries(subjectScoresGrid) as [string, { ca1: number; ca2: number; midterm: number; exam: number }][]).forEach(
      ([studentId, marks]) => {
        updateStudentSubjectScore(
          studentId,
          selectedSubjectId,
          marks.ca1,
          marks.ca2,
          marks.midterm,
          marks.exam,
          selectedSession,
          selectedTerm
        );
      }
    );
    setSaveSuccessMessage('All subject scores successfully calculated and saved!');
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  // Save single student full report
  const handleSaveStudentFullReport = () => {
    if (!studentFullReport) return;
    saveReport(studentFullReport);
    setSaveSuccessMessage('Full student report sheet saved successfully!');
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  // Quick fill demo sample scores for testing
  const handleQuickFillRandom = () => {
    const newGrid: Record<string, { ca1: number; ca2: number; midterm: number; exam: number }> = {};
    for (const student of classStudents) {
      newGrid[student.id] = {
        ca1: Math.floor(Math.random() * 3) + 8, // 8-10
        ca2: Math.floor(Math.random() * 3) + 8, // 8-10
        midterm: Math.floor(Math.random() * 5) + 16, // 16-20
        exam: Math.floor(Math.random() * 9) + 32, // 32-40
      };
    }
    setSubjectScoresGrid(newGrid);
  };

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const currentClass = classes.find(c => c.id === selectedClassId);
  const currentStudent = students.find(s => s.id === selectedStudentId);

  if (classes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto shadow-sm my-8">
        <School className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">No Classes Configured</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          To record continuous assessments and exam marks, please create at least one class level first.
        </p>
        <button
          onClick={() => setActiveTab('admin-classes')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-500 shadow-sm cursor-pointer"
        >
          <School className="w-4 h-4" />
          <span>Create Class Level</span>
        </button>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto shadow-sm my-8">
        <BookOpen className="w-12 h-12 text-purple-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">No Curriculum Subjects Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Please add subjects (e.g. Mathematics, English Language) before entering student grades.
        </p>
        <button
          onClick={() => setActiveTab('admin-subjects')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-500 shadow-sm cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>Add Curriculum Subject</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Mode Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <PenTool className="w-3.5 h-3.5" />
              <span>Assessment & Gradebook System</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Exam & Continuous Assessment Score Entry
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Input and manage Continuous Assessments (CA1: 10, CA2: 10), Midterm Test (20), and Terminal Examination (40).
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setEntryMode('by-subject')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                entryMode === 'by-subject'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Subject Gradebook Grid</span>
            </button>
            <button
              onClick={() => setEntryMode('by-student')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                entryMode === 'by-student'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Full Report View</span>
            </button>
          </div>
        </div>

        {/* Global Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Select Class</span>
            </label>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm font-medium text-slate-900"
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {entryMode === 'by-subject' ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Select Subject</span>
              </label>
              <select
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm font-medium text-slate-900"
              >
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Select Student</span>
              </label>
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm font-medium text-slate-900"
              >
                {classStudents.map(std => (
                  <option key={std.id} value={std.id}>
                    {std.lastName}, {std.firstName} ({std.regNumber})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Academic Session</span>
            </label>
            <select
              value={selectedSession}
              onChange={e => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm font-medium text-slate-900"
            >
              <option value="2025/2026">2025/2026</option>
              <option value="2024/2025">2024/2025</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span>Academic Term</span>
            </label>
            <select
              value={selectedTerm}
              onChange={e =>
                setSelectedTerm(e.target.value as 'First Term' | 'Second Term' | 'Third Term')
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm font-medium text-slate-900"
            >
              <option value="First Term">First Term</option>
              <option value="Second Term">Second Term</option>
              <option value="Third Term">Third Term</option>
            </select>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccessMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{saveSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Mode A: Subject Gradebook Matrix Grid */}
      {entryMode === 'by-subject' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-amber-400 font-mono text-xs font-bold block">
                {currentSubject?.code} &bull; {currentSubject?.category}
              </span>
              <h2 className="text-lg font-bold text-white">
                {currentSubject?.name} — Gradebook for {currentClass?.name}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {classStudents.length} Students Enrolled &bull; Subject Teacher:{' '}
                {currentSubject?.teacherName || 'Assigned Staff'}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleQuickFillRandom}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                title="Fill sample scores for all students"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto-Fill Sample</span>
              </button>

              <button
                type="button"
                onClick={handleSaveGridScores}
                className="inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 hover:to-amber-400 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Scores</span>
              </button>
            </div>
          </div>

          {/* Scores Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                  <th className="p-3 text-center w-8">#</th>
                  <th className="p-3 min-w-[200px]">Student Name & Reg No</th>
                  <th className="p-3 text-center min-w-[100px] bg-amber-50/50">
                    1st CA
                    <span className="block text-[10px] text-slate-500 font-normal">
                      (0 - {MAX_CA1})
                    </span>
                  </th>
                  <th className="p-3 text-center min-w-[100px] bg-amber-50/50">
                    2nd CA
                    <span className="block text-[10px] text-slate-500 font-normal">
                      (0 - {MAX_CA2})
                    </span>
                  </th>
                  <th className="p-3 text-center min-w-[110px] bg-blue-50/50">
                    Midterm Test
                    <span className="block text-[10px] text-slate-500 font-normal">
                      (0 - {MAX_MIDTERM})
                    </span>
                  </th>
                  <th className="p-3 text-center min-w-[110px] bg-purple-50/50">
                    Terminal Exam
                    <span className="block text-[10px] text-slate-500 font-normal">
                      (0 - {MAX_EXAM})
                    </span>
                  </th>
                  <th className="p-3 text-center font-extrabold bg-slate-200/60 min-w-[90px]">
                    Total
                    <span className="block text-[10px] text-slate-500 font-normal">
                      (/ {MAX_SUBJECT_TOTAL})
                    </span>
                  </th>
                  <th className="p-3 text-center min-w-[80px]">Score %</th>
                  <th className="p-3 text-center min-w-[80px]">Grade</th>
                  <th className="p-3 min-w-[120px]">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {classStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-500 italic">
                      No active students found in this class. Add students from the Students tab.
                    </td>
                  </tr>
                ) : (
                  classStudents.map((std, idx) => {
                    const marks = subjectScoresGrid[std.id] || {
                      ca1: 0,
                      ca2: 0,
                      midterm: 0,
                      exam: 0,
                    };
                    const breakdown = calculateScoreBreakdown(
                      marks.ca1,
                      marks.ca2,
                      marks.midterm,
                      marks.exam,
                      gradingScales
                    );

                    const gradeBadge =
                      breakdown.grade === 'A'
                        ? 'bg-emerald-100 text-emerald-800'
                        : breakdown.grade === 'B'
                        ? 'bg-blue-100 text-blue-800'
                        : breakdown.grade === 'C'
                        ? 'bg-indigo-100 text-indigo-800'
                        : breakdown.grade === 'D'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800';

                    return (
                      <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">
                            {std.lastName}, {std.firstName}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {std.regNumber}
                          </span>
                        </td>

                        {/* CA1 Input */}
                        <td className="p-2 text-center bg-amber-50/20">
                          <input
                            type="number"
                            min="0"
                            max={MAX_CA1}
                            step="0.5"
                            value={marks.ca1}
                            onChange={e => handleScoreChange(std.id, 'ca1', e.target.value)}
                            className="w-16 px-2 py-1.5 text-center font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                          />
                        </td>

                        {/* CA2 Input */}
                        <td className="p-2 text-center bg-amber-50/20">
                          <input
                            type="number"
                            min="0"
                            max={MAX_CA2}
                            step="0.5"
                            value={marks.ca2}
                            onChange={e => handleScoreChange(std.id, 'ca2', e.target.value)}
                            className="w-16 px-2 py-1.5 text-center font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                          />
                        </td>

                        {/* Midterm Input */}
                        <td className="p-2 text-center bg-blue-50/20">
                          <input
                            type="number"
                            min="0"
                            max={MAX_MIDTERM}
                            step="0.5"
                            value={marks.midterm}
                            onChange={e => handleScoreChange(std.id, 'midterm', e.target.value)}
                            className="w-16 px-2 py-1.5 text-center font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                          />
                        </td>

                        {/* Exam Input */}
                        <td className="p-2 text-center bg-purple-50/20">
                          <input
                            type="number"
                            min="0"
                            max={MAX_EXAM}
                            step="0.5"
                            value={marks.exam}
                            onChange={e => handleScoreChange(std.id, 'exam', e.target.value)}
                            className="w-16 px-2 py-1.5 text-center font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                          />
                        </td>

                        {/* Total Computed */}
                        <td className="p-3 text-center font-black text-sm text-slate-900 bg-slate-100/50">
                          {breakdown.total}
                        </td>

                        {/* Percentage */}
                        <td className="p-3 text-center font-semibold text-slate-700">
                          {breakdown.percentage}%
                        </td>

                        {/* Grade Pill */}
                        <td className="p-3 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded font-bold text-xs ${gradeBadge}`}
                          >
                            {breakdown.grade}
                          </span>
                        </td>

                        {/* Remark */}
                        <td className="p-3 text-slate-600 font-medium truncate max-w-[130px]">
                          {breakdown.remark}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Score Formula: CA1 (max 10) + CA2 (max 10) + Midterm (max 20) + Exam (max 40) = 80 Marks.
            </span>
            <button
              onClick={handleSaveGridScores}
              className="inline-flex items-center space-x-2 px-4 py-2 font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-lg shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode B: Single Student Full Report Sheet View */}
      {entryMode === 'by-student' && currentStudent && studentFullReport && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {currentStudent.regNumber}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {currentStudent.firstName} {currentStudent.lastName}
                </h2>
                <p className="text-xs text-slate-500">
                  {currentClass?.name} &bull; {selectedSession} ({selectedTerm})
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudentForPrint({
                      studentId: currentStudent.id,
                      session: selectedSession,
                      term: selectedTerm,
                    });
                    setActiveTab('public-checker');
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
                >
                  <Printer className="w-4 h-4 text-slate-700" />
                  <span>Preview & Print Slip</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveStudentFullReport}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 hover:to-amber-400 rounded-lg shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Full Report</span>
                </button>
              </div>
            </div>

            {/* Subject scores table for this student */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold text-center">
                    <th className="p-2.5 text-left border border-slate-700 min-w-[140px]">
                      Subject Name
                    </th>
                    <th className="p-2.5 border border-slate-700 bg-amber-950/40">
                      1st CA (Max 10)
                    </th>
                    <th className="p-2.5 border border-slate-700 bg-amber-950/40">
                      2nd CA (Max 10)
                    </th>
                    <th className="p-2.5 border border-slate-700 bg-blue-950/40">
                      Midterm (Max 20)
                    </th>
                    <th className="p-2.5 border border-slate-700 bg-purple-950/40">
                      Exam (Max 40)
                    </th>
                    <th className="p-2.5 border border-slate-700 font-extrabold bg-slate-800">
                      Total (Max 80)
                    </th>
                    <th className="p-2.5 border border-slate-700">Percentage</th>
                    <th className="p-2.5 border border-slate-700">Grade</th>
                    <th className="p-2.5 border border-slate-700 text-left">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {subjects.map(sub => {
                    const score = studentFullReport.scores[sub.id] || {
                      ca1: 0,
                      ca2: 0,
                      midterm: 0,
                      exam: 0,
                      total: 0,
                      percentage: 0,
                      grade: 'F',
                      remark: 'Fail',
                    };

                    const handleSingleSubjectChange = (
                      field: 'ca1' | 'ca2' | 'midterm' | 'exam',
                      val: string
                    ) => {
                      const num = Math.max(0, Number(val) || 0);
                      const maxVal =
                        field === 'ca1'
                          ? MAX_CA1
                          : field === 'ca2'
                          ? MAX_CA2
                          : field === 'midterm'
                          ? MAX_MIDTERM
                          : MAX_EXAM;
                      const clamped = Math.min(maxVal, num);

                      const updatedMarks = {
                        ...score,
                        [field]: clamped,
                      };

                      const recomputed = calculateScoreBreakdown(
                        field === 'ca1' ? clamped : score.ca1,
                        field === 'ca2' ? clamped : score.ca2,
                        field === 'midterm' ? clamped : score.midterm,
                        field === 'exam' ? clamped : score.exam,
                        gradingScales
                      );

                      setStudentFullReport(prev => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          scores: {
                            ...prev.scores,
                            [sub.id]: recomputed,
                          },
                        };
                      });
                    };

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/70">
                        <td className="p-2.5 border border-slate-200 font-bold text-slate-900">
                          {sub.name}
                          <span className="block text-[10px] font-mono text-slate-500 font-normal">
                            {sub.code}
                          </span>
                        </td>

                        <td className="p-2 border border-slate-200 text-center">
                          <input
                            type="number"
                            min="0"
                            max={MAX_CA1}
                            step="0.5"
                            value={score.ca1}
                            onChange={e => handleSingleSubjectChange('ca1', e.target.value)}
                            className="w-16 px-2 py-1 text-center font-bold text-slate-900 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500"
                          />
                        </td>

                        <td className="p-2 border border-slate-200 text-center">
                          <input
                            type="number"
                            min="0"
                            max={MAX_CA2}
                            step="0.5"
                            value={score.ca2}
                            onChange={e => handleSingleSubjectChange('ca2', e.target.value)}
                            className="w-16 px-2 py-1 text-center font-bold text-slate-900 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500"
                          />
                        </td>

                        <td className="p-2 border border-slate-200 text-center">
                          <input
                            type="number"
                            min="0"
                            max={MAX_MIDTERM}
                            step="0.5"
                            value={score.midterm}
                            onChange={e => handleSingleSubjectChange('midterm', e.target.value)}
                            className="w-16 px-2 py-1 text-center font-bold text-slate-900 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500"
                          />
                        </td>

                        <td className="p-2 border border-slate-200 text-center">
                          <input
                            type="number"
                            min="0"
                            max={MAX_EXAM}
                            step="0.5"
                            value={score.exam}
                            onChange={e => handleSingleSubjectChange('exam', e.target.value)}
                            className="w-16 px-2 py-1 text-center font-bold text-slate-900 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500"
                          />
                        </td>

                        <td className="p-2.5 border border-slate-200 text-center font-black text-slate-950 bg-slate-50">
                          {score.total}
                        </td>

                        <td className="p-2.5 border border-slate-200 text-center font-semibold text-slate-700">
                          {score.percentage}%
                        </td>

                        <td className="p-2.5 border border-slate-200 text-center font-bold text-slate-900">
                          {score.grade}
                        </td>

                        <td className="p-2.5 border border-slate-200 text-slate-700 font-medium">
                          {score.remark}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Attendance & Behavioral domain editor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              {/* Attendance */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Attendance Records
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Days Present
                    </label>
                    <input
                      type="number"
                      value={studentFullReport.attendance.daysPresent}
                      onChange={e =>
                        setStudentFullReport(prev =>
                          prev
                            ? {
                                ...prev,
                                attendance: {
                                  ...prev.attendance,
                                  daysPresent: Number(e.target.value) || 0,
                                },
                              }
                            : prev
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Days School Opened
                    </label>
                    <input
                      type="number"
                      value={studentFullReport.attendance.daysSchoolOpened}
                      onChange={e =>
                        setStudentFullReport(prev =>
                          prev
                            ? {
                                ...prev,
                                attendance: {
                                  ...prev.attendance,
                                  daysSchoolOpened: Number(e.target.value) || 0,
                                },
                              }
                            : prev
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Behavioral Domain 1-5 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Behavioral & Affective Ratings (1 - 5)
                </h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(
                    [
                      'punctuality',
                      'attentiveness',
                      'neatness',
                      'honesty',
                      'leadership',
                      'teamwork',
                    ] as const
                  ).map(trait => (
                    <div key={trait}>
                      <label className="block text-[10px] font-medium text-slate-600 capitalize">
                        {trait}:
                      </label>
                      <select
                        value={studentFullReport.behavioralTraits[trait]}
                        onChange={e =>
                          setStudentFullReport(prev =>
                            prev
                              ? {
                                  ...prev,
                                  behavioralTraits: {
                                    ...prev.behavioralTraits,
                                    [trait]: Number(e.target.value),
                                  },
                                }
                              : prev
                          )
                        }
                        className="w-full p-1 rounded border border-slate-300 bg-white font-bold text-xs"
                      >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Very Good</option>
                        <option value={3}>3 - Good</option>
                        <option value={2}>2 - Fair</option>
                        <option value={1}>1 - Poor</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Remarks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Class Teacher's Remark
                </label>
                <textarea
                  rows={2}
                  value={studentFullReport.classTeacherRemark}
                  onChange={e =>
                    setStudentFullReport(prev =>
                      prev ? { ...prev, classTeacherRemark: e.target.value } : prev
                    )
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-slate-50 focus:bg-white"
                  placeholder="Enter teacher's assessment..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Principal's Remark
                </label>
                <textarea
                  rows={2}
                  value={studentFullReport.principalRemark}
                  onChange={e =>
                    setStudentFullReport(prev =>
                      prev ? { ...prev, principalRemark: e.target.value } : prev
                    )
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-slate-50 focus:bg-white"
                  placeholder="Enter principal's review..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveStudentFullReport}
                className="inline-flex items-center space-x-2 px-6 py-2.5 font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 rounded-xl shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Student Assessment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
