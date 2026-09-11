import Tesseract from 'tesseract.js';
import { ChatGroq } from '@langchain/groq';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

// ─── OCR ─────────────────────────────────────────────────────────────────────

/**
 * Runs Tesseract OCR on a base64 data URI image.
 * Returns the raw extracted text string.
 */
export const extractTextFromImage = async (fileUrl) => {
    // Convert data URI to Buffer
    const base64Data = fileUrl.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const result = await Tesseract.recognize(buffer, 'eng', {
        logger: () => {}, // silence progress logs
    });

    return result.data.text.trim();
};

// ─── LLM ─────────────────────────────────────────────────────────────────────

const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile',
    temperature: 0,
});

const SYSTEM_PROMPT = `You are a medical data extraction assistant.
Given raw OCR text from a medical discharge or recovery document, extract and return ONLY a valid JSON object with this exact structure:
{
  "procedure": string or null,
  "surgery_date": "YYYY-MM-DD" or null,
  "discharge_date": "YYYY-MM-DD" or null,
  "medications": [{ "name": string, "dose": string, "schedule": [string] }],
  "wound_care": [string],
  "exercises": [string],
  "restrictions": [string],
  "follow_up": { "day": number } or null,
  "warning_signs": [string]
}
Return ONLY the JSON object. No markdown, no explanation.`;

/**
 * Sends OCR text to Groq LLaMA via LangChain and returns structured JSON.
 */
export const structureMedicalData = async (rawText) => {
    const messages = [
        new SystemMessage(SYSTEM_PROMPT),
        new HumanMessage(`Extract medical data from this text:\n\n${rawText}`),
    ];

    const response = await llm.invoke(messages);
    const content = response.content.trim();

    // Strip markdown code fences if model adds them
    const cleaned = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

    return JSON.parse(cleaned);
};

// ─── Combined Pipeline ────────────────────────────────────────────────────────

/**
 * Full pipeline: base64 image → OCR text → structured medical JSON.
 */
export const processReportFile = async (fileUrl, mimeType) => {
    let rawText;

    if (mimeType === 'application/pdf') {
        // For PDFs: extract text by treating first page as image (MVP approach)
        // Production: use pdf-parse or similar to extract text directly
        rawText = await extractTextFromImage(fileUrl);
    } else {
        rawText = await extractTextFromImage(fileUrl);
    }

    if (!rawText || rawText.length < 10) {
        throw new Error('OCR extracted insufficient text from the document.');
    }

    const structuredData = await structureMedicalData(rawText);

    return { raw_text: rawText, structured: structuredData };
};
