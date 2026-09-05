import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Area,
  ComposedChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Layers,
  Info,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { SentimentTrendPoint } from '../types';

interface SentimentTrendChartProps {
  data: SentimentTrendPoint[];
}

export const SentimentTrendChart: React.FC<SentimentTrendChartProps> = ({ data }) => {
  const [chartMode, setChartMode] = useState<'line' | 'composed'>('composed');

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10 flex items-center justify-center min-h-[320px] text-white/40 text-xs">
        No chronological trend data found in this review batch.
      </div>
    );
  }

  // Find peak and trough
  let maxPoint = data[0];
  let minPoint = data[0];
  data.forEach((p) => {
    if (p.averageSentiment > maxPoint.averageSentiment) maxPoint = p;
    if (p.averageSentiment < minPoint.averageSentiment) minPoint = p;
  });

  const firstScore = data[0].averageSentiment;
  const lastScore = data[data.length - 1].averageSentiment;
  const delta = Number((lastScore - firstScore).toFixed(2));
  const isUpward = delta >= 0;

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
      {/* Header & Chart Controls */}
      <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold block">
                Trajectory Analysis
              </span>
              <h3 className="text-base font-light text-white tracking-tight">
                Sentiment Trend Over Time
              </h3>
            </div>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Real-time trajectory tracking, positive vs negative volume distribution, and shift drivers
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <div className="bg-white/[0.04] p-0.5 rounded-xl border border-white/10 text-xs flex items-center">
            <button
              type="button"
              onClick={() => setChartMode('composed')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1 ${
                chartMode === 'composed'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 mr-1" />
              <span>Score & Volume</span>
            </button>
            <button
              type="button"
              onClick={() => setChartMode('line')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                chartMode === 'line'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Trend Line Only
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Stage */}
      <div className="p-5">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'composed' ? (
              <ComposedChart data={data} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="sentimentCyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="sentiment"
                  domain={[-1, 1]}
                  ticks={[-1.0, -0.5, 0, 0.5, 1.0]}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v > 0 ? `+${v}` : `${v}`)}
                />
                <YAxis
                  yAxisId="volume"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  hide={false}
                />
                <ReferenceLine yAxisId="sentiment" y={0} stroke="#00E5FF" strokeOpacity={0.3} strokeDasharray="2 2" />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  yAxisId="volume"
                  dataKey="positiveCount"
                  name="Positive Reviews"
                  fill="#10b981"
                  opacity={0.65}
                  radius={[3, 3, 0, 0]}
                  barSize={14}
                />
                <Bar
                  yAxisId="volume"
                  dataKey="negativeCount"
                  name="Negative Reviews"
                  fill="#f43f5e"
                  opacity={0.65}
                  radius={[3, 3, 0, 0]}
                  barSize={14}
                />
                <Area
                  yAxisId="sentiment"
                  type="monotone"
                  dataKey="averageSentiment"
                  stroke="#00E5FF"
                  strokeWidth={2.5}
                  fill="url(#sentimentCyanGradient)"
                  dot={{ r: 4, fill: '#00E5FF', strokeWidth: 2, stroke: '#05070A' }}
                  activeDot={{ r: 6, fill: '#00E5FF', stroke: '#ffffff' }}
                />
              </ComposedChart>
            ) : (
              <LineChart data={data} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[-1, 1]}
                  ticks={[-1.0, -0.5, 0, 0.5, 1.0]}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v > 0 ? `+${v}` : `${v}`)}
                />
                <ReferenceLine y={0} stroke="#00E5FF" strokeOpacity={0.3} strokeDasharray="2 2" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="averageSentiment"
                  name="Sentiment Score"
                  stroke="#00E5FF"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#00E5FF', strokeWidth: 2, stroke: '#05070A' }}
                  activeDot={{ r: 6, fill: '#00E5FF', stroke: '#ffffff' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Sentiment Trajectory Insights Footnote */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block">
              Trend Direction
            </span>
            <div className="mt-1 flex items-center space-x-1.5">
              {isUpward ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-semibold ${isUpward ? 'text-emerald-400' : 'text-red-400'}`}>
                {isUpward ? `Improving (+${delta})` : `Declining (${delta})`}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block">
              Sentiment High Point
            </span>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm font-light text-white">{maxPoint.period}</span>
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                +{maxPoint.averageSentiment}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block">
              Sentiment Low Point
            </span>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm font-light text-white">{minPoint.period}</span>
              <span className="text-xs font-mono font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded">
                {minPoint.averageSentiment}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Rich Tooltip for Line/Composed Chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const p = payload[0].payload as SentimentTrendPoint;
    const isPos = p.averageSentiment >= 0;

    return (
      <div className="bg-[#0A1017] text-white p-3.5 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-cyan-500/30 text-xs space-y-2 max-w-xs z-50 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <span className="font-semibold text-white/90">{p.period}</span>
          <span
            className={`font-mono font-semibold px-1.5 py-0.5 rounded text-[10px] border ${
              isPos ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30'
            }`}
          >
            Score: {isPos ? `+${p.averageSentiment}` : p.averageSentiment}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="bg-white/[0.03] border border-white/5 p-1.5 rounded-lg">
            <span className="text-emerald-400 block font-bold font-mono">+{p.positiveCount}</span>
            <span className="text-white/40 text-[9px] uppercase tracking-wider">Positive</span>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-1.5 rounded-lg">
            <span className="text-amber-400 block font-bold font-mono">{p.neutralCount}</span>
            <span className="text-white/40 text-[9px] uppercase tracking-wider">Neutral</span>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-1.5 rounded-lg">
            <span className="text-red-400 block font-bold font-mono">-{p.negativeCount}</span>
            <span className="text-white/40 text-[9px] uppercase tracking-wider">Negative</span>
          </div>
        </div>

        {p.notableDrivers && (
          <div className="pt-1 text-white/60 border-t border-white/10 flex items-start space-x-1 text-[11px]">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{p.notableDrivers}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};
