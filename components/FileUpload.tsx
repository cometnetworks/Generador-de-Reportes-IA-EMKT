import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { DocumentIcon } from './icons/DocumentIcon';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  onGenerate: () => void;
  isLoading: boolean;
  fileName?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, onGenerate, isLoading, fileName }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  }, [onFileChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  const buttonDisabled = isLoading || !fileName;

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-6 flex flex-col gap-4">
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon className="w-10 h-10 mb-3 text-slate-400"/>
            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">PDF, CSV o TXT</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileSelect} accept=".csv,.txt,.pdf" />
      </label>

      {fileName && (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 p-3 rounded-lg text-sm">
            <DocumentIcon className="h-5 w-5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{fileName}</span>
          </div>
      )}

      <button
        onClick={onGenerate}
        disabled={buttonDisabled}
        className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900 disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 ${isLoading ? 'animate-pulse' : ''}`}
      >
        {isLoading ? 'Analizando...' : 'Generar Reporte'}
      </button>
    </div>
  );
};