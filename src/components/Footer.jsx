import React from 'react';
import { Sparkles, Terminal, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-400">DevPrep AI</span>
          <span>— Full-Spectrum Technical Interview & Exam Platform</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 50 Questions + 20-Q Exam Mode
          </span>
          <span>Crafted for Software Engineers</span>
        </div>

      </div>
    </footer>
  );
}
