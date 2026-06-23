import { motion } from "motion/react";
import { Zap, Camera, Code, BookOpen, Megaphone } from "lucide-react";
import { InputType } from "../types";

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  icon: any;
  inputType: InputType;
  textInput: string;
  targetModel: string;
  style: string;
  tone: string;
  promptType: string;
  temperature: number;
}

const TEMPLATES: TemplatePreset[] = [
  {
    id: "cyberpunk",
    name: "Cyberpunk Street",
    description: "Generate dramatic Midjourney prompts for futuristic cities",
    icon: Camera,
    inputType: "text",
    textInput: "A rain-slicked futuristic Tokyo alleyway filled with glowing neon signs, steam rising from grates, a lone wanderer wearing a reflective trench coat, cinematic lighting, 8k resolution.",
    targetModel: "Midjourney",
    style: "Cyberpunk",
    tone: "Dramatic",
    promptType: "Detailed Scene Prompt",
    temperature: 0.9,
  },
  {
    id: "refactor",
    name: "Code Optimizer",
    description: "Build robust system prompt for software refactoring",
    icon: Code,
    inputType: "text",
    textInput: "A React TypeScript component that has performance bottlenecks and needs proper memoization, custom hooks, cleaner state updates, and robust error bounds.",
    targetModel: "Claude",
    style: "Technical",
    tone: "Instructive",
    promptType: "Roleplay / Persona Prompt",
    temperature: 0.3,
  },
  {
    id: "novel",
    name: "Sci-Fi Novel Start",
    description: "Get expansive creative prompts for narrative building",
    icon: BookOpen,
    inputType: "text",
    textInput: "An ancient spaceship discovered buried beneath the Antarctic ice, dating back 5 million years, sending a faint rhythmic pulse into deep space.",
    targetModel: "ChatGPT / GPT-4",
    style: "Cinematic",
    tone: "Creative",
    promptType: "Detailed Scene Prompt",
    temperature: 1.1,
  },
  {
    id: "marketing",
    name: "SaaS Hero Copywriter",
    description: "Formulate strategic marketing copywriting prompts",
    icon: Megaphone,
    inputType: "text",
    textInput: "A minimalist dashboard productivity app tailored for developers with ADHD, focusing on reducing cognitive overload and promoting frictionless deep focus.",
    targetModel: "Gemini",
    style: "Business",
    tone: "Professional",
    promptType: "Structured (Context + Rules)",
    temperature: 0.7,
  },
];

interface PromptTemplatesProps {
  onSelectTemplate: (template: TemplatePreset) => void;
}

export default function PromptTemplates({ onSelectTemplate }: PromptTemplatesProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-1.5 h-1.5 bg-white rounded-none"></span>
        <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#888888] font-bold">
          SIMPLE PRESET TEMPLATES
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {TEMPLATES.map((template, idx) => {
          const IconComponent = template.icon;
          return (
            <motion.button
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.04, ease: "easeOut" }}
              whileHover={{ y: -2, borderColor: "#ffffff", backgroundColor: "#0e0e0e" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTemplate(template)}
              className="text-left p-5 rounded-none border border-[#222222] bg-[#050505] cursor-pointer transition-all duration-150 group flex flex-col justify-between h-full relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 border border-[#222222] bg-[#0c0c0c] text-[#888888] group-hover:border-white group-hover:text-white transition-colors duration-150 rounded-none">
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#666666] bg-[#111111] border border-[#222222] px-2 py-0.5 rounded-none">
                    {template.targetModel}
                  </span>
                </div>
                <h4 className="font-sans font-bold text-white group-hover:text-white text-sm mb-1.5 uppercase tracking-tight">
                  {template.name}
                </h4>
                <p className="text-xs text-[#888888] leading-relaxed line-clamp-2">
                  {template.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
                <span className="text-[9px] text-[#555555] font-mono uppercase tracking-wider">Style: {template.style}</span>
                <span className="text-[9px] font-mono text-white group-hover:underline flex items-center gap-1 font-bold uppercase tracking-widest">
                  LOAD &rarr;
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

