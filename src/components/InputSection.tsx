import React from 'react';
import { Search, Upload, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface InputSectionProps {
  onAnalyze: (input: string, isFile: boolean) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [input, setInput] = React.useState('');
  const [localError, setLocalError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (input.trim()) {
      onAnalyze(input, false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLocalError(null);
    if (file) {
      if (file.size > 50000) {
        setLocalError("File too large (max 50KB).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onAnalyze(content, true);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-16 relative z-50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-full p-1.5 flex items-center gap-2 group focus-within:neon-border transition-all duration-500"
      >
        <div className="pl-5 text-[#d2691e]/50 group-focus-within:text-[#d2691e] transition-colors">
          <Search size={18} />
        </div>
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setLocalError(null);
            }}
            placeholder="Search ticker or compare (e.g. NVDA vs AMD)..."
            className="w-full bg-transparent border-none py-3 text-sm text-[#fffdd0] placeholder:text-[#af6e4d]/50 focus:outline-none focus:ring-0 font-medium"
            disabled={isLoading}
          />
        </form>
        <div className="flex items-center gap-1 pr-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-[#af6e4d] hover:text-[#d2691e] hover:bg-white/5 rounded-full transition-all"
            title="Upload dataset"
            disabled={isLoading}
          >
            <Upload size={18} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="bg-[#d2691e] hover:bg-[#7b3f00] disabled:bg-white/5 disabled:text-[#af6e4d] text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-all shadow-[0_10px_20px_rgba(210,105,30,0.2)] hover:shadow-[0_15px_30px_rgba(210,105,30,0.3)]"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Execute'}
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept=".csv,.txt"
        />
      </motion.div>
      
      {localError && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-rose-400 text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2 font-bold"
        >
          <AlertCircle size={12} />
          {localError}
        </motion.div>
      )}
      
      <div className="mt-6 flex justify-center gap-8 text-[10px] font-mono text-[#af6e4d] uppercase tracking-[0.2em] font-bold">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-1 h-1 rounded-full bg-[#d2691e] group-hover:animate-ping" />
          <span className="group-hover:text-[#fffdd0] transition-colors">Factor Analysis</span>
        </div>
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-1 h-1 rounded-full bg-[#7b3f00] group-hover:animate-ping" />
          <span className="group-hover:text-[#fffdd0] transition-colors">Causal Impact</span>
        </div>
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-1 h-1 rounded-full bg-[#3d2b1f] group-hover:animate-ping" />
          <span className="group-hover:text-[#fffdd0] transition-colors">Horizon Outlook</span>
        </div>
      </div>
    </div>
  );
};
