import React, { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ReportDisplay } from './components/ReportDisplay';
import { generateMarketingReport } from './services/geminiService';
import type { ReportData } from './types';

// Configurar el worker para pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs`;

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setReport(null);
    setError(null);
  };

  const handleGenerateReport = useCallback(async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo primero.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);

    const processFileContent = async (content: string) => {
        if (!content || content.trim() === '') {
            setError('No se pudo extraer contenido de texto del archivo.');
            setIsLoading(false);
            return;
        }
        try {
            const generatedReport = await generateMarketingReport(content);
            setReport(generatedReport);
        } catch (e) {
            console.error(e);
            setError('Hubo un error al generar el reporte con la IA. Por favor, revisa el formato de tu archivo e inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    try {
        if (file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const arrayBuffer = event.target?.result as ArrayBuffer;
                if (!arrayBuffer) {
                    setError('Error al leer el archivo PDF.');
                    setIsLoading(false);
                    return;
                }

                try {
                    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
                        fullText += pageText + '\n\n';
                    }
                    await processFileContent(fullText);
                } catch (pdfError) {
                    console.error('Error parsing PDF:', pdfError);
                    setError('No se pudo procesar el archivo PDF. Asegúrate de que no esté corrupto.');
                    setIsLoading(false);
                }
            };
            reader.onerror = () => {
                setError('Error al leer el archivo.');
                setIsLoading(false);
            };
            reader.readAsArrayBuffer(file);
        } else { // Manejar CSV y TXT
            const reader = new FileReader();
            reader.onload = async (event) => {
                const fileContent = event.target?.result as string;
                await processFileContent(fileContent);
            };
            reader.onerror = () => {
                setError('Error al leer el archivo.');
                setIsLoading(false);
            };
            reader.readAsText(file);
        }
    } catch (e) {
      console.error(e);
      setError('Ocurrió un error inesperado al procesar el archivo.');
      setIsLoading(false);
    }
  }, [file]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="lg:sticky lg:top-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Carga tu Reporte</h2>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              Sube tu archivo de reporte de campaña (en formato .pdf, .csv o .txt) de HubSpot, Brevo, o similar para que la IA lo analice.
            </p>
            <FileUpload
              onFileChange={handleFileChange}
              onGenerate={handleGenerateReport}
              isLoading={isLoading}
              fileName={file?.name}
            />
          </div>
          <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-6 min-h-[300px]">
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">Análisis de la IA</h2>
            <ReportDisplay report={report} isLoading={isLoading} error={error} />
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
        <p>Potenciado por IA para análisis de marketing de clase mundial.</p>
      </footer>
    </div>
  );
};

export default App;