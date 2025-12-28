
import { GoogleGenAI, Type } from "@google/genai";

export async function analyzePartImage(base64Image: string) {
  // Pirmiausia bandom paimti raktą iš aplinkos
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "") {
    console.error("KLAIDA: API_KEY nerastas Vercel nustatymuose.");
    throw new Error("Sistemos klaida: API raktas nesukonfigūruotas. Pridėkite API_KEY į Vercel Environment Variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Analyze this image for a garage marketplace called "Garažo Lobis". 
  The item can be a car part, a tool, garage equipment, or workshop materials.
  Extract details accurately:
  1. Title: Be specific (e.g., "Makita DDF484 Suktuvas" or "BMW E60 Generatorius").
  2. Part code / Model Number: OEM number for parts or model number for tools.
  3. Brand: Manufacturer name.
  4. Compatibility: For car parts, specify model. For tools/equipment/materials, set brand to "Universalu" and model to "Visiems modeliams".
  5. Category: Select from: Variklio dalys, Važiuoklė, Elektros sistema, Kėbulas, Interjeras, Ratai ir padangos, Apšvietimas, Įrankiai, Dirbtuvių įranga, Eksploatacinės medžiagos, Priedai / Tiuningas.
  6. Condition: Based on visual analysis, map to EXACTLY one of: "Nauja", "Kaip nauja", "Gera", "Naudota", "Atrodo ne kaip, bet funkciją atlieka", "Šlamštas".
  7. Description: Technical features, condition notes, and suggested fair price in EUR.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            partCode: { type: Type.STRING },
            brand: { type: Type.STRING },
            category: { type: Type.STRING },
            condition: { type: Type.STRING },
            description: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER },
            compatibility: {
              type: Type.OBJECT,
              properties: {
                brand: { type: Type.STRING },
                model: { type: Type.STRING },
                configurations: { 
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["brand", "model"]
            }
          },
          required: ["title", "brand", "category", "condition", "description", "suggestedPrice", "compatibility"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI neatsiuntė atsakymo.");
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini API Error:", err);
    throw err;
  }
}
