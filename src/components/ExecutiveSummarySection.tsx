import React from 'react';
import {
  FileCheck2,
  Sparkles,
  AlertOctagon,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  ShieldAlert,
  Zap,
  Quote,
} from 'lucide-react';
import { ExecutiveSummary, ActionableArea } from '../types';

interface ExecutiveSummarySectionProps {
  summary: ExecutiveSummary;
  onAskChatAboutAction: (area: ActionableArea) => void;
}

export const ExecutiveSummarySection: React.FC<ExecutiveSummarySectionProps> = ({
  summary,
  onAskChatAboutAction,
}) => {
  if (!summary) return null;

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
      {/* Executive Header Banner */}
      <div className="p-6 bg-[#05070A]/80 border-b border-white/10 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(0,229,255,0.15)]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold">
              AI-Generated Strategic Briefing
            </span>
          </div>
          <span className="text-[11px] text-white/40 font-mono">
            Gemini Reasoning Vector Analysis
          </span>
        </div>

        <h2 className="mt-3 text-xl sm:text-2xl font-light tracking-tight text-white">
          {summary.headline || 'Executive Customer Sentiment Diagnostic'}
        </h2>

        <p className="mt-2 text-sm sm:text-base text-white/70 leading-relaxed max-w-4xl font-light">
          {summary.overallNarrative}
        </p>

        {/* Strengths and Risks Highlight Blocks */}
        {(summary.keyStrengths?.length > 0 || summary.urgentRisks?.length > 0) && (
          <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            {summary.keyStrengths?.length > 0 && (
              <div className="bg-white/[0.02] rounded-xl p-4 border-l-2 border-emerald-500 border border-white/5">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Key Affinity Strengths</span>
                </div>
                <ul className="space-y-1.5 text-xs text-white/70">
                  {summary.keyStrengths.map((st, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Urgent Risks */}
            {summary.urgentRisks?.length > 0 && (
              <div className="bg-white/[0.02] rounded-xl p-4 border-l-2 border-red-500 border border-white/5">
                <div className="flex items-center space-x-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Urgent Friction Vectors</span>
                </div>
                <ul className="space-y-1.5 text-xs text-white/70">
                  {summary.urgentRisks.map((rk, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{rk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Top 3 Actionable Areas for Improvement */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold">
                Strategic Remediation
              </span>
            </div>
            <h3 className="text-lg font-light text-white tracking-tight mt-0.5">
              Top 3 Actionable Areas for Improvement
            </h3>
          </div>
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            3 High-Leverage Initiatives
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {summary.topActionableAreas?.slice(0, 3).map((area, idx) => {
            const isCritical = area.impact === 'Critical';
            const isHigh = area.impact === 'High';

            const impactBadgeColor = isCritical
              ? 'bg-red-500/20 text-red-300 border-red-500/40'
              : isHigh
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

            const accentBorderColor =
              idx === 0
                ? 'border-l-2 border-cyan-500'
                : idx === 1
                ? 'border-l-2 border-emerald-500'
                : 'border-l-2 border-amber-500';

            return (
              <div
                key={area.id || idx}
                className={`rounded-2xl border border-white/10 p-5 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-white/[0.04] transition-all flex flex-col justify-between group ${accentBorderColor}`}
              >
                <div>
                  {/* Priority & Impact Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/20">
                      Priority #{idx + 1}
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${impactBadgeColor}`}>
                      {area.impact} Impact
                    </span>
                  </div>

                  {/* Category */}
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block">
                    {area.category}
                  </span>

                  {/* Title */}
                  <h4 className="text-base font-medium text-white mt-1 leading-snug group-hover:text-cyan-300 transition-colors">
                    {area.title}
                  </h4>

                  {/* Problem Statement */}
                  <div className="mt-3">
                    <span className="text-[10px] uppercase tracking-wider text-white/40 block font-semibold">
                      Diagnostic Finding:
                    </span>
                    <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                      {area.problemStatement}
                    </p>
                  </div>

                  {/* Supporting Evidence Customer Quotes */}
                  {area.supportingEvidence && area.supportingEvidence.length > 0 && (
                    <div className="mt-3.5 bg-white/[0.02] rounded-xl p-3 border border-white/5">
                      <div className="flex items-center space-x-1 text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1.5">
                        <Quote className="w-3 h-3 text-cyan-400" />
                        <span>Customer Verbatim:</span>
                      </div>
                      <div className="space-y-1.5">
                        {area.supportingEvidence.map((quote, qIdx) => (
                          <p
                            key={qIdx}
                            className="text-xs italic text-white/80 font-sans border-l border-cyan-500/40 pl-2 leading-relaxed"
                          >
                            "{quote}"
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Action Plan */}
                  <div className="mt-3.5 bg-cyan-500/5 rounded-xl p-3 border border-cyan-500/20">
                    <span className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold block">
                      Recommended Action:
                    </span>
                    <p className="text-xs text-white/80 mt-0.5 leading-relaxed font-light">
                      {area.recommendedAction}
                    </p>
                  </div>

                  {/* Projected Impact */}
                  {area.projectedImpact && (
                    <div className="mt-3 flex items-start space-x-1.5 text-xs text-emerald-300 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug">
                        <strong className="text-emerald-400 uppercase tracking-wider font-semibold">Uplift: </strong>
                        {area.projectedImpact}
                      </span>
                    </div>
                  )}
                </div>

                {/* Consult Chat on this Area Button */}
                <div className="mt-5 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => onAskChatAboutAction(area)}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/60 shadow-[0_0_10px_rgba(0,229,255,0.1)] transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Deep-dive with AI Consultant</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
