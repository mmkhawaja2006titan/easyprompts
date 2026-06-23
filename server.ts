import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase limits to handle base64 image and video payloads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize GoogleGenAI SDK
// API key is accessed via process.env.GEMINI_API_KEY. Safe on server-side.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Route for prompt generation
app.post("/api/generate-prompt", async (req, res) => {
  try {
    const { inputType, textInput, fileData, fileMimeType, targetModel, style, tone, promptType, temperature } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(401).json({
        error: "Gemini API key is missing. Please set GEMINI_API_KEY in Settings > Secrets.",
      });
    }

    // Build parts for multimodal prompt
    const parts: any[] = [];

    // System instruction helper defining the core task
    const systemInstruction = `You are easyPrompts, an elite Prompt Engineering Specialist. Your mission is to generate extremely polished, high-quality, creative, and optimized prompts for other AI models (such as Midjourney, Stable Diffusion, DALL-E, ChatGPT, Claude, or Gemini) based on the user's input.

Analyze the input (which may be text, an image, or a short video description/contents) and construct a target prompt that conforms perfectly to the requested configuration:
- Target AI Model/Platform: ${targetModel || "General AI"}
- Style/Genre: ${style || "Standard"}
- Tone/Vibe: ${tone || "Professional"}
- Prompt Type/Structure: ${promptType || "Optimized detailed prompt"}

Guidelines for the prompt generation:
1. ALWAYS output your final generated prompt inside a structured JSON payload so the UI can parse and render it beautifully.
2. Provide multiple variations (e.g., "The Masterpiece" (highly detailed), "The Speedrun" (concise/direct), and "The Wildcard" (highly creative & out-of-the-box alternate formulation)).
3. For image-to-prompt tasks: extract specific subject details, art style, composition, lighting, shadows, colors, and camera/lens metadata.
4. For text-to-prompt tasks: amplify and expand the user's simple concept into a rich, descriptive setup with concrete context, formatting, and constraints.
5. Provide a brief explanation of the prompt engineering techniques applied (e.g., roleplay, shot-chaining, negative words, stylistic triggers).
6. Provide tips for best results on the target platform (e.g., "use negative prompt: text, hands" or "set --ar 16:9 for Midjourney").

The output MUST be valid JSON matching this schema (do not wrap in markdown blocks, just return pure JSON):
{
  "optimizedPrompts": [
    {
      "title": "Variation Title (e.g., 'Masterpiece Version')",
      "promptText": "The actual full optimized prompt text here...",
      "explanation": "Why this prompt works and the techniques used",
      "targetModel": "Recommended model or target platform",
      "tips": "Tips specifically for this variation"
    }
  ],
  "originalAnalysis": "Short evaluation and analysis of the source input provided by the user.",
  "recommendedSettings": "Recommended parameter settings (e.g., negative prompt, temperature, aspect ratios, etc.)"
}`;

    if (inputType === "text") {
      if (!textInput || textInput.trim() === "") {
        return res.status(400).json({ error: "Text input is required." });
      }
      parts.push({
        text: `Analyze this source text and generate prompt variations according to the system instructions: "${textInput}"`,
      });
    } else if (inputType === "image" || inputType === "video") {
      if (!fileData || !fileMimeType) {
        return res.status(400).json({ error: `File data and mimeType are required for ${inputType} prompt generation.` });
      }

      // Extract raw base64 data from potential Data URL
      let base64Data = fileData;
      if (fileData.includes(";base64,")) {
        base64Data = fileData.split(";base64,")[1];
      }

      parts.push({
        inlineData: {
          mimeType: fileMimeType,
          data: base64Data,
        },
      });

      parts.push({
        text: `Analyze this uploaded ${inputType} file and generate optimized prompt variations for it according to the specifications. If text description was provided, also incorporate it: "${textInput || ""}"`,
      });
    } else {
      return res.status(400).json({ error: "Invalid input type. Must be 'text', 'image', or 'video'." });
    }

    // Call the Gemini-3.5-flash model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: parseFloat(temperature) || 0.75,
      },
    });

    const responseText = response.text || "{}";
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText.trim());
    } catch (parseError) {
      // Fallback if model didn't output valid JSON
      console.warn("Gemini output was not valid JSON, creating fallback mapping", responseText);
      parsedResult = {
        optimizedPrompts: [
          {
            title: "Optimized Prompt",
            promptText: responseText,
            explanation: "Direct optimization based on source input.",
            targetModel: targetModel || "General AI",
            tips: "Use as-is in your model of choice.",
          },
        ],
        originalAnalysis: "Generated with fallback parser due to formatting variations.",
        recommendedSettings: "Standard parameters.",
      };
    }

    res.json(parsedResult);
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred while generating prompts.",
    });
  }
});

// Setup Vite Dev Server / Static Hosting
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`easyPrompts server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
