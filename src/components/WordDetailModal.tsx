import React from 'react';
import {
  X,
  ThumbsUp,
  ThumbsDown,
  Quote,
  MessageSquare,
  Sparkles,
  BarChart,
} from 'lucide-react';
import { WordCloudItem } from '../types';

interface WordDetailModalProps {
  item: WordCloudItem | null;
  onClose: () => void;
  onAskChat: (prompt: string) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  item,
  onClose,
  onAskChat,
}) => {
  if (!item) return null;

  const isPraise = item.type === 'praise';

  return (
    <div className="fixed inset-0 z-50 bg-[#05070A]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f17] rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div
          className={`p-5 border-b flex items-start justify-between ${
            isPraise
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className="flex items-start space-x-3">
            <span
              className={`p-2 rounded-xl mt-0.5 ${
                isPraise
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}
            >
              {isPraise ? (
                <ThumbsUp className="w-5 h-5 text-emerald-400" />
              ) : (
                <ThumbsDown className="w-5 h-5 text-red-400" />
              )}
            </span>
            <div>
              <span
                className={`text-[10px] font-mono uppercase tracking-widest ${
                  isPraise ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isPraise ? 'Affinity Driver' : 'Friction Vector'} • {item.category}
              </span>
              <h3 className="text-xl font-light text-white tracking-tight mt-0.5">
                "{item.text}"
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details & Metrics */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/40 uppercase font-semibold block">
                Mentions
              </span>
              <span className="text-lg font-mono font-bold text-white mt-0.5 block">
                {item.count ? `${item.count}x` : 'Multiple'}
              </span>
            </div>
            <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/40 uppercase font-semibold block">
                Intensity Weight
              </span>
              <span className="text-lg font-mono font-bold text-cyan-400 mt-0.5 block">
                {item.weight}%
              </span>
            </div>
            <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/40 uppercase font-semibold block">
                Sentiment Score
              </span>
              <span
                className={`text-lg font-mono font-bold mt-0.5 block ${
                  item.sentimentScore >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore}
              </span>
            </div>
          </div>

          {/* Associated Quotes */}
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              <Quote className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customer Voice Excerpts ({item.associatedQuotes?.length || 0})</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {item.associatedQuotes && item.associatedQuotes.length > 0 ? (
                item.associatedQuotes.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/80 italic leading-relaxed font-light"
                  >
                    "{q}"
                  </div>
                ))
              ) : (
                <div className="text-xs text-white/30 italic">
                  Extracted as a high-frequency phrase across the review corpus.
                </div>
              )}
            </div>
          </div>

          {/* Action to query chatbot */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onAskChat(
                  `Analyze the feedback pattern regarding "${item.text}". What root causes explain this ${item.type} and how should we address it?`
                );
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/60 shadow-[0_0_12px_rgba(0,229,255,0.15)] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Investigate "{item.text}" with AI Consultant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
