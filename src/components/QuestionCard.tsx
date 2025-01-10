import React from 'react';
import { NormalizedQuestion } from '../types';
import { ArrowRightLeft, Loader2 } from 'lucide-react';

interface QuestionCardProps {
  question: NormalizedQuestion;
  onNormalize: () => void;
}

export function QuestionCard({ question, onNormalize }: QuestionCardProps) {
  const { original, normalized, isProcessing, error } = question;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{original.title}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          original.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
          original.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {original.difficulty}
        </span>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium text-gray-700 mb-2">Original Question:</h3>
          <p className="text-gray-600">{original.content}</p>
        </div>

        {normalized && (
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Normalized Question:</h3>
            <p className="text-gray-600">{normalized}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={onNormalize}
          disabled={isProcessing}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white font-medium ${
            isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Normalizing...
            </>
          ) : (
            <>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Normalize Question
            </>
          )}
        </button>
      </div>
    </div>
  );
}