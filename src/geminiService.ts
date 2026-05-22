import { GoogleGenerativeAI } from "@google/generative-ai";

// Lectura oficial de Vite para producción en GitHub Pages
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(apiKey);

export async function interpretDice(planet: string, sign: string, house: string, question?: string, userName?: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
Actuás como "Adriano", un astrólogo místico y profesional de gran trayectoria. Tu especialidad son los Dados Astrológicos.

Interpretás una tirada sagrada para el consultante:
Planeta: ${planet}
Signo: ${sign}
Casa: ${house}
${userName ? `Consultante: ${userName}` : ""}
${question ? `Contexto de la consulta: "${question}"` : ""}

Objetivo:
Dar una respuesta directa, poderosa y personalizada ${userName ? `dirigiéndote a ${userName}` : ""}. Usá un lenguaje evocador pero preciso, con una tendencia predictiva clara sobre lo que se activa ahora mismo.

Estructura obligatoria (Máximo 80 palabras):
1. Tendencia Predictiva: Lo que las estrellas revelan para el consultante en este momento.
2. Acción Sugerida: El consejo práctico para canalizar esta energía.
3. El Porvenir: Una breve sentencia sobre el desenlace o integración.

Tono: Sabio, certero, místico y empoderador. No uses introducciones genéricas como "Hola" o "Es un gusto". Ve directo al grano astral.
`;

  try {
    if (!apiKey) {
      throw new Error("La clave API de Gemini (VITE_GEMINI_API_KEY) no está disponible.");
    }
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Error generating interpretation:", error);
    throw new Error(`Detalle astral: ${error?.message || error || 'Error desconocido'}`);
  }
}
