export interface PromptVariation {
  title: string;
  promptText: string;
  explanation: string;
  targetModel: string;
  tips: string;
}

export interface PromptResponse {
  optimizedPrompts: PromptVariation[];
  originalAnalysis: string;
  recommendedSettings: string;
}

export type InputType = "text" | "image" | "video";

export interface PromptHistoryItem {
  id: string;
  timestamp: string;
  inputType: InputType;
  textInput?: string;
  fileName?: string;
  fileSize?: string;
  targetModel: string;
  style: string;
  tone: string;
  promptType: string;
  result: PromptResponse;
}
