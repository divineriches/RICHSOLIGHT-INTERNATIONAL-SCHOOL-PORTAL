import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Student } from '../types';
import {
  Users,
  UserPlus,
  Search,
  Printer,
  Edit2,
  Trash2,
  Phone,
  Layers,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

export const StudentManager: React.FC = () => {
  const {
    students,
    classes,
    schoolInfo,
    addStudent,
    updateStudent,
    deleteStudent,
    setSelectedStudentForPrint,
    setActiveTab,
  } = usePortal();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'Transferred'>('Active');

  const openAddModal = () => {
    setEditingStudent(null);
    setFirstName('');
    setLastName('');
    setMiddleName('');
    // Auto-generate next registration number
    const nextNum = (students.length + 1).toString().padStart(3, '0');
    setRegNumber(`STD/2026/${nextNum}`);
    setGender('Male');
    setClassId(classes[0]?.id || '');
    setGuardianName('');
    setGuardianPhone('');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFirstName(student.firstName);
    setLastName(student.lastName);
    setMiddleName(student.middleName || '');
    setRegNumber(student.regNumber);
    setGender(student.gender);
    setClassId(student.classId);
    setGuardianName(student.guardianName);
    setGuardianPhone(student.guardianPhone);
    setStatus(student.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !regNumber.trim()) return;

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        middleName: middleName.trim(),
        regNumber: regNumber.trim().toUpperCase(),
        gender,
        classId,
        guardianName: guardianName.trim(),
        guardianPhone: guardianPhone.trim(),
        status,
      });
    } else {
      addStudent({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        middleName: middleName.trim(),
        regNumber: regNumber.trim().toUpperCase(),
        gender,
        classId,
        guardianName: guardianName.trim(),
        guardianPhone: guardianPhone.trim(),
        status,
      });
    }

    setIsModalOpen(false);
  };

  // Filter students
  const filteredStudents = students.filter(std => {
    const matchesClass = selectedClassFilter === 'ALL' || std.classId === selectedClassFilter;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      std.firstName.toLowerCase().includes(query) ||
      std.lastName.toLowerCase().includes(query) ||
      std.regNumber.toLowerCase().includes(query) ||
      (std.guardianName && std.guardianName.toLowerCase().includes(query));

    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-5">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Student Registry</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Student Enrollment & Profiles
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Add new scholars, assign classes, and generate student registration numbers.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 hover:to-amber-400 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll New Student</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by student name or registration number..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs sm:text-sm font-medium text-slate-900"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div>
            <select
              value={selectedClassFilter}
              onChange={e => setSelectedClassFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs sm:text-sm font-medium text-slate-900"
            >
              <option value="ALL">All Classes & Sections ({students.length} Total)</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({students.filter(s => s.classId === c.id).length} students)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <th className="p-3.5 text-center w-8">#</th>
                <th className="p-3.5 min-w-[120px]">Reg Number</th>
                <th className="p-3.5 min-w-[180px]">Student Full Name</th>
                <th className="p-3.5 min-w-[140px]">Class & Section</th>
                <th className="p-3.5 min-w-[70px]">Gender</th>
                <th className="p-3.5 min-w-[150px]">Guardian & Phone</th>
                <th className="p-3.5 text-center min-w-[80px]">Status</th>
                <th className="p-3.5 text-center min-w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                    No student records matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std, idx) => {
                  const currentClass = classes.find(c => c.id === std.classId);

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 text-center text-slate-400 font-medium">{idx + 1}</td>
                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                          {std.regNumber}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block text-sm">
                          {std.lastName}, {std.firstName} {std.middleName || ''}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800 block">
                          {currentClass?.name || 'Unassigned'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 font-medium">{std.gender}</td>
                      <td className="p-3.5">
                        <span className="text-slate-900 font-medium block">
                          {std.guardianName || 'N/A'}
                        </span>
                        {std.guardianPhone && (
                          <span className="text-[11px] text-slate-500 font-mono flex items-center space-x-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{std.guardianPhone}</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            std.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {std.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* Print Result Slip */}
                          <button
                            onClick={() => {
                              setSelectedStudentForPrint({
                                studentId: std.id,
                                session: schoolInfo.currentSession,
                                term: schoolInfo.currentTerm,
                              });
                              setActiveTab('public-checker');
                            }}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
                            title="View & Print Result Slip"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => openEditModal(std)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Edit Student Profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Are you sure you want to delete ${std.firstName} ${std.lastName}? This will also delete their score reports.`
                                )
                              ) {
                                deleteStudent(std.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingStudent ? 'Edit Student Profile' : 'Enroll New Student'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    placeholder="e.g. Divine"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    placeholder="e.g. Chizalam"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={middleName}
                    onChange={e => setMiddleName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    placeholder="e.g. David"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={regNumber}
                    onChange={e => setRegNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold uppercase"
                    placeholder="STD/2026/001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Class & Section *
                  </label>
                  <select
                    value={classId}
                    onChange={e => setClassId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  >
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as 'Male' | 'Female')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Enrollment Status
                  </label>
                  <select
                    value={status}
                    onChange={e =>
                      setStatus(e.target.value as 'Active' | 'Inactive' | 'Transferred')
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Transferred">Transferred</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Guardian / Parent Name
                  </label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={e => setGuardianName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    placeholder="e.g. Mr. & Mrs. Chizalam"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Guardian Phone Contact
                  </label>
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={e => setGuardianPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 shadow-sm"
                >
                  {editingStudent ? 'Save Changes' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
