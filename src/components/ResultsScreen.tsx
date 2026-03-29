import React from 'react';
import { Question } from '../types';
import { RotateCcw, CheckCircle2, XCircle, MinusCircle, RefreshCw } from 'lucide-react';

interface ResultsScreenProps {
  questions: Question[];
  userAnswers: (number | null)[];
  onRestart: () => void;
  onReattempt: () => void;
}

export function ResultsScreen({ questions, userAnswers, onRestart, onReattempt }: ResultsScreenProps) {
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  userAnswers.forEach((answer, idx) => {
    if (answer === null) {
      unattemptedCount++;
    } else if (answer === questions[idx].correctAnswerIndex) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const rawScore = correctCount * 1 - incorrectCount * 0.25;
  const maxScore = questions.length;
  const percentage = Math.max(0, (rawScore / maxScore) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Test Complete!</h2>
        <p className="text-slate-600">Here's how you performed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center md:col-span-2 md:row-span-2">
          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={`${percentage >= 50 ? 'text-emerald-500' : 'text-amber-500'}`}
                strokeDasharray={`${percentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-slate-900">{rawScore.toFixed(2)}</span>
              <span className="text-sm text-slate-500 font-medium">/ {maxScore}</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Final Score</h3>
          <p className="text-sm text-slate-500 mt-1">+1 for correct, -0.25 for incorrect</p>
        </div>

        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3 className="font-semibold text-emerald-900">Correct</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-700">{correctCount}</p>
          <p className="text-sm text-emerald-600 mt-1">+{correctCount} points</p>
        </div>

        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold text-red-900">Incorrect</h3>
          </div>
          <p className="text-3xl font-bold text-red-700">{incorrectCount}</p>
          <p className="text-sm text-red-600 mt-1">-{incorrectCount * 0.25} points</p>
        </div>

        <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex flex-col justify-center md:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <MinusCircle className="w-6 h-6 text-slate-500" />
            <h3 className="font-semibold text-slate-800">Unattempted</h3>
          </div>
          <p className="text-3xl font-bold text-slate-700">{unattemptedCount}</p>
          <p className="text-sm text-slate-500 mt-1">0 points</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button
          onClick={onReattempt}
          className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <RefreshCw className="w-5 h-5" />
          Reattempt Test
        </button>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <RotateCcw className="w-5 h-5" />
          Upload Another PDF
        </button>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-6">Detailed Review</h3>
      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const userAnswer = userAnswers[qIdx];
          const isCorrect = userAnswer === q.correctAnswerIndex;
          const isUnattempted = userAnswer === null;

          return (
            <div key={qIdx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className={`px-6 py-4 border-b flex items-start gap-4 ${
                isCorrect ? 'bg-emerald-50 border-emerald-100' : 
                isUnattempted ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-100'
              }`}>
                <div className="mt-1">
                  {isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> :
                   isUnattempted ? <MinusCircle className="w-6 h-6 text-slate-400" /> :
                   <XCircle className="w-6 h-6 text-red-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-500">Q{qIdx + 1}</span>
                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                      isCorrect ? 'bg-emerald-100 text-emerald-700' : 
                      isUnattempted ? 'bg-slate-200 text-slate-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {isCorrect ? '+1.00' : isUnattempted ? '0.00' : '-0.25'}
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-slate-900">{q.question}</h4>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const isActualCorrect = q.correctAnswerIndex === optIdx;
                    
                    let optionClass = "border-slate-200 bg-white text-slate-700";
                    if (isActualCorrect) {
                      optionClass = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500";
                    } else if (isSelected && !isActualCorrect) {
                      optionClass = "border-red-300 bg-red-50 text-red-900";
                    }

                    return (
                      <div key={optIdx} className={`p-4 rounded-xl border-2 flex items-start gap-3 ${optionClass}`}>
                        <div className="mt-0.5">
                          {isActualCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                          )}
                        </div>
                        <span className="leading-snug">{opt}</span>
                        {isSelected && <span className="ml-auto text-xs font-semibold uppercase tracking-wider opacity-70">Your Answer</span>}
                        {isActualCorrect && !isSelected && <span className="ml-auto text-xs font-semibold uppercase tracking-wider text-emerald-600">Correct Answer</span>}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h5 className="text-sm font-bold text-blue-900 mb-1 uppercase tracking-wider">Explanation</h5>
                  <p className="text-blue-800 text-sm leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
