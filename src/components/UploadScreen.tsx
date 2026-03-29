import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';

interface UploadScreenProps {
  onUpload: (file: File) => void;
  error: string | null;
}

export function UploadScreen({ onUpload, error }: UploadScreenProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onUpload(files[0]);
    }
  }, [onUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  }, [onUpload]);

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Turn any PDF into a Practice Test</h2>
        <p className="text-lg text-slate-600">
          Upload a document containing multiple choice questions. We'll automatically extract them and create an interactive test for you.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium">Error processing file</h4>
            <p className="text-sm mt-1 opacity-90">{error}</p>
          </div>
        </div>
      )}

      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center w-full h-80 
          border-2 border-dashed rounded-2xl cursor-pointer 
          transition-all duration-200 ease-in-out
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
          <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
            <UploadCloud className="w-10 h-10" />
          </div>
          <p className="mb-2 text-xl font-semibold text-slate-700">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-slate-500">
            PDF documents only
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="application/pdf" 
          onChange={handleFileInput}
        />
      </label>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">1. Upload PDF</h3>
          <p className="text-sm text-slate-600">Upload your notes, past papers, or textbooks containing MCQs.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">2. AI Extraction</h3>
          <p className="text-sm text-slate-600">Our AI instantly identifies and extracts questions and options.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">3. Take the Test</h3>
          <p className="text-sm text-slate-600">Test yourself with +1 for correct and -0.25 for incorrect answers.</p>
        </div>
      </div>
    </div>
  );
}
