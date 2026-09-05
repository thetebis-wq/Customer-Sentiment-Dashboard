export type SentimentCategory = 'positive' | 'neutral' | 'negative';

export interface ReviewItem {
  id: string;
  text: string;
  date?: string;
  rating?: number;
  sentiment: SentimentCategory;
  sentimentScore: number; // -1.0 to +1.0
  complaints: string[];
  praises: string[];
  keyThemes: string[];
  customerSegment?: string;
}

export interface ActionableArea {
  id: string;
  title: string;
  impact: 'Critical' | 'High' | 'Medium';
  category: string;
  problemStatement: string;
  supportingEvidence: string[];
  recommendedAction: string;
  projectedImpact: string;
}

export interface ExecutiveSummary {
  headline: string;
  overallNarrative: string;
  keyStrengths: string[];
  urgentRisks: string[];
  topActionableAreas: ActionableArea[]; // Top 3 actionable areas
}

export interface SentimentTrendPoint {
  period: string; // e.g., 'Jan 2024' or 'Week 1' or '2024-03-15'
  timestamp?: number;
  averageSentiment: number; // -1.0 to 1.0 (or normalized 0-100)
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  totalReviews: number;
  notableDrivers?: string;
}

export interface WordCloudItem {
  text: string;
  type: 'complaint' | 'praise';
  weight: number; // 1 to 100 relative frequency/intensity
  sentimentScore: number;
  count: number;
  category: string;
  associatedQuotes: string[];
}

export interface DashboardMetrics {
  totalReviews: number;
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
  averageSentimentScore: number; // -1.0 to +1.0
  estimatedNps: number; // -100 to +100
  averageRating: number; // 1.0 to 5.0
  topPraiseCategory: string;
  topComplaintCategory: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  metrics: DashboardMetrics;
  trendData: SentimentTrendPoint[];
  wordCloud: WordCloudItem[];
  executiveSummary: ExecutiveSummary;
  reviews: ReviewItem[];
  warning?: string;
  modelUsed?: string;
}

export type ChatRole = 'user' | 'model' | 'system';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  modelUsed?: string;
  isThinking?: boolean;
}

export type GeminiModelChoice =
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.5-flash'
  | 'gemini-3.1-flash-lite';
