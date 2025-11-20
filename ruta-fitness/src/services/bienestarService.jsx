
import BienestarPage from "./../pages/Bienestar";




/**
 * FETCH PRINCIPAL – llama a Gemini con Google Search
 */
export const fetchHealthContent = async () => {
    const systemPrompt =
        "Eres un editor de contenido digital experto en salud y bienestar. " +
        "Tu tarea es analizar los resultados de la búsqueda de Google sobre temas de salud, fitness y nutrición, " +
        "y estructurarlos en el formato JSON proporcionado. Usa lenguaje claro para hispanohablantes.";

    const userQuery =
        "Encuentra el tema de salud más importante del momento, tres artículos de salud relevantes, " +
        "y tres videos populares de YouTube sobre rutinas o dietas.";

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        tools: [{ google_search: {} }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error("Error en la respuesta HTTP:", response.status);
            return null;
        }

        const result = await response.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (jsonText) {
            const cleanJson = jsonText.replace(/^```json\s*|```\s*$/g, "").trim();
            return JSON.parse(cleanJson);
        }

        return null;
    } catch (error) {
        console.error("Error al obtener contenido estructurado:", error);
        return null;
    }
};
