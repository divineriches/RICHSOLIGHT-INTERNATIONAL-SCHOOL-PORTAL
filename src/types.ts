export interface SchoolInfo {
  name: string;
  motto: string;
  address: string;
  email: string;
  phone: string;
  currentSession: string; // e.g. "2025/2026"
  currentTerm: 'First Term' | 'Second Term' | 'Third Term';
  principalName: string;
  principalTitle: string;
  resumptionDate: string;
  logoBadgeText?: string;
  schoolType: string;
}

export interface ClassLevel {
  id: string;
  name: string; // e.g. "JSS 1A", "Grade 10 - Diamond", "SS 2 Science"
  category: 'Junior Secondary' | 'Senior Secondary' | 'Primary' | 'High School' | 'General';
  section: string;
  classTeacher: string;
  capacity?: number;
}

export interface Subject {
  id: string;
  code: string; // e.g. "MTH 101"
  name: string; // e.g. "Mathematics"
  category: 'Core' | 'Sciences' | 'Arts & Humanities' | 'Commercial' | 'Vocational' | 'General';
  teacherName: string;
}

export interface Student {
  id: string;
  regNumber: string; // e.g. "STD/2026/001"
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'Male' | 'Female';
  classId: string;
  dob?: string;
  guardianName: string;
  guardianPhone: string;
  avatarSeed?: string;
  status: 'Active' | 'Inactive' | 'Transferred';
}

export interface ScoreBreakdown {
  ca1: number; // Max 10
  ca2: number; // Max 10
  midterm: number; // Max 20
  exam: number; // Max 40
  total: number; // Calculated (ca1 + ca2 + midterm + exam) => Max 80
  percentage: number; // (total / 80) * 100 => Scaled to 100%
  grade: string; // e.g. "A", "B", "C", "D", "E", "F"
  remark: string; // e.g. "Distinction", "Excellent", "Good", "Credit", "Pass", "Fail"
  teacherNote?: string;
}

export interface BehavioralAssessment {
  punctuality: number; // 1-5
  attentiveness: number; // 1-5
  neatness: number; // 1-5
  honesty: number; // 1-5
  leadership: number; // 1-5
  teamwork: number; // 1-5
  sportsParticipation: number; // 1-5
}

export interface StudentReport {
  id: string;
  studentId: string;
  classId: string;
  session: string;
  term: 'First Term' | 'Second Term' | 'Third Term';
  scores: Record<string, ScoreBreakdown>; // subjectId -> ScoreBreakdown
  attendance: {
    daysPresent: number;
    daysSchoolOpened: number;
  };
  behavioralTraits: BehavioralAssessment;
  classTeacherRemark: string;
  principalRemark: string;
  published: boolean;
  generatedDate: string;
}

export interface GradingScale {
  id: string;
  minPercent: number;
  maxPercent: number;
  grade: string;
  remark: string;
  color: string;
  description: string;
}

export interface ComputedStudentRank {
  studentId: string;
  student: Student;
  report?: StudentReport;
  totalScore: number;
  maxPossibleScore: number;
  averagePercentage: number;
  subjectsCount: number;
  passedCount: number;
  failedCount: number;
  position: number; // 1, 2, 3...
  formattedPosition: string; // "1st", "2nd", "3rd"...
  gpa: number;
  overallGrade: string;
  overallRemark: string;
}

export type ActiveTab = 'public-checker' | 'admin-scores' | 'admin-broadsheet' | 'admin-students' | 'admin-classes' | 'admin-subjects' | 'admin-settings';
