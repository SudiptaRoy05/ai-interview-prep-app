import React, { useState, useMemo } from 'react';
import { Search, Code2, Sparkles, ArrowRight, BookOpen, Layers, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { LANGUAGES, CATEGORIES } from '../data/languages';

export default function LanguageSelector({ onSelectLanguage, isGenerating }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customLangName, setCustomLangName] = useState('');

  // Filter languages based on search query and category
  const filteredLanguages = useMemo(() => {
    return LANGUAGES.filter(lang => {
      const matchesSearch = 
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || lang.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customLangName.trim()) return;

    const customLang = {
      id: customLangName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: customLangName.trim(),
      version: 'Latest',
      category: 'Custom Specialty',
      iconColor: 'from-pink-500 to-purple-600',
      borderColor: 'hover:border-pink-500/50',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      description: `Custom target programming language requested by candidate for AI interview synthesis.`,
      popularity: 'Specialized',
      difficulty: 'Intermediate',
      topics: ['Language Fundamentals', 'Memory Architecture', 'Async & Concurrency', 'Design Patterns', 'Performance Tuning'],
      companies: ['Industry Top Performers']
    };

    onSelectLanguage(customLang);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI-Powered Technical Preparation Engine</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Select Your Programming Language
        </h1>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
          Click any language to instantly generate <span className="text-indigo-400 font-semibold">50 deep-dive interview questions</span>, study real internal mechanics, and qualify through an <span className="text-indigo-400 font-semibold">adaptive 20-question exam</span>.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-slate-300">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 50 Curated AI Questions
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Code Snippets & Internals
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 20-Question Exam & Scorecard
          </span>
        </div>
      </div>

      {/* Controls: Search + Category Filters */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Search bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search language, topics (e.g. event loop, goroutines, GIL)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Custom Language Form */}
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Or enter any language (e.g. Zig, Elixir)"
              value={customLangName}
              onChange={(e) => setCustomLangName(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-56"
            />
            <button
              type="submit"
              disabled={!customLangName.trim() || isGenerating}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 shrink-0 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" /> Generate
            </button>
          </form>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Language Cards Grid */}
      {filteredLanguages.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          <Code2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-300">No language matching "{searchTerm}"</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search or use the custom language generator above to create questions for any language!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLanguages.map((lang) => (
            <div
              key={lang.id}
              onClick={() => !isGenerating && onSelectLanguage(lang)}
              className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/80 ${lang.borderColor} hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer overflow-hidden`}
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${lang.iconColor} opacity-70 group-hover:opacity-100 transition-opacity`} />

              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lang.iconColor} flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform`}>
                      {lang.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                        {lang.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {lang.version} • {lang.category}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${lang.badgeColor}`}>
                    {lang.popularity}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {lang.description}
                </p>

                {/* Core Topics Pills */}
                <div className="space-y-1.5 mb-5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Key Focus Areas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {lang.topics.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/40"
                      >
                        {topic}
                      </span>
                    ))}
                    {lang.topics.length > 3 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-md text-slate-500">
                        +{lang.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>50 Questions Ready</span>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all">
                  <span>Start Prep</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
