import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { mockQuestions } from './data/mockQuestions';
import { QuestionCard } from './components/QuestionCard';
import { normalizeQuestion } from './services/openai';
import { NormalizedQuestion } from './types';

function App() {
  const [questions, setQuestions] = useState<NormalizedQuestion[]>(
    mockQuestions.map(q => ({
      original: q,
      normalized: '',
      isProcessing: false
    }))
  );

  const handleNormalizeQuestion = async (index: number) => {
    if (questions[index].isProcessing) return;

    setQuestions(prev => prev.map((q, i) => 
      i === index ? { ...q, isProcessing: true, error: undefined } : q
    ));

    try {
      const normalizedContent = await normalizeQuestion(questions[index].original);
      setQuestions(prev => prev.map((q, i) => 
        i === index ? { ...q, normalized: normalizedContent, isProcessing: false } : q
      ));
    } catch (error) {
      setQuestions(prev => prev.map((q, i) => 
        i === index ? { ...q, error: 'Failed to normalize question', isProcessing: false } : q
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center mb-8">
          <Brain className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">LeetCode Question Normalizer</h1>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.original.id}
              question={question}
              onNormalize={() => handleNormalizeQuestion(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;