import { SchoolInfo, ClassLevel, Subject, Student, StudentReport } from '../types';
import { calculateScoreBreakdown } from '../utils/grading';

export const SEED_SCHOOL_INFO: SchoolInfo = {
  name: 'Apex International Model Academy',
  motto: 'Knowledge, Integrity and Academic Excellence',
  address: 'Plot 42 Crescent Way, Victoria Island / Educational District',
  email: 'info@apexacademy.edu.org',
  phone: '+1 (555) 234-8900 / +234 802 345 6789',
  currentSession: '2025/2026',
  currentTerm: 'First Term',
  principalName: 'Dr. (Mrs.) Victoria Sterling, Ph.D.',
  principalTitle: 'Principal & Executive Director',
  resumptionDate: 'Monday, 12th January, 2026',
  logoBadgeText: 'AIMA',
  schoolType: 'Comprehensive Day & Boarding Secondary School',
};

export const SEED_CLASSES: ClassLevel[] = [
  {
    id: 'cls-jss1a',
    name: 'JSS 1A (Grade 7 Alpha)',
    category: 'Junior Secondary',
    section: 'A',
    classTeacher: 'Mr. Emmanuel Adeyemi (B.Sc Ed)',
    capacity: 35,
  },
  {
    id: 'cls-jss2b',
    name: 'JSS 2B (Grade 8 Beta)',
    category: 'Junior Secondary',
    section: 'B',
    classTeacher: 'Mrs. Folashade Nwosu (M.Ed)',
    capacity: 32,
  },
  {
    id: 'cls-ss1sci',
    name: 'SS 1 Science (Grade 10 Sci)',
    category: 'Senior Secondary',
    section: 'Science',
    classTeacher: 'Dr. Raymond Okonkwo',
    capacity: 30,
  },
  {
    id: 'cls-ss2art',
    name: 'SS 2 Arts & Commercial (Grade 11)',
    category: 'Senior Secondary',
    section: 'Arts/Comm',
    classTeacher: 'Ms. Beatrice Clarke',
    capacity: 28,
  },
];

export const SEED_SUBJECTS: Subject[] = [
  {
    id: 'sub-mth',
    code: 'MTH 101',
    name: 'Mathematics',
    category: 'Core',
    teacherName: 'Mr. K. Balogun',
  },
  {
    id: 'sub-eng',
    code: 'ENG 101',
    name: 'English Language',
    category: 'Core',
    teacherName: 'Mrs. C. Williams',
  },
  {
    id: 'sub-sci',
    code: 'BST 101',
    name: 'Basic Science & Technology',
    category: 'Sciences',
    teacherName: 'Engr. D. Bello',
  },
  {
    id: 'sub-civ',
    code: 'CSS 102',
    name: 'Civic Education & Social Studies',
    category: 'Arts & Humanities',
    teacherName: 'Mr. P. Obi',
  },
  {
    id: 'sub-ict',
    code: 'ICT 103',
    name: 'Computer Studies & ICT',
    category: 'Vocational',
    teacherName: 'Ms. T. Martins',
  },
  {
    id: 'sub-phy',
    code: 'PHY 201',
    name: 'Physics',
    category: 'Sciences',
    teacherName: 'Dr. R. Okonkwo',
  },
  {
    id: 'sub-chm',
    code: 'CHM 201',
    name: 'Chemistry',
    category: 'Sciences',
    teacherName: 'Mrs. H. Alabi',
  },
  {
    id: 'sub-bio',
    code: 'BIO 201',
    name: 'Biology',
    category: 'Sciences',
    teacherName: 'Mr. S. Daniel',
  },
  {
    id: 'sub-econ',
    code: 'ECN 201',
    name: 'Economics',
    category: 'Commercial',
    teacherName: 'Mr. J. Morgan',
  },
  {
    id: 'sub-lit',
    code: 'LIT 201',
    name: 'Literature in English',
    category: 'Arts & Humanities',
    teacherName: 'Ms. B. Clarke',
  },
];

export const SEED_STUDENTS: Student[] = [
  {
    id: 'std-001',
    regNumber: 'STD/2026/001',
    firstName: 'Divine-Riches',
    lastName: 'Chizalam',
    middleName: 'David',
    gender: 'Male',
    classId: 'cls-jss1a',
    dob: '2013-05-14',
    guardianName: 'Engr. & Mrs. Chizalam',
    guardianPhone: '+1 (555) 901-2345',
    avatarSeed: 'David',
    status: 'Active',
  },
  {
    id: 'std-002',
    regNumber: 'STD/2026/002',
    firstName: 'Sophia',
    lastName: 'Adekunle',
    middleName: 'Oluwaseun',
    gender: 'Female',
    classId: 'cls-jss1a',
    dob: '2013-08-22',
    guardianName: 'Chief O. Adekunle',
    guardianPhone: '+1 (555) 345-6789',
    avatarSeed: 'Sophia',
    status: 'Active',
  },
  {
    id: 'std-003',
    regNumber: 'STD/2026/003',
    firstName: 'Michael',
    lastName: 'Okafor',
    middleName: 'Somtochukwu',
    gender: 'Male',
    classId: 'cls-jss1a',
    dob: '2013-02-10',
    guardianName: 'Barrister N. Okafor',
    guardianPhone: '+1 (555) 789-0123',
    avatarSeed: 'Michael',
    status: 'Active',
  },
  {
    id: 'std-004',
    regNumber: 'STD/2026/004',
    firstName: 'Fatima',
    lastName: 'Abubakar',
    middleName: 'Zainab',
    gender: 'Female',
    classId: 'cls-jss1a',
    dob: '2013-11-05',
    guardianName: 'Alhaji M. Abubakar',
    guardianPhone: '+1 (555) 678-9012',
    avatarSeed: 'Fatima',
    status: 'Active',
  },
  {
    id: 'std-005',
    regNumber: 'STD/2026/005',
    firstName: 'Joshua',
    lastName: 'Eze',
    middleName: 'Kelechi',
    gender: 'Male',
    classId: 'cls-jss1a',
    dob: '2013-04-18',
    guardianName: 'Pastor P. Eze',
    guardianPhone: '+1 (555) 890-1234',
    avatarSeed: 'Joshua',
    status: 'Active',
  },
  {
    id: 'std-006',
    regNumber: 'STD/2026/006',
    firstName: 'Chloe',
    lastName: 'Richardson',
    middleName: 'Grace',
    gender: 'Female',
    classId: 'cls-ss1sci',
    dob: '2010-09-30',
    guardianName: 'Dr. & Mrs. Richardson',
    guardianPhone: '+1 (555) 456-7890',
    avatarSeed: 'Chloe',
    status: 'Active',
  },
  {
    id: 'std-007',
    regNumber: 'STD/2026/007',
    firstName: 'Tunde',
    lastName: 'Bakare',
    middleName: 'Olamide',
    gender: 'Male',
    classId: 'cls-ss1sci',
    dob: '2010-03-12',
    guardianName: 'Prof. Y. Bakare',
    guardianPhone: '+1 (555) 567-8901',
    avatarSeed: 'Tunde',
    status: 'Active',
  },
  {
    id: 'std-008',
    regNumber: 'STD/2026/008',
    firstName: 'Amina',
    lastName: 'Danjuma',
    middleName: 'Bilkisu',
    gender: 'Female',
    classId: 'cls-ss1sci',
    dob: '2010-07-25',
    guardianName: 'Col. (Rtd) Danjuma',
    guardianPhone: '+1 (555) 234-5678',
    avatarSeed: 'Amina',
    status: 'Active',
  },
];

export const SEED_REPORTS: StudentReport[] = [
  {
    id: 'rep-std-001-2025-term1',
    studentId: 'std-001',
    classId: 'cls-jss1a',
    session: '2025/2026',
    term: 'First Term',
    scores: {
      'sub-mth': calculateScoreBreakdown(9, 10, 19, 38), // 76/80 -> 95% A
      'sub-eng': calculateScoreBreakdown(9, 9, 18, 36),  // 72/80 -> 90% A
      'sub-sci': calculateScoreBreakdown(10, 10, 19, 39), // 78/80 -> 97.5% A
      'sub-civ': calculateScoreBreakdown(8, 9, 18, 35),  // 70/80 -> 87.5% A
      'sub-ict': calculateScoreBreakdown(10, 10, 20, 39), // 79/80 -> 98.8% A
    },
    attendance: {
      daysPresent: 64,
      daysSchoolOpened: 65,
    },
    behavioralTraits: {
      punctuality: 5,
      attentiveness: 5,
      neatness: 5,
      honesty: 5,
      leadership: 5,
      teamwork: 4,
      sportsParticipation: 4,
    },
    classTeacherRemark:
      'Divine-Riches is an exceptionally gifted, disciplined and articulate scholar. He demonstrates profound conceptual mastery across both analytical and language subjects.',
    principalRemark:
      'An outstanding and inspiring academic performance. Keep soaring to greater heights!',
    published: true,
    generatedDate: '2025-12-18',
  },
  {
    id: 'rep-std-002-2025-term1',
    studentId: 'std-002',
    classId: 'cls-jss1a',
    session: '2025/2026',
    term: 'First Term',
    scores: {
      'sub-mth': calculateScoreBreakdown(8, 9, 17, 34), // 68/80 -> 85% A
      'sub-eng': calculateScoreBreakdown(10, 9, 19, 38), // 76/80 -> 95% A
      'sub-sci': calculateScoreBreakdown(8, 8, 16, 33), // 65/80 -> 81.3% A
      'sub-civ': calculateScoreBreakdown(9, 9, 18, 37), // 73/80 -> 91.3% A
      'sub-ict': calculateScoreBreakdown(9, 8, 17, 35), // 69/80 -> 86.3% A
    },
    attendance: {
      daysPresent: 65,
      daysSchoolOpened: 65,
    },
    behavioralTraits: {
      punctuality: 5,
      attentiveness: 5,
      neatness: 5,
      honesty: 5,
      leadership: 4,
      teamwork: 5,
      sportsParticipation: 4,
    },
    classTeacherRemark:
      'Sophia has displayed consistent enthusiasm, neat work, and commendable linguistic abilities.',
    principalRemark: 'Excellent results, Sophia. A very promising academic session ahead.',
    published: true,
    generatedDate: '2025-12-18',
  },
  {
    id: 'rep-std-003-2025-term1',
    studentId: 'std-003',
    classId: 'cls-jss1a',
    session: '2025/2026',
    term: 'First Term',
    scores: {
      'sub-mth': calculateScoreBreakdown(7, 8, 15, 30), // 60/80 -> 75% A
      'sub-eng': calculateScoreBreakdown(8, 8, 15, 29), // 60/80 -> 75% A
      'sub-sci': calculateScoreBreakdown(9, 8, 17, 32), // 66/80 -> 82.5% A
      'sub-civ': calculateScoreBreakdown(7, 7, 14, 28), // 56/80 -> 70% B
      'sub-ict': calculateScoreBreakdown(8, 9, 16, 31), // 64/80 -> 80% A
    },
    attendance: {
      daysPresent: 62,
      daysSchoolOpened: 65,
    },
    behavioralTraits: {
      punctuality: 4,
      attentiveness: 4,
      neatness: 4,
      honesty: 5,
      leadership: 4,
      teamwork: 5,
      sportsParticipation: 5,
    },
    classTeacherRemark:
      'Michael is energetic and shows sound analytical ability. With deeper focus in revision, he can achieve top distinction.',
    principalRemark: 'Very commendable work. Maintain the strong drive for excellence.',
    published: true,
    generatedDate: '2025-12-18',
  },
  {
    id: 'rep-std-004-2025-term1',
    studentId: 'std-004',
    classId: 'cls-jss1a',
    session: '2025/2026',
    term: 'First Term',
    scores: {
      'sub-mth': calculateScoreBreakdown(6, 7, 13, 26), // 52/80 -> 65% B
      'sub-eng': calculateScoreBreakdown(8, 8, 16, 31), // 63/80 -> 78.8% A
      'sub-sci': calculateScoreBreakdown(7, 7, 14, 27), // 55/80 -> 68.8% B
      'sub-civ': calculateScoreBreakdown(8, 8, 16, 33), // 65/80 -> 81.3% A
      'sub-ict': calculateScoreBreakdown(7, 7, 15, 29), // 58/80 -> 72.5% B
    },
    attendance: {
      daysPresent: 60,
      daysSchoolOpened: 65,
    },
    behavioralTraits: {
      punctuality: 4,
      attentiveness: 4,
      neatness: 5,
      honesty: 5,
      leadership: 3,
      teamwork: 4,
      sportsParticipation: 3,
    },
    classTeacherRemark:
      'Fatima is polite and well-mannered. Her language proficiency is praiseworthy, though extra practice in numerical exercises is encouraged.',
    principalRemark: 'Good progress recorded. Keep striving for higher honors.',
    published: true,
    generatedDate: '2025-12-18',
  },
  {
    id: 'rep-std-005-2025-term1',
    studentId: 'std-005',
    classId: 'cls-jss1a',
    session: '2025/2026',
    term: 'First Term',
    scores: {
      'sub-mth': calculateScoreBreakdown(5, 6, 11, 22), // 44/80 -> 55% C
      'sub-eng': calculateScoreBreakdown(6, 6, 12, 24), // 48/80 -> 60% C
      'sub-sci': calculateScoreBreakdown(6, 5, 11, 23), // 45/80 -> 56.3% C
      'sub-civ': calculateScoreBreakdown(7, 7, 13, 27), // 54/80 -> 67.5% B
      'sub-ict': calculateScoreBreakdown(6, 7, 12, 25), // 50/80 -> 62.5% C
    },
    attendance: {
      daysPresent: 58,
      daysSchoolOpened: 65,
    },
    behavioralTraits: {
      punctuality: 3,
      attentiveness: 4,
      neatness: 4,
      honesty: 4,
      leadership: 3,
      teamwork: 4,
      sportsParticipation: 5,
    },
    classTeacherRemark:
      'Joshua has potential but needs to dedicate more hours to personal study and complete homework assignments promptly.',
    principalRemark: 'A fair effort. Encouraged to step up effort in the coming term.',
    published: true,
    generatedDate: '2025-12-18',
  },
  {
    id: 'rep-std-006-2025-term1',
    studentId: 'std-006',
    classId: 'cls-ss1sci',
    session: '2025/2026',
    term: 'First Term',
    scores: {
      'sub-mth': calculateScoreBreakdown(9, 10, 19, 39), // 77/80 -> 96.3% A
      'sub-eng': calculateScoreBreakdown(9, 9, 18, 36),  // 72/80 -> 90% A
      'sub-phy': calculateScoreBreakdown(10, 9, 19, 38), // 76/80 -> 95% A
      'sub-chm': calculateScoreBreakdown(9, 10, 19, 38), // 76/80 -> 95% A
      'sub-bio': calculateScoreBreakdown(9, 9, 18, 37),  // 73/80 -> 91.3% A
      'sub-ict': calculateScoreBreakdown(10, 10, 20, 40), // 80/80 -> 100% A
    },
    attendance: {
      daysPresent: 65,
      daysSchoolOpened: 65,
    },
    behavioralTraits: {
      punctuality: 5,
      attentiveness: 5,
      neatness: 5,
      honesty: 5,
      leadership: 5,
      teamwork: 5,
      sportsParticipation: 4,
    },
    classTeacherRemark:
      'Chloe is a brilliant young scientist who consistently exceeds expectations in theory and laboratory practicals.',
    principalRemark:
      'Exceptional performance at senior secondary tier. Hearty congratulations!',
    published: true,
    generatedDate: '2025-12-18',
  },
];
