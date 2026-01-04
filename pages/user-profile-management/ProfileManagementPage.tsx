
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Plus, Trash2, Briefcase, GraduationCap } from 'lucide-react';
import { MOCK_USER_PROFILE } from '../../constants';

const ProfileManagementPage: React.FC = () => {
  const [profile, setProfile] = useState(MOCK_USER_PROFILE);

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Master Profile</h1>
            <p className="text-slate-500 dark:text-slate-400">The source of truth for all your applications.</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/10 active:scale-95">
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </header>

      <div className="space-y-8">
        {/* Basic Info */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Basic Information</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 flex items-center"><User size={12} className="mr-1" /> Full Name</label>
              <input value={profile.fullName} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 flex items-center"><Mail size={12} className="mr-1" /> Email</label>
              <input value={profile.email} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 flex items-center"><Phone size={12} className="mr-1" /> Phone</label>
              <input value={profile.phone} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 flex items-center"><MapPin size={12} className="mr-1" /> Location</label>
              <input value={profile.location} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-white" />
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Work Experience</h2>
            <button className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
              <Plus size={18} />
            </button>
          </div>
          <div className="space-y-4">
            {profile.experience.map((exp, i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-white/5 relative group">
                <button className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={16} />
                </button>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-400"><Briefcase size={20} /></div>
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <input value={exp.role} className="bg-transparent border-b border-slate-200 dark:border-white/10 py-1 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all" />
                      <input value={exp.company} className="bg-transparent border-b border-slate-200 dark:border-white/10 py-1 text-slate-600 dark:text-slate-400 outline-none focus:border-indigo-500 transition-all" />
                    </div>
                    <textarea value={exp.description} rows={2} className="w-full bg-transparent text-sm text-slate-500 leading-relaxed outline-none resize-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileManagementPage;
