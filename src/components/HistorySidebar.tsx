import { motion, AnimatePresence } from "motion/react";
import { History, Trash2, ChevronRight, FileText, Image, Video, Clock, ExternalLink } from "lucide-react";
import { PromptHistoryItem } from "../types";

interface HistorySidebarProps {
  history: PromptHistoryItem[];
  selectedHistoryId: string | null;
  onSelectHistory: (item: PromptHistoryItem) => void;
  onClearHistory: () => void;
}

export default function HistorySidebar({
  history,
  selectedHistoryId,
  onSelectHistory,
  onClearHistory,
}: HistorySidebarProps) {
  const getInputIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-3.5 h-3.5 text-white" />;
      case "video":
        return <Video className="w-3.5 h-3.5 text-white" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-white" />;
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#222222] rounded-none p-4 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-[#222222] mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 bg-white rounded-none"></span>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#888888]">
            Prompt History ({history.length})
          </h3>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[#555555] hover:text-white transition-all duration-150 flex items-center gap-1 cursor-pointer text-[10px] font-mono uppercase tracking-widest rounded-none"
            title="Clear all prompt history"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {history.length === 0 ? (
          <div className="text-center py-10 px-4">
            <Clock className="w-6 h-6 text-[#333333] mx-auto mb-3" />
            <p className="text-[10px] text-[#555555] font-mono uppercase tracking-widest">No History Yet</p>
            <p className="text-[9px] text-[#444444] font-mono uppercase tracking-wider mt-1.5 leading-relaxed">
              Your generated prompts will appear here for quick access.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {history.map((item, index) => {
              const isSelected = selectedHistoryId === item.id;
              const formattedDate = new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  onClick={() => onSelectHistory(item)}
                  className={`w-full text-left p-4 rounded-none border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 group relative ${
                    isSelected
                      ? "bg-[#111111] border-white"
                      : "bg-[#050505] border-[#222222] hover:bg-[#0c0c0c] hover:border-[#333333]"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white"></div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1 bg-[#111111] border border-[#222222] rounded-none">
                        {getInputIcon(item.inputType)}
                      </div>
                      <span className="text-[9px] text-[#555555] font-mono uppercase tracking-wider">
                        {formattedDate}
                      </span>
                      <span className="text-[9px] font-mono text-white bg-white/10 border border-white/20 px-1.5 py-0.5 rounded-none ml-auto uppercase font-bold tracking-widest">
                        {item.targetModel}
                      </span>
                    </div>

                    <p className="text-xs text-white font-sans font-bold truncate mb-1">
                      {item.textInput || (item.inputType === "image" ? `Image Prompt (${item.fileName})` : `Video Prompt`)}
                    </p>

                    <div className="flex items-center gap-2 text-[9px] text-[#555555] font-mono uppercase tracking-wider">
                      <span className="truncate">Style: {item.style}</span>
                      <span>&bull;</span>
                      <span>Tone: {item.tone}</span>
                    </div>
                  </div>

                  <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-150 shrink-0 ${
                    isSelected ? "text-white translate-x-0.5" : "text-[#444444] group-hover:text-white"
                  }`} />
                </motion.button>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

