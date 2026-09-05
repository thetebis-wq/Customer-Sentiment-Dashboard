import React from 'react';
import {
  Sparkles,
  BarChart3,
  BrainCircuit,
  UploadCloud,
  FileDown,
  MessageSquare,
  RefreshCw,
  SlidersHorizontal,
  Printer,
} from 'lucide-react';
import { GeminiModelChoice } from '../types';

interface HeaderProps {
  onOpenInput: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  onExport: () => void;
  onPrintPdf: () => void;
  onReset: () => void;
  hasData: boolean;
  modelChoice: GeminiModelChoice;
  onSelectModel: (m: GeminiModelChoice) => void;
  enableThinking: boolean;
  onToggleThinking: () => void;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenInput,
  onToggleChat,
  isChatOpen,
  onExport,
  onPrintPdf,
  onReset,
  hasData,
  modelChoice,
  onSelectModel,
  enableThinking,
  onToggleThinking,
  isAnalyzing,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#05070A]/90 backdrop-blur-md border-b border-white/10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Logo & App Title matching Immersive UI */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.2)]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-bold">
                  Neural Intelligence Engine v2.5
                </h1>
                <div className="hidden sm:flex items-center gap-1.5 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#00E5FF] animate-pulse"></span>
                  <span className="text-[10px] uppercase tracking-widest text-white/50">Active</span>
                </div>
              </div>
              <h2 className="text-lg sm:text-xl font-light tracking-tight text-white">
                Customer Sentiment & PMF Teardown
              </h2>
            </div>
          </div>

          {/* Model & Thinking Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Thinking Mode Toggle Button */}
            <button
              id="header-thinking-toggle"
              type="button"
              onClick={onToggleThinking}
              title="Toggle Gemini High Thinking Mode"
              className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 min-h-[44px] rounded-xl text-xs font-medium transition-all active:scale-[0.97] ${
                enableThinking
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)] font-semibold'
                  : 'bg-white/[0.04] text-white/60 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              <BrainCircuit className={`w-3.5 h-3.5 ${enableThinking ? 'text-purple-300 animate-pulse' : 'text-white/40'}`} />
              <span>Thinking Mode</span>
              {enableThinking && (
                <span className="bg-purple-500 text-white text-[9px] px-1 py-0.2 rounded font-mono font-bold">
                  HIGH
                </span>
              )}
            </button>

            {/* Model Selector Pill */}
            <div className="hidden md:flex items-center bg-white/[0.04] p-0.5 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => onSelectModel('gemini-3.1-flash-lite')}
                className={`px-2.5 py-1 min-h-[40px] rounded-lg transition-colors active:scale-[0.97] ${
                  modelChoice === 'gemini-3.1-flash-lite' && !enableThinking
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Fast
              </button>
              <button
                type="button"
                onClick={() => onSelectModel('gemini-3.5-flash')}
                className={`px-2.5 py-1 min-h-[40px] rounded-lg transition-colors active:scale-[0.97] ${
                  modelChoice === 'gemini-3.5-flash' && !enableThinking
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                General
              </button>
              <button
                type="button"
                onClick={() => onSelectModel('gemini-3.1-pro-preview')}
                className={`px-2.5 py-1 min-h-[40px] rounded-lg transition-colors active:scale-[0.97] ${
                  modelChoice === 'gemini-3.1-pro-preview' || enableThinking
                    ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Pro 3.1
              </button>
            </div>

            {/* Ingest / Change Reviews Button */}
            <button
              id="header-ingest-button"
              type="button"
              onClick={onOpenInput}
              className="flex items-center space-x-1.5 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all cursor-pointer active:scale-[0.97]"
            >
              <UploadCloud className="w-4 h-4" />
              <span className="hidden sm:inline">Cargar Reseñas</span>
              <span className="sm:hidden">Ingesta</span>
            </button>

            {/* Chat Assistant Drawer Toggle */}
            <button
              id="header-chat-toggle"
              type="button"
              onClick={onToggleChat}
              className={`flex items-center space-x-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold border transition-all active:scale-[0.97] ${
                isChatOpen
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                  : 'bg-white/[0.04] text-white/70 hover:text-white border-white/10 hover:border-white/20'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">AI Consultant</span>
            </button>

            {/* Export & Reset buttons when data exists */}
            {hasData && (
              <>
                {/* PDF Print Export Button */}
                <button
                  id="header-print-pdf-button"
                  type="button"
                  onClick={onPrintPdf}
                  title="Exportar Reporte Ejecutivo a PDF"
                  className="flex items-center space-x-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all cursor-pointer active:scale-[0.97]"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span className="hidden md:inline">Reporte PDF</span>
                </button>

                {/* Markdown Export Button */}
                <button
                  id="header-export-button"
                  type="button"
                  onClick={onExport}
                  title="Descargar Reporte Markdown"
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-white/60 hover:text-cyan-400 hover:bg-white/[0.05] border border-white/10 transition-colors active:scale-[0.97]"
                >
                  <FileDown className="w-4 h-4" />
                </button>

                {/* Reset Button */}
                <button
                  id="header-reset-button"
                  type="button"
                  onClick={onReset}
                  title="Cargar Nuevo Lote"
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 border border-white/10 transition-colors active:scale-[0.97]"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
