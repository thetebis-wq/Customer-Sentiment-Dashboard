import React from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Minus,
  Star,
  Users,
  TrendingUp,
  Activity,
  HeartHandshake,
  AlertTriangle,
} from 'lucide-react';
import { DashboardMetrics } from '../types';

interface MetricsOverviewProps {
  metrics: DashboardMetrics;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics }) => {
  const isNetPositive = metrics.averageSentimentScore >= 0.1;
  const isNetNegative = metrics.averageSentimentScore <= -0.1;

  const sentimentLabel = isNetPositive
    ? 'Favorable Posture'
    : isNetNegative
    ? 'Critical Alert'
    : 'Neutral / Mixed';

  const sentimentColor = isNetPositive
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    : isNetNegative
    ? 'text-red-400 bg-red-500/10 border-red-500/30'
    : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Net Sentiment Score - Highlight Card with Cyan Glow */}
      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/70 font-semibold">
            Net Sentiment
          </span>
          <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${sentimentColor}`}>
            {sentimentLabel}
          </span>
        </div>
        <div className="my-2 flex items-baseline space-x-2">
          <span className="text-4xl font-light text-cyan-400 tracking-tight leading-none">
            {metrics.averageSentimentScore > 0 ? `+${metrics.averageSentimentScore}` : metrics.averageSentimentScore}
          </span>
          <span className="text-[10px] text-cyan-200/50 font-mono">scale -1.0 to +1.0</span>
        </div>
        {/* Visual Sentiment Spectrum Bar */}
        <div className="mt-2">
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden flex">
            <div
              className="bg-emerald-400 h-full"
              style={{ width: `${metrics.positivePercentage}%` }}
              title={`Positive: ${metrics.positivePercentage}%`}
            />
            <div
              className="bg-amber-400 h-full"
              style={{ width: `${metrics.neutralPercentage}%` }}
              title={`Neutral: ${metrics.neutralPercentage}%`}
            />
            <div
              className="bg-red-400 h-full"
              style={{ width: `${metrics.negativePercentage}%` }}
              title={`Negative: ${metrics.negativePercentage}%`}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono text-white/50">
            <span className="text-emerald-400 flex items-center">
              <ThumbsUp className="w-2.5 h-2.5 mr-1" />
              {metrics.positivePercentage}%
            </span>
            <span className="text-amber-400 flex items-center">
              <Minus className="w-2.5 h-2.5 mr-0.5" />
              {metrics.neutralPercentage}%
            </span>
            <span className="text-red-400 flex items-center">
              <ThumbsDown className="w-2.5 h-2.5 mr-1" />
              {metrics.negativePercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Metric 2: Estimated NPS */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-sm hover:border-white/20 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
            Estimated NPS
          </span>
          <span className="p-1.5 rounded-lg bg-white/[0.05] text-cyan-400 border border-white/5">
            <TrendingUp className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="my-2 flex items-baseline space-x-2">
          <span className="text-4xl font-light text-white tracking-tight leading-none">
            {metrics.estimatedNps > 0 ? `+${metrics.estimatedNps}` : metrics.estimatedNps}
          </span>
          <span className="text-[10px] text-white/40 font-mono">range -100 to +100</span>
        </div>
        <div className="text-[11px] text-white/50 leading-relaxed">
          Derived from promoter vs detractor sentiment ratio in parsed batch.
        </div>
      </div>

      {/* Metric 3: Average Star Rating */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-sm hover:border-white/20 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
            Average Rating
          </span>
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
          </span>
        </div>
        <div className="my-2 flex items-baseline space-x-2">
          <span className="text-4xl font-light text-white tracking-tight leading-none">
            {metrics.averageRating.toFixed(1)}
          </span>
          <span className="text-[10px] text-white/40 font-mono">/ 5.0 stars</span>
        </div>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                star <= Math.round(metrics.averageRating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-white/10'
              }`}
            />
          ))}
          <span className="text-[10px] text-white/40 ml-2 font-mono">
            {metrics.totalReviews} reviews
          </span>
        </div>
      </div>

      {/* Metric 4: Top Friction & Praise Categories */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-sm hover:border-white/20 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
            Primary Themes
          </span>
          <span className="p-1.5 rounded-lg bg-white/[0.05] text-cyan-400 border border-white/5">
            <Activity className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="my-1 space-y-2">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="text-[10px] text-white/40 block uppercase tracking-wider">Top Friction:</span>
              <span className="font-medium text-white/90 line-clamp-1">
                {metrics.topComplaintCategory || 'Operational friction'}
              </span>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="text-[10px] text-white/40 block uppercase tracking-wider">Top Affinity:</span>
              <span className="font-medium text-white/90 line-clamp-1">
                {metrics.topPraiseCategory || 'Product usability'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
