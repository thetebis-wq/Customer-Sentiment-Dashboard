import React, { useState } from 'react';
import {
  Cloud,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Sparkles,
  Quote,
  Search,
  ExternalLink,
} from 'lucide-react';
import { WordCloudItem } from '../types';

interface WordCloudProps {
  items: WordCloudItem[];
  onSelectWord: (item: WordCloudItem) => void;
}

export const WordCloud: React.FC<WordCloudProps> = ({ items, onSelectWord }) => {
  const [filterType, setFilterType] = useState<'all' | 'complaint' | 'praise'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!items || items.length === 0) {
    return (
      <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10 flex items-center justify-center min-h-[300px] text-white/40 text-xs">
        No frequent complaints or praises extracted yet.
      </div>
    );
  }

  // Extract categories
  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));

  // Filter items
  const filtered = items.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchTerm && !item.text.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Calculate stats
  const praiseCount = items.filter((i) => i.type === 'praise').length;
  const complaintCount = items.filter((i) => i.type === 'complaint').length;

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-5 border-b border-white/10 bg-white/[0.01]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Cloud className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold block">
                  Cluster Resonance
                </span>
                <h3 className="text-base font-light text-white tracking-tight">
                  Customer Voice Word Cloud
                </h3>
              </div>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Interactive high-frequency semantic matrix of affinities & points of friction. Click any phrase to reveal customer quotes.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-white/30" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter keywords..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white/[0.04] border border-white/10 text-white placeholder-white/30 rounded-xl focus:outline-none focus:border-cyan-500/50 w-36 sm:w-44 font-mono"
              />
            </div>

            {/* Type Selector */}
            <div className="bg-white/[0.04] p-0.5 rounded-xl border border-white/10 text-xs flex items-center">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filterType === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                All ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('praise')}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1 ${
                  filterType === 'praise'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                    : 'text-emerald-400/80 hover:text-emerald-300'
                }`}
              >
                <ThumbsUp className="w-3 h-3 mr-1" />
                <span>Praises ({praiseCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('complaint')}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1 ${
                  filterType === 'complaint'
                    ? 'bg-red-500/20 text-red-300 font-semibold border border-red-500/40 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
                    : 'text-red-400/80 hover:text-red-300'
                }`}
              >
                <ThumbsDown className="w-3 h-3 mr-1" />
                <span>Complaints ({complaintCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Pill Sub-filter */}
        {categories.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center space-x-2 overflow-x-auto pb-1 text-xs text-white/50">
            <span className="font-semibold text-white/30 text-[10px] uppercase tracking-wider shrink-0">
              Taxonomy:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-0.5 rounded-lg shrink-0 text-xs transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium'
                  : 'bg-white/[0.04] text-white/50 hover:text-white border border-white/5'
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-0.5 rounded-lg shrink-0 text-xs transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium'
                    : 'bg-white/[0.04] text-white/50 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cloud Display Stage */}
      <div className="p-8 bg-[#05070A]/50 min-h-[280px] flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-xs">
            No terms matched your current filter criteria.
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isPraise = item.type === 'praise';

            // Scale font size based on relative weight (1 to 100)
            const weightNormalized = Math.min(100, Math.max(20, item.weight));
            const fontSizeRem = 0.75 + (weightNormalized / 100) * 0.65; // 0.75rem to 1.4rem

            return (
              <button
                key={`${item.text}-${idx}`}
                type="button"
                onClick={() => onSelectWord(item)}
                title={`Click to see quotes for "${item.text}" (${item.count || 1} mentions)`}
                style={{ fontSize: `${fontSizeRem}rem` }}
                className={`group relative inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm ${
                  isPraise
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                    : 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30 hover:border-red-500/60 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
                }`}
              >
                {isPraise ? (
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <ThumbsDown className="w-3.5 h-3.5 text-red-400 shrink-0" />
                )}
                <span className="tracking-tight font-medium">{item.text}</span>

                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isPraise
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {item.count ? `${item.count}x` : `${item.weight}%`}
                </span>

                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-70 text-cyan-300 transition-opacity" />
              </button>
            );
          })
        )}
      </div>

      {/* Cloud Legend & Interaction Helper */}
      <div className="px-5 py-3 bg-white/[0.01] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-white/40 gap-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            <span className="font-medium text-white/70">Praises (Affinity Drivers)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_6px_#f43f5e]" />
            <span className="font-medium text-white/70">Complaints (Friction Drivers)</span>
          </div>
        </div>
        <span className="text-[11px] text-white/40 font-mono">
          Interactive nodes • Click any term to inspect sentiment context
        </span>
      </div>
    </div>
  );
};
