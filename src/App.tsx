/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UploadScreen } from './components/UploadScreen';
import { TestScreen } from './components/TestScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { extractQuestionsFromPDF } from './lib/gemini';
import { TestState } from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<TestState>({
    status: 'upload',
    questions: [],
    userAnswers: [],
    error: null,
  });

  const handleFileUpload = async (file: File) => {
    setState((s) => ({ ...s, status: 'processing', error: null }));
    try {
      const questions = await extractQuestionsFromPDF(file);
      if (questions.length === 0) {
        setState((s) => ({ ...s, status: 'upload', error: 'No multiple choice questions found in the PDF.' }));
        return;
      }
      setState((s) => ({
        ...s,
        status: 'testing',
        questions,
        userAnswers: new Array(questions.length).fill(null),
      }));
    } catch (error: any) {
      setState((s) => ({ ...s, status: 'upload', error: error.message || 'Failed to process PDF.' }));
    }
  };

  const handleFinishTest = (answers: (number | null)[]) => {
    setState((s) => ({ ...s, status: 'results', userAnswers: answers }));
  };

  const handleRestart = () => {
    setState({
      status: 'upload',
      questions: [],
      userAnswers: [],
      error: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-blue-600 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF Test Generator
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {state.status === 'upload' && (
          <UploadScreen onUpload={handleFileUpload} error={state.error} />
        )}
        
        {state.status === 'processing' && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
            <h2 className="text-2xl font-medium text-slate-800 mb-2">Analyzing Document</h2>
            <p className="text-slate-500 text-center max-w-md">
              Our AI is reading your PDF and extracting multiple choice questions to build your test. This might take a moment.
            </p>
          </div>
        )}

        {state.status === 'testing' && (
          <TestScreen 
            questions={state.questions} 
            onFinish={handleFinishTest} 
          />
        )}

        {state.status === 'results' && (
          <ResultsScreen 
            questions={state.questions} 
            userAnswers={state.userAnswers} 
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
