export interface QuantAnalysis {
  summary: {
    health: 'strong' | 'moderate' | 'weak';
    observations: string[];
    explanation: string;
  };
  factorSignals: {
    momentum: string;
    volatility: string;
    trendStrength: string;
  };
  eventImpact: {
    cause: string;
    explanation: string;
  };
  confidence: {
    score: number;
    basis: string[];
  };
  timeHorizon: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  signalAgreement: {
    status: 'Aligned' | 'Mixed' | 'Opposing';
    message: string;
  };
  timeline: {
    past: string;
    present: string;
    future: string;
  };
  redFlags: string[];
  valuation: {
    status: 'undervalued' | 'fairly valued' | 'overvalued';
    reasoning: string;
  };
  verdict: {
    action: 'Buy' | 'Hold' | 'Avoid';
    reasoning: string;
  };
  comparison?: {
    stockA: string;
    stockB: string;
    winner: {
      growth: string;
      risk: string;
      stability: string;
    };
    overallWinner: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
