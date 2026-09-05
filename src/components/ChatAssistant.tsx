import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  BrainCircuit,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  Zap,
  CornerDownLeft,
} from 'lucide-react';
import { ChatMessage, GeminiModelChoice, AnalysisResult } from '../types';

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardResult: AnalysisResult | null;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  isOpen,
  onClose,
  dashboardResult,
  initialPrompt = '',
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello! I'm your **Senior Voice-of-Customer & CX Strategy Director** powered by Gemini. 

I have direct access to your current sentiment report, trend lines, and word cloud. Ask me to:
- Formulate a prioritized remediation roadmap for your top 3 friction areas
- Calculate estimated churn risk and ROI for engineering fixes
- Draft customer communications, status page advisories, or post-mortems
- Investigate specific sentiment anomalies or customer quote cohorts`,
      timestamp: Date.now(),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<GeminiModelChoice>('gemini-3.5-flash');
  const [enableThinking, setEnableThinking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Handle external prompt injection (e.g. clicking an Actionable Area card or Word in Word Cloud)
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      setInput(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [initialPrompt, onClearInitialPrompt]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleToggleThinking = () => {
    const nextVal = !enableThinking;
    setEnableThinking(nextVal);
    if (nextVal) {
      setSelectedModel('gemini-3.1-pro-preview');
    }
  };

  const handleModelChange = (model: GeminiModelChoice) => {
    setSelectedModel(model);
    if (model !== 'gemini-3.1-pro-preview') {
      setEnableThinking(false);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation payload for multi-turn history
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Summarize dashboard context to give bot rich knowledge
      const dashboardContext = dashboardResult
        ? {
            metrics: dashboardResult.metrics,
            topActionableAreas: dashboardResult.executiveSummary.topActionableAreas,
            headline: dashboardResult.executiveSummary.headline,
            keyStrengths: dashboardResult.executiveSummary.keyStrengths,
            urgentRisks: dashboardResult.executiveSummary.urgentRisks,
            topComplaints: dashboardResult.wordCloud
              .filter((w) => w.type === 'complaint')
              .slice(0, 10)
              .map((w) => `${w.text} (${w.count}x)`),
            topPraises: dashboardResult.wordCloud
              .filter((w) => w.type === 'praise')
              .slice(0, 10)
              .map((w) => `${w.text} (${w.count}x)`),
            trendDips: dashboardResult.trendData.map((t) => ({
              period: t.period,
              sentiment: t.averageSentiment,
              drivers: t.notableDrivers,
            })),
          }
        : null;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          modelChoice: selectedModel,
          enableThinking,
          dashboardContext,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply,
        timestamp: Date.now(),
        modelUsed: data.modelUsed || selectedModel,
        isThinking: data.thinkingUsed || enableThinking,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'model',
        content: `**Consultation Note**: ${err.message || 'Unable to connect to Gemini service.'}\n\nPlease check your Gemini API Key in the Settings > Secrets panel.`,
        timestamp: Date.now(),
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        content:
          "Conversation history cleared. What customer sentiment dimension would you like to explore next?",
        timestamp: Date.now(),
        modelUsed: selectedModel,
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[540px] bg-[#05070A] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-white/10 bg-[#05070A]/95 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.2)]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold block">
                AI Strategic Dialogue
              </span>
              <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] px-1.5 py-0.2 rounded font-mono">
                Multi-Turn
              </span>
            </div>
            <h3 className="text-sm font-medium text-white tracking-tight">
              AI CX Strategy Director
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-1.5 text-white/40 hover:text-red-400 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Model & Thinking Mode Bar */}
      <div className="px-4 py-2 bg-white/[0.02] border-b border-white/10 flex items-center justify-between text-xs">
        {/* Model Switcher */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => handleModelChange('gemini-3.1-flash-lite')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              selectedModel === 'gemini-3.1-flash-lite' && !enableThinking
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Fast
          </button>
          <button
            type="button"
            onClick={() => handleModelChange('gemini-3.5-flash')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              selectedModel === 'gemini-3.5-flash' && !enableThinking
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-white/50 hover:text-white'
            }`}
          >
            General
          </button>
          <button
            type="button"
            onClick={() => handleModelChange('gemini-3.1-pro-preview')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              selectedModel === 'gemini-3.1-pro-preview'
                ? 'bg-cyan-500/30 text-cyan-200 font-semibold border border-cyan-400/40 shadow-[0_0_8px_rgba(0,229,255,0.2)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Pro 3.1
          </button>
        </div>

        {/* Thinking Mode Toggle */}
        <button
          type="button"
          onClick={handleToggleThinking}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
            enableThinking
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.25)] font-bold'
              : 'bg-white/[0.03] text-white/50 border-white/10 hover:text-white'
          }`}
        >
          <BrainCircuit className={`w-3.5 h-3.5 ${enableThinking ? 'text-purple-400 animate-pulse' : 'text-white/40'}`} />
          <span>High Thinking</span>
          {enableThinking && (
            <span className="bg-purple-600 text-white text-[9px] px-1 rounded font-mono">
              ON
            </span>
          )}
        </button>
      </div>

      {/* Suggested Quick Starters */}
      {messages.length <= 2 && (
        <div className="px-4 py-3 bg-cyan-500/5 border-b border-cyan-500/15">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-2">
            Suggested Consultation Inquiries:
          </span>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() =>
                handleSendMessage(
                  'Break down the top 3 actionable areas into a 30-60-90 day engineering and support roadmap.'
                )
              }
              className="text-left text-xs text-white/80 hover:text-cyan-300 bg-white/[0.03] hover:bg-white/[0.06] px-3 py-2 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all flex items-center justify-between group cursor-pointer"
            >
              <span>Build 30-60-90 day remediation roadmap</span>
              <CornerDownLeft className="w-3 h-3 opacity-40 group-hover:opacity-100 text-cyan-400" />
            </button>
            <button
              type="button"
              onClick={() =>
                handleSendMessage(
                  'Draft a transparent executive email to customers addressing the main complaints in this dataset.'
                )
              }
              className="text-left text-xs text-white/80 hover:text-cyan-300 bg-white/[0.03] hover:bg-white/[0.06] px-3 py-2 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all flex items-center justify-between group cursor-pointer"
            >
              <span>Draft empathetic customer apology & update email</span>
              <CornerDownLeft className="w-3 h-3 opacity-40 group-hover:opacity-100 text-cyan-400" />
            </button>
            <button
              type="button"
              onClick={() =>
                handleSendMessage(
                  'What are the strongest affinity points in positive reviews that we should highlight in marketing?'
                )
              }
              className="text-left text-xs text-white/80 hover:text-cyan-300 bg-white/[0.03] hover:bg-white/[0.06] px-3 py-2 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all flex items-center justify-between group cursor-pointer"
            >
              <span>Identify marketing strengths from praises</span>
              <CornerDownLeft className="w-3 h-3 opacity-40 group-hover:opacity-100 text-cyan-400" />
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#05070A]/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-white/10 text-cyan-400 border border-white/10 shadow-2xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/40 rounded-tr-xs shadow-[0_0_12px_rgba(0,229,255,0.1)]'
                    : 'bg-white/[0.03] text-white/90 border border-white/10 rounded-tl-xs backdrop-blur-sm shadow-xs font-light'
                }`}
              >
                {/* Bot Model Badge */}
                {!isUser && (
                  <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-1.5 text-[10px] text-white/40 font-mono">
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{msg.modelUsed || selectedModel}</span>
                      {msg.isThinking && (
                        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1 rounded font-bold">
                          Thinking Mode: High
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-white p-0.5 rounded cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-white/40" />
                      )}
                    </button>
                  </div>
                )}

                {/* Render Markdown-like text simply */}
                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.content}
                </div>

                <div
                  className={`mt-1.5 text-[10px] font-mono ${
                    isUser ? 'text-cyan-300/60 text-right' : 'text-white/30 text-left'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(0,229,255,0.2)]">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl rounded-tl-xs p-3.5 text-xs text-white/70 flex items-center space-x-2">
              <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>
                {enableThinking
                  ? 'Gemini 3.1 Pro is executing multi-step reasoning (High Thinking)...'
                  : 'Synthesizing customer intelligence...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3.5 border-t border-white/10 bg-[#05070A]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end space-x-2"
        >
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask the AI Strategy Director about customer sentiment, fixes, or churn..."
            className="flex-1 p-3 text-xs sm:text-sm bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 resize-none text-white placeholder-white/30 font-light"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_14px_rgba(0,229,255,0.3)] transition-all shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-2 flex items-center justify-between text-[10px] text-white/40 px-1 font-mono">
          <span>Enter to transmit • Shift+Enter for newline</span>
          <span>Role: Senior CX Strategy Director</span>
        </div>
      </div>
    </div>
  );
};
