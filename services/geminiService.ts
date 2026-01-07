
import { GoogleGenAI } from "@google/genai";
import { SubjectType } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
// Note: In this specific app, the key is provided by the user and stored in localStorage.
export const getGeminiClient = (apiKey: string) => {
  return new GoogleGenAI({ apiKey });
};

export const generateActivitySuggestion = async (
  apiKey: string,
  subject: SubjectType,
  duration: number,
  context?: string
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is required");

  const ai = getGeminiClient(apiKey);
  
  const prompt = `
    I am an elementary school teacher.
    Subject: ${subject}
    Duration: ${duration} minutes.
    Context/Topic: ${context || "General review or fun activity"}
    
    Please suggest a single, specific, engaging, and age-appropriate classroom activity or warm-up for this time slot.
    Keep it concise (under 50 words). Format it as a direct instruction or description I can put on the agenda card.
    Do not add introductory text like "Here is an idea". Just give me the activity description.
  `;

  try {
    // Using 'gemini-3-flash-preview' for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // The response object features a text property (not a method)
    return response.text || "Could not generate an idea at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate suggestion. Please check your API key.");
  }
};
