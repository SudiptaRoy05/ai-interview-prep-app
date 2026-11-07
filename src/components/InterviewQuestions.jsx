import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, Filter, CheckCircle2, Circle, ChevronDown, ChevronUp, 
  Copy, Check, Lightbulb, Code, Sparkles, BookOpen, AlertTriangle, ArrowRight,
  RotateCcw, SlidersHorizontal
} from 'lucide-react';

export default function InterviewQuestions({ 
  language, 
  questions, 
  onBack, 
  onProceedToExam,
  isGenerating
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [expandedIds, setExpandedIds] = useState(() => new Set([1, 2])); // first 2 expanded by default
  const [masteredIds, setMasteredIds] = useState(() => new Set());
  const [copiedId, setCopiedId] = useState(null);
  const [showDoneConfirmModal, setShowDoneConfirmModal] = useState(false);

  // Extract unique topics from the 50 questions
  const uniqueTopics = useMemo(() => {
    const set = new Set(questions.map(q => q.topic).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [questions]);

  // Filter questions based on search, difficulty, and topic
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchSearch = 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.topic && q.topic.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      const matchTopic = selectedTopic === 'All' || q.topic === selectedTopic;

      return matchSearch && matchDiff && matchTopic;
    });
  }, [questions, searchTerm, selectedDifficulty, selectedTopic]);

  // Expand / Collapse toggles
  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(questions.map(q => q.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  // Mastered / Studied toggles
  const toggleMastered = (id, e) => {
    e.stopPropagation();
    setMasteredIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const markAllMastered = () => {
    setMasteredIds(new Set(questions.map(q => q.id)));
  };

  const clearAllMastered = () => {
    setMasteredIds(new Set());
  };

  // Copy code helper
  const handleCopyCode = (id, code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Completion calculation
  const masteredCount = masteredIds.size;
  const totalCount = questions.length; // 50
  const progressPercent = Math.round((masteredCount / totalCount) * 100);

  // Handle Done button
  const handleDoneClick = () => {
    if (masteredCount < totalCount) {
      setShowDoneConfirmModal(true);
    } else {
      onProceedToExam(questions);
    }
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Intermediate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Advanced':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Switch Language
        </button>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> AI Generated Suite (50 Questions)
          </span>
        </div>
      </div>

      {/* Main Title & Progress Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${language.iconColor} flex items-center justify-center text-white font-extrabold text-xl shadow-lg`}>
                {language.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {language.name} Interview Mastery
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  50 Comprehensive AI-Generated Interview Questions & Code Internals
                </p>
              </div>
            </div>
          </div>

          {/* Progress Tracker Card */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300">Study Progress</span>
              <span className="text-indigo-400 font-mono">{masteredCount} / {totalCount} ({progressPercent}%)</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <button
                onClick={markAllMastered}
                className="hover:text-indigo-300 underline font-medium"
              >
                Mark all as studied
              </button>
              {masteredCount > 0 && (
                <button
                  onClick={clearAllMastered}
                  className="hover:text-rose-400"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3 mb-6">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 50 interview questions & answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Controls: Difficulty + Topic dropdowns + Expand/Collapse */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Difficulty selector */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Topic selector */}
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 max-w-[160px] truncate"
            >
              {uniqueTopics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Expand / Collapse buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={expandAll}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Expand all questions"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Collapse all questions"
              >
                Collapse
              </button>
            </div>

          </div>

        </div>

        {/* Status count */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Showing {filteredQuestions.length} of 50 questions</span>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-indigo-400 hover:underline">
              Clear search filter
            </button>
          )}
        </div>
      </div>

      {/* Questions List (50 Questions) */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedIds.has(q.id);
          const isMastered = masteredIds.has(q.id);

          return (
            <div
              key={q.id}
              className={`rounded-2xl transition-all duration-200 border ${
                isMastered
                  ? 'bg-slate-900/40 border-emerald-500/30'
                  : 'bg-slate-900/90 border-slate-800/90 hover:border-slate-700'
              }`}
            >
              {/* Question Header (Always Visible) */}
              <div
                onClick={() => toggleExpand(q.id)}
                className="p-5 flex items-start gap-4 cursor-pointer select-none"
              >
                {/* Mastered Checkbox Button */}
                <button
                  onClick={(e) => toggleMastered(q.id, e)}
                  className={`mt-0.5 p-1 rounded-lg transition-colors ${
                    isMastered
                      ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                  }`}
                  title={isMastered ? 'Marked as mastered' : 'Click to mark as mastered'}
                >
                  {isMastered ? (
                    <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                {/* Question Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-indigo-400">
                      #{q.id}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyBadge(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                    {q.topic && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50">
                        {q.topic}
                      </span>
                    )}
                    {isMastered && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Mastered
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                    {q.question}
                  </h3>
                </div>

                {/* Expand Indicator */}
                <div className="p-1 rounded-lg text-slate-400 hover:text-white">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Collapsible Answer & Code Area */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/60 space-y-4 text-sm text-slate-300">
                  
                  {/* Detailed Explanation */}
                  <div className="leading-relaxed text-slate-300 text-xs sm:text-sm pl-9">
                    <p className="whitespace-pre-line">{q.answer}</p>
                  </div>

                  {/* Code Example Snippet */}
                  {q.code && (
                    <div className="ml-9 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1.5 font-mono">
                          <Code className="w-3.5 h-3.5 text-indigo-400" /> {language.name} Example
                        </span>
                        <button
                          onClick={(e) => handleCopyCode(q.id, q.code, e)}
                          className="flex items-center gap-1 hover:text-white text-slate-400 transition-colors px-2 py-0.5 rounded bg-slate-800/60"
                        >
                          {copiedId === q.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3.5 overflow-x-auto text-xs font-mono text-indigo-200/90 leading-relaxed">
                        <code>{q.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Interviewer Tip */}
                  {q.tip && (
                    <div className="ml-9 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-200">Interviewer Tip: </strong>
                        <span>{q.tip}</span>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Sticky Bar: "DONE - Take Exam" */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              {progressPercent}%
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{masteredCount} of {totalCount} Questions Studied</span>
                {masteredCount === totalCount && (
                  <span className="text-emerald-400 font-semibold">(100% Ready!)</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Exam contains 20 AI-generated questions from these 50
              </p>
            </div>
          </div>

          {/* Primary Action Button: DONE */}
          <button
            onClick={handleDoneClick}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Done — Proceed to 20-Question Exam</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Confirmation Modal if user hasn't marked all 50 */}
      {showDoneConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white text-center mb-2">
              Ready for the Exam?
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 text-center mb-6 leading-relaxed">
              You have marked <strong className="text-white">{masteredCount} of 50</strong> questions as studied. The exam will test 20 questions synthesized from this collection.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => setShowDoneConfirmModal(false)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Review More Questions
              </button>

              <button
                onClick={() => {
                  setShowDoneConfirmModal(false);
                  onProceedToExam(questions);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <span>Proceed to Exam Anyway</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
