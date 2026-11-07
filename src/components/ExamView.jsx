import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Flag, CheckCircle2, ChevronLeft, ChevronRight, AlertCircle, 
  Send, Sparkles, Code, Pause, Play, HelpCircle
} from 'lucide-react';

export default function ExamView({ 
  language, 
  examQuestions, 
  onSubmitExam, 
  onCancelExam 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // userAnswers maps examQuestionId -> selectedOptionIndex (0, 1, 2, or 3)
  const [userAnswers, setUserAnswers] = useState({});
  // flaggedIds is a Set of examQuestionIds
  const [flaggedIds, setFlaggedIds] = useState(new Set());
  
  // Timer: 20 minutes (1200 seconds)
  const TOTAL_SECONDS = 20 * 60;
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const startTimeRef = useRef(Date.now());

  const currentQ = examQuestions[currentIndex];
  const totalQuestions = examQuestions.length; // 20

  // Countdown timer effect
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit on timeout
          handleSubmitConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, userAnswers]);

  // Format MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  // Option selection
  const handleSelectOption = (optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.examQuestionId]: optionIndex
    }));
  };

  // Flag toggle
  const toggleFlag = (qId) => {
    setFlaggedIds(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  // Clear answer for current question
  const clearCurrentAnswer = () => {
    setUserAnswers(prev => {
      const next = { ...prev };
      delete next[currentQ.examQuestionId];
      return next;
    });
  };

  // Submit confirmation
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;

  const handleSubmitConfirm = () => {
    const timeSpentSeconds = TOTAL_SECONDS - secondsLeft;
    onSubmitExam({
      userAnswers,
      timeSpentSeconds,
      examQuestions
    });
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
      
      {/* Top Floating Exam Header */}
      <div className="sticky top-20 z-30 mb-6 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Language & Exam Title */}
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${language.iconColor} flex items-center justify-center text-white font-bold text-sm`}>
            {language.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{language.name} Technical Exam</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                20 Questions
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Derived from the 50 interview questions studied
            </p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-xs ${
            secondsLeft < 300 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
              : 'bg-slate-950 text-indigo-300 border-slate-800'
          }`}>
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{formatTime(secondsLeft)}</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs transition-colors"
            title={isPaused ? "Resume Timer" : "Pause Timer"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" /> Submit Exam ({answeredCount}/{totalQuestions})
          </button>
        </div>

      </div>

      {/* Question Number Palette (1 to 20) */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="font-semibold text-slate-300">Question Palette</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Answered ({answeredCount})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Flagged ({flaggedIds.size})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" /> Unanswered ({unansweredCount})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
          {examQuestions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = userAnswers[q.examQuestionId] !== undefined;
            const isFlagged = flaggedIds.has(q.examQuestionId);

            let bgClass = 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700';
            if (isAnswered) bgClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
            if (isFlagged) bgClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
            if (isCurrent) bgClass += ' ring-2 ring-indigo-500';

            return (
              <button
                key={q.examQuestionId}
                onClick={() => setCurrentIndex(idx)}
                className={`h-8 rounded-lg border text-xs font-mono transition-all flex items-center justify-center relative ${bgClass}`}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative">
        
        {/* Question Header & Tags */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-indigo-600/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300">
              {currentQ.topic}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              (Source: Q#{currentQ.sourceQuestionId})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFlag(currentQ.examQuestionId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                flaggedIds.has(currentQ.examQuestionId)
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${flaggedIds.has(currentQ.examQuestionId) ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{flaggedIds.has(currentQ.examQuestionId) ? 'Flagged' : 'Flag Question'}</span>
            </button>

            {userAnswers[currentQ.examQuestionId] !== undefined && (
              <button
                onClick={clearCurrentAnswer}
                className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1"
              >
                Clear choice
              </button>
            )}
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 leading-relaxed">
          {currentQ.question}
        </h3>

        {/* Associated Code Snippet if applicable */}
        {currentQ.code && (
          <div className="mb-6 rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              <span>Reference Snippet</span>
            </div>
            <pre className="p-4 text-xs font-mono text-indigo-200/90 overflow-x-auto leading-relaxed">
              <code>{currentQ.code}</code>
            </pre>
          </div>
        )}

        {/* Multiple Choice Options (A, B, C, D) */}
        <div className="space-y-3 mb-8">
          {currentQ.options.map((optionText, optIdx) => {
            const isSelected = userAnswers[currentQ.examQuestionId] === optIdx;

            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 select-none ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-950'
                }`}
              >
                {/* Option Letter Indicator */}
                <div className={`w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {optionLetters[optIdx]}
                </div>

                <div className="flex-1 text-xs sm:text-sm pt-1 leading-relaxed">
                  {optionText}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Card Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-xs text-slate-500 font-mono">
            {currentIndex + 1} / {totalQuestions}
          </span>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>Next</span> <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>Review & Submit</span> <Send className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-lg font-bold text-white mb-2">Submit Your Exam?</h3>
            
            <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
              You have answered <strong className="text-white">{answeredCount} of {totalQuestions}</strong> questions.
            </p>

            {unansweredCount > 0 && (
              <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  You still have <strong>{unansweredCount} unanswered questions</strong>. Any unanswered questions will be marked incorrect.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Return to Exam
              </button>

              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSubmitConfirm();
                }}
                className="py-2.5 px-5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm & See Results
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
