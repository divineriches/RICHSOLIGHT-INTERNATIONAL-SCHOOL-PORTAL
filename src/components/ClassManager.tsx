import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { ClassLevel } from '../types';
import { School, Plus, Edit2, Trash2, Users, X, CheckCircle2 } from 'lucide-react';

export const ClassManager: React.FC = () => {
  const { classes, students, addClass, updateClass, deleteClass, setActiveTab } = usePortal();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassLevel | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClassLevel['category']>('Junior Secondary');
  const [section, setSection] = useState('');
  const [classTeacher, setClassTeacher] = useState('');
  const [capacity, setCapacity] = useState(35);

  const openAddModal = () => {
    setEditingClass(null);
    setName('');
    setCategory('Junior Secondary');
    setSection('A');
    setClassTeacher('');
    setCapacity(35);
    setIsModalOpen(true);
  };

  const openEditModal = (c: ClassLevel) => {
    setEditingClass(c);
    setName(c.name);
    setCategory(c.category);
    setSection(c.section);
    setClassTeacher(c.classTeacher);
    setCapacity(c.capacity || 35);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingClass) {
      updateClass(editingClass.id, {
        name: name.trim(),
        category,
        section: section.trim(),
        classTeacher: classTeacher.trim(),
        capacity,
      });
    } else {
      addClass({
        name: name.trim(),
        category,
        section: section.trim(),
        classTeacher: classTeacher.trim(),
        capacity,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <School className="w-3.5 h-3.5" />
              <span>Academic Structure</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Class Levels & Arms Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Configure class cohorts, designated teachers, sections, and student enrollment limits.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 hover:to-amber-400 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Class Level</span>
          </button>
        </div>
      </div>

      {/* Class Cards Grid */}
      {classes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-sm">
          <School className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Class Levels Created Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
            Get started by defining your school's classes and arms (e.g. JSS 1 Alpha, Grade 10 Science).
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-500 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Class Level</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map(cls => {
            const enrolledCount = students.filter(s => s.classId === cls.id).length;

            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {cls.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditModal(cls)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                        title="Edit Class"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Delete class ${cls.name}? (Students assigned to this class will need reassignment)`
                            )
                          ) {
                            deleteClass(cls.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete Class"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900">{cls.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Section / Arm: <span className="font-bold text-slate-700">{cls.section || '-'}</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Class Teacher:</span>
                      <span className="font-semibold text-slate-900">{cls.classTeacher || 'None assigned'}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Enrolled Students:</span>
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {enrolledCount} {cls.capacity ? `/ ${cls.capacity}` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveTab('admin-scores');
                    }}
                    className="text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors"
                  >
                    Enter Scores &rarr;
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('admin-broadsheet');
                    }}
                    className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    View Broadsheet
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingClass ? 'Edit Class Details' : 'Create Class Level'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">
                  Class Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  placeholder="e.g. JSS 3A (Grade 9)"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">
                  Category Tier
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ClassLevel['category'])}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                >
                  <option value="Junior Secondary">Junior Secondary</option>
                  <option value="Senior Secondary">Senior Secondary</option>
                  <option value="Primary">Primary</option>
                  <option value="High School">High School</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Section / Arm</label>
                  <input
                    type="text"
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                    placeholder="e.g. Alpha, Science, A"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Target Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value) || 30)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">
                  Assigned Class Teacher
                </label>
                <input
                  type="text"
                  value={classTeacher}
                  onChange={e => setClassTeacher(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  placeholder="e.g. Mr. S. Adeleke"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 shadow-sm"
                >
                  {editingClass ? 'Save Changes' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
