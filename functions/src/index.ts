/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 * 
 * Updated: Using direct API key for testing
 */

import { onRequest } from "firebase-functions/v2/https";
import OpenAI from 'openai';
import { defineSecret } from "firebase-functions/params";

const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY")

// HTTPS Endpoint: /askGPT
export const askGPT = onRequest(
  { cors: true, maxInstances: 10, secrets: [OPENAI_API_KEY] },
  async (req, res) => {
    const apiKey = OPENAI_API_KEY.value();
    console.log("askGPT API Key available?", !!apiKey);
    const openai = new OpenAI({ apiKey });

    console.log("API Key exists:", !!OPENAI_API_KEY);

    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const prompt = req.body.prompt;

    if (!prompt) {
      res.status(400).send('Missing prompt in request body.');
      return;
    }

    try {
      console.log("Initializing OpenAI client with hardcoded API key...");
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: prompt },
      ];

      console.log("Attempting to create chat completion...");
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });
      console.log("Chat completion successful");

      const aiResponse = completion.choices[0].message.content;

      res.status(200).json({ response: aiResponse });
    } catch (error: any) {
      console.error("Detailed error in askGPT function:", {
        name: error.name,
        message: error.message,
        status: error.status,
        type: error.type,
        code: error.code,
        stack: error.stack
      });
      
      if (error instanceof OpenAI.APIError) {
        res.status(error.status || 500).json({ 
          error: `OpenAI API Error: ${error.message}`,
          details: {
            type: error.type,
            code: error.code
          }
        });
      } else if (error.message.includes("Invalid API key")) {
        res.status(500).json({ 
          error: "Server configuration error: Invalid OpenAI API key.",
          details: {
            message: error.message,
            stack: error.stack
          }
        });
      } else {
        res.status(500).json({ 
          error: "Failed to process request due to a server error.",
          details: {
            message: error.message,
            stack: error.stack
          }
        });
      }
    }
  }
);

// HTTPS Endpoint: /summarizeNotes
export const summarizeNotes = onRequest(
  { cors: true, maxInstances: 10, secrets: [OPENAI_API_KEY] },
  async (req, res) => {
    const apiKey = OPENAI_API_KEY.value();
    console.log("summarizeNotes API Key available?", !!apiKey);
    const openai = new OpenAI({ apiKey });

    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const text = req.body.text;

    if (!text) {
      res.status(400).send('Missing text in request body.');
      return;
    }

    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {role: "system", content: "You are a highly skilled summarization AI. Condense the following text into a concise and clear summary, retaining all key information"},
        {role: "user", content: text},
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      const summary = completion.choices[0].message.content;

      res.status(200).json({ summary: summary });
    } catch (error: any) {
      console.error("Detailed error in summarizeNotes function:", {
        name: error.name,
        message: error.message,
        status: error.status,
        type: error.type,
        code: error.code,
        stack: error.stack
      });
      
      if(error instanceof OpenAI.APIError) {
        res.status(error.status || 500).json({ 
          error: `OpenAI API Error: ${error.message}`,
          details: {
            type: error.type,
            code: error.code
          }
        });
      } else if (error.message.includes("Invalid API key")) {
        res.status(500).json({ 
          error: "Server configuration error: Invalid OpenAI API key.",
          details: {
            message: error.message,
            stack: error.stack
          }
        });
      } else {
        res.status(500).json({ 
          error: "Failed to summarize text due to a server error.",
          details: {
            message: error.message,
            stack: error.stack
          }
        });
      }
    }
  }
);

// HTTPS Endpoint: /generateQuiz
export const generateQuiz = onRequest(
  { cors: true, maxInstances: 10, secrets: [OPENAI_API_KEY] },
  async (req, res) => {
    const apiKey = OPENAI_API_KEY.value();
    console.log("generateQuiz API Key available?", !!apiKey);
    const openai = new OpenAI({ apiKey });

    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const input = req.body.input;

    if (!input) {
      res.status(400).send('Missing input in request body.');
      return;
    }

    try {
      const quizGenerationPrompt = `Generate 3 multiple-choice questions with 4 options each, and indicate the correct answer for the following topic/paragraph. Provide the output as a JSON array of objects. Each object should have 'id' (number), 'question' (string), 'options' (array of strings), and 'correctAnswerIndex' (number, 0-indexed).

Topic/Paragraph: "${input}"

Example JSON structure for one question:
{
  "id": 1,
  "question": "What is ...?",
  "options": ["A", "B", "C", "D"],
  "correctAnswerIndex": 0
}
`;

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: "You are an AI that creates multiple-choice quizzes from provided text or topics. Your output must be a valid JSON array of quiz questions." },
        { role: "user", content: quizGenerationPrompt }
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        response_format: { type: "json_object" },
      });

      const rawAiResponse = completion.choices[0].message.content;

      let quizQuestions;
      try {
        quizQuestions = JSON.parse(rawAiResponse || "[]");
      } catch (jsonError) {
        console.error("Failed to parse JSON from AI response:", jsonError);
        res.status(500).json({ error: "Failed to parse quiz questions from AI response." });
        return;
      }
      
      res.status(200).json({ quiz: quizQuestions });
    } catch (error: any) {
      console.error("Detailed error in generateQuiz function:", {
        name: error.name,
        message: error.message,
        status: error.status,
        type: error.type,
        code: error.code,
        stack: error.stack
      });
      
      if(error instanceof OpenAI.APIError) {
        res.status(error.status || 500).json({ 
          error: `OpenAI API Error: ${error.message}`,
          details: {
            type: error.type,
            code: error.code
          }
        });
      } else if (error.message.includes("Invalid API key")) {
        res.status(500).json({ 
          error: "Server configuration error: Invalid OpenAI API key.",
          details: {
            message: error.message,
            stack: error.stack
          }
        });
      } else {
        res.status(500).json({ 
          error: "Failed to generate quiz due to a server error.",
          details: {
            message: error.message,
            stack: error.stack
          }
        });
      }
    }
  }
);
