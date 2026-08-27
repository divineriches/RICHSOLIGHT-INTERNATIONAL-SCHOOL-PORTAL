import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Subject } from '../types';
import { BookOpen, Plus, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';

export const SubjectManager: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject, setActiveTab } = usePortal();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Subject['category']>('Core');
  const [teacherName, setTeacherName] = useState('');

  const openAddModal = () => {
    setEditingSubject(null);
    setCode('');
    setName('');
    setCategory('Core');
    setTeacherName('');
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subject) => {
    setEditingSubject(sub);
    setCode(sub.code);
    setName(sub.name);
    setCategory(sub.category);
    setTeacherName(sub.teacherName);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        category,
        teacherName: teacherName.trim(),
      });
    } else {
      addSubject({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        category,
        teacherName: teacherName.trim(),
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum & Subjects</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Subject Inventory & Teachers
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Add curriculum subjects, departmental categories, and assigned instructors.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Subject</span>
          </button>
        </div>
      </div>

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Subjects Configured Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
            Add curriculum subjects with assessment weighting (e.g. Mathematics, English Language, Physics).
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-500 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Subject</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(sub => {
            const catBg =
              sub.category === 'Core'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : sub.category === 'Sciences'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : sub.category === 'Commercial'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-purple-50 text-purple-800 border-purple-200';

            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase border ${catBg}`}
                    >
                      {sub.code}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditModal(sub)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete subject ${sub.name}?`)) {
                            deleteSubject(sub.id);
                          }
                        }}
                        className="p-1 rounded text-rose-400 hover:text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 mt-1">{sub.name}</h3>
                  <span className="inline-block text-[11px] text-slate-500 uppercase font-medium mt-0.5">
                    Category: {sub.category}
                  </span>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <span>Instructor:</span>{' '}
                    <strong className="text-slate-900">{sub.teacherName || 'Unassigned'}</strong>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Max Mark: 80</span>
                  <button
                    onClick={() => setActiveTab('admin-scores')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800"
                  >
                    Grade Subject &rarr;
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
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
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
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  placeholder="e.g. Further Mathematics"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold uppercase"
                    placeholder="e.g. MTH 102"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">
                    Department Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as Subject['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  >
                    <option value="Core">Core</option>
                    <option value="Sciences">Sciences</option>
                    <option value="Arts & Humanities">Arts & Humanities</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Vocational">Vocational</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">
                  Subject Teacher
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={e => setTeacherName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  placeholder="e.g. Mr. K. Balogun"
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
                  {editingSubject ? 'Save Changes' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
