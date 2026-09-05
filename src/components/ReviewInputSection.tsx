import React, { useState, useRef } from 'react';
import {
  Sparkles,
  BrainCircuit,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  X,
  ShieldCheck,
  Swords,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { SAMPLE_DATASETS } from '../data/sampleReviews';
import { GeminiModelChoice, AnalysisMode } from '../types';
import { parseReviewCsv, CsvParseResult } from '../utils/csvParser';
import { sanitizeReviewsPii, SanitizationResult } from '../utils/zeroPiiSanitizer';

interface ReviewInputSectionProps {
  onAnalyze: (
    text: string,
    model: GeminiModelChoice,
    thinking: boolean,
    analysisMode: AnalysisMode
  ) => void;
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
  const [inputTab, setInputTab] = useState<'text' | 'csv'>('text');
  const [text, setText] = useState<string>(initialText || SAMPLE_DATASETS[0].rawText);
  const [selectedModel, setSelectedModel] = useState<GeminiModelChoice>('gemini-3.5-flash');
  const [thinkingMode, setThinkingMode] = useState<boolean>(false);
  const [activeDatasetId, setActiveDatasetId] = useState<string>(SAMPLE_DATASETS[0].id);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('competitor_teardown');

  // CSV parsing state
  const [csvResult, setCsvResult] = useState<CsvParseResult | null>(null);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [sanitizationStats, setSanitizationStats] = useState<SanitizationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setCsvResult(null);
      setCsvFileName(null);
      // Run Zero-PII check
      const scrubbed = sanitizeReviewsPii(found.rawText);
      setSanitizationStats(scrubbed);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processCsvFile(file);
  };

  const processCsvFile = (file: File) => {
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const parsed = parseReviewCsv(content);
      setCsvResult(parsed);

      if (parsed.success && parsed.formattedPayload) {
        // Run client-side Zero-PII sanitization
        const scrubbed = sanitizeReviewsPii(parsed.formattedPayload);
        setText(scrubbed.sanitizedText);
        setSanitizationStats(scrubbed);
        setActiveDatasetId('');
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processCsvFile(file);
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

    // Final Zero-PII sanitization guard before dispatching
    const safePayload = sanitizeReviewsPii(text);
    onAnalyze(safePayload.sanitizedText, selectedModel, thinkingMode, analysisMode);
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
                  Data Stream Ingestion & Autopsy
                </span>
                <h2 className="text-sm font-light text-white tracking-tight">
                  Customer Review Batch & Teardown Center
                </h2>
              </div>
            </div>
            <p className="text-xs text-white/50 mt-1 font-light">
              Upload CSVs from Trustpilot, G2, Amazon or paste raw text batches with automated Zero-PII sanitization
            </p>
          </div>

          {isOpenAsModal && onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              className="self-end sm:self-auto p-2 min-w-[48px] min-h-[48px] flex items-center justify-center text-white/40 hover:text-white rounded-xl hover:bg-white/10 transition-colors active:scale-[0.97]"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Mode Selector (Competitor Teardown vs Self-Audit) */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-white/50 block mb-2">
            Strategic Analysis Lens (Modo de Diagnóstico)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setAnalysisMode('competitor_teardown')}
              className={`p-3 min-h-[48px] rounded-xl border transition-all text-left flex items-start space-x-3 cursor-pointer active:scale-[0.97] ${
                analysisMode === 'competitor_teardown'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.15)] font-medium'
                  : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:border-white/20'
              }`}
            >
              <Swords className={`w-4 h-4 mt-0.5 shrink-0 ${analysisMode === 'competitor_teardown' ? 'text-amber-400' : 'text-white/40'}`} />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-white">Competitor PMF Teardown</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                    Recomendado
                  </span>
                </div>
                <p className="text-[11px] text-white/50 mt-0.5 leading-tight">
                  Descubre el ángulo de ataque ("The Wedge"), detonantes de cancelación y ganchos publicitarios ofensivos.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAnalysisMode('self_audit')}
              className={`p-3 min-h-[48px] rounded-xl border transition-all text-left flex items-start space-x-3 cursor-pointer active:scale-[0.97] ${
                analysisMode === 'self_audit'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200 shadow-[0_0_12px_rgba(0,229,255,0.15)] font-medium'
                  : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:border-white/20'
              }`}
            >
              <Layers className={`w-4 h-4 mt-0.5 shrink-0 ${analysisMode === 'self_audit' ? 'text-cyan-400' : 'text-white/40'}`} />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-white">Auditoría Interna de Producto</span>
                </div>
                <p className="text-[11px] text-white/50 mt-0.5 leading-tight">
                  Identifica fricciones operativas y prioriza las Top 3 Áreas de Mejora para el roadmap de tu propio producto.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Selector: Text Paste vs CSV Upload */}
        <div className="mt-4 flex items-center space-x-2 border-b border-white/5 pb-2">
          <button
            type="button"
            onClick={() => setInputTab('text')}
            className={`px-3 py-1.5 min-h-[40px] text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 active:scale-[0.97] cursor-pointer ${
              inputTab === 'text'
                ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pegar Texto / Muestras</span>
          </button>
          <button
            type="button"
            onClick={() => setInputTab('csv')}
            className={`px-3 py-1.5 min-h-[40px] text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 active:scale-[0.97] cursor-pointer ${
              inputTab === 'csv'
                ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Subir Archivo CSV / TSV</span>
          </button>
        </div>

        {/* Quick Sample Selector Pills (only when text tab active) */}
        {inputTab === 'text' && (
          <div className="mt-3 flex flex-wrap gap-2">
            {SAMPLE_DATASETS.map((ds) => {
              const isSelected = activeDatasetId === ds.id && text === ds.rawText;
              return (
                <button
                  key={ds.id}
                  type="button"
                  onClick={() => handleSelectDataset(ds.id)}
                  className={`text-xs px-3 py-1.5 min-h-[40px] rounded-xl border transition-all text-left flex items-center space-x-1.5 cursor-pointer active:scale-[0.97] ${
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
        )}
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        {/* CSV Dropzone when CSV tab is selected */}
        {inputTab === 'csv' && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.tsv,.txt"
              className="hidden"
            />
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-cyan-400/60 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all space-y-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {csvFileName ? `Archivo cargado: ${csvFileName}` : 'Arrastra un archivo CSV o haz clic para seleccionarlo'}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  Compatible con exportaciones de Trustpilot, G2, Amazon Reviews, Google Play y App Store (.csv, .tsv)
                </p>
              </div>
            </div>

            {/* CSV Inspection Metadata Banner */}
            {csvResult && (
              <div className={`p-3.5 rounded-xl border text-xs backdrop-blur-sm ${
                csvResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}>
                {csvResult.success ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>CSV parseado exitosamente: {csvResult.totalRows} reseñas detectadas</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-emerald-300/80 font-mono">
                      <span>• Columna Texto: <strong className="text-white">{csvResult.detectedTextColumn}</strong></span>
                      {csvResult.detectedDateColumn && (
                        <span>• Columna Fecha: <strong className="text-white">{csvResult.detectedDateColumn}</strong></span>
                      )}
                      {csvResult.detectedRatingColumn && (
                        <span>• Columna Rating: <strong className="text-white">{csvResult.detectedRatingColumn}</strong></span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{csvResult.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Text Area (always visible, populated by CSV or pasted directly) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-white/60">
            <label htmlFor="raw-reviews-input" className="font-medium text-white/80 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cuerpo de Reseñas para Análisis</span>
            </label>
            <div className="flex items-center space-x-3 text-[11px] font-mono text-cyan-400/70">
              <span>{lineCount} registros</span>
              <span>•</span>
              <span>{wordCount} palabras</span>
              <span>•</span>
              <span>{charCount} caracteres</span>
            </div>
          </div>

          <textarea
            id="raw-reviews-input"
            rows={inputTab === 'csv' ? 5 : 7}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setActiveDatasetId('');
            }}
            placeholder="Pega aquí el lote de reseñas (una reseña por línea, con o sin fechas y valoraciones)..."
            className="w-full font-mono text-xs sm:text-sm p-4 bg-[#05070A]/70 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all placeholder:text-white/20 text-white/90 leading-relaxed resize-y"
          />
        </div>

        {/* Zero-PII Shield Status Badge */}
        {sanitizationStats && sanitizationStats.scrubbedCount > 0 && (
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Gobernanza Zero-PII:</strong> {sanitizationStats.scrubbedCount} elementos identificables anonimizados en cliente ({sanitizationStats.details.emails} emails, {sanitizationStats.details.phones} teléfonos, {sanitizationStats.details.signatures} firmas).
            </span>
          </div>
        )}

        {/* Configuration Bar (Models + High Thinking) */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Model Selector Options */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-white/40 block">
              Motor Gemini
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleModelChange('gemini-3.1-flash-lite')}
                className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-medium border transition-all cursor-pointer active:scale-[0.97] ${
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
                className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-medium border transition-all cursor-pointer active:scale-[0.97] ${
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
                className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-medium border transition-all cursor-pointer active:scale-[0.97] ${
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
              className={`flex items-center space-x-2 px-3 py-2 min-h-[48px] rounded-xl text-xs font-medium border transition-all cursor-pointer active:scale-[0.97] ${
                thinkingMode
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
                  : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <BrainCircuit className={`w-4 h-4 ${thinkingMode ? 'text-purple-400' : 'text-white/40'}`} />
              <div className="text-left">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold">Deep Thinking</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded font-mono font-bold ${
                    thinkingMode ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/40'
                  }`}>
                    {thinkingMode ? 'HIGH' : 'OFF'}
                  </span>
                </div>
                <span className="text-[10px] text-white/40 block">
                  Razonamiento exhaustivo multi-paso
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              setText('');
              setCsvResult(null);
              setCsvFileName(null);
              setSanitizationStats(null);
            }}
            disabled={!text || isAnalyzing}
            className="text-xs text-white/40 hover:text-white/80 transition-colors disabled:opacity-30 cursor-pointer min-h-[48px] px-2 flex items-center active:scale-[0.97]"
          >
            Limpiar buffer
          </button>

          <button
            id="run-sentiment-analysis-btn"
            type="submit"
            disabled={!text.trim() || isAnalyzing}
            className="flex items-center space-x-2 px-6 py-3 min-h-[48px] rounded-xl font-semibold text-xs tracking-wide uppercase bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_18px_rgba(0,229,255,0.35)] disabled:opacity-40 disabled:cursor-not-allowed transition-all transform active:scale-[0.97] cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>
                  {thinkingMode
                    ? 'Razonando con Gemini 3.1 Pro...'
                    : 'Ejecutando Diagnóstico con Gemini...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {analysisMode === 'competitor_teardown'
                    ? 'Generar Competitor Teardown'
                    : 'Generar Reporte de Sentimiento'}
                </span>
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
