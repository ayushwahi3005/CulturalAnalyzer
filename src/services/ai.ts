import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function normalizeQuestion(question: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that converts programming questions to use culturally neutral language. Convert questions to remove any regional or cultural references while keeping the core problem-solving concept and difficulty the same."
        },
        {
          role: "user",
          content: `Convert this question to use culturally neutral language: ${question}`
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error normalizing question:', error);
    throw new Error('Failed to normalize question');
  }
}

export async function analyzeCulturalTerminology(text: string): Promise<CulturalReport> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a cultural analysis expert. Analyze text for cultural terminology and respond with a JSON object containing cultural analysis metrics."
        },
        {
          role: "user",
          content: `Analyze this text for cultural terminology and respond ONLY with a JSON object containing:
          1. culturalTerms: array of cultural terms found
          2. totalWords: total word count
          3. culturalWordCount: count of cultural words
          4. percentage: percentage of cultural terms (rounded to 2 decimals)
          5. culturalOrigin: the cultural origin/region of the terminology
          6. biasPercentage: bias percentage (0-100) indicating cultural specificity
          7. analysis: brief analysis of the cultural context

          Text to analyze: ${text}`
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing cultural terminology:', error);
    throw new Error('Failed to analyze cultural terminology');
  }
}