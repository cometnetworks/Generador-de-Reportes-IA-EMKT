import React from 'react';
import type { ReportData, KPI } from '../types';
import { Loader } from './Loader';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ChartPieIcon } from './icons/ChartPieIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { ArrowTrendingUpIcon } from './icons/ArrowTrendingUpIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';

interface ReportDisplayProps {
  report: ReportData | null;
  isLoading: boolean;
  error: string | null;
}

const KPICard: React.FC<{ kpi: KPI }> = ({ kpi }) => (
  <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
    <p className="text-sm text-slate-500 dark:text-slate-400">{kpi.name}</p>
    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{kpi.value}</p>
    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{kpi.interpretation}</p>
  </div>
);

const InsightList: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string }> = ({ title, items, icon, color }) => (
  <div>
    <h4 className={`flex items-center gap-2 font-semibold text-lg mb-3 ${color}`}>
      {icon}
      {title}
    </h4>
    <ul className="space-y-2 pl-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className={`mt-1 flex-shrink-0 h-2 w-2 rounded-full ${color.replace('text', 'bg')}`}></span>
          <p className="text-slate-600 dark:text-slate-300">{item}</p>
        </li>
      ))}
    </ul>
  </div>
);

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
        <Loader />
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">La IA está analizando tus datos...</p>
        <p className="text-sm text-slate-400 dark:text-slate-500">Esto puede tardar unos segundos.</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-700 dark:text-red-300 font-semibold">Error al generar el reporte</p>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
        <InformationCircleIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Tu reporte aparecerá aquí.</p>
        <p className="text-sm text-slate-400 dark:text-slate-500">Carga un archivo y haz clic en "Generar Reporte" para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <h3 className="text-xl font-bold text-primary-700 dark:text-primary-300">{report.campaignTitle}</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{report.summary}</p>
      </section>
      
      <section>
        <h4 className="flex items-center gap-2 font-semibold text-lg mb-3 text-slate-800 dark:text-slate-200">
            <ChartPieIcon className="h-6 w-6" />
            KPIs Principales
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {report.kpis.map((kpi) => (
            <KPICard key={kpi.name} kpi={kpi} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InsightList 
          title="Insights Positivos" 
          items={report.positiveInsights} 
          icon={<CheckCircleIcon className="h-6 w-6"/>}
          color="text-green-600 dark:text-green-400"
        />
        <InsightList 
          title="Áreas de Mejora" 
          items={report.areasForImprovement}
          icon={<ExclamationTriangleIcon className="h-6 w-6"/>}
          color="text-yellow-600 dark:text-yellow-400"
        />
      </section>

      <section>
         <InsightList 
          title="Recomendaciones Accionables" 
          items={report.actionableRecommendations}
          icon={<ArrowTrendingUpIcon className="h-6 w-6"/>}
          color="text-blue-600 dark:text-blue-400"
        />
      </section>
    </div>
  );
};
