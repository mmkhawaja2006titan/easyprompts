import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clipboard,
  Check,
  Cpu,
  Compass,
  Lightbulb,
  CheckCircle,
  TrendingUp,
  Layout,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { PromptResponse, PromptVariation } from "../types";

interface PromptOutputProps {
  result: PromptResponse;
}

export default function PromptOutput({ result }: PromptOutputProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!result || !result.optimizedPrompts || result.optimizedPrompts.length === 0) {
    return null;
  }

  const variations = result.optimizedPrompts;
  const currentVar = variations[activeTab] || variations[0];

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <span className="w-1.5 h-1.5 bg-white rounded-none"></span>
        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#888888] font-bold">
          Engineered Prompts
        </h2>
      </div>

      {/* Variation Switcher Tabs - Flat & crisp */}
      <div className="flex flex-wrap gap-1 border-b border-[#222222] pb-3">
        {variations.map((v, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`py-2 px-4 rounded-none text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer ${
              activeTab === idx
                ? "bg-white text-black border border-white"
                : "bg-[#0a0a0a] border border-[#222222] text-[#888888] hover:text-white"
            }`}
          >
            {v.title || `Variation ${idx + 1}`}
          </button>
        ))}
      </div>

      {/* Main Active Variation Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle Column - Large Prompt Box and Explanation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Display Box */}
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-none p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888] font-bold">
                  {currentVar.title}
                </span>
              </div>
              <button
                onClick={() => handleCopy(currentVar.promptText, activeTab)}
                className={`py-1.5 px-3 rounded-none border text-[9px] font-mono font-bold uppercase tracking-widest transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  copiedIndex === activeTab
                    ? "bg-white text-black border-white"
                    : "bg-[#050505] text-[#888888] border-[#333333] hover:border-white hover:text-white"
                }`}
              >
                {copiedIndex === activeTab ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3 h-3" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>

            {/* Actual Prompt Text Container using premium Serif font */}
            <div className="relative bg-[#050505] border border-[#222222] rounded-none p-6 select-all hover:border-[#333333] transition-colors duration-150">
              <p className="text-base md:text-lg text-[#dddddd] font-serif italic leading-relaxed whitespace-pre-wrap">
                "{currentVar.promptText}"
              </p>
            </div>

            {/* Quick tips about prompt usage */}
            <div className="mt-4 flex items-center gap-2 text-[9px] text-[#555555] font-mono uppercase tracking-widest">
              <CheckCircle className="w-3 h-3 text-white" />
              <span>Recommended Model: <strong className="text-white font-bold">{currentVar.targetModel || result.optimizedPrompts[0]?.targetModel || "General AI"}</strong></span>
            </div>
          </div>

          {/* Strategy / Logic Explanation */}
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-none p-6">
            <div className="flex items-center gap-2 mb-3.5">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
              <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-white font-bold">
                Prompt Strategy
              </h3>
            </div>
            <p className="text-xs md:text-sm text-[#888888] leading-relaxed font-sans">
              {currentVar.explanation || "Systematic breakdown of the engineered formulation."}
            </p>
          </div>
        </div>

        {/* Right Column - Side Panels (Analysis, Tips, Settings) */}
        <div className="space-y-6">
          {/* Original Input Analysis */}
          {result.originalAnalysis && (
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-none p-5">
              <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888] mb-3 border-b border-[#222222] pb-2 font-bold">
                Source Analysis
              </h4>
              <p className="text-xs text-[#888888] leading-relaxed font-sans">
                {result.originalAnalysis}
              </p>
            </div>
          )}

          {/* Style & Execution Tips */}
          {currentVar.tips && (
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-none p-5">
              <div className="flex items-center gap-2 mb-3 border-b border-[#222222] pb-2">
                <Lightbulb className="w-3.5 h-3.5 text-white" />
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888] font-bold">
                  Execution Tips
                </h4>
              </div>
              <p className="text-xs text-[#888888] leading-relaxed whitespace-pre-line font-sans">
                {currentVar.tips}
              </p>
            </div>
          )}

          {/* Config / Recommended parameters */}
          {result.recommendedSettings && (
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-none p-5 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3 border-b border-[#222222] pb-2">
                <Layout className="w-3.5 h-3.5 text-white" />
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888] font-bold">
                  Recommended Settings
                </h4>
              </div>
              <p className="text-xs text-[#888888] leading-relaxed font-sans">
                {result.recommendedSettings}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

