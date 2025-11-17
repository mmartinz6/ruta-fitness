import React, { useState, useEffect } from 'react';
import { 
    Home, Dumbbell, Activity, Settings, LogOut, X, Users, Heart, Mail, Menu,
    Video, BookOpen, Clock, Loader, ExternalLink, Zap, RefreshCcw, AlertTriangle 
} from 'lucide-react';

// =================================================================
// 0. CONFIGURACIÓN GLOBAL Y DEFINICIONES DE RUTA
// =================================================================

// NOTA: La clave API se deja vacía para que el entorno la inyecte.
const apiKey = ""; 
// URL de la API de Gemini (asegúrate de que la API key se inyecte en el entorno real)
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

// Definición de las rutas de navegación (GLOBALMENTE ACCESIBLE)
const navItems = [
    { name: 'Inicio', icon: Home, route: '/dashboard' },
    { name: 'Rutinas', icon: Dumbbell, route: '/rutinas' },
    { name: 'Progreso', icon: Activity, route: '/progreso' },
    { name: 'Comunidad', icon: Users, route: '/comunidad' },
    { name: 'Bienestar', icon: Heart, route: '/bienestar' }, // <-- RUTA DE BIENESTAR
    { name: 'Contactos', icon: Mail, route: '/contactos' },
];

// Componentes Placeholder para las páginas estáticas
const DashboardPage = () => <div className="p-8 text-center text-2xl font-bold text-gray-700">Página de Inicio (Dashboard)</div>;
const RutinasPage = () => <div className="p-8 text-center text-2xl font-bold text-gray-700">Página de Rutinas</div>;
const ProgresoPage = () => <div className="p-8 text-center text-2xl font-bold text-gray-700">Página de Progreso</div>;
const ComunidadPage = () => <div className="p-8 text-center text-2xl font-bold text-gray-700">Página de Comunidad</div>;
const ContactosPage = () => <div className="p-8 text-center text-2xl font-bold text-gray-700">Página de Contactos</div>;
const ConfiguracionPage = () => <div className="p-8 text-center text-2xl font-bold text-gray-700">Página de Ajustes</div>;


// =================================================================
// 1. COMPONENTE DE NAVEGACIÓN (Sidebar)
// =================================================================

function Navigation({ isOpen, toggleSidebar, navigate, currentPage, onLogout }) {
    
    const settingsRoute = '/configuracion'; 
    
    const linkClasses = (route) => {
        const isActive = currentPage === route || (currentPage === '/' && route === '/dashboard');
        return `flex items-center p-3 rounded-xl transition-colors duration-200 group ${
            isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`;
    };

    const handleNavigation = (route) => {
        navigate(route);
    };

    return (
        <>
            {/* Overlay para móvil */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${
                    isOpen ? 'block' : 'hidden'
                }`}
                onClick={toggleSidebar}
            ></div>

            {/* Sidebar real: CLASES ACTUALIZADAS PARA FIJARLO EN ESCRITORIO */}
            <div
                className={`flex flex-col h-screen bg-gray-800 w-64 space-y-6 py-7 px-4 fixed inset-y-0 left-0 transform transition duration-300 ease-in-out z-40 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0' // Aquí aseguramos que se muestre en escritorio y es fijo
                }`}
            >
                {/* Logo / Título */}
                <div className="flex items-center justify-between px-3 mb-6">
                    <h1 className="text-2xl font-extrabold text-white tracking-wider">
                        Ruta<span className="text-indigo-500">Fitness</span>
                    </h1>
                    <button className="lg:hidden text-gray-300 hover:text-white" onClick={toggleSidebar}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Enlaces de Navegación PRINCIPAL */}
                <nav className="flex-1 space-y-2 overflow-y-auto pr-2"> 
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => handleNavigation(item.route)}
                            className={linkClasses(item.route)}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span className="font-semibold">{item.name}</span>
                        </button>
                    ))}
                </nav>

                {/* Sección Inferior: Ajustes y Cerrar Sesión */}
                <div className="mt-auto space-y-2 border-t border-gray-700 pt-4 shrink-0">
                    <button 
                        onClick={() => handleNavigation(settingsRoute)} 
                        className={linkClasses(settingsRoute)}
                    >
                        <Settings className="w-5 h-5 mr-3" />
                        <span className="font-semibold">Ajustes</span>
                    </button>

                    <button 
                        onClick={onLogout} 
                        className="flex items-center p-3 rounded-xl transition-colors duration-200 text-red-400 hover:bg-gray-700 hover:text-red-300 w-full"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-semibold">Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </>
    );
}

// =================================================================
// 2. LÓGICA DE LA API Y PÁGINA DE BIENESTAR
// =================================================================

const fetchHealthContent = async () => {
    // NOTA: Para que esto funcione, la constante 'apiKey' debe tener tu clave API real.

    const systemPrompt = 
        "Eres un editor experto en salud y bienestar. Analiza Google Search para encontrar temas de tendencia, y crea contenido estructurado. Los enlaces deben ser URLs reales que encuentres. Devuelve **solamente** el bloque de código JSON, sin ningún texto adicional. El formato debe ser un JSON plano, sin saltos de línea adicionales fuera de los strings.";
    
    // Estructura JSON de referencia para el modelo
    const jsonFormatReference = JSON.stringify({
        featuredTopic: { title: "Título del Artículo", content: "Contenido detallado con **Markdown** (mínimo 3 párrafos)." },
        articles: [{ title: "Título 1", summary: "Resumen breve", link: "URL real" }, { title: "Título 2", summary: "Resumen breve", link: "URL real" }, { title: "Título 3", summary: "Resumen breve", link: "URL real" }],
        videos: [{ title: "Título 1", channel: "Nombre del Canal", link: "URL real de YouTube" }, { title: "Título 2", channel: "Nombre del Canal", link: "URL real de YouTube" }, { title: "Título 3", channel: "Nombre del Canal", link: "URL real de YouTube" }]
    }, null, 2);

    const userPrompt = 
        `Encuentra el tema de bienestar más relevante. Genera un artículo principal y tres artículos y videos de apoyo.

        **FORMATO DE SALIDA REQUERIDO:**
        Debes devolver el resultado como un **bloque de código JSON** que siga esta estructura:
        \`\`\`json
        ${jsonFormatReference}
        \`\`\``;

    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        tools: [{ google_search: {} }], 
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };
    
    let maxRetries = 3;
    let delay = 1000;

    for (let i = 0; i < maxRetries; i++) {
        try {
            // Verificar si hay clave API antes de hacer la llamada
            if (!apiKey) {
                // Simulación para evitar error de Fetch si la clave API está vacía
                throw new Error("Clave API vacía. Por favor, inyecta la clave API.");
            }
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - No se pudo conectar con Gemini.`);
            }

            const result = await response.json();
            const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!jsonText) throw new Error("No content found in API response.");

            // Extrae el JSON dentro del bloque de código ```json...```
            const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
            let cleanJsonText = match ? match[1].trim() : jsonText.trim();
            
            if (!match && !cleanJsonText.startsWith('{')) {
                throw new Error("El modelo no devolvió un bloque de código JSON válido.");
            }

            return JSON.parse(cleanJsonText);

        } catch (error) {
            console.error(`Gemini error (Intento ${i + 1}):`, error);
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; 
            } else {
                return null;
            }
        }
    }
    return null; 
};

const BienestarPage = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadContent = async () => {
        setLoading(true);
        setError(false);
        const data = await fetchHealthContent();
        if (!data) {
            setError(true);
        } else {
            setContent(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadContent();
    }, []);

    const getYouTubeId = (url) => {
        try {
            const u = new URL(url);
            if (u.hostname.includes("youtu.be")) return u.pathname.substring(1);
            if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
            return null;
        } catch {
            return null;
        }
    };

    const renderContent = (text) => {
        if (!text) return null;
        // Simple render de Markdown (negritas y párrafos)
        return text.split('\n\n').map((paragraph, index) => {
            let htmlContent = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return (
                <p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            );
        });
    };

    const renderVideoEmbed = (link, title) => {
        const id = getYouTubeId(link);
        // Usa una imagen de baja resolución como fallback por defecto
        let imageUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; 
        
        if (id) {
            // Intenta usar la imagen de alta resolución
            imageUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
        }

        if (!id) {
            return (
                <div className="relative pt-[56.25%] bg-gray-200 flex items-center justify-center rounded-t-xl">
                    <p className="text-gray-600 flex items-center text-sm">
                        <AlertTriangle className="w-4 h-4 mr-1"/> Enlace Inválido
                    </p>
                </div>
            );
        }

        return (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={`Ver video: ${title}`}
                className="block relative pt-[56.25%] overflow-hidden rounded-t-xl group transition duration-300 transform hover:shadow-2xl"
            >
                <img
                    src={imageUrl}
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = `https://placehold.co/1280x720/E5E7EB/4B5563?text=Video+Placeholder`; 
                    }}
                    alt={`Miniatura del video: ${title}`}
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


    if (loading) {
        return (
            <div className="min-h-full flex items-center justify-center bg-gray-50 p-6 rounded-xl">
                <div className="bg-white p-10 rounded-xl shadow-2xl flex flex-col items-center border-l-4 border-indigo-500 max-w-sm w-full">
                    <Loader className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="mt-4 text-lg font-medium text-gray-700 text-center">
                        Generando su revista personalizada...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !content || !content.featuredTopic) {
        return (
            <div className="min-h-full flex items-center justify-center bg-red-50 p-6 rounded-xl">
                <div className="bg-white p-10 rounded-xl shadow-2xl border-l-4 border-red-500 flex flex-col items-center max-w-sm w-full">
                    <AlertTriangle className="w-10 h-10 text-red-600 mb-4" />
                    <p className="font-bold text-xl text-red-700">Error cargando contenido.</p>
                    <p className="text-gray-600 mt-2 text-center">
                        No se pudo obtener la revista de bienestar.
                    </p>
                    <button 
                        onClick={loadContent} 
                        className="mt-6 px-6 py-3 bg-red-600 text-white font-bold rounded-full shadow-md hover:bg-red-700 transition-colors flex items-center transform hover:scale-105 active:scale-95"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2"/> Reintentar Carga
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-50">
            <div className="max-w-7xl mx-auto">

                <header className="bg-white shadow-xl rounded-3xl p-6 md:p-8 border-b-8 border-indigo-600 mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Heart className="w-12 h-12 text-indigo-600 p-1 bg-indigo-100 rounded-full shrink-0" />
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Tu Revista de Bienestar Diario</h1>
                        </div>
                        <button 
                            onClick={loadContent} 
                            className="flex items-center justify-center px-4 py-2 bg-yellow-500 text-white font-bold rounded-full shadow-lg hover:bg-yellow-600 transition-all text-sm transform hover:scale-105 active:scale-95 shrink-0"
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" /> 
                            Cargar Contenido Fresco
                        </button>
                    </div>
                    <p className="mt-4 text-gray-600 italic border-t pt-2 text-sm">
                        Contenido fundamentado en Google Search.
                    </p>
                </header>

                <section className="mb-12">
                    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl border-l-8 border-yellow-500">
                        <h2 className="text-base font-semibold uppercase mb-3 text-yellow-600 flex items-center">
                            <Zap className="w-5 h-5 mr-1" />
                            Artículo Destacado del Día
                        </h2>
                        <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-gray-900">{content.featuredTopic.title}</h3>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            {renderContent(content.featuredTopic.content)}
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    <section>
                        <h2 className="text-2xl font-bold mb-6 border-b-2 border-indigo-200 pb-2 flex items-center text-indigo-800">
                            <BookOpen className="w-6 h-6 mr-2 text-indigo-500" />
                            Artículos Recomendados
                        </h2>
                        <div className="space-y-6">
                            {content.articles.map((a, i) => (
                                <div key={i} className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition flex border-l-4 border-indigo-500">
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">{a.title}</h3>
                                        <p className="text-gray-600 text-sm">{a.summary}</p>
                                    </div>
                                    <div className="ml-4 flex items-center">
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

                    <section>
                        <h2 className="text-2xl font-bold mb-6 border-b-2 border-red-200 pb-2 flex items-center text-red-800">
                            <Video className="w-6 h-6 mr-2 text-red-500" />
                            Videos Populares de YouTube
                        </h2>
                        <div className="space-y-6">
                            {content.videos.map((v, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden border-b-4 border-red-500">
                                    {renderVideoEmbed(v.link, v.title)}
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-gray-800 leading-snug">{v.title}</h3>
                                        <p className="text-sm text-gray-500 flex items-center mt-1">
                                            <Clock className="w-3 h-3 mr-1 text-gray-400" />
                                            Canal: <span className="font-medium ml-1 text-red-600">{v.channel}</span>
                                        </p>
                                        <a 
                                            href={v.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="mt-2 inline-flex items-center text-indigo-600 text-sm font-semibold hover:text-indigo-800 transition"
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
};


// =================================================================
// 3. COMPONENTE PRINCIPAL (App) - Manejo de Rutas
// =================================================================

const App = () => {
    // Inicia en la página de Bienestar para que el usuario pueda probar de inmediato
    const [currentPage, setCurrentPage] = useState('/bienestar'); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Función de navegación directa
    const navigate = (route) => {
        setCurrentPage(route);
        // Cierra el sidebar en móvil
        if (isSidebarOpen) setIsSidebarOpen(false); 
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        console.log('Sesión cerrada (simulado)');
    };

    // Función que decide qué componente renderizar
    const renderPage = () => {
        switch (currentPage) {
            case '/dashboard':
            case '/':
                return <DashboardPage />;
            case '/rutinas':
                return <RutinasPage />;
            case '/progreso':
                return <ProgresoPage />;
            case '/comunidad':
                return <ComunidadPage />;
            case '/bienestar':
                // RUTA CONECTADA AL COMPONENTE DE REVISTA
                return <BienestarPage />; 
            case '/contactos':
                return <ContactosPage />;
            case '/configuracion':
                return <ConfiguracionPage />;
            default:
                return <DashboardPage />;
        }
    };

    // Obtenemos el título de la página actual para el header móvil
    const currentTitle = navItems.find(item => item.route === currentPage)?.name || 
                        (currentPage === '/configuracion' ? 'Ajustes' : 'Inicio');

    return (
        <div className="flex min-h-screen bg-gray-100">
             
            {/* 1. Navigation (Sidebar) - Es fijo con h-screen */}
            <Navigation
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                navigate={navigate}
                currentPage={currentPage}
                onLogout={handleLogout}
            />

            {/* 2. Contenido Principal: AHORA INCLUYE MARGEN IZQUIERDO EN ESCRITORIO (lg:ml-64) */}
            <div className="flex-1 flex flex-col overflow-x-hidden lg:ml-64">
                {/* Top Bar para móvil y título */}
                <header className="bg-white shadow p-4 lg:hidden sticky top-0 z-20">
                    <div className="flex items-center justify-between">
                        <button onClick={toggleSidebar} className="text-gray-600 hover:text-indigo-600">
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800">
                             {currentTitle}
                        </h2>
                    </div>
                </header>
                
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {/* Renderiza el componente de la página activa */}
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default App;