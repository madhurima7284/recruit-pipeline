import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  GitBranch,
  Calendar,
  BarChart3,
  Settings,
  Upload,
  LogOut,
  Building2,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, shortlistCount = 0 }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    {
      id: 'pipeline',
      label: 'Pipeline',
      icon: GitBranch,
      badge: shortlistCount > 0 ? `${shortlistCount}` : null
    },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-white border-r border-[#E7E5DF] flex flex-col justify-between p-3.5 min-h-[calc(100vh-53px)] text-[#1A1A1A] shrink-0">
      <div className="space-y-5">
        {/* Workspace Brand Header */}
        <div className="px-2 py-1 flex items-center justify-between border-b border-[#E7E5DF] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#3A4032] text-white flex items-center justify-center font-serif text-sm font-bold">
              T
            </div>
            <div>
              <div className="text-xs font-semibold text-[#1A1A1A] tracking-tight">Acme Talent OS</div>
              <div className="text-[10px] text-[#6B6B63]">AI Recruiting Pipeline</div>
            </div>
          </div>
        </div>

        {/* Action Button: Import Resume */}
        <button
          onClick={() => setActiveTab('upload')}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium transition ${
            activeTab === 'upload'
              ? 'bg-[#3A4032] text-white'
              : 'bg-[#FAF9F6] hover:bg-[#EFECE6] text-[#1A1A1A] border border-[#E7E5DF]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import Resumes</span>
        </button>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] font-semibold text-[#6B6B63] uppercase tracking-wider">
            Main Navigation
          </div>
          <nav className="space-y-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#F3F2EE] text-[#3A4032] font-semibold'
                      : 'text-[#6B6B63] hover:bg-[#FAF9F6] hover:text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#3A4032]' : 'text-[#6B6B63]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#EFECE6] text-[#3A4032] rounded border border-[#E7E5DF]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Recruiter Profile & Workspace Footer */}
      <div className="pt-4 border-t border-[#E7E5DF] space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#EFECE6] border border-[#E7E5DF] flex items-center justify-center font-medium text-xs text-[#3A4032] shrink-0">
              SC
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-[#1A1A1A] truncate">Sarah Chen</div>
              <div className="text-[10px] text-[#6B6B63] truncate">Lead Technical Recruiter</div>
            </div>
          </div>
          <button
            title="Logout"
            onClick={() => alert('Logged out from Sarah Chen workspace session.')}
            className="p-1.5 text-[#6B6B63] hover:text-[#1A1A1A] hover:bg-[#FAF9F6] rounded transition shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

