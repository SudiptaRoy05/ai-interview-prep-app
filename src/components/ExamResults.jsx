import React, { useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, CheckCircle2, XCircle, RotateCcw, BookOpen, Terminal, 
  Clock, Target, BarChart2, Lightbulb, Code, Printer, ChevronRight,
  Filter, Sparkles, Check, X
} from 'lucide-react';

export default function ExamResults({ 
  language, 
  examData, 
  onRetakeExam, 
  onReview50Questions, 
  onSwitchLanguage 
}) {
  const { userAnswers, timeSpentSeconds, examQuestions } = examData;
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'incorrect' | 'correct'

  // Calculate results
  const totalQuestions = examQuestions.length; // 20
  
  const scoreResults = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    const topicStats = {};

    examQuestions.forEach(q => {
      const selected = userAnswers[q.examQuestionId];
      const isCorrect = selected === q.correctIndex;
      const isSkipped = selected === undefined;

      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0 };
      }
      topicStats[q.topic].total += 1;

      if (isCorrect) {
        correct++;
        topicStats[q.topic].correct += 1;
      } else if (isSkipped) {
        unattempted++;
      } else {
        incorrect++;
      }
    });

    const percentage = Math.round((correct / totalQuestions) * 100);
    const passed = percentage >= 70;

    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else grade = 'Needs Work';

    return {
      correct,
      incorrect,
      unattempted,
      percentage,
      passed,
      grade,
      topicStats
    };
  }, [examQuestions, userAnswers, totalQuestions]);

  // Trigger celebration confetti on pass!
  useEffect(() => {
    if (scoreResults.passed) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [scoreResults.passed]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Filtered review questions
  const filteredQuestions = examQuestions.filter(q => {
    const selected = userAnswers[q.examQuestionId];
    const isCorrect = selected === q.correctIndex;
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return !isCorrect;
    return true;
  });

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      
      {/* Top Header / Language Back */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onSwitchLanguage}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <Terminal className="w-3.5 h-3.5" /> All Languages
        </button>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <Printer className="w-3.5 h-3.5" /> Print / Save Report
        </button>
      </div>

      {/* Main Score Hero Card */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 shadow-2xl mb-8 relative overflow-hidden">
        
        {/* Background glow */}
        <div className={`absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
          scoreResults.passed ? 'bg-emerald-500' : 'bg-amber-500'
        }`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          
          {/* Score & Verdict */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                scoreResults.passed
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {scoreResults.passed ? 'PASSED TECHNICAL ASSESSMENT' : 'EXAM COMPLETED — NEEDS PRACTICE'}
              </span>
              <span className="text-xs text-slate-400">
                • {language.name}
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
                {scoreResults.correct} <span className="text-2xl text-slate-500 font-sans font-normal">/ {totalQuestions}</span>
              </div>
              <div className={`text-2xl font-bold ${scoreResults.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {scoreResults.percentage}%
              </div>
              <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white">
                Grade: {scoreResults.grade}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
              {scoreResults.passed
                ? `Outstanding work! You demonstrated strong conceptual proficiency in ${language.name} architecture, memory models, and idiomatic practices.`
                : `You scored ${scoreResults.percentage}%. Target benchmark for senior interviews is 70%+. Review your incorrect questions below and retake the exam to cement the concepts.`}
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Time Spent</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {formatTime(timeSpentSeconds)}
              </div>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Accuracy</span>
              </div>
              <div className="text-base font-bold text-emerald-400 font-mono">
                {scoreResults.percentage}%
              </div>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Correct</span>
              </div>
              <div className="text-base font-bold text-emerald-400 font-mono">
                {scoreResults.correct} Qs
              </div>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Incorrect</span>
              </div>
              <div className="text-base font-bold text-rose-400 font-mono">
                {scoreResults.incorrect + scoreResults.unattempted} Qs
              </div>
            </div>
          </div>

        </div>

        {/* Primary Action Buttons Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <button
            onClick={onRetakeExam}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Retake Exam (Fresh 20 Qs)
          </button>

          <button
            onClick={onReview50Questions}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-slate-700"
          >
            <BookOpen className="w-4 h-4" /> Review 50 Interview Questions
          </button>

          <button
            onClick={onSwitchLanguage}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs transition-colors border border-slate-800"
          >
            Pick Another Language
          </button>
        </div>

      </div>

      {/* Topic Breakdown Section */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 mb-8">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-indigo-400" /> Performance by Topic
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(scoreResults.topicStats).map(([topic, stat]) => {
            const topicPct = Math.round((stat.correct / stat.total) * 100);
            return (
              <div key={topic} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-300 truncate max-w-[160px]">{topic}</span>
                  <span className="font-mono text-indigo-400 font-bold">{stat.correct}/{stat.total} ({topicPct}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      topicPct >= 70 ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${topicPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Question Review Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">
            Detailed 20-Question Examination Review
          </h3>
          <p className="text-xs text-slate-400">
            Compare your selections with the verified solutions and underlying interview mechanics
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filterMode === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({totalQuestions})
          </button>
          <button
            onClick={() => setFilterMode('incorrect')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filterMode === 'incorrect'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            Incorrect ({scoreResults.incorrect + scoreResults.unattempted})
          </button>
          <button
            onClick={() => setFilterMode('correct')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filterMode === 'correct'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            Correct ({scoreResults.correct})
          </button>
        </div>
      </div>

      {/* Questions Review List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const userChoice = userAnswers[q.examQuestionId];
          const isCorrect = userChoice === q.correctIndex;
          const isSkipped = userChoice === undefined;

          return (
            <div
              key={q.examQuestionId}
              className={`p-6 rounded-2xl border transition-all ${
                isCorrect
                  ? 'bg-slate-900/40 border-emerald-500/30'
                  : 'bg-slate-900/90 border-rose-500/30'
              }`}
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400">
                    Question #{q.examQuestionId}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    {q.topic}
                  </span>
                  <span className="text-xs text-slate-500">
                    (Interview Question #{q.sourceQuestionId})
                  </span>
                </div>

                {/* Status indicator */}
                <div>
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                      <Check className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : isSkipped ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-semibold">
                      Skipped
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
                      <X className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <h4 className="text-base font-bold text-white mb-4 leading-snug">
                {q.question}
              </h4>

              {/* Reference Code Snippet if applicable */}
              {q.code && (
                <div className="mb-4 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                  <pre className="p-3 text-xs font-mono text-indigo-200/90 overflow-x-auto">
                    <code>{q.code}</code>
                  </pre>
                </div>
              )}

              {/* Options breakdown */}
              <div className="space-y-2 mb-4">
                {q.options.map((opt, oIdx) => {
                  const isUserSelection = userChoice === oIdx;
                  const isVerifiedCorrect = q.correctIndex === oIdx;

                  let optClass = 'bg-slate-950/60 border-slate-800 text-slate-400';
                  if (isVerifiedCorrect) {
                    optClass = 'bg-emerald-500/15 border-emerald-500 text-emerald-200 font-semibold';
                  } else if (isUserSelection && !isVerifiedCorrect) {
                    optClass = 'bg-rose-500/15 border-rose-500 text-rose-200';
                  }

                  return (
                    <div
                      key={oIdx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${optClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-800/80 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {optionLetters[oIdx]}
                        </span>
                        <span>{opt}</span>
                      </div>

                      <div className="text-[11px] font-bold shrink-0 ml-2">
                        {isVerifiedCorrect && (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Correct Answer
                          </span>
                        )}
                        {isUserSelection && !isVerifiedCorrect && (
                          <span className="text-rose-400 flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> Your Choice
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Solution Explanation */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/50 text-xs text-indigo-200 leading-relaxed">
                <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Key Engineering Concept & Solution:
                </div>
                <p>{q.explanation}</p>
                {q.interviewerTip && (
                  <div className="mt-2 text-[11px] text-amber-300 flex items-center gap-1.5">
                    <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                    <span><strong>Interviewer insight:</strong> {q.interviewerTip}</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
