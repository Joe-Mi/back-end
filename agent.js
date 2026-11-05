import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemorySaver } from "@langchain/langgraph";
import { createAgent } from "langchain";
import { z } from "zod";

class DeliveryAgent {
    constructor() {
        this.responseSchema = z.object({
            summary: z.string(),
            confidence: z.number().min(0).max(1),
        });
        this.checkpointer = new MemorySaver();
        this.agent = null;
    }

    startUp() {
        if (this.agent) {
            return this.agent;
        }

        const model = new ChatGoogleGenerativeAI({
            model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        });

        this.agent = createAgent({
            model,
            tools: [],
            systemPrompt: [
                "You are a concise, helpful delivery and location-planning assistant.",
                "Give practical suggestions and state uncertainty when details are not verified.",
                "Do not claim to have searched live sources or used tools.",
                "Return a concise summary and a confidence score from 0 to 1.",
            ].join(" "),
            responseFormat: this.responseSchema,
            checkpointer: this.checkpointer,
        });

        return this.agent;
    }

    async handlePrompt(prompt, sessionId) {
        if (typeof prompt !== "string" || !prompt.trim()) {
            throw new TypeError("Prompt must be a non-empty string");
        }
        if (typeof sessionId !== "string" || !sessionId) {
            throw new TypeError("Session ID is required");
        }

        const result = await this.startUp().invoke(
            { messages: [{ role: "user", content: prompt.trim() }] },
            { configurable: { thread_id: sessionId } }
        );

        return this.responseSchema.parse(result.structuredResponse);
    }
}

export default new DeliveryAgent();
