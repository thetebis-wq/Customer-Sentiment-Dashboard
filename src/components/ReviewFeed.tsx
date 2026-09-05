import React, { useState } from 'react';
import {
  Search,
  Filter,
  Star,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Calendar,
  MessageSquareQuote,
  ChevronDown,
} from 'lucide-react';
import { ReviewItem, SentimentCategory } from '../types';

interface ReviewFeedProps {
  reviews: ReviewItem[];
}

export const ReviewFeed: React.FC<ReviewFeedProps> = ({ reviews }) => {
  const [filterSentiment, setFilterSentiment] = useState<'all' | SentimentCategory>('all');
  const [search, setSearch] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(10);

  if (!reviews || reviews.length === 0) return null;

  const filtered = reviews.filter((r) => {
    if (filterSentiment !== 'all' && r.sentiment !== filterSentiment) return false;
    if (search && !r.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
      {/* Header & Filters */}
      <div className="p-5 border-b border-white/10 bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <MessageSquareQuote className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold block">
                Corpus Exploration
              </span>
              <h3 className="text-base font-light text-white tracking-tight">
                Parsed Review Explorer ({filtered.length})
              </h3>
            </div>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Detailed granular sentiment decomposition, extracted complaints, and positive drivers per review entry
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in reviews..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white/[0.04] border border-white/10 text-white placeholder-white/30 rounded-xl focus:outline-none focus:border-cyan-500/50 w-36 sm:w-44 font-mono"
            />
          </div>

          {/* Sentiment Filter */}
          <div className="bg-white/[0.04] p-0.5 rounded-xl border border-white/10 text-xs flex items-center">
            <button
              type="button"
              onClick={() => setFilterSentiment('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterSentiment === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterSentiment('positive')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterSentiment === 'positive'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-emerald-400/80 hover:text-emerald-300'
              }`}
            >
              Positive
            </button>
            <button
              type="button"
              onClick={() => setFilterSentiment('neutral')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterSentiment === 'neutral'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              Neutral
            </button>
            <button
              type="button"
              onClick={() => setFilterSentiment('negative')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterSentiment === 'negative'
                  ? 'bg-red-500/20 text-red-300 font-semibold border border-red-500/30'
                  : 'text-red-400/80 hover:text-red-300'
              }`}
            >
              Negative
            </button>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="divide-y divide-white/5">
        {visible.length === 0 ? (
          <div className="text-center py-10 text-xs text-white/40">
            No reviews match the current search or sentiment filter.
          </div>
        ) : (
          visible.map((review, idx) => {
            const isPos = review.sentiment === 'positive';
            const isNeg = review.sentiment === 'negative';

            return (
              <div key={review.id || idx} className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    {/* Sentiment Pill */}
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider ${
                        isPos
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : isNeg
                          ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {isPos ? (
                        <ThumbsUp className="w-3 h-3 mr-1 text-emerald-400" />
                      ) : isNeg ? (
                        <ThumbsDown className="w-3 h-3 mr-1 text-red-400" />
                      ) : (
                        <Minus className="w-3 h-3 mr-0.5 text-amber-400" />
                      )}
                      <span>{review.sentiment}</span>
                      <span className="opacity-80">
                        ({review.sentimentScore > 0 ? `+${review.sentimentScore}` : review.sentimentScore})
                      </span>
                    </span>

                    {/* Star Rating */}
                    {review.rating && (
                      <div className="flex items-center space-x-0.5 ml-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= review.rating!
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-white/10'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  {review.date && (
                    <span className="text-xs text-white/40 font-mono flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-white/30" />
                      {review.date}
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-sm text-white/80 leading-relaxed font-light">
                  {review.text}
                </p>

                {/* Complaints & Praises Chips */}
                {((review.complaints && review.complaints.length > 0) ||
                  (review.praises && review.praises.length > 0)) && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-1">
                    {review.praises?.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                      >
                        ✓ {p}
                      </span>
                    ))}
                    {review.complaints?.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20 font-medium"
                      >
                        ⚠ {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination / Load More */}
      {visibleCount < filtered.length && (
        <div className="p-4 border-t border-white/5 text-center bg-white/[0.01]">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 15)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
          >
            <span>Load More ({filtered.length - visibleCount} remaining)</span>
            <ChevronDown className="w-3.5 h-3.5 ml-1 text-cyan-400" />
          </button>
        </div>
      )}
    </div>
  );
};
