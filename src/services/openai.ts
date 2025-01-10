import OpenAI from 'openai';
import { LeetCodeQuestion } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function normalizeQuestion(question: LeetCodeQuestion): Promise<string> {
  try {
    const prompt = `
      Convert the following programming question to use culturally neutral language and examples. 
      Remove any regional or cultural references while maintaining the core problem-solving concept.
      Keep the difficulty level and logical complexity the same.
      Question: ${question.content}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content || question.content;
  } catch (error) {
    console.error('Error normalizing question:', error);
    throw new Error('Failed to normalize question');
  }
}