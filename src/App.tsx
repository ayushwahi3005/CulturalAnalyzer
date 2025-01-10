import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { mockQuestions } from './data/mockQuestions';
import { QuestionCard } from './components/QuestionCard';
import { normalizeQuestion, analyzeCulturalTerminology } from './services/ai';
import { NormalizedQuestion } from './types';

export default function App() {
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    difficulty: 'EASY',
  });
  const [questions, setQuestions] = useState<NormalizedQuestion[]>(
    mockQuestions.map(q => ({
      original: q,
      normalized: '',
      isProcessing: false,
      selectedCode: q.content
    }))
  );

  
  
  const handleNormalizeQuestion = async (index: number) => {
    if (questions[index].isProcessing) return;

    setQuestions(prev => prev.map((q, i) => 
      i === index ? { ...q, isProcessing: true, error: undefined } : q
    ));

    try {
      const normalizedContent = await normalizeQuestion(questions[index].selectedCode || questions[index].original.content);
      setQuestions(prev => prev.map((q, i) => 
        i === index ? { ...q, normalized: normalizedContent, isProcessing: false } : q
      ));
    } catch (error) {
      setQuestions(prev => prev.map((q, i) => 
        i === index ? { ...q, error: error instanceof Error ? error.message : 'Failed to normalize question', isProcessing: false } : q
      ));
    }
  };

  const handleAnalyzeQuestion = async (index: number) => {
    if (questions[index].isProcessing) return;

    setQuestions(prev => prev.map((q, i) => 
      i === index ? { ...q, isProcessing: true, error: undefined } : q
    ));

    try {
      const report = await analyzeCulturalTerminology(questions[index].selectedCode || questions[index].original.content);
      setQuestions(prev => prev.map((q, i) => 
        i === index ? { ...q, culturalReport: report, isProcessing: false } : q
      ));
    } catch (error) {
      setQuestions(prev => prev.map((q, i) => 
        i === index ? { ...q, error: error instanceof Error ? error.message : 'Failed to analyze question', isProcessing: false } : q
      ));
    }
  };

  const handleSelectCode = (index: number, code: string) => {
    setQuestions(prev => prev.map((q, i) => 
      i === index ? { ...q, selectedCode: code } : q
    ));
  };
  const handleAddQuestion = () => {
    if (!newQuestion.title || !newQuestion.content) {
      alert('Please provide a title and content.');
      return;
    }
    // const questionLen=questions.length;
    const newQuestionObject = {
      original: { id: Date.now().toString(), ...newQuestion },
      normalized: '',
      isProcessing: false,
      selectedCode: newQuestion.content,
    };

    setQuestions(prev => [...prev, newQuestionObject]);
    setNewQuestion({ title: '', content: '', difficulty: 'EASY' });
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center mb-8">
          <Brain className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Cultural Coding Question Normalizer</h1>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
        >
          {isAdding ? 'Cancel' : 'Add New Question'}
        </button>

        {isAdding && (
          <div className="bg-white p-4 shadow rounded mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Title</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newQuestion.title}
                onChange={e => setNewQuestion({ ...newQuestion, title: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Content</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={4}
                value={newQuestion.content}
                onChange={e => setNewQuestion({ ...newQuestion, content: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Difficulty</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newQuestion.difficulty}
                onChange={e => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <button
              onClick={handleAddQuestion}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Question
            </button>
          </div>
        )}

        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.original.id}
              question={question}
              onNormalize={() => handleNormalizeQuestion(index)}
              onAnalyze={() => handleAnalyzeQuestion(index)}
              onSelectCode={(code) => handleSelectCode(index, code)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}