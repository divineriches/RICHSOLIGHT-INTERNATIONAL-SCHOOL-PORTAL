import { GradingScale, ScoreBreakdown, Student, StudentReport, ComputedStudentRank } from '../types';

export const DEFAULT_GRADING_SCALES: GradingScale[] = [
  {
    id: 'scale-a',
    minPercent: 75,
    maxPercent: 100,
    grade: 'A',
    remark: 'Distinction / Excellent',
    color: 'emerald',
    description: 'Outstanding mastery of course material',
  },
  {
    id: 'scale-b',
    minPercent: 65,
    maxPercent: 74.99,
    grade: 'B',
    remark: 'Very Good',
    color: 'blue',
    description: 'Above average understanding and consistency',
  },
  {
    id: 'scale-c',
    minPercent: 50,
    maxPercent: 64.99,
    grade: 'C',
    remark: 'Credit / Good',
    color: 'indigo',
    description: 'Satisfactory and solid grasp of fundamentals',
  },
  {
    id: 'scale-d',
    minPercent: 40,
    maxPercent: 49.99,
    grade: 'D',
    remark: 'Pass / Fair',
    color: 'amber',
    description: 'Meets minimum benchmark requirements',
  },
  {
    id: 'scale-e',
    minPercent: 30,
    maxPercent: 39.99,
    grade: 'E',
    remark: 'Weak Pass',
    color: 'orange',
    description: 'Needs focused intervention and remedial study',
  },
  {
    id: 'scale-f',
    minPercent: 0,
    maxPercent: 29.99,
    grade: 'F',
    remark: 'Fail',
    color: 'rose',
    description: 'Unsatisfactory performance; repetition recommended',
  },
];

export const MAX_CA1 = 10;
export const MAX_CA2 = 10;
export const MAX_MIDTERM = 20;
export const MAX_EXAM = 40;
export const MAX_SUBJECT_TOTAL = 80;

/**
 * Calculates total, percentage, grade, and remark from component marks
 */
export function calculateScoreBreakdown(
  rawCa1: number | string,
  rawCa2: number | string,
  rawMidterm: number | string,
  rawExam: number | string,
  scales: GradingScale[] = DEFAULT_GRADING_SCALES
): ScoreBreakdown {
  const ca1 = Math.min(MAX_CA1, Math.max(0, Number(rawCa1) || 0));
  const ca2 = Math.min(MAX_CA2, Math.max(0, Number(rawCa2) || 0));
  const midterm = Math.min(MAX_MIDTERM, Math.max(0, Number(rawMidterm) || 0));
  const exam = Math.min(MAX_EXAM, Math.max(0, Number(rawExam) || 0));

  const total = Number((ca1 + ca2 + midterm + exam).toFixed(1));
  const percentage = Number(((total / MAX_SUBJECT_TOTAL) * 100).toFixed(1));

  let grade = 'F';
  let remark = 'Fail';

  for (const scale of scales) {
    if (percentage >= scale.minPercent && percentage <= (scale.maxPercent + 0.01)) {
      grade = scale.grade;
      remark = scale.remark;
      break;
    }
  }

  return {
    ca1,
    ca2,
    midterm,
    exam,
    total,
    percentage,
    grade,
    remark,
  };
}

/**
 * Helper to format numeric position as ordinal string: 1st, 2nd, 3rd, 4th...
 */
export function formatOrdinal(n: number): string {
  if (!n || n <= 0) return '-';
  const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });
  const suffixes: Record<string, string> = {
    one: 'st',
    two: 'nd',
    few: 'rd',
    other: 'th',
  };
  const rule = pr.select(n);
  return `${n}${suffixes[rule] || 'th'}`;
}

/**
 * Computes class rankings and positions for all students in a class
 */
export function computeClassRankings(
  students: Student[],
  reports: StudentReport[],
  classId: string,
  session: string,
  term: string,
  scales: GradingScale[] = DEFAULT_GRADING_SCALES
): ComputedStudentRank[] {
  const classStudents = students.filter(s => s.classId === classId && s.status === 'Active');

  const rankedList = classStudents.map(student => {
    const report = reports.find(
      r => r.studentId === student.id && r.session === session && r.term === term
    );

    let totalScore = 0;
    let subjectsCount = 0;
    let passedCount = 0;
    let failedCount = 0;

    if (report && report.scores) {
      const scoreEntries = Object.values(report.scores);
      subjectsCount = scoreEntries.length;
      for (const score of scoreEntries) {
        totalScore += score.total;
        if (score.percentage >= 40) {
          passedCount++;
        } else {
          failedCount++;
        }
      }
    }

    const maxPossibleScore = subjectsCount * MAX_SUBJECT_TOTAL;
    const averagePercentage =
      maxPossibleScore > 0 ? Number(((totalScore / maxPossibleScore) * 100).toFixed(1)) : 0;

    let overallGrade = 'F';
    let overallRemark = 'Fail';
    for (const scale of scales) {
      if (averagePercentage >= scale.minPercent && averagePercentage <= (scale.maxPercent + 0.01)) {
        overallGrade = scale.grade;
        overallRemark = scale.remark;
        break;
      }
    }

    const gpa = Number(((averagePercentage / 100) * 4.0).toFixed(2));

    return {
      studentId: student.id,
      student,
      report,
      totalScore: Number(totalScore.toFixed(1)),
      maxPossibleScore,
      averagePercentage,
      subjectsCount,
      passedCount,
      failedCount,
      position: 0,
      formattedPosition: '-',
      gpa,
      overallGrade,
      overallRemark,
    };
  });

  // Sort descending by total score, then average percentage
  rankedList.sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return b.averagePercentage - a.averagePercentage;
  });

  // Assign positions (handling ties gracefully)
  let currentRank = 1;
  for (let i = 0; i < rankedList.length; i++) {
    if (i > 0 && rankedList[i].totalScore === rankedList[i - 1].totalScore) {
      rankedList[i].position = rankedList[i - 1].position;
    } else {
      rankedList[i].position = currentRank;
    }
    rankedList[i].formattedPosition = formatOrdinal(rankedList[i].position);
    currentRank++;
  }

  return rankedList;
}

/**
 * Computes stats for each subject in a given class (highest score, lowest score, average)
 */
export function computeSubjectClassStats(
  subjectId: string,
  reports: StudentReport[],
  classStudentIds: Set<string>
): { highest: number; lowest: number; average: number; count: number } {
  const scores: number[] = [];

  for (const report of reports) {
    if (classStudentIds.has(report.studentId) && report.scores && report.scores[subjectId]) {
      scores.push(report.scores[subjectId].total);
    }
  }

  if (scores.length === 0) {
    return { highest: 0, lowest: 0, average: 0, count: 0 };
  }

  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);
  const sum = scores.reduce((a, b) => a + b, 0);
  const average = Number((sum / scores.length).toFixed(1));

  return { highest, lowest, average, count: scores.length };
}
