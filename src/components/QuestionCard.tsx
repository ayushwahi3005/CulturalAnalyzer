import React, { useState } from 'react';
import { NormalizedQuestion } from '../types';
import { ArrowRightLeft, Loader2, FileCode, BarChart2,Download } from 'lucide-react';

interface QuestionCardProps {
  question: NormalizedQuestion;
  onNormalize: () => void;
  onAnalyze: () => void;
  onSelectCode: (code: string) => void;
}

export function QuestionCard({ question, onNormalize, onAnalyze, onSelectCode }: QuestionCardProps) {
  const { original, normalized, isProcessing, error, culturalReport, selectedCode } = question;
  const [showCodeSelection, setShowCodeSelection] = useState(false);
  const handleDownloadReport = () => {
    const reportData = {
      title: original.title,
      difficulty: original.difficulty,
      originalContent: original.content,
      normalizedContent: normalized,
      culturalAnalysis: culturalReport || 'No cultural analysis available',
    };

    const reportString = JSON.stringify(reportData, null, 2); // Pretty-print JSON
    const blob = new Blob([reportString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Trigger file download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${original.title.replace(/\s+/g, '_')}_report.json`; // Safe file name
    a.click();

    // Revoke the object URL
    URL.revokeObjectURL(url);
  };
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
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700">Original Question:</h3>
            <button
              onClick={() => setShowCodeSelection(!showCodeSelection)}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              <FileCode className="h-4 w-4 mr-1" />
              {showCodeSelection ? 'Hide Code Selection' : 'Show Code Selection'}
            </button>
          </div>
          {showCodeSelection ? (
            <div className="space-y-2">
              <textarea
                className="w-full p-2 border rounded-md font-mono text-sm"
                rows={5}
                value={selectedCode || original.content}
                onChange={(e) => onSelectCode(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={onAnalyze}
                  className="flex items-center px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                >
                  <BarChart2 className="h-4 w-4 mr-1" />
                  Analyze
                </button>
                <button
                  onClick={onNormalize}
                  disabled={isProcessing}
                  className={`flex items-center px-3 py-1 rounded-md text-white ${
                    isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin mr-1 h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="mr-1 h-4 w-4" />
                      Convert
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">{original.content}</p>
          )}
        </div>

        {normalized && (
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Normalized Question:</h3>
            <p className="text-gray-600">{normalized}</p>
          </div>
        )}

        {culturalReport && (
          <div>
          <div className="bg-purple-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Cultural Analysis Report:</h3>
            <div className="space-y-4">
              {/* Cultural Origin */}
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Cultural Origin:</h4>
                <p className="text-purple-700 font-medium">{culturalReport.culturalOrigin}</p>
              </div>

              {/* Bias Percentage */}
              <div className="bg-white p-3 rounded-md shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-700">Cultural Bias Level:</h4>
                  <span className="font-medium text-purple-700">{culturalReport.biasPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${culturalReport.biasPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Cultural Terms */}
              {culturalReport.culturalTerms.length > 0 && (
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Cultural Terms Found:</h4>
                  <div className="flex flex-wrap gap-2">
                    {culturalReport.culturalTerms.map((term, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-sm"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis */}
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Analysis:</h4>
                <p className="text-gray-600 text-sm">{culturalReport.analysis}</p>
              </div>

              <div className="text-sm text-gray-500 mt-2">
                Found {culturalReport.culturalWordCount} cultural terms out of {culturalReport.totalWords} total words
              </div>
            </div>
          </div>
          <button
            onClick={handleDownloadReport}
            className="flex items-center mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Report
          </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}