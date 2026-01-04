
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Globe, Shield, Activity } from 'lucide-react';
import WorkExperienceTab from './components/WorkExperienceTab';
import SkillsTab from './components/SkillsTab';
import ProfileCompletion from './components/ProfileCompletion';
import UsageStatistics from './components/UsageStatistics';
import ImportResume from './components/ImportResume';
import { MOCK_USER_PROFILE } from '../../constants';

const UserProfileManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'work' | 'skills' | 'preferences'>('work');

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Master Profile</h1>
            <p className="text-slate-500 dark:text-slate-400">The decentralized source of truth for your digital career.</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ImportResume />
          <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/10 active:scale-95">
            <Save size={18} />
            <span>Sync Vault</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-8">
          {/* Main Info */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center space-x-6 border-b border-slate-100 dark:border-white/5 pb-8 mb-8">
               <button 
                 onClick={() => setActiveTab('work')}
                 className={`text-sm font-black uppercase tracking-widest pb-4 border-b-2 transition-all ${activeTab === 'work' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}>
                 Experience
               </button>
               <button 
                 onClick={() => setActiveTab('skills')}
                 className={`text-sm font-black uppercase tracking-widest pb-4 border-b-2 transition-all ${activeTab === 'skills' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}>
                 Skills
               </button>
            </div>

            {activeTab === 'work' && <WorkExperienceTab experience={MOCK_USER_PROFILE.experience} />}
            {activeTab === 'skills' && <SkillsTab skills={MOCK_USER_PROFILE.skills} />}
          </section>

          <UsageStatistics />
        </div>

        <div className="col-span-4 space-y-8">
          <ProfileCompletion />
          
          <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Shield size={120} />
            </div>
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Privacy Guard</h4>
            <p className="text-sm font-bold mb-2">Local-First Storage</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your profile data is encrypted locally. ApplyWise never uploads your raw PII to our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileManagement;
