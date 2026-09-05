import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  Cloud,
  FileCheck2,
  UploadCloud,
  MessageSquare,
  AlertCircle,
  Download,
  Check,
} from 'lucide-react';
import { Header } from './components/Header';
import { ReviewInputSection } from './components/ReviewInputSection';
import { MetricsOverview } from './components/MetricsOverview';
import { SentimentTrendChart } from './components/SentimentTrendChart';
import { WordCloud } from './components/WordCloud';
import { ExecutiveSummarySection } from './components/ExecutiveSummarySection';
import { ReviewFeed } from './components/ReviewFeed';
import { ChatAssistant } from './components/ChatAssistant';
import { WordDetailModal } from './components/WordDetailModal';
import { SAMPLE_DATASETS } from './data/sampleReviews';
import {
  AnalysisResult,
  ActionableArea,
  WordCloudItem,
  GeminiModelChoice,
} from './types';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatPrompt, setChatPrompt] = useState<string>('');
  const [selectedWordItem, setSelectedWordItem] = useState<WordCloudItem | null>(null);
  const [modelChoice, setModelChoice] = useState<GeminiModelChoice>('gemini-3.5-flash');
  const [enableThinking, setEnableThinking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Analyze function
  const runAnalysis = async (
    rawText: string,
    model: GeminiModelChoice = modelChoice,
    thinking: boolean = enableThinking
  ) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawReviews: rawText,
          modelChoice: model,
          enableThinking: thinking,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
      setIsInputModalOpen(false);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMessage(err.message || 'Failed to analyze customer reviews.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Initial load: Auto-run first sample so user sees a vibrant dashboard instantly!
  useEffect(() => {
    runAnalysis(SAMPLE_DATASETS[0].rawText, 'gemini-3.5-flash', false);
  }, []);

  const handleSelectModel = (model: GeminiModelChoice) => {
    setModelChoice(model);
    if (model !== 'gemini-3.1-pro-preview') {
      setEnableThinking(false);
    }
  };

  const handleToggleThinking = () => {
    const nextVal = !enableThinking;
    setEnableThinking(nextVal);
    if (nextVal) {
      setModelChoice('gemini-3.1-pro-preview');
    }
  };

  const handleAskChatAboutAction = (area: ActionableArea) => {
    setChatPrompt(
      `Please provide a comprehensive implementation plan for Actionable Area #${area.title}. Specifically: 1) Root cause analysis, 2) Step-by-step 30-day remediation plan, 3) Metrics to measure success.`
    );
    setIsChatOpen(true);
  };

  const handleAskChatAboutWord = (promptText: string) => {
    setChatPrompt(promptText);
    setIsChatOpen(true);
  };

  const handleExport = () => {
    if (!analysisResult) return;

    const markdownReport = `# Customer Sentiment Analysis Report
Generated on: ${new Date(analysisResult.timestamp).toLocaleString()}
Gemini Model: ${modelChoice} (Thinking: ${enableThinking ? 'High' : 'Standard'})

## Executive Summary
**${analysisResult.executiveSummary.headline}**
${analysisResult.executiveSummary.overallNarrative}

### Metrics Overview
- Net Sentiment Score: ${analysisResult.metrics.averageSentimentScore} (-1.0 to +1.0)
- Positive: ${analysisResult.metrics.positivePercentage}% | Neutral: ${analysisResult.metrics.neutralPercentage}% | Negative: ${analysisResult.metrics.negativePercentage}%
- Estimated NPS: ${analysisResult.metrics.estimatedNps}
- Average Rating: ${analysisResult.metrics.averageRating} / 5.0 (${analysisResult.metrics.totalReviews} reviews)

## Top 3 Actionable Areas for Improvement
${analysisResult.executiveSummary.topActionableAreas
  .map(
    (a, i) => `
### Priority #${i + 1}: ${a.title} (${a.impact} Impact - ${a.category})
- **Problem Statement:** ${a.problemStatement}
- **Recommended Action:** ${a.recommendedAction}
- **Projected Impact:** ${a.projectedImpact}
- **Supporting Customer Evidence:**
${a.supportingEvidence.map((e) => `  * "${e}"`).join('\n')}
`
  )
  .join('\n')}

## Most Frequent Voice-of-Customer Keywords
### Praises:
${analysisResult.wordCloud
  .filter((w) => w.type === 'praise')
  .map((w) => `- ${w.text} (${w.count}x, weight ${w.weight}%)`)
  .join('\n')}

### Complaints:
${analysisResult.wordCloud
  .filter((w) => w.type === 'complaint')
  .map((w) => `- ${w.text} (${w.count}x, weight ${w.weight}%)`)
  .join('\n')}
`;

    const blob = new Blob([markdownReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Customer-Sentiment-Report-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);

    setExportNotice('Report downloaded as Markdown!');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleReset = () => {
    setIsInputModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-[#E0E6ED] flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <Header
        onOpenInput={() => setIsInputModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        onExport={handleExport}
        onReset={handleReset}
        hasData={Boolean(analysisResult)}
        modelChoice={modelChoice}
        onSelectModel={handleSelectModel}
        enableThinking={enableThinking}
        onToggleThinking={handleToggleThinking}
        isAnalyzing={isAnalyzing}
      />

      {/* Notification Toast */}
      {exportNotice && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0A1017] border border-cyan-500/50 text-cyan-200 px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.25)] flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-cyan-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-200 font-semibold uppercase tracking-wider text-[10px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Warning Notice if AI model was under high demand */}
        {analysisResult?.warning && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{analysisResult.warning}</span>
            </div>
          </div>
        )}

        {/* Loading Overlay State if analyzing from scratch */}
        {isAnalyzing && !analysisResult && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center space-y-4 shadow-2xl my-12 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(0,229,255,0.2)] animate-pulse">
              <Sparkles className="w-7 h-7 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-light tracking-tight text-white">
                Neural Analysis Engine Processing...
              </h3>
              <p className="text-xs text-white/50 max-w-md mx-auto mt-1 leading-relaxed">
                Gemini is decomposing review batches, calculating sentiment vectors, categorizing friction vs. praise clusters, and synthesizing strategic intelligence.
              </p>
            </div>
          </div>
        )}

        {/* Populated Dashboard Report */}
        {analysisResult && (
          <div className="space-y-6">
            {/* 1. Metrics Overview */}
            <MetricsOverview metrics={analysisResult.metrics} />

            {/* 2. Sentiment Trend Line Chart Over Time */}
            <SentimentTrendChart data={analysisResult.trendData} />

            {/* 3. Word Cloud of Frequent Complaints & Praises */}
            <WordCloud
              items={analysisResult.wordCloud}
              onSelectWord={(item) => setSelectedWordItem(item)}
            />

            {/* 4. AI-Written Executive Summary with Top 3 Actionable Areas */}
            <ExecutiveSummarySection
              summary={analysisResult.executiveSummary}
              onAskChatAboutAction={handleAskChatAboutAction}
            />

            {/* 5. Granular Parsed Review Explorer */}
            <ReviewFeed reviews={analysisResult.reviews} />
          </div>
        )}

        {/* If no data and not analyzing, show full Ingest Section */}
        {!analysisResult && !isAnalyzing && (
          <ReviewInputSection
            onAnalyze={runAnalysis}
            isAnalyzing={isAnalyzing}
          />
        )}
      </main>

      {/* Review Ingestion Modal */}
      {isInputModalOpen && (
        <ReviewInputSection
          isOpenAsModal={true}
          onCloseModal={() => setIsInputModalOpen(false)}
          onAnalyze={runAnalysis}
          isAnalyzing={isAnalyzing}
        />
      )}

      {/* Word Cloud Inspection Modal */}
      <WordDetailModal
        item={selectedWordItem}
        onClose={() => setSelectedWordItem(null)}
        onAskChat={handleAskChatAboutWord}
      />

      {/* Multi-turn Chat Assistant Drawer */}
      <ChatAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        dashboardResult={analysisResult}
        initialPrompt={chatPrompt}
        onClearInitialPrompt={() => setChatPrompt('')}
      />

      {/* Immersive UI Footer */}
      <footer className="mt-12 py-6 border-t border-white/5 bg-[#05070A]/80 text-[10px] text-white/30 tracking-widest uppercase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Neural Intelligence Engine • Gemini High Precision Analysis</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-white/50">Processing: Latency Optimized</span>
            <span className="text-cyan-400/80">System Status: Optimal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
