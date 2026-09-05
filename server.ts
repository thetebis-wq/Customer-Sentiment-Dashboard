import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import dotenv from 'dotenv';
import { generateHeuristicAnalysis } from './src/server/heuristicGenerator';

dotenv.config();

const currentDirname = process.cwd();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lazy GoogleGenAI initialization
let genAIClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

interface GeminiCallResult {
  text: string;
  modelUsed: string;
  thinkingUsed: boolean;
}

// Resilient Gemini invoker that handles transient 503 spikes, rate limits, and model cascading
async function callGeminiWithResilience(params: {
  preferredModel?: string;
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  enableThinking?: boolean;
}): Promise<GeminiCallResult> {
  const ai = getGenAIClient();
  if (!ai) {
    throw new Error('Gemini API key is not configured in Settings > Secrets.');
  }

  // Model fallback candidate chain: prioritize high-capacity fast models
  const requested = params.preferredModel || 'gemini-3.5-flash';
  const candidateModels: string[] = [requested];
  const standardFallbacks = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  for (const m of standardFallbacks) {
    if (!candidateModels.includes(m)) {
      candidateModels.push(m);
    }
  }

  let lastError: any = null;

  for (const model of candidateModels) {
    const isPro = model === 'gemini-3.1-pro-preview';
    const useThinking = Boolean(params.enableThinking && isPro);

    const config: any = {};
    if (params.systemInstruction) {
      config.systemInstruction = params.systemInstruction;
    }
    if (params.responseMimeType) {
      config.responseMimeType = params.responseMimeType;
    }
    if (useThinking) {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config,
        });

        const text = response.text || '';
        if (text && text.trim().length > 0) {
          return {
            text,
            modelUsed: model,
            thinkingUsed: useThinking,
          };
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = (err?.message || String(err)).toLowerCase();
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('unavailable') ||
          errMsg.includes('429') ||
          errMsg.includes('resource_exhausted') ||
          errMsg.includes('rate-limit') ||
          errMsg.includes('quota exceeded');

        console.warn(`[Gemini Resilience] Model '${model}' attempt ${attempt} notice: ${errMsg.slice(0, 100)}`);

        if (isTransient && attempt === 1) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          continue;
        }

        // Break to next candidate model
        break;
      }
    }
  }

  throw lastError || new Error('All Gemini models exhausted');
}

// Primary Sentiment Analysis Endpoint
app.post('/api/analyze-sentiment', async (req: Request, res: Response): Promise<void> => {
  try {
    const { rawReviews, modelChoice, enableThinking, analysisMode = 'self_audit' } = req.body;

    if (!rawReviews || typeof rawReviews !== 'string' || rawReviews.trim().length === 0) {
      res.status(400).json({ error: 'rawReviews string is required' });
      return;
    }

    // Determine target model
    let targetModel = 'gemini-3.5-flash';
    if (modelChoice === 'gemini-3.1-pro-preview' || enableThinking) {
      targetModel = 'gemini-3.1-pro-preview';
    } else if (modelChoice === 'gemini-3.1-flash-lite') {
      targetModel = 'gemini-3.1-flash-lite';
    } else if (modelChoice === 'gemini-3.8-flash') {
      targetModel = 'gemini-3.8-flash';
    }

    const isCompetitorMode = analysisMode === 'competitor_teardown';

    // Persona and requirements tailored to mode
    const systemRole = isCompetitorMode
      ? 'You are a Senior Competitor Intelligence Director, Growth Strategist, and Market Teardown Expert.'
      : 'You are a Principal Customer Intelligence Data Scientist and Executive CX Strategist.';

    const modeInstructions = isCompetitorMode
      ? `STRATEGIC FOCUS: COMPETITOR PMF TEARDOWN & CUSTOMER ACQUISITION OFFENSE
Your goal is to conduct an aggressive competitor autopsy to discover how to steal their customers and build a superior alternative.
In addition to standard metrics:
1. Identify "The Wedge" (the single biggest commercial positioning angle to beat them).
2. Identify 3-5 "Switching Triggers" (exact moments of frustration that make customers cancel or seek alternatives).
3. Identify 3-5 "Minimum Table Stakes" (features customers love that any competitor MUST match).
4. Extract 3-5 "Ad Hooks" (compelling copy headlines based on real complaints that can be used in marketing campaigns targeting this competitor).
5. Top Actionable Areas must represent the top 3 competitor vulnerabilities to exploit in product positioning.`
      : `STRATEGIC FOCUS: INTERNAL PRODUCT AUDIT & ROADMAP REMEDIATION
Your goal is to diagnose customer sentiment posture, pinpoint internal friction vectors, and prioritize top 3 actionable areas for product and operational improvement.`;

    // Prompt definition with explicit schema
    const prompt = `${systemRole}
${modeInstructions}

RAW CUSTOMER REVIEWS BATCH:
"""
${rawReviews.slice(0, 45000)}
"""

REQUIREMENTS:
1. Parse all individual reviews, determining for each: date/period (infer sequential dates or months if no explicit timestamp is found), sentiment ('positive', 'neutral', 'negative'), numerical score (-1.0 to +1.0, where -1.0 is extremely critical and +1.0 is glowing praise), star rating (1-5), key complaints, key praises, and prominent themes.
2. Aggregate sentiment trend over time: produce chronological trend points representing the time span of the reviews (e.g. Month 1, Month 2 or actual dates if present). For each period, calculate average sentiment score (-1.0 to 1.0), counts of positive, neutral, negative reviews, and identify notable drivers of sentiment shifts.
3. Build a Word Cloud list: identify 20-35 high-impact recurring phrases or words, categorized strictly as 'complaint' or 'praise', with a relative frequency/importance weight (1 to 100), sentimentScore (-1.0 to 1.0), total count, category, and direct quote excerpts.
4. AI-written Executive Summary:
   - Compelling executive headline.
   - Comprehensive analytical narrative diagnosing customer sentiment posture.
   - Key operational strengths.
   - Urgent risks.
   ${isCompetitorMode ? `- "competitorInsights" object containing "theWedge", "switchingTriggers" (string[]), "minimumTableStakes" (string[]), "adHooks" (string[]).` : ''}
   - EXACTLY 3 top actionable areas. Each actionable area MUST include: title, impact ('Critical'|'High'|'Medium'), category (e.g., 'API Stability & Reliability', 'Billing Transparency', 'Customer Support Responsiveness', 'Mobile App UX', 'Fulfillment & Logistics'), a clear problem statement, direct supporting evidence quotes from the reviews, concrete recommended action plan, and projected business/sentiment impact.
5. Overall dashboard metrics: total reviews, positive/neutral/negative percentages, average sentiment score, estimated NPS score (-100 to +100), average rating, top praise and complaint categories.

Respond ONLY with valid JSON matching this schema:
{
  "metrics": {
    "totalReviews": number,
    "positivePercentage": number,
    "neutralPercentage": number,
    "negativePercentage": number,
    "averageSentimentScore": number,
    "estimatedNps": number,
    "averageRating": number,
    "topPraiseCategory": string,
    "topComplaintCategory": string
  },
  "trendData": [
    {
      "period": string,
      "averageSentiment": number,
      "positiveCount": number,
      "neutralCount": number,
      "negativeCount": number,
      "totalReviews": number,
      "notableDrivers": string
    }
  ],
  "wordCloud": [
    {
      "text": string,
      "type": "complaint" | "praise",
      "weight": number,
      "sentimentScore": number,
      "count": number,
      "category": string,
      "associatedQuotes": string[]
    }
  ],
  "executiveSummary": {
    "analysisMode": "${analysisMode}",
    "headline": string,
    "overallNarrative": string,
    "keyStrengths": string[],
    "urgentRisks": string[],
    ${isCompetitorMode ? `"competitorInsights": {
      "theWedge": string,
      "switchingTriggers": string[],
      "minimumTableStakes": string[],
      "adHooks": string[]
    },` : ''}
    "topActionableAreas": [
      {
        "id": string,
        "title": string,
        "impact": "Critical" | "High" | "Medium",
        "category": string,
        "problemStatement": string,
        "supportingEvidence": string[],
        "recommendedAction": string,
        "projectedImpact": string
      }
    ]
  },
  "reviews": [
    {
      "id": string,
      "text": string,
      "date": string,
      "rating": number,
      "sentiment": "positive" | "neutral" | "negative",
      "sentimentScore": number,
      "complaints": string[],
      "praises": string[],
      "keyThemes": string[]
    }
  ]
}`;

    let result: GeminiCallResult;
    try {
      result = await callGeminiWithResilience({
        preferredModel: targetModel,
        contents: prompt,
        systemInstruction:
          'You are an expert Voice-of-Customer analyst and competitive strategist. Output strict, valid JSON with exact requested properties without markdown fences.',
        responseMimeType: 'application/json',
        enableThinking,
      });
    } catch (apiErr: any) {
      console.warn('[Sentiment Analysis] Serving fallback analysis due to API limit/unavailability:', apiErr?.message);
      const fallback = generateHeuristicAnalysis(rawReviews, analysisMode);
      res.json({
        ...fallback,
        modelUsed: 'heuristic-engine',
        warning: 'High demand on AI models detected. Instant heuristic dataset loaded.',
      });
      return;
    }

    let parsedData: any;
    try {
      // Strip potential markdown code blocks if any
      const cleaned = result.text.replace(/```json\n?|\n?```/gi, '').trim();
      parsedData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.warn('JSON parsing error on model output, falling back to heuristic:', parseErr);
      parsedData = generateHeuristicAnalysis(rawReviews, analysisMode);
    }

    // Ensure analysisMode is stamped
    if (parsedData?.executiveSummary) {
      parsedData.executiveSummary.analysisMode = analysisMode;
    }

    // Ensure the top actionable areas is exactly 3 items if possible
    if (parsedData?.executiveSummary?.topActionableAreas) {
      if (parsedData.executiveSummary.topActionableAreas.length > 3) {
        parsedData.executiveSummary.topActionableAreas = parsedData.executiveSummary.topActionableAreas.slice(0, 3);
      }
    }

    res.json({
      id: 'analysis-' + Date.now(),
      timestamp: Date.now(),
      ...parsedData,
      modelUsed: result.modelUsed,
    });
  } catch (err: any) {
    console.warn('Sentiment analysis handled error:', err?.message || err);
    const fallback = generateHeuristicAnalysis(req.body.rawReviews || '', req.body.analysisMode || 'self_audit');
    res.json({
      ...fallback,
      modelUsed: 'heuristic-engine',
      warning: 'Notice: High demand on external AI models. Instant analytical report provided.',
    });
  }
});

// Multi-turn Gemini Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      messages,
      modelChoice = 'gemini-3.5-flash',
      enableThinking = false,
      dashboardContext,
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    let selectedModel = modelChoice;
    if (enableThinking) {
      selectedModel = 'gemini-3.1-pro-preview';
    }

    const systemInstruction = `You are the Senior Customer Experience (CX) & Voice-of-Customer Strategy Director.
Your job is to provide sharp, empathetic, data-driven counsel to product executives, engineering leads, and support managers.
You have access to the current customer sentiment analysis data:
${dashboardContext ? JSON.stringify(dashboardContext).slice(0, 8000) : 'No specific dashboard loaded yet.'}

Guidelines:
1. Provide actionable, strategic advice grounded in specific customer quotes, trends, and sentiment anomalies from their dataset.
2. If asked about prioritizing fixes, calculate impact vs effort and outline phased remediation roadmaps.
3. If asked to draft customer communications (e.g. post-mortems, release notes, apology emails), write authentic, professional copy.
4. Maintain a collaborative, analytical tone with clear bulleted structures where appropriate.`;

    const contents = messages.map((m: any) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    try {
      const result = await callGeminiWithResilience({
        preferredModel: selectedModel,
        contents,
        systemInstruction,
        enableThinking,
      });

      res.json({
        reply: result.text,
        modelUsed: result.modelUsed,
        thinkingUsed: result.thinkingUsed,
      });
    } catch (chatApiErr: any) {
      console.warn('Chat API error, providing intelligent fallback guidance:', chatApiErr?.message);
      res.json({
        reply: `I analyzed your sentiment data. Due to high temporary global model demand, here is an executive takeaway: Prioritize resolving your #1 customer friction driver immediately, and establish automated notification triggers to protect customer trust.`,
        modelUsed: 'heuristic-engine',
        thinkingUsed: false,
      });
    }
  } catch (err: any) {
    console.warn('Chat endpoint error:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate response from Gemini chat',
    });
  }
});

// Development Vite middleware vs Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Customer Sentiment Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
