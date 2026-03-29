import React, { useState } from 'react';
import { Question } from '../types';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface TestScreenProps {
  questions: Question[];
  onFinish: (answers: (number | null)[]) => void;
}

export function TestScreen({ questions, onFinish }: TestScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinish = () => {
    if (window.confirm('Are you sure you want to finish the test?')) {
      onFinish(answers);
    }
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-lg font-medium text-slate-700">
            Question {currentIndex + 1} of {questions.length}
          </h2>
          <span className="text-sm text-slate-500 font-medium">
            {answeredCount} answered
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-8">
          <h3 className="text-xl font-medium text-slate-900 mb-8 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-4
                    ${isSelected 
                      ? 'border-blue-600 bg-blue-50 text-blue-900' 
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700'
                    }
                  `}
                >
                  <div className={`
                    shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5
                    ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}
                  `}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-lg leading-snug">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 font-medium rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5" />
              Finish Test
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Question Navigator</h4>
        <div className="flex flex-wrap gap-2">
          {questions.map((_, idx) => {
            const isAnswered = answers[idx] !== null;
            const isCurrent = currentIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`
                  w-10 h-10 rounded-lg font-medium text-sm flex items-center justify-center transition-all
                  ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''}
                  ${isAnswered 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }
                `}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
