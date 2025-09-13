
import { GoogleGenAI, Type } from "@google/genai";
import type { Strategy } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // In a real app, you'd want to handle this more gracefully.
    // For this environment, we assume it's always present.
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const strategySchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "A creative and descriptive name for the trading strategy."
        },
        description: {
            type: Type.STRING,
            description: "A one-sentence summary of what the strategy does."
        },
        rules: {
            type: Type.OBJECT,
            properties: {
                entry: {
                    type: Type.STRING,
                    description: "The specific condition(s) for entering a trade (e.g., buying a stock)."
                },
                exit: {
                    type: Type.STRING,
                    description: "The specific condition(s) for exiting a trade (e.g., selling a stock)."
                },
                stopLoss: {
                    type: Type.STRING,
                    description: "An optional rule for a stop-loss to manage risk."
                }
            }
        }
    }
};

export const generateStrategyFromText = async (prompt: string): Promise<Strategy> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Parse the following user request into a structured trading strategy. Be creative but stick to the user's core logic. If they mention a stock, ignore it and make the rule generic.

            User Request: "${prompt}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: strategySchema,
            },
        });
        
        const text = response.text.trim();
        const parsedJson = JSON.parse(text);

        // Basic validation
        if (parsedJson.name && parsedJson.description && parsedJson.rules && parsedJson.rules.entry) {
            return parsedJson as Strategy;
        } else {
            throw new Error("Generated strategy is missing required fields.");
        }

    } catch (error) {
        console.error("Error generating strategy from text:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
};

export const optimizeStrategy = async (strategy: Strategy): Promise<string> => {
    try {
        const prompt = `
            Analyze the following trading strategy and provide one or two concise, actionable suggestions for improvement. Focus on parameter tuning, adding complementary indicators, or risk management. Keep the suggestions brief and to the point.

            Strategy Name: ${strategy.name}
            Description: ${strategy.description}
            Entry Rule: ${strategy.rules.entry}
            Exit Rule: ${strategy.rules.exit}
            Stop-Loss: ${strategy.rules.stopLoss || 'Not specified'}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error optimizing strategy:", error);
        throw new Error("Failed to get optimization suggestions from the AI model.");
    }
};
