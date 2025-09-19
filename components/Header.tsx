import React from 'react';
import { ChartBarIcon } from './icons/ChartBarIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800/50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-500 rounded-lg p-2 text-white">
            <ChartBarIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Generador de Reportes con IA
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Análisis de Campañas de Email Marketing</p>
          </div>
        </div>
      </div>
    </header>
  );
};
