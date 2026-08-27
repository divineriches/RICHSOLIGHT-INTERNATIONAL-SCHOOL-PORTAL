import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SchoolInfo,
  ClassLevel,
  Subject,
  Student,
  StudentReport,
  GradingScale,
  ScoreBreakdown,
  ActiveTab,
} from '../types';
import {
  SEED_SCHOOL_INFO,
  SEED_CLASSES,
  SEED_SUBJECTS,
  SEED_STUDENTS,
  SEED_REPORTS,
} from '../data/seedData';
import { DEFAULT_GRADING_SCALES, calculateScoreBreakdown } from '../utils/grading';

interface PortalContextType {
  schoolInfo: SchoolInfo;
  updateSchoolInfo: (info: Partial<SchoolInfo>) => void;

  classes: ClassLevel[];
  addClass: (newClass: Omit<ClassLevel, 'id'>) => string;
  updateClass: (id: string, updated: Partial<ClassLevel>) => void;
  deleteClass: (id: string) => void;
  getClassById: (id: string) => ClassLevel | undefined;

  subjects: Subject[];
  addSubject: (newSubject: Omit<Subject, 'id'>) => string;
  updateSubject: (id: string, updated: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  getSubjectById: (id: string) => Subject | undefined;

  students: Student[];
  addStudent: (newStudent: Omit<Student, 'id'>) => string;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
  getStudentByRegNumber: (regNumber: string) => Student | undefined;

  reports: StudentReport[];
  saveReport: (report: StudentReport) => void;
  updateStudentSubjectScore: (
    studentId: string,
    subjectId: string,
    ca1: number,
    ca2: number,
    midterm: number,
    exam: number,
    session?: string,
    term?: 'First Term' | 'Second Term' | 'Third Term'
  ) => void;
  getReportByStudent: (
    studentId: string,
    session?: string,
    term?: 'First Term' | 'Second Term' | 'Third Term'
  ) => StudentReport | undefined;

  gradingScales: GradingScale[];
  updateGradingScale: (scales: GradingScale[]) => void;

  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedStudentForPrint: { studentId: string; session: string; term: 'First Term' | 'Second Term' | 'Third Term' } | null;
  setSelectedStudentForPrint: (data: { studentId: string; session: string; term: 'First Term' | 'Second Term' | 'Third Term' } | null) => void;

  resetToSeedData: () => void;
  clearAllData: () => void;
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonData: string) => boolean;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SCHOOL: 'exam_portal_school_info_v2',
  CLASSES: 'exam_portal_classes_v2',
  SUBJECTS: 'exam_portal_subjects_v2',
  STUDENTS: 'exam_portal_students_v2',
  REPORTS: 'exam_portal_reports_v2',
  SCALES: 'exam_portal_scales_v2',
};

// Clean legacy v1 storage if present
if (typeof window !== 'undefined') {
  ['exam_portal_school_info_v1', 'exam_portal_classes_v1', 'exam_portal_subjects_v1', 'exam_portal_students_v1', 'exam_portal_reports_v1', 'exam_portal_scales_v1'].forEach(k => {
    localStorage.removeItem(k);
  });
}

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHOOL);
    return saved ? JSON.parse(saved) : SEED_SCHOOL_INFO;
  });

  const [classes, setClasses] = useState<ClassLevel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
    return saved ? JSON.parse(saved) : [];
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [reports, setReports] = useState<StudentReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [gradingScales, setGradingScales] = useState<GradingScale[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCALES);
    return saved ? JSON.parse(saved) : DEFAULT_GRADING_SCALES;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('public-checker');
  const [selectedStudentForPrint, setSelectedStudentForPrint] = useState<{
    studentId: string;
    session: string;
    term: 'First Term' | 'Second Term' | 'Third Term';
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCALES, JSON.stringify(gradingScales));
  }, [gradingScales]);

  // School actions
  const updateSchoolInfo = (info: Partial<SchoolInfo>) => {
    setSchoolInfo(prev => ({ ...prev, ...info }));
  };

  // Class actions
  const addClass = (newClass: Omit<ClassLevel, 'id'>) => {
    const id = `cls-${Date.now().toString(36)}`;
    const fullClass: ClassLevel = { ...newClass, id };
    setClasses(prev => [...prev, fullClass]);
    return id;
  };

  const updateClass = (id: string, updated: Partial<ClassLevel>) => {
    setClasses(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const getClassById = (id: string) => classes.find(c => c.id === id);

  // Subject actions
  const addSubject = (newSubject: Omit<Subject, 'id'>) => {
    const id = `sub-${Date.now().toString(36)}`;
    const fullSubject: Subject = { ...newSubject, id };
    setSubjects(prev => [...prev, fullSubject]);
    return id;
  };

  const updateSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const getSubjectById = (id: string) => subjects.find(s => s.id === id);

  // Student actions
  const addStudent = (newStudent: Omit<Student, 'id'>) => {
    const id = `std-${Date.now().toString(36)}`;
    const fullStudent: Student = { ...newStudent, id };
    setStudents(prev => [...prev, fullStudent]);
    return id;
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setReports(prev => prev.filter(r => r.studentId !== id));
  };

  const getStudentById = (id: string) => students.find(s => s.id === id);

  const getStudentByRegNumber = (regNumber: string) => {
    if (!regNumber) return undefined;
    const cleanQuery = regNumber.trim().toUpperCase();
    return students.find(s => s.regNumber.trim().toUpperCase() === cleanQuery);
  };

  // Report actions
  const saveReport = (report: StudentReport) => {
    setReports(prev => {
      const idx = prev.findIndex(
        r =>
          r.studentId === report.studentId &&
          r.session === report.session &&
          r.term === report.term
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = report;
        return next;
      }
      return [...prev, report];
    });
  };

  const getReportByStudent = (
    studentId: string,
    session: string = schoolInfo.currentSession,
    term: 'First Term' | 'Second Term' | 'Third Term' = schoolInfo.currentTerm
  ) => {
    return reports.find(
      r => r.studentId === studentId && r.session === session && r.term === term
    );
  };

  const updateStudentSubjectScore = (
    studentId: string,
    subjectId: string,
    ca1: number,
    ca2: number,
    midterm: number,
    exam: number,
    session: string = schoolInfo.currentSession,
    term: 'First Term' | 'Second Term' | 'Third Term' = schoolInfo.currentTerm
  ) => {
    const student = getStudentById(studentId);
    if (!student) return;

    const breakdown = calculateScoreBreakdown(ca1, ca2, midterm, exam, gradingScales);

    setReports(prev => {
      const existing = prev.find(
        r => r.studentId === studentId && r.session === session && r.term === term
      );

      if (existing) {
        const updatedScores = {
          ...existing.scores,
          [subjectId]: breakdown,
        };
        return prev.map(r =>
          r.id === existing.id
            ? {
                ...r,
                scores: updatedScores,
                generatedDate: new Date().toISOString().split('T')[0],
              }
            : r
        );
      } else {
        const newReport: StudentReport = {
          id: `rep-${studentId}-${Date.now().toString(36)}`,
          studentId,
          classId: student.classId,
          session,
          term,
          scores: {
            [subjectId]: breakdown,
          },
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
          classTeacherRemark: 'Satisfactory performance. Continue working diligently.',
          principalRemark: 'Good progress made this term.',
          published: true,
          generatedDate: new Date().toISOString().split('T')[0],
        };
        return [...prev, newReport];
      }
    });
  };

  const updateGradingScale = (scales: GradingScale[]) => {
    setGradingScales(scales);
    // Recalculate all reports with new grading scales
    setReports(prev =>
      prev.map(rep => {
        const recalculatedScores: Record<string, ScoreBreakdown> = {};
        (Object.entries(rep.scores) as [string, ScoreBreakdown][]).forEach(([subId, score]) => {
          recalculatedScores[subId] = calculateScoreBreakdown(
            score.ca1,
            score.ca2,
            score.midterm,
            score.exam,
            scales
          );
        });
        return {
          ...rep,
          scores: recalculatedScores,
        };
      })
    );
  };

  const clearAllData = () => {
    setClasses([]);
    setSubjects([]);
    setStudents([]);
    setReports([]);
    setSelectedStudentForPrint(null);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
  };

  const resetToSeedData = () => {
    setSchoolInfo(SEED_SCHOOL_INFO);
    setClasses(SEED_CLASSES);
    setSubjects(SEED_SUBJECTS);
    setStudents(SEED_STUDENTS);
    setReports(SEED_REPORTS);
    setGradingScales(DEFAULT_GRADING_SCALES);
    localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(SEED_SCHOOL_INFO));
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(SEED_CLASSES));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(SEED_SUBJECTS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(SEED_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
    localStorage.setItem(STORAGE_KEYS.SCALES, JSON.stringify(DEFAULT_GRADING_SCALES));
  };

  const exportDatabaseJSON = () => {
    const data = {
      schoolInfo,
      classes,
      subjects,
      students,
      reports,
      gradingScales,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam_portal_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseJSON = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.schoolInfo) setSchoolInfo(data.schoolInfo);
      if (Array.isArray(data.classes)) setClasses(data.classes);
      if (Array.isArray(data.subjects)) setSubjects(data.subjects);
      if (Array.isArray(data.students)) setStudents(data.students);
      if (Array.isArray(data.reports)) setReports(data.reports);
      if (Array.isArray(data.gradingScales)) setGradingScales(data.gradingScales);
      return true;
    } catch (err) {
      console.error('Failed to import portal database:', err);
      return false;
    }
  };

  return (
    <PortalContext.Provider
      value={{
        schoolInfo,
        updateSchoolInfo,
        classes,
        addClass,
        updateClass,
        deleteClass,
        getClassById,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        getSubjectById,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,
        getStudentByRegNumber,
        reports,
        saveReport,
        updateStudentSubjectScore,
        getReportByStudent,
        gradingScales,
        updateGradingScale,
        activeTab,
        setActiveTab,
        selectedStudentForPrint,
        setSelectedStudentForPrint,
        resetToSeedData,
        clearAllData,
        exportDatabaseJSON,
        importDatabaseJSON,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
