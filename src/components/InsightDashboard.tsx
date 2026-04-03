import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  TrendingUp, 
  ShieldAlert, 
  BarChart3, 
  CheckCircle2,
  Clock,
  Zap,
  AlertTriangle,
  History,
  Scale,
  Target,
  ArrowRight
} from 'lucide-react';
import { QuantAnalysis } from '../types';

interface InsightDashboardProps {
  analysis: QuantAnalysis;
}

export const InsightDashboard: React.FC<InsightDashboardProps> = ({ analysis }) => {
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'strong': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'moderate': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'weak': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-[#af6e4d] bg-white/5 border-white/10';
    }
  };

  const getAgreementIcon = (status: string) => {
    switch (status) {
      case 'Aligned': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'Mixed': return <AlertTriangle className="text-amber-500" size={18} />;
      case 'Opposing': return <AlertTriangle className="text-rose-500" size={18} />;
      default: return null;
    }
  };

  const getVerdictColor = (action: string) => {
    switch (action) {
      case 'Buy': return 'text-[#d2691e] border-[#d2691e]/20 bg-[#d2691e]/5';
      case 'Avoid': return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
      default: return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-7xl mx-auto auto-rows-[minmax(180px,auto)]">
      {/* Summary & Timeline Card */}
      <motion.div 
        id="summary-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:col-span-8 md:row-span-2 glass rounded-[2.5rem] p-10 relative overflow-hidden group scroll-mt-24"
      >
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity text-[#fffdd0]">
          <Activity size={120} />
        </div>
        
        <div className="flex items-start justify-between mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#d2691e]/10 rounded-2xl flex items-center justify-center text-[#d2691e] border border-[#d2691e]/20">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#fffdd0] tracking-tight">Alpha Insight</h3>
              <p className="text-sm text-[#af6e4d] font-mono uppercase tracking-widest font-bold">Causal Intelligence Report</p>
            </div>
          </div>
          <div className={`px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${getHealthColor(analysis.summary.health)}`}>
            {analysis.summary.health} Health
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
          <div className="lg:col-span-7">
            <p className="text-lg text-[#fffdd0]/90 leading-relaxed font-medium mb-8">
              {analysis.summary.explanation}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.summary.observations.map((obs, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-[#d2691e]/30 transition-colors group/item">
                  <div className="text-[#d2691e] group-hover/item:scale-110 transition-transform"><CheckCircle2 size={16} /></div>
                  <span className="text-xs text-[#fffdd0]/70 font-bold">{obs}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-dark rounded-3xl p-6 border border-white/5">
              <h4 className="text-[10px] font-mono text-[#af6e4d] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 font-bold">
                <History size={14} className="text-[#d2691e]" /> Temporal Analysis
              </h4>
              <div className="space-y-6 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
                {[
                  { label: 'Past', value: analysis.timeline.past, active: false },
                  { label: 'Present', value: analysis.timeline.present, active: true },
                  { label: 'Outlook', value: analysis.timeline.future, active: false }
                ].map((item, i) => (
                  <div key={i} className="relative pl-6">
                    <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#2b1b12] ${item.active ? 'bg-[#d2691e] shadow-[0_0_10px_rgba(210,105,30,0.3)]' : 'bg-white/10'}`} />
                    <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${item.active ? 'text-[#d2691e]' : 'text-[#af6e4d]'}`}>{item.label}</span>
                    <p className={`text-xs mt-1 ${item.active ? 'text-[#fffdd0] font-bold' : 'text-[#fffdd0]/50'}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 bg-gradient-to-r from-[#d2691e]/5 to-transparent rounded-3xl border border-[#d2691e]/20 relative z-10 scroll-mt-24" id="causal-section">
          <div className="flex items-center gap-3 mb-3">
            <Zap size={16} className="text-[#d2691e]" />
            <h4 className="text-[10px] font-mono text-[#d2691e] uppercase tracking-[0.2em] font-bold">Causal Event Detection</h4>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="px-4 py-2 bg-[#d2691e]/10 text-[#d2691e] rounded-xl text-xs font-black uppercase tracking-widest border border-[#d2691e]/20">
              {analysis.eventImpact.cause}
            </div>
            <p className="text-sm text-[#af6e4d] font-bold italic">"{analysis.eventImpact.explanation}"</p>
          </div>
        </div>
      </motion.div>

      {/* Verdict & Confidence Card */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className={`md:col-span-4 md:row-span-2 glass rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden ${getVerdictColor(analysis.verdict.action)}`}
      >
        <div className="absolute -bottom-10 -right-10 opacity-5 text-[#fffdd0]">
          <Target size={200} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-black/20 rounded-2xl flex items-center justify-center border border-white/10">
              <Target size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#fffdd0] tracking-tight">Final Verdict</h3>
              <p className="text-[10px] text-[#af6e4d] font-mono uppercase tracking-widest font-bold">Quant Conviction</p>
            </div>
          </div>
          
          <div className="text-7xl font-black mb-6 tracking-tighter neon-text">{analysis.verdict.action}</div>
          <p className="text-[#fffdd0]/80 leading-relaxed font-bold mb-10">{analysis.verdict.reasoning}</p>
          
          <div className="glass-dark rounded-3xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-[#af6e4d] uppercase tracking-[0.2em] font-bold">Signal Agreement</span>
              <div className="flex items-center gap-2 text-xs font-black">
                {getAgreementIcon(analysis.signalAgreement.status)}
                <span className="tracking-widest uppercase text-[#fffdd0]">{analysis.signalAgreement.status}</span>
              </div>
            </div>
            <p className="text-xs text-[#af6e4d] leading-relaxed italic font-bold">{analysis.signalAgreement.message}</p>
          </div>
        </div>

        <div className="relative z-10 pt-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-[10px] font-mono text-[#af6e4d] uppercase tracking-[0.2em] block mb-1 font-bold">Confidence Score</span>
              <span className="text-4xl font-black text-[#fffdd0]">{analysis.confidence.score}%</span>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-end max-w-[150px]">
              {analysis.confidence.basis.map((b, i) => (
                <span key={i} className="text-[8px] font-mono text-[#af6e4d] bg-black/20 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-white/5 font-bold">
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="h-3 bg-black/20 rounded-full overflow-hidden p-0.5 border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${analysis.confidence.score}%` }}
              className="h-full bg-[#d2691e] rounded-full shadow-[0_0_15px_rgba(210,105,30,0.3)]"
            />
          </div>
        </div>
      </motion.div>

      {/* Factor Signals */}
      <motion.div 
        id="signals-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="md:col-span-4 glass rounded-[2.5rem] p-8 scroll-mt-24"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-[#d2691e]/10 rounded-xl flex items-center justify-center text-[#d2691e] border border-[#d2691e]/20">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[#fffdd0] tracking-tight">Factor Signals</h3>
            <p className="text-[9px] text-[#af6e4d] font-mono uppercase tracking-widest font-bold">Quant Indicators</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Momentum', value: analysis.factorSignals.momentum },
            { label: 'Volatility', value: analysis.factorSignals.volatility },
            { label: 'Trend Strength', value: analysis.factorSignals.trendStrength }
          ].map((factor, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-[#d2691e]/30 transition-all">
              <span className="text-[10px] font-mono text-[#af6e4d] uppercase tracking-widest font-bold">{factor.label}</span>
              <span className="text-sm font-black text-[#fffdd0]">{factor.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Time Horizon Analysis */}
      <motion.div 
        id="horizon-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="md:col-span-4 glass rounded-[2.5rem] p-8 scroll-mt-24"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-[#d2691e]/10 rounded-xl flex items-center justify-center text-[#d2691e] border border-[#d2691e]/20">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[#fffdd0] tracking-tight">Time Horizon</h3>
            <p className="text-[9px] text-[#af6e4d] font-mono uppercase tracking-widest font-bold">Outlook Classification</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Short', period: '1-2w', value: analysis.timeHorizon.shortTerm },
            { label: 'Mid', period: '1-3m', value: analysis.timeHorizon.mediumTerm },
            { label: 'Long', period: '6m+', value: analysis.timeHorizon.longTerm }
          ].map((horizon, i) => (
            <div key={i} className="p-4 bg-black/20 rounded-2xl border border-white/5 flex flex-col items-center text-center group hover:border-[#d2691e]/30 transition-all">
              <span className="text-[8px] font-mono text-[#af6e4d] uppercase mb-1 font-bold">{horizon.label}</span>
              <span className="text-[8px] font-mono text-[#d2691e]/50 uppercase mb-3 font-bold">{horizon.period}</span>
              <span className="text-[11px] font-black text-[#fffdd0] leading-tight">{horizon.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Risk & Valuation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="md:col-span-4 glass rounded-[2.5rem] p-8"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-600 border border-rose-200">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 tracking-tight">Risk & Value</h3>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest font-bold">Red Flags & Pricing</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {analysis.redFlags.map((flag, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-rose-100 border border-rose-200 rounded-full text-[9px] text-rose-600 font-black uppercase tracking-wider">
                <AlertTriangle size={10} />
                {flag}
              </div>
            ))}
          </div>

          <div className="p-4 bg-white/40 rounded-2xl border border-white/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Valuation</span>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{analysis.valuation.status}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-bold">{analysis.valuation.reasoning}</p>
          </div>
        </div>
      </motion.div>

      {/* Comparison Mode (Conditional) */}
      {analysis.comparison && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-12 glass rounded-[2.5rem] p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-5 text-[#fffdd0]">
            <Scale size={150} />
          </div>

          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="w-12 h-12 bg-[#d2691e]/10 rounded-2xl flex items-center justify-center text-[#d2691e] border border-[#d2691e]/20">
              <Scale size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#fffdd0] tracking-tight">Alpha Comparison</h3>
              <p className="text-sm text-[#af6e4d] font-mono uppercase tracking-widest font-bold">{analysis.comparison.stockA} vs {analysis.comparison.stockB}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 relative z-10">
            {[
              { label: 'Growth', winner: analysis.comparison.winner.growth },
              { label: 'Risk', winner: analysis.comparison.winner.risk },
              { label: 'Stability', winner: analysis.comparison.winner.stability }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-black/20 rounded-3xl border border-white/5 flex flex-col items-center text-center group hover:neon-border transition-all">
                <span className="text-[10px] font-mono text-[#af6e4d] uppercase tracking-[0.2em] mb-3 font-bold">{item.label} Alpha</span>
                <div className="flex items-center gap-3 text-[#d2691e] font-black text-xl tracking-tight">
                  <CheckCircle2 size={20} />
                  {item.winner}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-[#d2691e]/5 rounded-[2rem] border border-[#d2691e]/20 relative z-10">
            <div className="mb-6 md:mb-0">
              <span className="text-[10px] font-mono text-[#d2691e] uppercase tracking-[0.3em] block mb-2 font-bold">Institutional Selection</span>
              <div className="text-5xl font-black text-[#fffdd0] tracking-tighter neon-text">{analysis.comparison.overallWinner}</div>
            </div>
            <button className="flex items-center gap-3 bg-[#d2691e] text-white font-black text-xs uppercase tracking-[0.2em] px-10 py-5 rounded-full hover:bg-[#7b3f00] transition-all shadow-xl">
              Execute Position <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
