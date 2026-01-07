
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Shield, Cpu, Activity, GraduationCap, Briefcase, Sparkles } from 'lucide-react';
import WorkExperienceTab from './components/WorkExperienceTab';
import SkillsTab from './components/SkillsTab';
import ProfileCompletion from './components/ProfileCompletion';
import UsageStatistics from './components/UsageStatistics';
import ImportResume from './components/ImportResume';
import { UserProfile } from '../../types';
import { geminiService } from '../../services/geminiService';

interface UserProfileManagementProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const UserProfileManagement: React.FC<UserProfileManagementProps> = ({ profile, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'work' | 'skills' | 'basic'>('work');
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleUpdateField = (field: keyof UserProfile, value: any) => {
    onUpdate({ ...profile, [field]: value });
  };

  const handleResumeImport = async (file: File) => {
    setIsImporting(true);
    setImportSuccess(false);
    try {
      const reader = new FileReader();
      const fileDataPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      
      const fileData = await fileDataPromise;
      const parsedData = await geminiService.parseResume(fileData, file.type);
      
      // Merge parsed data into existing profile with careful array handling
      onUpdate({
        ...profile,
        ...parsedData,
        experience: (parsedData.experience && parsedData.experience.length > 0) ? parsedData.experience : profile.experience,
        education: (parsedData.education && parsedData.education.length > 0) ? parsedData.education : profile.education,
        skills: (parsedData.skills && parsedData.skills.length > 0) ? parsedData.skills : profile.skills,
      });
      
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 5000);
      
      // Switch to work tab to show results
      setActiveTab('work');
    } catch (error) {
      console.error("Import failed:", error);
      alert("Failed to parse resume. Gemini 3 Flash works best with text-heavy PDFs and standard document formats.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
        {importSuccess && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl flex items-center space-x-3 animate-in slide-in-from-top-4">
            <Sparkles size={20} />
            <p className="text-sm font-bold">Profile pre-filled successfully! Review the extracted data below.</p>
          </div>
        )}

        <header className="flex flex-col md:flex-row items-center justify-between mb-12 space-y-4 md:space-y-0">
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
            <ImportResume onImport={handleResumeImport} isImporting={isImporting} />
            <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/10 active:scale-95">
              <Save size={18} />
              <span>Sync Vault</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Main Tabs UI */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center space-x-8 border-b border-slate-100 dark:border-white/5 pb-6 mb-8 overflow-x-auto no-scrollbar">
                 <button 
                   onClick={() => setActiveTab('work')}
                   className={`text-sm font-black uppercase tracking-widest pb-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'work' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-500'}`}>
                   Experience
                 </button>
                 <button 
                   onClick={() => setActiveTab('skills')}
                   className={`text-sm font-black uppercase tracking-widest pb-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'skills' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-500'}`}>
                   Skills & Tech
                 </button>
                 <button 
                   onClick={() => setActiveTab('basic')}
                   className={`text-sm font-black uppercase tracking-widest pb-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'basic' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-500'}`}>
                   Basic Details
                 </button>
              </div>

              <div className="min-h-[400px]">
                {activeTab === 'work' && (
                  <WorkExperienceTab 
                    experience={profile.experience} 
                    onUpdate={(newExp) => handleUpdateField('experience', newExp)} 
                  />
                )}
                {activeTab === 'skills' && (
                  <SkillsTab 
                    skills={profile.skills} 
                    onUpdate={(newSkills) => handleUpdateField('skills', newSkills)} 
                  />
                )}
                {activeTab === 'basic' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center"><User size={12} className="mr-1.5" /> Full Name</label>
                        <input value={profile.fullName} onChange={(e) => handleUpdateField('fullName', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-white font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center"><Mail size={12} className="mr-1.5" /> Contact Email</label>
                        <input value={profile.email} onChange={(e) => handleUpdateField('email', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-white font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center"><Phone size={12} className="mr-1.5" /> Phone Number</label>
                        <input value={profile.phone} onChange={(e) => handleUpdateField('phone', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-white font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center"><MapPin size={12} className="mr-1.5" /> Location</label>
                        <input value={profile.location} onChange={(e) => handleUpdateField('location', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-white font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Professional Summary</label>
                      <textarea value={profile.summary} onChange={(e) => handleUpdateField('summary', e.target.value)} rows={4} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-white font-medium resize-none leading-relaxed" />
                    </div>
                  </div>
                )}
              </div>
            </section>

            <UsageStatistics />
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-8">
            <ProfileCompletion />
            
            <div className="bg-slate-900 dark:bg-indigo-950 rounded-[2.5rem] p-8 text-white overflow-hidden relative group shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <Shield size={140} />
              </div>
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Privacy Guard Active</h4>
              <p className="text-xl font-black mb-3 leading-tight tracking-tight">Local-First Architecture</p>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Your career data is encrypted on your local machine. ApplyWise never transmits raw PII to third-party servers.
              </p>
              <div className="flex items-center space-x-2 text-[10px] font-bold text-emerald-400 italic">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>Vault Verification Sync Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileManagement;
