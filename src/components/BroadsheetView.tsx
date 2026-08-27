import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { computeClassRankings, computeSubjectClassStats, MAX_SUBJECT_TOTAL } from '../utils/grading';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Layers,
  Award,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const BroadsheetView: React.FC = () => {
  const {
    schoolInfo,
    classes,
    subjects,
    students,
    reports,
    gradingScales,
    setSelectedStudentForPrint,
    setActiveTab,
  } = usePortal();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedSession, setSelectedSession] = useState(schoolInfo.currentSession);
  const [selectedTerm, setSelectedTerm] = useState<'First Term' | 'Second Term' | 'Third Term'>(
    schoolInfo.currentTerm
  );

  React.useEffect(() => {
    if ((!selectedClassId || !classes.some(c => c.id === selectedClassId)) && classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const currentClass = classes.find(c => c.id === selectedClassId);

  if (classes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto shadow-sm my-8">
        <FileSpreadsheet className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">No Classes Configured</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Create class levels and enroll students to view academic broadsheet rankings.
        </p>
        <button
          onClick={() => setActiveTab('admin-classes')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-500 shadow-sm cursor-pointer"
        >
          <span>Go to Class Management</span>
        </button>
      </div>
    );
  }

  // Compute full class rankings and stats
  const rankedStudents = computeClassRankings(
    students,
    reports,
    selectedClassId,
    selectedSession,
    selectedTerm,
    gradingScales
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!currentClass || rankedStudents.length === 0) return;

    // Build CSV header
    const headers = [
      'Rank',
      'Reg Number',
      'Student Name',
      'Gender',
      ...subjects.map(s => `${s.name} (${s.code})`),
      'Total Score',
      'Max Score',
      'Average %',
      'Overall Grade',
      'Overall Remark',
    ];

    const rows = rankedStudents.map(item => {
      const report = item.report;
      const subScores = subjects.map(s => {
        const sc = report?.scores?.[s.id];
        return sc ? `${sc.total} (${sc.grade})` : '-';
      });

      return [
        item.formattedPosition,
        item.student.regNumber,
        `"${item.student.lastName}, ${item.student.firstName}"`,
        item.student.gender,
        ...subScores,
        item.totalScore,
        item.maxPossibleScore,
        `${item.averagePercentage}%`,
        item.overallGrade,
        `"${item.overallRemark}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `broadsheet_${currentClass.name.replace(/\s+/g, '_')}_${selectedSession.replace('/', '-')}_${selectedTerm.replace(' ', '')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-5">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Master Grade Broadsheet</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Class Broadsheet & Performance Register
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Cross-subject continuous assessment and terminal examination broadsheet with automated
              ranking and class aggregates.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Broadsheet</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Class Level</span>
            </label>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs sm:text-sm font-medium text-slate-900"
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Academic Session</span>
            </label>
            <select
              value={selectedSession}
              onChange={e => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs sm:text-sm font-medium text-slate-900"
            >
              <option value="2025/2026">2025/2026</option>
              <option value="2024/2025">2024/2025</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span>Examination Term</span>
            </label>
            <select
              value={selectedTerm}
              onChange={e =>
                setSelectedTerm(e.target.value as 'First Term' | 'Second Term' | 'Third Term')
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs sm:text-sm font-medium text-slate-900"
            >
              <option value="First Term">First Term</option>
              <option value="Second Term">Second Term</option>
              <option value="Third Term">Third Term</option>
            </select>
          </div>
        </div>
      </div>

      {/* Broadsheet Canvas */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-lg p-6 overflow-hidden print:p-0 print:border-none print:shadow-none">
        {/* Printable Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
          <h2 className="text-xl font-black uppercase text-slate-950">{schoolInfo.name}</h2>
          <h3 className="text-sm font-bold uppercase text-slate-700 mt-0.5">
            TERMINAL MASTER EXAMINATION BROADSHEET &bull; {selectedSession} ({selectedTerm})
          </h3>
          <div className="text-xs text-slate-600 mt-1 flex justify-center items-center space-x-4">
            <span>
              Class: <strong>{currentClass?.name}</strong>
            </span>
            <span>&bull;</span>
            <span>
              Class Teacher: <strong>{currentClass?.classTeacher || 'Teacher'}</strong>
            </span>
            <span>&bull;</span>
            <span>
              Total Enrolled: <strong>{rankedStudents.length} Students</strong>
            </span>
          </div>
        </div>

        {/* Broadsheet Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-slate-300 print:border-black">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-center">
                <th className="p-2 border border-slate-600 w-10">Pos</th>
                <th className="p-2 border border-slate-600 text-left min-w-[150px]">Student Name</th>
                <th className="p-2 border border-slate-600 min-w-[90px]">Reg No</th>
                {subjects.map(sub => (
                  <th key={sub.id} className="p-2 border border-slate-600 min-w-[70px]">
                    <span className="block font-mono text-[10px] text-amber-300">{sub.code}</span>
                    <span className="block truncate max-w-[80px]">{sub.name}</span>
                  </th>
                ))}
                <th className="p-2 border border-slate-600 bg-slate-800 font-extrabold min-w-[70px]">
                  Total
                </th>
                <th className="p-2 border border-slate-600 min-w-[65px]">Avg %</th>
                <th className="p-2 border border-slate-600 min-w-[50px]">Grade</th>
                <th className="p-2 border border-slate-600 text-left min-w-[100px]">Remark</th>
                <th className="p-2 border border-slate-600 print:hidden w-16">Slip</th>
              </tr>
            </thead>
            <tbody>
              {rankedStudents.length === 0 ? (
                <tr>
                  <td colSpan={subjects.length + 7} className="p-8 text-center text-slate-500 italic">
                    No active students found in this class level.
                  </td>
                </tr>
              ) : (
                rankedStudents.map((item, index) => {
                  const isTop3 = item.position <= 3;
                  const posBg =
                    item.position === 1
                      ? 'bg-amber-100 text-amber-900 font-black'
                      : item.position === 2
                      ? 'bg-slate-200 text-slate-900 font-bold'
                      : item.position === 3
                      ? 'bg-amber-50 text-amber-800 font-bold'
                      : 'text-slate-600';

                  return (
                    <tr
                      key={item.studentId}
                      className={index % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100/70'}
                    >
                      <td className={`p-2 border border-slate-300 text-center ${posBg}`}>
                        {item.formattedPosition}
                      </td>
                      <td className="p-2 border border-slate-300 font-bold text-slate-900">
                        {item.student.lastName}, {item.student.firstName}
                      </td>
                      <td className="p-2 border border-slate-300 font-mono text-[11px] text-center text-slate-600">
                        {item.student.regNumber}
                      </td>

                      {/* Subject Total Scores */}
                      {subjects.map(sub => {
                        const sc = item.report?.scores?.[sub.id];
                        if (!sc) {
                          return (
                            <td
                              key={sub.id}
                              className="p-2 border border-slate-300 text-center text-slate-400"
                            >
                              -
                            </td>
                          );
                        }
                        return (
                          <td key={sub.id} className="p-2 border border-slate-300 text-center">
                            <span className="font-bold text-slate-900">{sc.total}</span>
                            <span className="text-[10px] text-slate-500 ml-1 font-semibold">
                              ({sc.grade})
                            </span>
                          </td>
                        );
                      })}

                      {/* Total Score */}
                      <td className="p-2 border border-slate-300 text-center font-black text-slate-950 bg-slate-100/50">
                        {item.totalScore}
                      </td>

                      {/* Average Percentage */}
                      <td className="p-2 border border-slate-300 text-center font-extrabold text-emerald-800">
                        {item.averagePercentage}%
                      </td>

                      {/* Grade */}
                      <td className="p-2 border border-slate-300 text-center font-bold text-slate-900">
                        {item.overallGrade}
                      </td>

                      {/* Remark */}
                      <td className="p-2 border border-slate-300 text-slate-700 text-[11px] truncate max-w-[120px]">
                        {item.overallRemark}
                      </td>

                      {/* Print Result Slip Shortcut */}
                      <td className="p-2 border border-slate-300 text-center print:hidden">
                        <button
                          onClick={() => {
                            setSelectedStudentForPrint({
                              studentId: item.studentId,
                              session: selectedSession,
                              term: selectedTerm,
                            });
                            setActiveTab('public-checker');
                          }}
                          className="inline-flex items-center justify-center p-1 rounded bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition-colors"
                          title="Print Student Result Slip"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Broadsheet Footer */}
        <div className="mt-6 pt-4 border-t border-slate-300 flex flex-wrap justify-between items-center text-xs text-slate-600">
          <div>
            <strong>Summary:</strong> {rankedStudents.length} Students Ranked &bull; Top Performer:{' '}
            {rankedStudents[0]
              ? `${rankedStudents[0].student.firstName} ${rankedStudents[0].student.lastName} (${rankedStudents[0].averagePercentage}%)`
              : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-400">
            Generated by {schoolInfo.name} Examination Engine &bull; {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
