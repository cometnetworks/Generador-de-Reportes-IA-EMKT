import { GoogleGenAI, Type } from "@google/genai";
import type { ReportData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const reportSchema = {
  type: Type.OBJECT,
  properties: {
    campaignTitle: {
      type: Type.STRING,
      description: "Un título corto y descriptivo para la campaña analizada.",
    },
    summary: {
      type: Type.STRING,
      description: "Un resumen ejecutivo de 2-3 frases sobre el rendimiento general de la campaña.",
    },
    kpis: {
      type: Type.ARRAY,
      description: "Indicadores Clave de Rendimiento (KPIs) extraídos o calculados de los datos.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Nombre del KPI (ej. Tasa de Apertura, CTR).",
          },
          value: {
            type: Type.STRING,
            description: "El valor del KPI (ej. 25.4%, 3.1%).",
          },
          interpretation: {
            type: Type.STRING,
            description: "Una breve explicación de lo que significa este valor en el contexto de la campaña.",
          },
        },
        required: ["name", "value", "interpretation"],
      },
    },
    positiveInsights: {
      type: Type.ARRAY,
      description: "Una lista de 3-5 puntos destacando los aspectos positivos o lo que funcionó bien en la campaña.",
      items: { type: Type.STRING },
    },
    areasForImprovement: {
      type: Type.ARRAY,
      description: "Una lista de 3-5 puntos identificando áreas donde la campaña podría haber tenido un mejor rendimiento.",
      items: { type: Type.STRING },
    },
    actionableRecommendations: {
      type: Type.ARRAY,
      description: "Una lista de 3-5 recomendaciones específicas y accionables para mejorar futuras campañas.",
      items: { type: Type.STRING },
    },
  },
  required: [
    "campaignTitle",
    "summary",
    "kpis",
    "positiveInsights",
    "areasForImprovement",
    "actionableRecommendations",
  ],
};

export const generateMarketingReport = async (fileContent: string): Promise<ReportData> => {
  const prompt = `
    Eres un analista experto en email marketing de clase mundial. Tu tarea es analizar los siguientes datos de una campaña de email, extraídos de un archivo de reporte (que puede ser un PDF, CSV o texto plano), y generar un informe completo y profesional en español.

    Datos de la campaña:
    \`\`\`
    ${fileContent}
    \`\`\`

    Basándote en estos datos, genera un informe que contenga lo siguiente:
    1. Un título conciso para la campaña.
    2. Un resumen del rendimiento general.
    3. Los KPIs más importantes (Tasa de Apertura, Tasa de Clics (CTR), Tasa de Rebote, Tasa de Bajas). Calcúlalos si es necesario a partir de los datos brutos como "enviados", "abiertos", "clics". Proporciona el valor y una breve interpretación.
    4. Una lista de insights positivos sobre lo que funcionó bien.
    5. Una lista de áreas de mejora.
    6. Una lista de recomendaciones accionables y específicas para optimizar futuras campañas.

    Responde únicamente con un objeto JSON que se ajuste estrictamente al esquema proporcionado. No incluyas texto introductorio, explicaciones adicionales ni la palabra "json" o \`\`\`.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: reportSchema,
      },
    });

    const reportJsonString = response.text.trim();
    const report: ReportData = JSON.parse(reportJsonString);
    return report;

  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    throw new Error("Failed to generate marketing report from AI.");
  }
};