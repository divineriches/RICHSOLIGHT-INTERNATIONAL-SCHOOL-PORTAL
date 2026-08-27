import React from 'react';
import { usePortal } from '../context/PortalContext';
import { ActiveTab } from '../types';
import {
  GraduationCap,
  Search,
  PenTool,
  FileSpreadsheet,
  Users,
  School,
  BookOpen,
  Settings,
  Printer,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { schoolInfo, activeTab, setActiveTab, setSelectedStudentForPrint } = usePortal();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'public-checker',
      label: 'Check Result',
      icon: <Search className="w-4 h-4" />,
      badge: 'Public',
    },
    {
      id: 'admin-scores',
      label: 'Score Entry',
      icon: <PenTool className="w-4 h-4" />,
      badge: 'CA & Exam',
    },
    {
      id: 'admin-broadsheet',
      label: 'Broadsheet',
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
    {
      id: 'admin-students',
      label: 'Students',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'admin-classes',
      label: 'Classes',
      icon: <School className="w-4 h-4" />,
    },
    {
      id: 'admin-subjects',
      label: 'Subjects',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'admin-settings',
      label: 'Settings & Grading',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Name */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => {
              setActiveTab('public-checker');
              setSelectedStudentForPrint(null);
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-sm ring-2 ring-amber-400/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white line-clamp-1">
                  {schoolInfo.name}
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {schoolInfo.currentSession} &bull; {schoolInfo.currentTerm}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block italic line-clamp-1">
                &ldquo;{schoolInfo.motto}&rdquo;
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedStudentForPrint(null);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-slate-950/20 text-slate-950'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Action */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setActiveTab('public-checker');
                setSelectedStudentForPrint(null);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-400/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Student Result Portal</span>
              <span className="sm:hidden">Results</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Scroll */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-800 scrollbar-none">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedStudentForPrint(null);
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
