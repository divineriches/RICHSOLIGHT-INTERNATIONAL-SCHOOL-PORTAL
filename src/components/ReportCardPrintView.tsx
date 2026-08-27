import React, { useRef } from 'react';
import { usePortal } from '../context/PortalContext';
import { Student, StudentReport } from '../types';
import {
  computeClassRankings,
  computeSubjectClassStats,
  MAX_CA1,
  MAX_CA2,
  MAX_MIDTERM,
  MAX_EXAM,
  MAX_SUBJECT_TOTAL,
} from '../utils/grading';
import {
  Printer,
  ArrowLeft,
  Award,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  Download,
} from 'lucide-react';

interface ReportCardPrintViewProps {
  student: Student;
  session: string;
  term: 'First Term' | 'Second Term' | 'Third Term';
  onBack?: () => void;
}

export const ReportCardPrintView: React.FC<ReportCardPrintViewProps> = ({
  student,
  session,
  term,
  onBack,
}) => {
  const {
    schoolInfo,
    classes,
    subjects,
    students,
    reports,
    gradingScales,
    getClassById,
  } = usePortal();

  const printRef = useRef<HTMLDivElement>(null);

  const currentClass = getClassById(student.classId);
  const report = reports.find(
    r => r.studentId === student.id && r.session === session && r.term === term
  );

  // Compute rankings
  const classRankings = computeClassRankings(
    students,
    reports,
    student.classId,
    session,
    term,
    gradingScales
  );

  const studentRankInfo = classRankings.find(r => r.studentId === student.id);
  const totalStudentsInClass = classRankings.length;

  const handlePrint = () => {
    window.print();
  };

  // Get subject records
  const studentScores = report?.scores || {};
  const scoredSubjectIds = Object.keys(studentScores);

  // Class student IDs for stats computation
  const classStudentIds = new Set<string>(
    students.filter(s => s.classId === student.classId).map(s => s.id)
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Non-printed action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex items-center space-x-2">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Official Result Slip &bull; {student.firstName} {student.lastName}
            </h2>
            <p className="text-xs text-slate-500">
              {currentClass?.name || 'Class'} &bull; {session} ({term})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors ring-2 ring-slate-900/10 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Result / PDF</span>
          </button>
        </div>
      </div>

      {/* Official Report Card Printable Canvas */}
      <div
        ref={printRef}
        id="printable-report-sheet"
        className="bg-white text-slate-900 border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-lg relative print:shadow-none print:border-2 print:border-black print:rounded-none print:p-6 print:m-0 print:w-full"
      >
        {/* Subtle Watermark for authenticity */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <div className="text-center">
            <Award className="w-96 h-96 mx-auto text-slate-900" />
            <span className="text-6xl font-black tracking-widest uppercase">
              {schoolInfo.name}
            </span>
          </div>
        </div>

        {/* 1. Header Section */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center">
          <div className="flex items-center justify-between mb-2">
            <div className="w-16 h-16 rounded-full bg-slate-900 text-amber-400 font-extrabold text-lg flex items-center justify-center border-2 border-amber-400 shadow-sm print:border-black">
              {schoolInfo.logoBadgeText || 'AIMA'}
            </div>
            <div className="flex-1 px-4">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950">
                {schoolInfo.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold italic text-slate-700">
                &ldquo;{schoolInfo.motto}&rdquo;
              </p>
              <p className="text-[11px] text-slate-600 mt-1 max-w-xl mx-auto">
                {schoolInfo.address} &bull; Tel: {schoolInfo.phone} &bull; Email: {schoolInfo.email}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 p-1 flex items-center justify-center print:border-black">
              <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold text-center">
                OFFICIAL SEAL
              </div>
            </div>
          </div>

          <div className="mt-3 inline-block bg-slate-900 text-white px-6 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider print:bg-black print:text-white">
            STUDENT CONTINUOUS ASSESSMENT & TERMINAL REPORT SHEET
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-700">
            ACADEMIC SESSION: <span className="text-slate-950 font-bold">{session}</span> &bull;
            TERM: <span className="text-slate-950 font-bold">{term.toUpperCase()}</span>
          </div>
        </div>

        {/* 2. Student Bio & Summary Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-xs print:bg-slate-50 print:border-black print:rounded-none">
          <div>
            <span className="text-slate-500 block font-medium">STUDENT NAME</span>
            <span className="font-bold text-slate-950 text-sm">
              {student.lastName.toUpperCase()}, {student.firstName} {student.middleName || ''}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block font-medium">REGISTRATION NO.</span>
            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mt-0.5 print:border-black">
              {student.regNumber}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block font-medium">CLASS / SECTION</span>
            <span className="font-bold text-slate-900">{currentClass?.name || '-'}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-medium">GENDER</span>
            <span className="font-semibold text-slate-900">{student.gender}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-medium">CLASS POSITION / RANK</span>
            <span className="font-extrabold text-slate-950 text-sm text-amber-700 print:text-black">
              {studentRankInfo?.formattedPosition || '-'} of {totalStudentsInClass}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block font-medium">TOTAL MARKS OBTAINED</span>
            <span className="font-bold text-slate-900">
              {studentRankInfo?.totalScore || 0} / {studentRankInfo?.maxPossibleScore || 0}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block font-medium">AVERAGE PERCENTAGE</span>
            <span className="font-bold text-emerald-700 print:text-black text-sm">
              {studentRankInfo?.averagePercentage || 0}%
            </span>
          </div>
          <div>
            <span className="text-slate-500 block font-medium">ATTENDANCE</span>
            <span className="font-semibold text-slate-900">
              {report?.attendance.daysPresent || 60} of {report?.attendance.daysSchoolOpened || 65}{' '}
              days
            </span>
          </div>
        </div>

        {/* 3. Academic Breakdown Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-slate-300 print:border-black">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-center print:bg-slate-800 print:text-white">
                <th className="p-2 border border-slate-400 text-left w-6">#</th>
                <th className="p-2 border border-slate-400 text-left min-w-[140px]">
                  SUBJECT TITLE
                </th>
                <th className="p-2 border border-slate-400 bg-amber-950/40 print:bg-slate-200 print:text-black">
                  1st CA
                  <span className="block text-[10px] font-normal opacity-80">(Max {MAX_CA1})</span>
                </th>
                <th className="p-2 border border-slate-400 bg-amber-950/40 print:bg-slate-200 print:text-black">
                  2nd CA
                  <span className="block text-[10px] font-normal opacity-80">(Max {MAX_CA2})</span>
                </th>
                <th className="p-2 border border-slate-400 bg-blue-950/40 print:bg-slate-200 print:text-black">
                  Midterm
                  <span className="block text-[10px] font-normal opacity-80">
                    (Max {MAX_MIDTERM})
                  </span>
                </th>
                <th className="p-2 border border-slate-400 bg-purple-950/40 print:bg-slate-200 print:text-black">
                  Exam
                  <span className="block text-[10px] font-normal opacity-80">(Max {MAX_EXAM})</span>
                </th>
                <th className="p-2 border border-slate-400 font-extrabold bg-slate-800">
                  Total
                  <span className="block text-[10px] font-normal opacity-80">
                    (Max {MAX_SUBJECT_TOTAL})
                  </span>
                </th>
                <th className="p-2 border border-slate-400">Score %</th>
                <th className="p-2 border border-slate-400">Grade</th>
                <th className="p-2 border border-slate-400 text-left min-w-[100px]">Remark</th>
                <th className="p-2 border border-slate-400 text-center">Class Avg</th>
              </tr>
            </thead>
            <tbody>
              {scoredSubjectIds.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center p-6 text-slate-500 italic">
                    No scores recorded yet for this academic term.
                  </td>
                </tr>
              ) : (
                scoredSubjectIds.map((subId, index) => {
                  const subject = subjects.find(s => s.id === subId);
                  const score = studentScores[subId];
                  const subStats = computeSubjectClassStats(subId, reports, classStudentIds);

                  const gradeBg =
                    score.grade === 'A'
                      ? 'bg-emerald-100 text-emerald-900'
                      : score.grade === 'B'
                      ? 'bg-blue-100 text-blue-900'
                      : score.grade === 'C'
                      ? 'bg-indigo-100 text-indigo-900'
                      : score.grade === 'D'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-rose-100 text-rose-900';

                  return (
                    <tr
                      key={subId}
                      className={
                        index % 2 === 0
                          ? 'bg-white'
                          : 'bg-slate-50/70 print:bg-slate-50'
                      }
                    >
                      <td className="p-2 border border-slate-300 text-center font-medium text-slate-500 print:border-black">
                        {index + 1}
                      </td>
                      <td className="p-2 border border-slate-300 font-semibold text-slate-900 print:border-black">
                        {subject?.name || subId}
                        <span className="block text-[10px] font-mono text-slate-500 font-normal">
                          {subject?.code}
                        </span>
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-medium print:border-black">
                        {score.ca1}
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-medium print:border-black">
                        {score.ca2}
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-medium print:border-black">
                        {score.midterm}
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-medium print:border-black">
                        {score.exam}
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-bold text-slate-950 bg-slate-100/50 print:bg-transparent print:border-black">
                        {score.total}
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-semibold print:border-black">
                        {score.percentage}%
                      </td>
                      <td className="p-2 border border-slate-300 text-center print:border-black">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${gradeBg} print:bg-transparent print:text-black print:p-0`}
                        >
                          {score.grade}
                        </span>
                      </td>
                      <td className="p-2 border border-slate-300 font-medium text-slate-700 print:border-black">
                        {score.remark}
                      </td>
                      <td className="p-2 border border-slate-300 text-center text-slate-600 print:border-black">
                        {subStats.average}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {scoredSubjectIds.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-bold text-slate-950 border-t-2 border-slate-400 print:bg-slate-100 print:border-black">
                  <td colSpan={6} className="p-2 border border-slate-300 text-right uppercase">
                    Aggregates & Summary:
                  </td>
                  <td className="p-2 border border-slate-300 text-center font-extrabold text-sm">
                    {studentRankInfo?.totalScore || 0} / {studentRankInfo?.maxPossibleScore || 0}
                  </td>
                  <td className="p-2 border border-slate-300 text-center font-extrabold text-sm text-emerald-800 print:text-black">
                    {studentRankInfo?.averagePercentage || 0}%
                  </td>
                  <td className="p-2 border border-slate-300 text-center font-extrabold text-sm">
                    {studentRankInfo?.overallGrade || '-'}
                  </td>
                  <td colSpan={2} className="p-2 border border-slate-300 text-left font-semibold">
                    {studentRankInfo?.overallRemark || '-'}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* 4. Behavioral Traits & Grading Key Legend Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Behavioral / Affective Assessment */}
          <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/50 print:border-black print:rounded-none">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Affective & Behavioral Assessment
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Punctuality:</span>
                <span className="font-bold text-slate-900">
                  {report?.behavioralTraits.punctuality || 5} / 5
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Attentiveness:</span>
                <span className="font-bold text-slate-900">
                  {report?.behavioralTraits.attentiveness || 5} / 5
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Neatness & Decorum:</span>
                <span className="font-bold text-slate-900">
                  {report?.behavioralTraits.neatness || 5} / 5
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Honesty & Integrity:</span>
                <span className="font-bold text-slate-900">
                  {report?.behavioralTraits.honesty || 5} / 5
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Leadership:</span>
                <span className="font-bold text-slate-900">
                  {report?.behavioralTraits.leadership || 4} / 5
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Teamwork:</span>
                <span className="font-bold text-slate-900">
                  {report?.behavioralTraits.teamwork || 4} / 5
                </span>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 italic">
              Rating Key: 5 - Excellent | 4 - Very Good | 3 - Good | 2 - Fair | 1 - Poor
            </div>
          </div>

          {/* Grading Scheme Key */}
          <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/50 print:border-black print:rounded-none">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Grading Scale Key & Mark Distribution
            </h4>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              {gradingScales.map(scale => (
                <div
                  key={scale.id}
                  className="bg-white p-1.5 rounded border border-slate-200 text-center print:border-black print:rounded-none"
                >
                  <span className="font-bold text-slate-900 block text-xs">{scale.grade}</span>
                  <span className="text-slate-600 text-[10px] block">
                    {scale.minPercent}% - {Math.floor(scale.maxPercent)}%
                  </span>
                  <span className="text-[9px] text-slate-500 block truncate">{scale.remark}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-slate-500 font-medium">
              Distribution: 1st CA (10) + 2nd CA (10) + Midterm (20) + Exam (40) = 80 Marks Total.
            </div>
          </div>
        </div>

        {/* 5. Remarks & Signatures Section */}
        <div className="border border-slate-300 rounded-xl p-4 space-y-4 text-xs print:border-black print:rounded-none">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold uppercase text-slate-900">Class Teacher's Remark:</span>
              <span className="text-slate-500 italic text-[11px]">
                Teacher: {currentClass?.classTeacher || 'Class Master'}
              </span>
            </div>
            <p className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-800 italic print:bg-transparent print:border-none print:p-0">
              &ldquo;
              {report?.classTeacherRemark ||
                'Displays good conduct and consistent academic diligence. Keep up the high standards.'}
              &rdquo;
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold uppercase text-slate-900">Principal's Remark:</span>
              <span className="text-slate-500 italic text-[11px]">{schoolInfo.principalName}</span>
            </div>
            <p className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-800 italic print:bg-transparent print:border-none print:p-0">
              &ldquo;
              {report?.principalRemark ||
                'Commendable effort. Encouraged to sustain focus and excel further.'}
              &rdquo;
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-center">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                <span className="font-serif italic text-slate-700 text-xs">
                  {currentClass?.classTeacher?.split(' ')[1] || 'Signature'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase mt-1 block">
                Class Teacher's Signature
              </span>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                <span className="font-serif italic font-bold text-slate-800 text-sm">
                  Victoria Sterling
                </span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase mt-1 block">
                Principal's Signature & Stamp
              </span>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                <span className="font-bold text-slate-800 text-xs">
                  {schoolInfo.resumptionDate}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase mt-1 block">
                Next Term Begins Date
              </span>
            </div>
          </div>
        </div>

        {/* 6. Footer Verification Timestamp */}
        <div className="mt-6 pt-3 border-t border-slate-200 flex flex-wrap justify-between items-center text-[10px] text-slate-400 print:text-black">
          <span>
            Doc Ref: REP/{session.replace('/', '-')}/{student.regNumber.replace('/', '-')}/
            {term.replace(' ', '')}
          </span>
          <span>Verified Academic Report &bull; {new Date().toLocaleDateString()}</span>
          <span>System Generated Result Slip &bull; Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};
