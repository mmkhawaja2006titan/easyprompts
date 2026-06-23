import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  UploadCloud,
  X,
  Sliders,
  ChevronDown,
  ChevronUp,
  Feather,
  HelpCircle,
  Eye,
  AlertCircle
} from "lucide-react";
import { InputType } from "../types";

interface InputSectionProps {
  inputType: InputType;
  setInputType: (type: InputType) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  fileData: string | null;
  setFileData: (data: string | null) => void;
  fileMimeType: string | null;
  setFileMimeType: (mime: string | null) => void;
  fileName: string | null;
  setFileName: (name: string | null) => void;
  fileSize: string | null;
  setFileSize: (size: string | null) => void;

  targetModel: string;
  setTargetModel: (model: string) => void;
  style: string;
  setStyle: (style: string) => void;
  tone: string;
  setTone: (tone: string) => void;
  promptType: string;
  setPromptType: (type: string) => void;
  temperature: number;
  setTemperature: (temp: number) => void;

  onGenerate: () => void;
  isLoading: boolean;
}

const TARGET_MODELS = [
  "Gemini",
  "Midjourney",
  "Stable Diffusion",
  "DALL-E 3",
  "ChatGPT / GPT-4",
  "Claude",
  "General LLM",
];

const STYLES = [
  "Standard",
  "Cinematic",
  "Photorealistic",
  "Cyberpunk",
  "Anime/Illustration",
  "Minimalist",
  "Technical/Coding",
  "Business/Marketing",
  "Academic/Analytical",
  "Creative Narrative",
];

const TONES = [
  "Professional",
  "Dramatic",
  "Creative/Playful",
  "Precise",
  "Instructive/Coaching",
  "Warm/Conversational",
  "Skeptical/Critical",
];

const PROMPT_TYPES = [
  "Optimized detailed prompt",
  "Detailed Scene Prompt",
  "Structured (Context + Rules)",
  "Roleplay / Persona Prompt",
  "One-shot Prompting Layout",
  "System Prompt Definition",
];

export default function InputSection({
  inputType,
  setInputType,
  textInput,
  setTextInput,
  fileData,
  setFileData,
  fileMimeType,
  setFileMimeType,
  fileName,
  setFileName,
  fileSize,
  setFileSize,

  targetModel,
  setTargetModel,
  style,
  setStyle,
  tone,
  setTone,
  promptType,
  setPromptType,
  temperature,
  setTemperature,

  onGenerate,
  isLoading,
}: InputSectionProps) {
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag Over
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Process File and convert to Base64
  const processFile = (file: File) => {
    setErrorMsg(null);
    const validMimes =
      inputType === "image"
        ? ["image/jpeg", "image/png", "image/webp", "image/gif"]
        : ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];

    if (!validMimes.includes(file.type)) {
      setErrorMsg(
        `Invalid file type. Please upload a valid ${
          inputType === "image" ? "image" : "video"
        } file.`
      );
      return;
    }

    // Limit files to 15MB for optimal API transmission
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("File is too large. Maximum size allowed is 15MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileData(reader.result as string);
      setFileMimeType(file.type);
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
    };
    reader.onerror = () => {
      setErrorMsg("Error parsing file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  // Handle Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle File Selector
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setFileData(null);
    setFileMimeType(null);
    setFileName(null);
    setFileSize(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Input Mode Selector - Sharp and high-contrast */}
      <div className="bg-[#050505] p-1 border border-[#222222] rounded-none flex gap-1">
        <button
          onClick={() => {
            setInputType("text");
            handleClearFile();
          }}
          className={`flex-1 py-3 px-4 rounded-none flex items-center justify-center gap-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer ${
            inputType === "text"
              ? "bg-white text-black border border-white"
              : "text-[#888888] hover:text-white border border-transparent"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>TEXT</span>
        </button>

        <button
          onClick={() => {
            setInputType("image");
            handleClearFile();
          }}
          className={`flex-1 py-3 px-4 rounded-none flex items-center justify-center gap-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer ${
            inputType === "image"
              ? "bg-white text-black border border-white"
              : "text-[#888888] hover:text-white border border-transparent"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>IMAGE</span>
        </button>

        <button
          onClick={() => {
            setInputType("video");
            handleClearFile();
          }}
          className={`flex-1 py-3 px-4 rounded-none flex items-center justify-center gap-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer ${
            inputType === "video"
              ? "bg-white text-black border border-white"
              : "text-[#888888] hover:text-white border border-transparent"
          }`}
        >
          <VideoIcon className="w-3.5 h-3.5" />
          <span>VIDEO</span>
        </button>
      </div>

      {/* Multimodal Content Inputs */}
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-none p-6 relative overflow-hidden">
        {/* Sharp editorial grid */}
        <div className="absolute inset-0 editorial-grid opacity-[0.08] pointer-events-none"></div>

        <div className="relative z-10 space-y-5">
          {/* File Upload Section for Multimodal */}
          {inputType !== "text" && (
            <div className="space-y-2.5">
              <label className="text-[10px] font-mono text-[#888888] uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <span className="w-2 h-[1px] bg-[#333333]"></span>
                <span>Upload Reference ({inputType === "image" ? "Image" : "Video"})</span>
              </label>

              {!fileData ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed rounded-none p-8 text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-center gap-4 relative ${
                    dragActive
                      ? "border-white bg-[#111111]"
                      : "border-[#333333] hover:border-white bg-[#050505]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={inputType === "image" ? "image/*" : "video/*"}
                    onChange={handleFileChange}
                  />
                  <div className="p-3 bg-[#0a0a0a] border border-[#222222] text-[#888888] rounded-none">
                    <UploadCloud className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                      Drag & drop your {inputType} here or <span className="underline decoration-[#444444] hover:decoration-white">browse</span>
                    </p>
                    <p className="text-[10px] text-[#555555] font-mono uppercase tracking-wider mt-1.5">
                      Max file size: 15MB. Safe server processing.
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#050505] border border-[#222222] rounded-none p-4 flex flex-col md:flex-row items-center gap-4 relative overflow-hidden"
                >
                  {/* File preview */}
                  <div className="relative w-full md:w-28 h-28 bg-[#0a0a0a] border border-[#222222] rounded-none overflow-hidden flex items-center justify-center shrink-0">
                    {inputType === "image" ? (
                      <img
                        src={fileData}
                        alt="Uploaded preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="relative w-full h-full flex flex-col items-center justify-center text-[#555555] bg-[#0a0a0a]">
                        <VideoIcon className="w-6 h-6 text-white" />
                        <span className="text-[9px] font-mono uppercase tracking-widest mt-1 text-[#444444]">Video</span>
                      </div>
                    )}
                    <div className="absolute top-1.5 right-1.5 bg-[#050505] border border-[#222222] p-1 flex items-center justify-center">
                      <Eye className="w-3.5 h-3.5 text-[#888888]" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-center md:text-left">
                    <p className="text-xs font-bold text-white uppercase tracking-wider truncate">
                      {fileName}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 mt-1 text-[10px] text-[#555555] font-mono uppercase">
                      <span>Size: <strong className="text-white">{fileSize}</strong></span>
                      <span>&bull;</span>
                      <span>Format: <strong className="text-white">{fileMimeType?.split("/")[1].toUpperCase()}</strong></span>
                    </div>

                    <div className="mt-4 flex items-center justify-center md:justify-start">
                      <button
                        onClick={handleClearFile}
                        className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-[#888888] hover:text-white bg-[#0a0a0a] border border-[#222222] hover:border-white px-3 py-1.5 rounded-none transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>Remove File</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-black border border-[#222222] text-xs font-mono text-white">
                  <AlertCircle className="w-4 h-4 shrink-0 text-white" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* Text Description Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono text-[#888888] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <span className="w-2 h-[1px] bg-[#333333]"></span>
                <span>
                  {inputType === "text"
                    ? "Describe your prompt concept or raw idea"
                    : "Additional details or constraints (Optional)"}
                </span>
              </label>
              <span className="text-[9px] font-mono text-[#555555]">
                {textInput.length} CHARS
              </span>
            </div>

            <textarea
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={
                inputType === "text"
                  ? "Describe your prompt concept in detail. E.g., 'An interactive code reviewer bot for TypeScript that explains complexity...'"
                  : "Provide additional context, guidelines, or elements to focus on..."
              }
              className="w-full bg-[#050505] border border-[#222222] p-4 text-xs font-mono text-white placeholder-[#444444] focus:outline-none focus:border-white transition-all leading-relaxed rounded-none resize-y"
            />
          </div>
        </div>
      </div>

      {/* Advanced Prompt Settings Accordion */}
      <div className="bg-[#0a0a0a]/40 border border-[#222222] rounded-none overflow-hidden">
        <button
          onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
          className="w-full flex items-center justify-between p-4 bg-[#0a0a0a]/80 hover:bg-[#111111] transition-colors cursor-pointer border-b border-[#222222]"
        >
          <div className="flex items-center gap-2.5">
            <Sliders className="w-3.5 h-3.5 text-white" />
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-white">
              Advanced Settings
            </h3>
          </div>
          {isSettingsExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#555555]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#555555]" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {isSettingsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#050505]">
                {/* Target AI Model */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-[#888888] uppercase tracking-widest font-bold">
                    Target AI Platform
                  </label>
                  <select
                    value={targetModel}
                    onChange={(e) => setTargetModel(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#222222] p-3 text-[11px] font-mono text-white focus:outline-none focus:border-white cursor-pointer rounded-none uppercase tracking-wider"
                  >
                    {TARGET_MODELS.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Style/Genre */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-[#888888] uppercase tracking-widest font-bold">
                    Style Genre
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#222222] p-3 text-[11px] font-mono text-white focus:outline-none focus:border-white cursor-pointer rounded-none uppercase tracking-wider"
                  >
                    {STYLES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tone */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-[#888888] uppercase tracking-widest font-bold">
                    Tone & Vibe
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#222222] p-3 text-[11px] font-mono text-white focus:outline-none focus:border-white cursor-pointer rounded-none uppercase tracking-wider"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prompt Layout Type */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-[#888888] uppercase tracking-widest font-bold">
                    Prompt Layout
                  </label>
                  <select
                    value={promptType}
                    onChange={(e) => setPromptType(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#222222] p-3 text-[11px] font-mono text-white focus:outline-none focus:border-white cursor-pointer rounded-none uppercase tracking-wider"
                  >
                    {PROMPT_TYPES.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Temperature Slider */}
                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-mono text-[#888888] uppercase tracking-widest font-bold">
                      Creative Temperature: <span className="text-white font-black">{temperature.toFixed(2)}</span>
                    </label>
                    <div className="flex gap-4 text-[9px] text-[#555555] font-mono uppercase tracking-wider">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#222222] appearance-none cursor-pointer accent-white focus:outline-none rounded-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Primary Action Button */}
      <motion.button
        whileHover={{ scale: 1.01, backgroundColor: "#eeeeee" }}
        whileTap={{ scale: 0.99 }}
        disabled={isLoading || (inputType === "text" && !textInput.trim()) || (inputType !== "text" && !fileData)}
        onClick={onGenerate}
        className="w-full py-4.5 px-6 rounded-none bg-white text-black font-mono font-black text-xs uppercase tracking-[0.2em] shadow-none flex items-center justify-center gap-3.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border border-white"
      >
        <Feather className={`w-4 h-4 ${isLoading ? "animate-pulse" : ""}`} />
        <span>{isLoading ? "Generating Prompt..." : "Generate Prompt"}</span>
      </motion.button>
    </div>
  );
}

