
import React from 'react';
import { History, ExternalLink, Calendar, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react';

const MOCK_HISTORY = [
  { id: 1, company: 'Google', role: 'Senior UX Engineer', date: '2024-03-15', status: 'interviewing', location: 'Mountain View, CA' },
  { id: 2, company: 'Stripe', role: 'Frontend Architect', date: '2024-03-10', status: 'applied', location: 'Remote' },
  { id: 3, company: 'Vercel', role: 'Developer Relations', date: '2024-02-28', status: 'rejected', location: 'Remote' },
];

const ApplicationHistoryPage: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl">
            <History size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Application History</h1>
            <p className="text-sm text-slate-500">Keep track of every role you've ApplyWised.</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4">
        {MOCK_HISTORY.map((app) => (
          <div key={app.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-xl text-slate-400">
                {app.company[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                  {app.role}
                  <ExternalLink size={14} className="ml-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                  <span className="flex items-center"><Building2 size={14} className="mr-1" /> {app.company}</span>
                  <span className="flex items-center"><MapPin size={14} className="mr-1" /> {app.location}</span>
                  <span className="flex items-center"><Calendar size={14} className="mr-1" /> {app.date}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                app.status === 'interviewing' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/30' :
                app.status === 'applied' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/10 dark:text-indigo-400 dark:border-indigo-900/30' :
                'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-white/5'
              }`}>
                {app.status}
              </span>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <ChevronRight size={20} className="text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Re-using Building2 and ChevronRight from Sidebar imports via context or global scope
const Building2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/><path d="M15 18h.01"/></svg>
const ChevronRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>

export default ApplicationHistoryPage;
