import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
app.use(express.json({ limit: '50mb' }));

app.post('/api/extract', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set. Please configure it in your Vercel project settings.');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { base64Data } = req.body;
    
    if (!base64Data) {
      throw new Error('No PDF data provided');
    }
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'application/pdf',
          },
        },
        'Extract all multiple-choice questions from this document. Return a JSON array where each object has: "question" (string), "options" (array of strings), "correctAnswerIndex" (integer, 0-based index of the correct option), and "explanation" (string). If the correct answer is not explicitly marked, deduce it to the best of your ability. If there are no multiple choice questions, return an empty array.',
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
            },
            required: ['question', 'options', 'correctAnswerIndex', 'explanation'],
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response from Gemini');
    }

    const questions = JSON.parse(text);
    res.json({ questions });
  } catch (error: any) {
    console.error('Extraction error:', error);
    res.status(500).json({ error: error.message || 'Failed to extract questions' });
  }
});

export default app;
