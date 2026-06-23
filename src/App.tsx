import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Feather,
  Zap,
  Info,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  FileCode,
  ShieldAlert
} from "lucide-react";
import Header from "./components/Header";
import PromptTemplates, { TemplatePreset } from "./components/PromptTemplates";
import InputSection from "./components/InputSection";
import PromptOutput from "./components/PromptOutput";
import HistorySidebar from "./components/HistorySidebar";
import { PromptResponse, PromptHistoryItem, InputType } from "./types";

const DIAGNOSTIC_MESSAGES = [
  "Reading your prompt ideas...",
  "Analyzing image and text details...",
  "Checking style and layout options...",
  "Creating prompt guidelines...",
  "Writing your custom prompt variations...",
  "Finishing up...",
];

export default function App() {
  // Input Content State
  const [inputType, setInputType] = useState<InputType>("text");
  const [textInput, setTextInput] = useState<string>("");
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  // Prompt Parameter State
  const [targetModel, setTargetModel] = useState<string>("Gemini");
  const [style, setStyle] = useState<string>("Standard");
  const [tone, setTone] = useState<string>("Professional");
  const [promptType, setPromptType] = useState<string>("Optimized detailed prompt");
  const [temperature, setTemperature] = useState<number>(0.75);

  // Application State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PromptResponse | null>(null);

  // History State
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  // Sync loading status text step-by-step
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < DIAGNOSTIC_MESSAGES.length - 1 ? prev + 1 : prev));
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("easy_prompts_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse history", err);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: PromptHistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem("easy_prompts_history", JSON.stringify(newHistory));
  };

  // Select Quick-Start Preset Template
  const handleSelectTemplate = (template: TemplatePreset) => {
    setInputType(template.inputType);
    setTextInput(template.textInput);
    setTargetModel(template.targetModel);
    setStyle(template.style);
    setTone(template.tone);
    setPromptType(template.promptType);
    setTemperature(template.temperature);
    // Clear results & files to focus on the loaded template
    setResult(null);
    setSelectedHistoryId(null);
    setFileData(null);
    setFileMimeType(null);
    setFileName(null);
    setFileSize(null);
    setError(null);
  };

  // Perform Prompt Engineering Generation Call
  const handleGeneratePrompts = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputType,
          textInput,
          fileData,
          fileMimeType,
          targetModel,
          style,
          tone,
          promptType,
          temperature,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate optimized prompts.");
      }

      setResult(data);

      // Save to history
      const newHistoryItem: PromptHistoryItem = {
        id: Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toISOString(),
        inputType,
        textInput: textInput || undefined,
        fileName: fileName || undefined,
        fileSize: fileSize || undefined,
        targetModel,
        style,
        tone,
        promptType,
        result: data,
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, 50); // Keep max 50 items
      saveHistory(updatedHistory);
      setSelectedHistoryId(newHistoryItem.id);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected network or system error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Select item from history
  const handleSelectHistory = (item: PromptHistoryItem) => {
    setInputType(item.inputType);
    setTextInput(item.textInput || "");
    setTargetModel(item.targetModel);
    setStyle(item.style);
    setTone(item.tone);
    setPromptType(item.promptType);
    setResult(item.result);
    setSelectedHistoryId(item.id);

    // Clear file inputs for the restored state to avoid confusion (since past file payloads aren't fully stored in history items)
    setFileData(null);
    setFileMimeType(null);
    setFileName(item.fileName || null);
    setFileSize(item.fileSize || null);
    setError(null);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire prompt history?")) {
      saveHistory([]);
      setSelectedHistoryId(null);
    }
  };

  const handleReset = () => {
    setTextInput("");
    setFileData(null);
    setFileMimeType(null);
    setFileName(null);
    setFileSize(null);
    setResult(null);
    setSelectedHistoryId(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative z-10">
        
        {/* Quick Presets Grid */}
        <PromptTemplates onSelectTemplate={handleSelectTemplate} />

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Form & Settings (Lg: 8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-none p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-none"></span>
                  <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#888888] font-bold">
                    Configure Prompt Input
                  </h2>
                </div>
                
                {/* Reset button */}
                {(textInput || fileData || result) && (
                  <button
                    onClick={handleReset}
                    className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#888888] hover:text-white bg-[#050505] hover:bg-[#111111] px-2.5 py-1.5 border border-[#222222] transition-colors cursor-pointer rounded-none"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Fields</span>
                  </button>
                )}
              </div>

              <InputSection
                inputType={inputType}
                setInputType={setInputType}
                textInput={textInput}
                setTextInput={setTextInput}
                fileData={fileData}
                setFileData={setFileData}
                fileMimeType={fileMimeType}
                setFileMimeType={setFileMimeType}
                fileName={fileName}
                setFileName={setFileName}
                fileSize={fileSize}
                setFileSize={setFileSize}
                targetModel={targetModel}
                setTargetModel={setTargetModel}
                style={style}
                setStyle={setStyle}
                tone={tone}
                setTone={setTone}
                promptType={promptType}
                setPromptType={setPromptType}
                temperature={temperature}
                setTemperature={setTemperature}
                onGenerate={handleGeneratePrompts}
                isLoading={isLoading}
              />
            </div>

            {/* Error Message Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 bg-black border border-white rounded-none flex items-start gap-3.5 text-xs font-mono text-white"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 text-white" />
                  <div className="space-y-1">
                    <h4 className="font-bold uppercase tracking-widest">Generation Error</h4>
                    <p className="leading-relaxed text-[#888888]">{error}</p>
                    <p className="text-[10px] text-[#555555] uppercase tracking-wider mt-1">
                      Check your input format or API key configuration.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading / Diagnostic overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-12 border border-[#222222] bg-[#050505] rounded-none text-center space-y-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]"
                >
                  <div className="absolute inset-0 editorial-grid opacity-15 pointer-events-none animate-pulse-slow"></div>

                  <div className="relative">
                    <div className="relative w-12 h-12 border border-transparent border-t-white rounded-full animate-spin"></div>
                  </div>

                  <div className="space-y-2 max-w-md relative z-10">
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888] font-bold">
                      Analyzing Prompt Input
                    </h4>
                    
                    {/* Animated cycling steps */}
                    <p className="text-xs font-mono text-white tracking-wide h-5 flex items-center justify-center gap-2">
                      <Zap className="w-3 h-3 text-white" />
                      {DIAGNOSTIC_MESSAGES[loadingStep]}
                    </p>

                    <p className="text-[10px] text-[#555555] font-mono leading-relaxed uppercase tracking-wider mt-3">
                      Processing your guidelines and media. This usually takes under 8 seconds.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generated Prompt Results */}
            <AnimatePresence mode="wait">
              {result && !isLoading && (
                <motion.div
                  key={selectedHistoryId || "current"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <PromptOutput result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Sidebar (Lg: 4 cols) */}
          <div className="lg:col-span-4 h-full">
            <div className="lg:sticky lg:top-24 h-[calc(100vh-140px)] min-h-[400px]">
              <HistorySidebar
                history={history}
                selectedHistoryId={selectedHistoryId}
                onSelectHistory={handleSelectHistory}
                onClearHistory={handleClearHistory}
              />
            </div>
          </div>

        </div>

      </main>

      {/* Interactive Footer */}
      <footer className="border-t border-[#222222] bg-[#050505] py-8 px-6 mt-12 text-center text-[10px] text-[#555555] font-mono uppercase tracking-wider">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            &copy; 2026 easyPrompts. Simple, powerful prompt engineering.
          </p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-help transition-colors">Documentation</span>
            <span>&bull;</span>
            <span className="hover:text-white cursor-help transition-colors">Privacy Schema</span>
            <span>&bull;</span>
            <span className="hover:text-white cursor-help transition-colors">Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
