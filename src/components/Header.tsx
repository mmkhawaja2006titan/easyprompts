import { motion } from "motion/react";
import { Feather, Terminal, Cpu, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-[#222222] bg-[#050505] sticky top-0 z-50 py-5 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center gap-3.5"
        >
          <div className="p-2 border border-white text-black bg-white flex items-center justify-center rounded-none relative">
            <Feather className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <h1 className="font-sans font-black text-2xl tracking-tighter uppercase">
              easyPrompts<span className="text-[#666666]">.</span>
            </h1>
            <p className="text-[9px] text-[#888888] font-mono tracking-[0.2em] uppercase">
              SMART PROMPT GENERATOR
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="flex items-center flex-wrap gap-3 text-[10px] text-[#888888] font-mono tracking-wider"
        >
          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#222222] px-3 py-2 rounded-none">
            <Cpu className="w-3.5 h-3.5 text-white" />
            <span>AI Model: <span className="text-white font-bold">Gemini 3.5</span></span>
          </div>

          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#222222] px-3 py-2 rounded-none">
            <Terminal className="w-3.5 h-3.5 text-white" />
            <span>Format: <span className="text-white font-bold">Text & Media</span></span>
          </div>

          <div className="flex items-center gap-1.5 text-white bg-white/10 border border-white/20 px-3 py-2 rounded-none font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span className="tracking-wider">Secure Connection</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

