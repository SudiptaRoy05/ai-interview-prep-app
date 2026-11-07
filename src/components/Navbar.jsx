import React from 'react';
import { Sparkles, Terminal, BookOpen, Award, CheckCircle2, Key, ArrowLeft } from 'lucide-react';

export default function Navbar({ currentStep, setStep, selectedLanguage, onOpenApiModal, apiKeySet }) {
  const steps = [
    { id: 'languages', label: '1. Select Language', icon: Terminal },
    { id: 'questions', label: '2. 50 AI Questions', icon: BookOpen },
    { id: 'exam', label: '3. 20-Q Exam', icon: Award },
    { id: 'results', label: '4. Results', icon: CheckCircle2 },
  ];

  const currentIdx = steps.findIndex(s => s.id === currentStep);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div 
          onClick={() => setStep('languages')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                DevPrep AI
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">50 Interview Qs & Adaptive Exam</p>
          </div>
        </div>

        {/* Steps Breadcrumb (Medium+ screens) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isActive = s.id === currentStep;
            const isCompleted = index < currentIdx;
            const isClickable = index <= currentIdx || (s.id === 'questions' && selectedLanguage);

            return (
              <button
                key={s.id}
                disabled={!isClickable}
                onClick={() => isClickable && setStep(s.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : isCompleted
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Active Language Badge & API Settings */}
        <div className="flex items-center gap-2.5">
          {selectedLanguage && currentStep !== 'languages' && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/60 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-white">{selectedLanguage.name}</span>
            </div>
          )}

          <button
            onClick={onOpenApiModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              apiKeySet
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
            }`}
            title="Configure Gemini API Key"
          >
            <Key className={`w-3.5 h-3.5 ${apiKeySet ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{apiKeySet ? 'Gemini AI Active' : 'AI Engine'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
