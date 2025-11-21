import React, { useState, useEffect } from 'react';
import { 
    Heart, Video, BookOpen, Clock, Loader, ExternalLink, Zap, RefreshCcw, AlertTriangle 
} from 'lucide-react';

// =================================================================
// 0. CONFIGURACIÓN GLOBAL Y CONSTANTES
// =================================================================

// La clave se deja vacía. El entorno la inyectará automáticamente en el fetch.
const apiKey = "AIzaSyDgcDuRP4BLucS9eXfBSXqQ3cELc0oOfi0"; 
// Usamos el modelo y la URL base para generateContent.
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`; 

// Clave para almacenar la revista en el navegador (para evitar recargas al navegar)
const HEALTH_CONTENT_CACHE_KEY = 'health_magazine_content';

// Estado inicial de contenido de reserva (fallback)
const initialContent = {
    featuredTopic: { 
        title: "Bienvenido a Bienestar", 
        content: "Para cargar la revista por primera vez, haz clic en el botón 'Cargar Contenido Fresco' en la parte superior. Si la carga falla, el navegador puede estar experimentando problemas de rendimiento." 
    },
    articles: [],
    videos: []
};

// =================================================================
// 1. COMPONENTE: MANEJO DE MINIATURAS DE YOUTUBE (ROBUSTO)
// =================================================================

/**
 * Componente robusto para cargar miniaturas de YouTube con doble fallback.
 * Esto previene errores de miniaturas que no existen (código 404).
 */
const YoutubeThumbnailErrorBoundary = ({ link, title }) => {
    
    // Función de extracción de ID 
    const getYouTubeId = (url) => {
        try {
            // Manejo de enlaces cortos (youtu.be) y enlaces largos (youtube.com/watch?v=)
            const u = new URL(url); 
            if (u.hostname.includes("youtu.be")) return u.pathname.substring(1);
            // Verifica el parámetro 'v' en enlaces de youtube.com
            if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
            return null;
        } catch {
            return null; // Enlace no válido
        }
    };
    
    const id = getYouTubeId(link);
    // Estado para la fuente actual de la imagen (intenta con maxresdefault primero)
    const [currentSrc, setCurrentSrc] = useState(null);
    const [isInvalid, setIsInvalid] = useState(!id); 

    useEffect(() => {
        // Al cambiar el link (o al montar), reseteamos y calculamos la URL de la miniatura.
        if (id) {
            // Intenta cargar la miniatura de alta resolución (maxresdefault)
            setCurrentSrc(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`);
            setIsInvalid(false);
        } else {
            setIsInvalid(true);
        }
    }, [id, link]); // Depende del ID y del link

    // Maneja el error de imagen: si falla maxresdefault, intenta con hqdefault.
    const handleImageError = (e) => {
        if (currentSrc && currentSrc.includes('maxresdefault.jpg') && id) {
            // Intenta la versión segura hqdefault como segundo intento
            e.target.onerror = null; // Evita bucle infinito de error
            setCurrentSrc(`https://img.youtube.com/vi/${id}/hqdefault.jpg`); 
        } 
        else {
            // Falla hqdefault o el ID es inexistente. Muestra el error de fallback.
            setIsInvalid(true);
        }
    };

    if (isInvalid) {
        return (
            // CONTENEDOR AJUSTADO: Se le da un alto fijo si el enlace es inválido para evitar que el layout se rompa.
            <div className="w-full h-36 bg-gray-200 flex items-center justify-center rounded-t-xl overflow-hidden relative">
                <p className="text-gray-600 flex items-center text-sm p-4 text-center">
                    <AlertTriangle className="w-4 h-4 mr-1"/> Enlace de Video Inválido o Eliminado
                </p>
            </div>
        );
    }
    
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            // Se usa el padding 16:9, pero en un contenedor definido.
            className="block relative pt-[56.25%] overflow-hidden rounded-t-xl group transition duration-300 transform hover:shadow-2xl"
        >
            <img
                src={currentSrc}
                onError={handleImageError} 
                alt={`Miniatura del video: ${title}`}
                // key asegura que React re-renderice y reintente cargar si currentSrc cambia
                key={currentSrc} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <div className="p-4 bg-red-600 rounded-full text-white shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <Video className="w-7 h-7" />
                </div>
            </div>
        </a>
    );
};


// =================================================================
// 2. LÓGICA DE LA API (Función fetchFreshContentFromApi)
// =================================================================

/**
 * Llama a la API de Gemini para generar contenido nuevo y fresco.
 */
const fetchFreshContentFromApi = async () => {
    
    const systemPrompt = 
        "Eres un editor experto en salud y bienestar. Analiza Google Search para encontrar temas de tendencia, y crea contenido estructurado. Los enlaces deben ser URLs reales que encuentres. **ES CRUCIAL QUE TODAS LAS URLs de video sean enlaces funcionales de YouTube** (e.g., 'https://www.youtube.com/watch?v=XXXX'). Devuelve **solamente** el bloque de código JSON, sin ningún texto adicional.";
    
    // Referencia del formato JSON requerido
    // Mantenemos 2 artículos y 2 vídeos para reducir el riesgo de cuelgue.
    const jsonFormatReference = JSON.stringify({
        featuredTopic: { 
            title: "Título del Artículo", 
            content: "Contenido detallado con **Markdown** (mínimo 3 párrafos). Utiliza **negrita** para énfasis." 
        },
        articles: [
            { title: "Título 1", summary: "Resumen breve", link: "URL real" }, 
            { title: "Título 2", summary: "Resumen breve", link: "URL real" }, 
        ],
        videos: [
            { title: "Título 1", channel: "Nombre del Canal", link: "URL real y FUNCIONAL de YouTube (formato largo)" }, 
            { title: "Título 2", channel: "Nombre del Canal", link: "URL real y FUNCIONAL de YouTube (formato largo)" }, 
        ]
    }, null, 2);

    const userPrompt = 
        `Encuentra el tema de bienestar más relevante. Genera un artículo principal, dos artículos y dos videos de apoyo.

        **REQUISITO DE VIDEO:** Asegúrate de que las URLs de video sean **SIEMPRE enlaces completos de YouTube (NO enlaces cortos ni listas de reproducción).** La miniatura y el video deben existir.

        **FORMATO DE SALIDA REQUERIDO:**
        Debes devolver el resultado como un **bloque de código JSON** que siga esta estructura:
        \`\`\`json
        ${jsonFormatReference}
        \`\`\``;

    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        tools: [{ google_search: {} }], // Usar Google Search para obtener información actualizada
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };
    
    let maxRetries = 3;
    let delay = 1000;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Lanza error para entrar en el catch y reintentar.
                throw new Error(`HTTP Error: ${response.status} - No se pudo conectar con Gemini.`);
            }

            const result = await response.json();
            const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!jsonText) throw new Error("No se encontró contenido en la respuesta de la API.");

            // Extrae el bloque de código JSON
            const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
            let cleanJsonText = match ? match[1].trim() : jsonText.trim();
            
            // Verificación básica de que parece JSON
            if (!cleanJsonText.startsWith('{') && !cleanJsonText.startsWith('[')) {
                throw new Error("El modelo no devolvió un bloque de código JSON válido.");
            }

            return JSON.parse(cleanJsonText);

        } catch (error) {
            console.error(`Error de Gemini (Intento ${i + 1}):`, error);
            if (i < maxRetries - 1) {
                // Backoff exponencial antes de reintentar
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; 
            } else {
                return null; // Falla después del último reintento
            }
        }
    }
    return null; 
};




export default function App() {
    // Usar initialContent para que la página muestre algo si no hay caché
    const [content, setContent] = useState(initialContent); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(false);

    /**
     * Carga el contenido de bienestar: primero desde el caché, o fresco si se fuerza.
     * @param {boolean} forceRefresh - Si es true, omite el caché y va directo a la API.
     */
    const initializeContent = async (forceRefresh = false) => {
        
        // 1. INTENTAR CARGAR DESDE CACHÉ si NO se fuerza la actualización
        const cachedContent = localStorage.getItem(HEALTH_CONTENT_CACHE_KEY);

        if (cachedContent && !forceRefresh) {
            try {
                const parsedContent = JSON.parse(cachedContent);
                console.log("Contenido cargado desde caché local.");
                // Establecer contenido y terminar la carga
                setContent(parsedContent);
                setLoading(false);
                return; // IMPORTANTE: Sale de la función, NO llama a la API.
            } catch (e) {
                console.error("Error al analizar el contenido de caché. Obteniendo contenido fresco si es forzado.", e);
            }
        }

        // Si se fuerza la recarga O el caché es inválido/no existe, llamamos a la API.
        if (forceRefresh || !cachedContent || content.featuredTopic.title === initialContent.featuredTopic.title) {
            setLoading(true);
            setError(false);
            
            // 2. OBTENER CONTENIDO FRESCO DESDE LA API
            await new Promise(resolve => setTimeout(resolve, 500)); // Retardo UX
            const data = await fetchFreshContentFromApi();
            
            if (!data || !data.featuredTopic || !data.featuredTopic.title) {
                // Si la API falla, intentamos usar el fallback inicial y mostrar un error
                setContent(initialContent);
                setError(true);
            } else {
                // 3. PROCESAR Y GUARDAR EN CACHÉ
                const safeData = {
                    ...data,
                    articles: data.articles || [],
                    videos: data.videos || []
                };
                
                try {
                    localStorage.setItem(HEALTH_CONTENT_CACHE_KEY, JSON.stringify(safeData));
                    console.log("Contenido fresco guardado en caché local.");
                } catch (e) {
                    console.error("No se pudo guardar en localStorage.", e);
                }
                setContent(safeData);
            }
            setLoading(false);
        }
    };

    
    useEffect(() => {
        // La primera vez que se carga la página, intentamos cargar desde caché (si existe)
        initializeContent(false); 
    }, []); 
    
    // Función de renderizado de contenido simple con soporte de Markdown (negritas)
    const renderContent = (text) => {
        if (!text) return null;
        // Divide el texto en párrafos y renderiza Markdown simple (negritas)
        return text.split('\n\n').map((paragraph, index) => {
            let htmlContent = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Reemplazar saltos de línea simples por <br/> (opcional)
            htmlContent = htmlContent.replace(/\n/g, '<br/>');
            return (
                // Aplica break-words al párrafo para forzar el ajuste
                <p key={index} className="mb-4 break-words" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            );
        });
    };


    // La pantalla de carga se muestra SOLO si loading es true (i.e., estamos llamando a la API)
    if (loading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center bg-gray-50 p-6 rounded-xl">
                <div className="bg-white p-10 rounded-xl shadow-2xl flex flex-col items-center border-l-4 border-indigo-500 max-w-sm w-full">
                    <Loader className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="mt-4 text-lg font-medium text-gray-700 text-center">
                        Generando su revista personalizada...
                    </p>
                    <p className="mt-2 text-xs text-gray-400 text-center">
                        Esto puede tomar unos segundos. Por favor, espere.
                    </p>
                </div>
            </div>
        );
    }
    
    // El resto del componente usa 'content' de forma segura.
    
    return (
        <div className="w-full bg-gray-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            {/* Contenedor principal para evitar desbordamiento horizontal */}
            <div className="max-w-7xl mx-auto overflow-x-hidden"> 

                <header className="bg-white shadow-xl rounded-3xl p-6 md:p-8 border-b-8 border-indigo-600 mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Heart className="w-12 h-12 text-indigo-600 p-1 bg-indigo-100 rounded-full shrink-0" />
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Tu Revista de Bienestar Diario</h1>
                        </div>
                        {/* Botón de Actualizar, LLAMA a initializeContent con true para forzar la API */}
                        <button 
                            onClick={() => initializeContent(true)} 
                            className="flex items-center justify-center px-4 py-2 bg-yellow-500 text-white font-bold rounded-full shadow-lg hover:bg-yellow-600 transition-all text-sm transform hover:scale-105 active:scale-95 shrink-0"
                            disabled={loading} // Deshabilitar si ya está cargando
                        >
                            <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> 
                            Cargar Contenido Fresco
                        </button>
                    </div>
                    {error && (
                        <p className="mt-4 text-red-600 font-semibold italic text-sm">
                            <AlertTriangle className="w-4 h-4 inline mr-1"/>
                            Error al cargar el contenido. Por favor, inténtalo de nuevo o espera unos momentos.
                        </p>
                    )}
                    <p className="mt-2 text-gray-600 italic border-t pt-2 text-sm">
                        Contenido fundamentado en Google Search. **Se carga desde el caché al navegar. Solo se actualiza con el botón.**
                    </p>
                </header>

                <section className="mb-12">
                    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl border-l-8 border-yellow-500">
                        <h2 className="text-base font-semibold uppercase mb-3 text-yellow-600 flex items-center">
                            <Zap className="w-5 h-5 mr-1" />
                            Artículo Destacado del Día
                        </h2>
                        <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-gray-900 break-words">{content.featuredTopic.title}</h3> 
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            {/* Aplicado break-words en el renderizado del párrafo */}
                            {renderContent(content.featuredTopic.content)}
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* Sección de Artículos: Añadido min-w-0 */}
                    <section className="min-w-0"> 
                        <h2 className="text-2xl font-bold mb-6 border-b-2 border-indigo-200 pb-2 flex items-center text-indigo-800">
                            <BookOpen className="w-6 h-6 mr-2 text-indigo-500" />
                            Artículos Recomendados
                        </h2>
                        <div className="space-y-6">
                            {(content.articles || []).map((a, i) => (
                                <div key={i} className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition flex border-l-4 border-indigo-500">
                                    <div className="flex-grow min-w-0"> {/* Añadido min-w-0 para el crecimiento flexible */}
                                        <h3 className="text-xl font-bold text-gray-800 mb-1 break-words">{a.title}</h3> {/* break-words */}
                                        <p className="text-gray-600 text-sm break-words">{a.summary}</p> {/* break-words */}
                                    </div>
                                    <div className="ml-4 flex items-center shrink-0">
                                        <a
                                            href={a.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Abrir artículo"
                                            className="p-2 text-indigo-600 font-semibold flex items-center shrink-0 ml-3 hover:text-indigo-800 transition rounded-full bg-indigo-50 hover:bg-indigo-100"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Sección de Videos: Añadido min-w-0 */}
                    <section className="min-w-0"> 
                        <h2 className="text-2xl font-bold mb-6 border-b-2 border-red-200 pb-2 flex items-center text-red-800">
                            <Video className="w-6 h-6 mr-2 text-red-500" />
                            Videos Populares de YouTube
                        </h2>
                        <div className="space-y-6">
                            {(content.videos || []).map((v, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden border-b-4 border-red-500">
                                    <YoutubeThumbnailErrorBoundary link={v.link} title={v.title} /> 
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-gray-800 leading-snug break-words">{v.title}</h3>
                                        <p className="text-sm text-gray-500 flex items-center mt-1">
                                            <Clock className="w-3 h-3 mr-1 text-gray-400" />
                                            Canal: <span className="font-medium ml-1 text-red-600 break-words">{v.channel}</span>
                                        </p>
                                        <a 
                                            href={v.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="mt-2 inline-flex items-center text-indigo-600 text-sm font-semibold hover:text-indigo-800 transition break-words"
                                        >
                                            Ver Video <ExternalLink className="w-4 h-4 ml-1" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                
                <footer className="mt-12 text-center text-sm text-gray-500 pt-6 border-t border-gray-300">
                    <p>Aplicación de Revista de Bienestar impulsada por Gemini.</p>
                </footer>
            </div>
        </div>
    );
}