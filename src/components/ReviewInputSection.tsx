import React, { useState } from 'react';
import {
  Sparkles,
  BrainCircuit,
  FileText,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Database,
  X,
} from 'lucide-react';
import { SAMPLE_DATASETS } from '../data/sampleReviews';
import { GeminiModelChoice } from '../types';

interface ReviewInputSectionProps {
  onAnalyze: (text: string, model: GeminiModelChoice, thinking: boolean) => void;
  isAnalyzing: boolean;
  initialText?: string;
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
}

export const ReviewInputSection: React.FC<ReviewInputSectionProps> = ({
  onAnalyze,
  isAnalyzing,
  initialText = '',
  isOpenAsModal = false,
  onCloseModal,
}) => {
  const [text, setText] = useState<string>(initialText || SAMPLE_DATASETS[0].rawText);
  const [selectedModel, setSelectedModel] = useState<GeminiModelChoice>('gemini-3.5-flash');
  const [thinkingMode, setThinkingMode] = useState<boolean>(false);
  const [activeDatasetId, setActiveDatasetId] = useState<string>(SAMPLE_DATASETS[0].id);

  // Compute metrics from text
  const trimmed = text.trim();
  const lineCount = trimmed ? trimmed.split(/\n+/).filter(Boolean).length : 0;
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;

  const handleSelectDataset = (datasetId: string) => {
    const found = SAMPLE_DATASETS.find((d) => d.id === datasetId);
    if (found) {
      setText(found.rawText);
      setActiveDatasetId(datasetId);
    }
  };

  const handleModelChange = (model: GeminiModelChoice) => {
    setSelectedModel(model);
    if (model !== 'gemini-3.1-pro-preview') {
      setThinkingMode(false);
    }
  };

  const handleToggleThinking = () => {
    const nextVal = !thinkingMode;
    setThinkingMode(nextVal);
    if (nextVal) {
      setSelectedModel('gemini-3.1-pro-preview');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isAnalyzing) return;
    onAnalyze(text, selectedModel, thinkingMode);
  };

  const content = (
    <div className="bg-white/[0.03] rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
      {/* Top Banner with Preset Selector */}
      <div className="bg-[#05070A]/80 border-b border-white/10 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Database className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold block">
                  Data Stream Ingestion
                </span>
                <h2 className="text-sm font-light text-white tracking-tight">
                  Batch Review Payload Ingestion
                </h2>
              </div>
            </div>
            <p className="text-xs text-white/50 mt-1 font-light">
              Paste customer feedback batches or choose a pre-structured diagnostic corpus
            </p>
          </div>

          {isOpenAsModal && onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              className="self-end sm:self-auto p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Sample Selector Pills */}
        <div className="mt-3.5 flex flex-wrap gap-2">
          {SAMPLE_DATASETS.map((ds) => {
            const isSelected = activeDatasetId === ds.id && text === ds.rawText;
            return (
              <button
                key={ds.id}
                type="button"
                onClick={() => handleSelectDataset(ds.id)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all text-left flex items-center space-x-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-medium shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                    : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{ds.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        {/* Large Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-white/60">
            <label htmlFor="raw-reviews-input" className="font-medium text-white/80 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Raw Text Stream</span>
            </label>
            <div className="flex items-center space-x-3 text-[11px] font-mono text-cyan-400/70">
              <span>{lineCount} records</span>
              <span>•</span>
              <span>{wordCount} tokens</span>
              <span>•</span>
              <span>{charCount} bytes</span>
            </div>
          </div>

          <textarea
            id="raw-reviews-input"
            rows={8}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setActiveDatasetId('');
            }}
            placeholder="Paste your customer reviews here (e.g. one review per line, with or without dates, ratings, and customer comments)..."
            className="w-full font-mono text-xs sm:text-sm p-4 bg-[#05070A]/70 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all placeholder:text-white/20 text-white/90 leading-relaxed resize-y"
          />
        </div>

        {/* Configuration Bar (Models + High Thinking) */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Model Selector Options */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-white/40 block">
              Gemini Intelligence Model
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleModelChange('gemini-3.1-flash-lite')}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedModel === 'gemini-3.1-flash-lite' && !thinkingMode
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(0,229,255,0.15)] font-semibold'
                    : 'bg-white/[0.03] text-white/60 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                Fast (gemini-3.1-flash-lite)
              </button>
              <button
                type="button"
                onClick={() => handleModelChange('gemini-3.5-flash')}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedModel === 'gemini-3.5-flash' && !thinkingMode
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(0,229,255,0.15)] font-semibold'
                    : 'bg-white/[0.03] text-white/60 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                General (gemini-3.5-flash)
              </button>
              <button
                type="button"
                onClick={() => handleModelChange('gemini-3.1-pro-preview')}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedModel === 'gemini-3.1-pro-preview'
                    ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400/50 shadow-[0_0_10px_rgba(0,229,255,0.2)] font-semibold'
                    : 'bg-white/[0.03] text-white/60 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                Pro (gemini-3.1-pro-preview)
              </button>
            </div>
          </div>

          {/* Thinking Level Toggle */}
          <div className="flex items-center sm:border-l sm:border-white/10 sm:pl-4">
            <button
              type="button"
              onClick={handleToggleThinking}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                thinkingMode
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
                  : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <BrainCircuit className={`w-4 h-4 ${thinkingMode ? 'text-purple-400' : 'text-white/40'}`} />
              <div className="text-left">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold">High Thinking</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded font-mono font-bold ${
                    thinkingMode ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/40'
                  }`}>
                    {thinkingMode ? 'HIGH' : 'OFF'}
                  </span>
                </div>
                <span className="text-[10px] text-white/40 block">
                  Multi-step reasoning diagnostics
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setText('')}
            disabled={!text || isAnalyzing}
            className="text-xs text-white/40 hover:text-white/80 transition-colors disabled:opacity-30 cursor-pointer"
          >
            Clear buffer
          </button>

          <button
            id="run-sentiment-analysis-btn"
            type="submit"
            disabled={!text.trim() || isAnalyzing}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-xs tracking-wide uppercase bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_18px_rgba(0,229,255,0.35)] disabled:opacity-40 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>
                  {thinkingMode
                    ? 'Reasoning with Gemini 3.1 Pro (High Thinking)...'
                    : 'Analyzing Sentiment with Gemini...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Sentiment Report</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 z-50 bg-[#05070A]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-3xl my-8">{content}</div>
      </div>
    );
  }

  return content;
};
