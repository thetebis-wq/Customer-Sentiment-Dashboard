import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Zap,
  Quote,
  Swords,
  Target,
  Copy,
  Check,
  Flame,
  ShieldCheck,
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
  const [copiedHookIdx, setCopiedHookIdx] = useState<number | null>(null);

  if (!summary) return null;

  const isCompetitorMode =
    summary.analysisMode === 'competitor_teardown' || Boolean(summary.competitorInsights);

  const handleCopyHook = (hookText: string, idx: number) => {
    navigator.clipboard.writeText(hookText);
    setCopiedHookIdx(idx);
    setTimeout(() => setCopiedHookIdx(null), 2500);
  };

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden print:border-slate-300 print:bg-white print:text-black">
      {/* Executive Header Banner */}
      <div className="p-6 bg-[#05070A]/80 border-b border-white/10 text-white print:bg-slate-50 print:text-black print:border-slate-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className={`p-1.5 rounded-lg border shadow-sm ${
              isCompetitorMode
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
            }`}>
              {isCompetitorMode ? <Swords className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </span>
            <span className={`text-[10px] uppercase tracking-[0.3em] font-bold ${
              isCompetitorMode ? 'text-amber-400' : 'text-cyan-400'
            }`}>
              {isCompetitorMode
                ? 'AI Competitor PMF Autopsy Brief'
                : 'AI-Generated Strategic Briefing'}
            </span>
          </div>
          <span className="text-[11px] text-white/40 font-mono print:text-slate-500">
            Gemini Reasoning Vector Analysis
          </span>
        </div>

        <h2 className="mt-3 text-xl sm:text-2xl font-light tracking-tight text-white print:text-black">
          {summary.headline || 'Executive Customer Sentiment Diagnostic'}
        </h2>

        <p className="mt-2 text-sm sm:text-base text-white/70 leading-relaxed max-w-4xl font-light print:text-slate-700">
          {summary.overallNarrative}
        </p>

        {/* Competitor Teardown Specific Intelligence Blocks */}
        {isCompetitorMode && summary.competitorInsights && (
          <div className="mt-6 space-y-4 pt-4 border-t border-white/10 print:border-slate-300">
            {/* The Commercial Wedge Highlight */}
            {summary.competitorInsights.theWedge && (
              <div className="bg-amber-500/10 border-l-4 border-amber-400 p-4 rounded-xl text-amber-200 border border-amber-500/20 print:bg-amber-50 print:text-amber-900 print:border-amber-300">
                <div className="flex items-center space-x-2 text-amber-400 print:text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
                  <Target className="w-4 h-4" />
                  <span>The Commercial Wedge (Ángulo de Ataque Competitivo)</span>
                </div>
                <p className="text-sm text-white/90 print:text-black leading-relaxed font-medium">
                  {summary.competitorInsights.theWedge}
                </p>
              </div>
            )}

            {/* Switching Triggers vs Minimum Table Stakes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Switching Triggers */}
              {summary.competitorInsights.switchingTriggers?.length > 0 && (
                <div className="bg-white/[0.02] rounded-xl p-4 border-l-2 border-red-500 border border-white/5 print:border-slate-200 print:bg-slate-50">
                  <div className="flex items-center space-x-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Disparadores de Cancelación (Switching Triggers)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-white/80 print:text-slate-800">
                    {summary.competitorInsights.switchingTriggers.map((st, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-red-400 font-bold">•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Table Stakes */}
              {summary.competitorInsights.minimumTableStakes?.length > 0 && (
                <div className="bg-white/[0.02] rounded-xl p-4 border-l-2 border-emerald-500 border border-white/5 print:border-slate-200 print:bg-slate-50">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Table Stakes Mínimos Innegociables</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-white/80 print:text-slate-800">
                    {summary.competitorInsights.minimumTableStakes.map((ts, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{ts}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Direct Response Ad Hooks */}
            {summary.competitorInsights.adHooks?.length > 0 && (
              <div className="bg-white/[0.02] rounded-xl p-4 border border-white/10 print:border-slate-300 print:bg-slate-50">
                <div className="flex items-center space-x-2 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ganchos Publicitarios de Respuesta Directa (Ad Hooks)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {summary.competitorInsights.adHooks.map((hook, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-black/40 border border-white/10 rounded-lg text-xs flex flex-col justify-between group print:bg-white print:border-slate-300"
                    >
                      <p className="text-white/80 print:text-black italic leading-snug">
                        {hook}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopyHook(hook, i)}
                        className="mt-2 self-end text-[10px] text-cyan-400 hover:text-cyan-200 flex items-center space-x-1 cursor-pointer print:hidden min-h-[32px]"
                      >
                        {copiedHookIdx === i ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar gancho</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Standard Strengths and Risks Highlight Blocks (for Self-Audit or general baseline) */}
        {!isCompetitorMode && (summary.keyStrengths?.length > 0 || summary.urgentRisks?.length > 0) && (
          <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 print:border-slate-300">
            {/* Strengths */}
            {summary.keyStrengths?.length > 0 && (
              <div className="bg-white/[0.02] rounded-xl p-4 border-l-2 border-emerald-500 border border-white/5 print:border-slate-200 print:bg-slate-50">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Key Affinity Strengths</span>
                </div>
                <ul className="space-y-1.5 text-xs text-white/70 print:text-slate-800">
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
              <div className="bg-white/[0.02] rounded-xl p-4 border-l-2 border-red-500 border border-white/5 print:border-slate-200 print:bg-slate-50">
                <div className="flex items-center space-x-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Urgent Friction Vectors</span>
                </div>
                <ul className="space-y-1.5 text-xs text-white/70 print:text-slate-800">
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

      {/* Top 3 Actionable Areas */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold">
                {isCompetitorMode ? 'Vulnerability Exploitation' : 'Strategic Remediation'}
              </span>
            </div>
            <h3 className="text-lg font-light text-white tracking-tight mt-0.5 print:text-black">
              {isCompetitorMode
                ? 'Top 3 Vulnerabilidades Críticas a Explotar'
                : 'Top 3 Actionable Areas for Improvement'}
            </h3>
          </div>
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 print:border-slate-400 print:text-black">
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

            return (
              <div
                key={area.id || idx}
                className="bg-white/[0.02] border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-cyan-500/30 transition-all hover:bg-white/[0.04] group print:border-slate-300 print:bg-white"
              >
                <div className="space-y-3">
                  {/* Top Category & Priority Indicator */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-white/40 font-mono print:text-slate-500">
                      Priority #{idx + 1} • {area.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${impactBadgeColor}`}
                    >
                      {area.impact}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white leading-snug group-hover:text-cyan-300 transition-colors print:text-black">
                    {area.title}
                  </h4>

                  {/* Problem Statement */}
                  <div className="text-xs text-white/70 leading-relaxed font-light print:text-slate-700">
                    <strong className="text-white/90 font-medium block text-[11px] mb-0.5 print:text-black">
                      Vulnerabilidad Observada:
                    </strong>
                    {area.problemStatement}
                  </div>

                  {/* Supporting Evidence Quote */}
                  {area.supportingEvidence && area.supportingEvidence.length > 0 && (
                    <div className="bg-black/30 rounded-lg p-2.5 border border-white/5 space-y-1 print:bg-slate-50 print:border-slate-200">
                      <div className="flex items-center space-x-1.5 text-[10px] text-white/40 font-mono print:text-slate-500">
                        <Quote className="w-3 h-3 text-cyan-400" />
                        <span>Cita Textual de Respaldo:</span>
                      </div>
                      <p className="text-[11px] text-white/80 italic line-clamp-3 print:text-slate-800">
                        "{area.supportingEvidence[0]}"
                      </p>
                    </div>
                  )}

                  {/* Action Recommendation */}
                  <div className="text-xs text-white/70 leading-relaxed font-light print:text-slate-700">
                    <strong className="text-cyan-300 font-medium block text-[11px] mb-0.5 print:text-cyan-800">
                      Estrategia de Ventaja:
                    </strong>
                    {area.recommendedAction}
                  </div>
                </div>

                {/* Projected Business Impact & Chat Action Button */}
                <div className="mt-5 pt-3 border-t border-white/10 space-y-3 print:border-slate-200">
                  <div className="text-[11px] text-white/60 font-light flex items-start space-x-1.5 print:text-slate-600">
                    <span className="text-emerald-400 font-bold">▲</span>
                    <span>
                      <strong className="text-white/80 font-medium print:text-black">Impacto Estimado: </strong>
                      {area.projectedImpact}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAskChatAboutAction(area)}
                    className="w-full min-h-[44px] flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-cyan-300 hover:text-black bg-cyan-500/10 hover:bg-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition-all active:scale-[0.97] cursor-pointer print:hidden"
                  >
                    <span>Profundizar con Asistente AI</span>
                    <ArrowRight className="w-3 h-3" />
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
