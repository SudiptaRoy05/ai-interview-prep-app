import React, { useState } from 'react';
import { X, Key, ExternalLink, Check, AlertCircle, Sparkles } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey } from '../services/aiGenerator';

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const [keyInput, setKeyInput] = useState(getStoredApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredApiKey(keyInput);
    setSavedSuccess(true);
    if (onKeySaved) onKeySaved(keyInput);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setKeyInput('');
    saveStoredApiKey('');
    if (onKeySaved) onKeySaved('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">AI Engine Settings</h3>
            <p className="text-xs text-slate-400">Google Gemini Live Generation (Optional)</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="p-3.5 mb-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 leading-relaxed flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong>Note:</strong> DevPrep AI is 100% operational out of the box with built-in high-grade question banks and dynamic synthesis. Adding a free Gemini API key lets you generate infinite real-time custom questions for any language!
          </span>
        </div>

        {/* Input */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-semibold text-slate-300">
            Google Gemini API Key
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Stored privately in your browser's localStorage</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium underline"
            >
              Get free key <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          {keyInput && (
            <button
              onClick={handleClear}
              className="px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
            >
              Clear Key
            </button>
          )}

          <button
            onClick={handleSave}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-md ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" /> Saved!
              </>
            ) : (
              'Save & Use AI Engine'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
