import { GoogleGenAI, Type } from "@google/genai";

export const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        health: { type: Type.STRING, enum: ["strong", "moderate", "weak"] },
        observations: { type: Type.ARRAY, items: { type: Type.STRING } },
        explanation: { type: Type.STRING }
      },
      required: ["health", "observations", "explanation"]
    },
    factorSignals: {
      type: Type.OBJECT,
      properties: {
        momentum: { type: Type.STRING, description: "e.g. Strong ↑ / Weak ↓" },
        volatility: { type: Type.STRING, description: "e.g. High / Low / Increasing ⚠️" },
        trendStrength: { type: Type.STRING, description: "e.g. Stable / Reversing / Strengthening" }
      },
      required: ["momentum", "volatility", "trendStrength"]
    },
    eventImpact: {
      type: Type.OBJECT,
      properties: {
        cause: { type: Type.STRING, description: "e.g. Earnings miss, News sentiment, Sector drop" },
        explanation: { type: Type.STRING }
      },
      required: ["cause", "explanation"]
    },
    confidence: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "0 to 100" },
        basis: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g. Data consistency, Trend strength, Signal agreement" }
      },
      required: ["score", "basis"]
    },
    timeHorizon: {
      type: Type.OBJECT,
      properties: {
        shortTerm: { type: Type.STRING, description: "1-2 weeks outlook" },
        mediumTerm: { type: Type.STRING, description: "1-3 months outlook" },
        longTerm: { type: Type.STRING, description: "6+ months outlook" }
      },
      required: ["shortTerm", "mediumTerm", "longTerm"]
    },
    signalAgreement: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING, enum: ["Aligned", "Mixed", "Opposing"] },
        message: { type: Type.STRING, description: "e.g. Signals are mixed -> Avoid aggressive positions" }
      },
      required: ["status", "message"]
    },
    timeline: {
      type: Type.OBJECT,
      properties: {
        past: { type: Type.STRING },
        present: { type: Type.STRING },
        future: { type: Type.STRING }
      },
      required: ["past", "present", "future"]
    },
    redFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "e.g. Falling profits, High debt, Sudden volatility"
    },
    valuation: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING, enum: ["undervalued", "fairly valued", "overvalued"] },
        reasoning: { type: Type.STRING }
      },
      required: ["status", "reasoning"]
    },
    verdict: {
      type: Type.OBJECT,
      properties: {
        action: { type: Type.STRING, enum: ["Buy", "Hold", "Avoid"] },
        reasoning: { type: Type.STRING }
      },
      required: ["action", "reasoning"]
    },
    comparison: {
      type: Type.OBJECT,
      properties: {
        stockA: { type: Type.STRING },
        stockB: { type: Type.STRING },
        winner: {
          type: Type.OBJECT,
          properties: {
            growth: { type: Type.STRING },
            risk: { type: Type.STRING },
            stability: { type: Type.STRING }
          },
          required: ["growth", "risk", "stability"]
        },
        overallWinner: { type: Type.STRING }
      },
      required: ["stockA", "stockB", "winner", "overallWinner"]
    }
  },
  required: ["summary", "factorSignals", "eventImpact", "confidence", "timeHorizon", "signalAgreement", "timeline", "redFlags", "valuation", "verdict"]
};

export async function analyzeAsset(input: string, isFile: boolean = false) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Please add it to your environment variables.");
  }
  const genAI = new GoogleGenAI({ apiKey });
  const model = "gemini-3.1-pro-preview";
  
  let prompt = "";
  let systemInstruction = "You are a world-class Quant Financial Analyst. Your task is to analyze assets and provide institutional-grade insights strictly following the provided JSON schema. Use your search tool to get the latest market data if a ticker is provided.";

  if (isFile) {
    prompt = `Analyze the following dataset and provide high-quality quant insights. Focus on financial health, trends, risks, and valuation. Dataset: \n\n${input}`;
  } else if (input.toLowerCase().includes(" vs ") || input.toLowerCase().includes(" compare ")) {
    prompt = `Perform a side-by-side comparison of the two stocks mentioned in "${input}". 
    Evaluate them on Factor Signals, Event Impact, Confidence, Time Horizon, Signal Agreement, Timeline, and Red Flags.
    Specifically determine which is better in Growth, Risk, and Stability. 
    IMPORTANT: You MUST include the "comparison" object in your response for this request.`;
  } else {
    prompt = `Analyze the stock/ticker "${input}" using your real-time search capabilities. 
    Provide high-quality quant insights including:
    1. Factor Signals (Momentum, Volatility, Trend Strength)
    2. Event Impact Detection (What caused recent movements)
    3. Confidence Score with basis
    4. Time Horizon Analysis (Short, Medium, Long term)
    5. Signal Agreement Meter
    6. Insight Timeline (Past, Present, Future)
    7. Red Flag Detector
    8. Valuation & Verdict`;
  }

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        tools: isFile ? [] : [{ googleSearch: {} }]
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI engine.");
    }

    const data = JSON.parse(response.text);
    
    // Basic validation to prevent component crashes
    if (!data.summary || !data.verdict || !data.factorSignals) {
      throw new Error("AI response missing critical analysis fields.");
    }

    return data;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}

export async function getChatResponse(history: any[], message: string, context: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  const genAI = new GoogleGenAI({ apiKey });
  const model = "gemini-3.1-pro-preview";
  
  const chat = genAI.chats.create({
    model,
    config: {
      systemInstruction: `You are a Quant Insight AI assistant. You provide simple, insight-driven answers based on the following asset context: ${context}. Keep responses professional, concise, and helpful for non-experts.`
    }
  });

  try {
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
}
