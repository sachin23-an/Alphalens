import React from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 glass rounded-[2.5rem] overflow-hidden flex flex-col h-[600px] border border-white/10 shadow-xl">
      <div className="p-6 border-b border-white/5 bg-[#1a110b]/40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#d2691e]/10 rounded-xl flex items-center justify-center text-[#d2691e] border border-[#d2691e]/20">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[#fffdd0] tracking-tight">Alpha AI Assistant</h3>
            <p className="text-[10px] text-[#af6e4d] font-mono uppercase tracking-widest font-bold">Institutional Support Active</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#d2691e] animate-pulse shadow-[0_0_8px_rgba(210,105,30,0.5)]" />
          <span className="text-[10px] font-mono text-[#af6e4d] uppercase tracking-widest font-bold">Neural Link Established</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-none bg-black/10">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  msg.role === 'user' 
                    ? 'bg-[#3d2b1f] border-white/10 text-[#af6e4d]' 
                    : 'bg-[#d2691e]/10 border-[#d2691e]/20 text-[#d2691e]'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-5 rounded-3xl text-sm leading-relaxed font-medium ${
                  msg.role === 'user' 
                    ? 'bg-[#d2691e] text-white rounded-tr-none shadow-lg shadow-[#d2691e]/20' 
                    : 'bg-black/40 border border-white/5 text-[#fffdd0] rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#d2691e]/10 border border-[#d2691e]/20 text-[#d2691e] flex items-center justify-center">
                  <Loader2 size={14} className="animate-spin" />
                </div>
                <div className="p-5 bg-black/40 border border-white/5 rounded-3xl rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#d2691e]/50 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-[#d2691e]/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-[#d2691e]/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-[#1a110b]/40 border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query the Alpha Engine..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm text-[#fffdd0] placeholder:text-[#af6e4d]/50 focus:outline-none focus:neon-border transition-all duration-500 font-medium shadow-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-[#d2691e] hover:text-[#7b3f00] disabled:text-[#af6e4d] transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
