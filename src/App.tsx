import React from 'react';
import { InputSection } from './components/InputSection';
import { InsightDashboard } from './components/InsightDashboard';
import { ChatInterface } from './components/ChatInterface';
import { analyzeAsset, getChatResponse } from './lib/gemini';
import { QuantAnalysis, ChatMessage } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, RefreshCcw, Info } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<QuantAnalysis | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAnalyze = async (input: string, isFile: boolean) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setMessages([]);
    
    try {
      const result = await analyzeAsset(input, isFile);
      setAnalysis(result);
      setMessages([
        { role: 'assistant', content: `Analysis for ${isFile ? 'the uploaded dataset' : input} is complete. How can I help you further?` }
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze asset. Please check the ticker or dataset and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!analysis) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setIsChatLoading(true);

    try {
      const context = JSON.stringify(analysis);
      const response = await getChatResponse(newMessages, content, context);
      setMessages([...newMessages, { role: 'assistant', content: response || 'I apologize, I could not generate a response.' }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error while processing your request.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#2b1b12] text-[#fffdd0] selection:bg-[#d2691e]/30 font-sans overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3d2b1f]/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#7b3f00]/20 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#d2691e]/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <header className="relative z-50 border-b border-white/5 bg-[#1a110b]/80 backdrop-blur-2xl sticky top-0">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center neon-border">
              <Terminal size={20} className="text-[#d2691e]" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter leading-none text-[#fffdd0]">ALPHA<span className="text-[#d2691e]">LENS</span></span>
              <span className="text-[8px] font-mono text-[#af6e4d] uppercase tracking-[0.4em] mt-1">Quant Intelligence v2.0</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: 'Terminal', id: 'summary-section' },
              { name: 'Signals', id: 'signals-section' },
              { name: 'Causal', id: 'causal-section' },
              { name: 'Horizon', id: 'horizon-section' }
            ].map((item) => (
              <button 
                key={item.name} 
                onClick={() => scrollToSection(item.id)}
                className="text-[10px] font-mono text-[#af6e4d] hover:text-[#d2691e] uppercase tracking-[0.2em] transition-colors font-bold"
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 glass rounded-full border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#d2691e] animate-ping" />
              <span className="text-[9px] font-mono text-[#fffdd0]/60 uppercase tracking-widest font-bold">Engine Online</span>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-10 h-10 glass rounded-full flex items-center justify-center text-[#af6e4d] hover:text-[#d2691e] transition-all"
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-1.5 glass rounded-full border-[#d2691e]/20 text-[9px] font-mono text-[#d2691e] uppercase tracking-[0.3em] mb-8 font-bold"
          >
            Next-Gen Financial Intelligence
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-[#fffdd0]"
          >
            Institutional <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#d2691e] to-[#7b3f00] drop-shadow-sm">Alpha Analysis</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#af6e4d] max-w-xl text-lg font-medium leading-relaxed"
          >
            The Glass Terminal for modern quants. Decode momentum, 
            detect causal impacts, and execute with institutional conviction.
          </motion.p>
        </div>

        <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto mb-12 p-6 glass border-rose-500/20 rounded-[2rem] flex items-center gap-4 text-rose-400"
            >
              <div className="w-10 h-10 bg-rose-500/10 rounded-full flex items-center justify-center shrink-0">
                <Info size={20} />
              </div>
              <p className="text-sm font-bold">{error}</p>
            </motion.div>
          )}

          {isLoading && !analysis && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 space-y-10"
            >
              <div className="relative">
                <div className="w-24 h-24 border-2 border-[#d2691e]/20 border-t-[#d2691e] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center neon-border animate-pulse">
                    <Terminal size={24} className="text-[#d2691e]" />
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-[#fffdd0] tracking-tight">Syncing Neural Engine</h3>
                <p className="text-[10px] text-[#af6e4d] font-mono uppercase tracking-[0.4em] font-bold">Extracting Alpha Factors...</p>
              </div>
            </motion.div>
          )}

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 100 }}
              className="space-y-8"
            >
              <InsightDashboard analysis={analysis} />
              <ChatInterface 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                isLoading={isChatLoading} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!analysis && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20">
            {[
              { title: 'Factor Intelligence', desc: 'Momentum, Volatility, and Trend Strength factors analyzed via deep neural networks.' },
              { title: 'Causal Detection', desc: 'Identification of macro and micro events impacting price action and sentiment.' },
              { title: 'Horizon Mapping', desc: 'Multi-timeframe outlook classifications for short, medium, and long-term execution.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="p-8 glass rounded-[2rem] hover:neon-border transition-all duration-500 group"
              >
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-[#d2691e]/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d2691e]" />
                </div>
                <h4 className="text-xs font-black text-[#fffdd0] mb-3 uppercase tracking-[0.2em]">{feature.title}</h4>
                <p className="text-xs text-[#af6e4d] leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-20 mt-40 relative z-10 bg-black/20 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-[#af6e4d]">
              <Terminal size={18} />
              <span className="font-bold tracking-tighter text-[#fffdd0]">ALPHA<span className="text-[#d2691e]">LENS</span></span>
            </div>
            <p className="text-[10px] font-mono text-[#af6e4d] uppercase tracking-widest font-bold">© 2026 Institutional Alpha Systems</p>
          </div>
          <div className="flex gap-12 text-[9px] font-mono text-[#af6e4d] uppercase tracking-[0.3em] font-bold">
            <div className="flex flex-col gap-2">
              <span className="text-[#3d2b1f]">Engine</span>
              <span className="text-[#fffdd0]">Gemini 3.1 Pro</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[#3d2b1f]">Latency</span>
              <span className="text-[#fffdd0]">&lt; 240ms</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[#3d2b1f]">Status</span>
              <span className="text-[#d2691e]">Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
