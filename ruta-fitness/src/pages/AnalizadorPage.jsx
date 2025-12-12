import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken, 
    onAuthStateChanged
} from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    query, 
    onSnapshot,
    setDoc,
    doc
} from 'firebase/firestore';

// =================================================================
// 0. CONFIGURACIÓN GLOBAL
// =================================================================

// Variables de entorno
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Inicialización de la App y Servicios
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// =================================================================
// 1. SERVICIOS DE AUTENTICACIÓN (AUTH SERVICE)
// =================================================================

/**
 * Inicializa la autenticación de Firebase (token o anónima).
 */
export const initializeAuth = async () => {
    try {
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth);
        }
        console.log("Servicio de Auth iniciado.");
    } catch (error) {
        console.error("Error al iniciar la autenticación:", error);
    }
};

/**
 * Obtiene el objeto de autenticación de Firebase.
 * @returns {import('firebase/auth').Auth}
 */
export const getAuthInstance = () => auth;


// =================================================================
// 2. SERVICIOS DE FIRESTORE (FIRESTORE SERVICE)
// =================================================================

/**
 * Construye la ruta para una colección privada del usuario.
 * @param {string} collectionName - Nombre de la colección (ej: 'comparaciones_fotos').
 * @returns {import('firebase/firestore').CollectionReference}
 */
export const getPrivateCollectionRef = (collectionName) => {
    // Usamos el ID del usuario actual. Si no está listo, usamos 'anonymous'.
    const userId = auth.currentUser?.uid || 'anonymous'; 
    const path = `artifacts/${appId}/users/${userId}/${collectionName}`;
    return collection(db, path);
};

/**
 * Guarda un nuevo documento de comparación en Firestore.
 * @param {object} comparisonData - Datos de la comparación a guardar.
 * @returns {Promise<void>}
 */
export const saveComparison = async (comparisonData) => {
    try {
        const collectionRef = getPrivateCollectionRef('comparaciones_fotos');
        // Usamos doc(collectionRef) sin ID para que Firestore genere uno automáticamente
        await setDoc(doc(collectionRef), comparisonData); 
        console.log("Comparación guardada en Firestore.");
    } catch (error) {
        console.error("Error al guardar en Firestore:", error);
        throw new Error("Error DB: No se pudo guardar la comparación.");
    }
};

/**
 * Establece un listener reactivo para el historial de comparaciones.
 * @param {function} setFotos - Función setter de React para actualizar el estado de fotos.
 * @param {function} setError - Función setter de React para manejar errores.
 * @param {function} setLoading - Función setter de React para manejar el estado de carga.
 * @returns {function} Función de desuscripción.
 */
export const subscribeToComparisons = (setFotos, setError, setLoading) => {
    const collectionRef = getPrivateCollectionRef('comparaciones_fotos');
    const q = query(collectionRef);
    
    // onSnapshot mantiene los datos sincronizados en tiempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const loadedFotos = [];
        querySnapshot.forEach((doc) => {
            loadedFotos.push({ id: doc.id, ...doc.data() });
        });
        // Ordenar por fecha de creación descendente
        loadedFotos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFotos(loadedFotos);
        setLoading(false);
    }, (err) => {
        console.error("Error de suscripción a Firestore:", err);
        setError("Error al cargar fotos: " + err.message);
        setLoading(false);
    });

    return unsubscribe;
};


// =================================================================
// 3. SERVICIOS DE ALMACENAMIENTO (CLOUDINARY SERVICE)
// =================================================================

// Función de utilidad para generar un placeholder de URL
const placeholderUrl = (type) => `https://placehold.co/400x400/3B82F6/ffffff?text=FOTO+${type.toUpperCase()}`;

/**
 * !!! IMPORTANTE: REEMPLAZAR CON LÓGICA DE CLOUDINARY REAL !!!
 * * Sube un archivo de imagen (File object) y devuelve la URL pública.
 * @param {File} file - El objeto File a subir.
 * @returns {Promise<string>} La URL pública del archivo subido.
 */
export const uploadFileToCloudinary = async (file) => {
    // ESTE ES UN PLACEHOLDER. Aquí iría tu código real de FETCH a Cloudinary.
    
    console.log(`Simulando subida del archivo: ${file.name}`);
    // Simular tiempo de espera de red y subida
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    // Devolver una URL de placeholder
    const fileType = file.name.includes('antes') ? 'antes' : 'despues';
    return placeholderUrl(fileType); 
};


// =================================================================
// 4. COMPONENTE COMPARACIONESPAGE (Usa los Servicios)
// =================================================================

const ComparacionesPage = ({ isAuthReady, userId }) => {
    // ESTADO
    const [fotos, setFotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedFiles, setSelectedFiles] = useState({ initial: null, current: null });
    const [uploading, setUploading] = useState(false);

    // EFECTO: SUSCRIPCIÓN A DATOS
    useEffect(() => {
        let unsubscribe = () => {};

        if (isAuthReady && userId) {
            setLoading(true);
            setError('');
            // Se llama a la función del servicio que maneja la suscripción
            unsubscribe = subscribeToComparisons(setFotos, setError, setLoading);
        }

        return () => unsubscribe();
    }, [isAuthReady, userId]);

    // MANEJADORES
    const handleFileChange = (type) => (event) => {
        setSelectedFiles(prev => ({ ...prev, [type]: event.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFiles.initial || !selectedFiles.current) {
            setError("Por favor, selecciona las fotos de Antes y Después.");
            return;
        }

        setUploading(true);
        setError('');

        try {
            // 1. Subir ambas fotos usando el Cloudinary Service (placeholder)
            const urlInitial = await uploadFileToCloudinary(selectedFiles.initial);
            const urlCurrent = await uploadFileToCloudinary(selectedFiles.current);

            // 2. Crear objeto de comparación
            const newComparison = {
                dateInitial: new Date().toISOString().substring(0, 10),
                dateCurrent: new Date().toISOString().substring(0, 10),
                urlInitial: urlInitial,
                urlCurrent: urlCurrent,
                createdAt: new Date().toISOString(),
                userId: userId,
                notes: 'Comparación registrada con éxito (Subida simulada).'
            };

            // 3. Guardar en Firestore usando el servicio
            await saveComparison(newComparison);
            
            setSelectedFiles({ initial: null, current: null }); 
        } catch (err) {
            setError("Error al procesar: " + (err.message || 'Error desconocido.'));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 bg-white min-h-screen rounded-xl shadow-lg">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b-2 pb-2 text-indigo-700">
                📸 Comparación de Fotos (Progreso)
            </h1>

            {!isAuthReady || loading ? (
                 <div className="text-center p-10 text-lg text-gray-600">
                    {loading ? 'Cargando historial...' : 'Esperando autenticación...'}
                </div>
            ) : (
                <>
                    {/* Formulario de Subida (UI) */}
                    <div className="p-6 rounded-xl shadow-lg mb-8 border border-blue-100 bg-blue-50/50">
                        <h2 className="text-xl font-semibold text-blue-800 mb-4">Subir Nueva Comparación</h2>
                        {error && <div className="p-3 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-lg">{error}</div>}
                        
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            {/* Input Foto Inicial */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Foto Inicial (Antes)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange('initial')}
                                    required
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {selectedFiles.initial && <p className="mt-2 text-xs text-green-600 truncate">{selectedFiles.initial.name}</p>}
                            </div>

                            {/* Input Foto Actual */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Foto Actual (Después)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange('current')}
                                    required
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {selectedFiles.current && <p className="mt-2 text-xs text-green-600 truncate">{selectedFiles.current.name}</p>}
                            </div>

                            {/* Botón de Subida */}
                            <button
                                type="submit"
                                disabled={uploading || !selectedFiles.initial || !selectedFiles.current}
                                className="w-full inline-flex justify-center rounded-lg border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    'Guardar Comparación'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Historial de Comparaciones (UI) */}
                    <div className="p-6 rounded-xl shadow-lg bg-white">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">Historial de Comparaciones ({fotos.length})</h2>
                        
                        {fotos.length === 0 ? (
                            <p className="text-gray-500 italic text-center py-4">Aún no hay comparaciones guardadas.</p>
                        ) : (
                            <div className="space-y-8">
                                {fotos.map((comp) => (
                                    <div key={comp.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                                        <div className="text-lg font-bold text-gray-800 mb-3">
                                            Comparación del {new Date(comp.createdAt).toLocaleDateString('es-ES')}
                                            <p className="text-sm font-normal text-gray-500 mt-1">{comp.notes}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Foto Antes */}
                                            <div className="flex flex-col items-center p-3 border rounded-lg bg-red-50/50">
                                                <span className="text-sm font-medium text-red-600 mb-2">Antes ({new Date(comp.dateInitial).toLocaleDateString('es-ES')})</span>
                                                <img 
                                                    src={comp.urlInitial} 
                                                    alt="Foto antes" 
                                                    className="w-full h-auto object-cover rounded-lg shadow-md max-h-96" 
                                                    onError={(e) => { e.target.onerror = null; e.target.src = placeholderUrl('antes-error'); }}
                                                />
                                            </div>
                                            {/* Foto Después */}
                                            <div className="flex flex-col items-center p-3 border rounded-lg bg-green-50/50">
                                                <span className="text-sm font-medium text-green-600 mb-2">Después ({new Date(comp.dateCurrent).toLocaleDateString('es-ES')})</span>
                                                <img 
                                                    src={comp.urlCurrent} 
                                                    alt="Foto después" 
                                                    className="w-full h-auto object-cover rounded-lg shadow-md max-h-96" 
                                                    onError={(e) => { e.target.onerror = null; e.target.src = placeholderUrl('despues-error'); }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

// =================================================================
// 5. PÁGINAS PLACEHOLDER Y MAIN APP
// =================================================================

const DashboardPage = () => (
    <div className="p-8 text-center bg-white rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-700">Panel de Control (Dashboard)</h2>
        <p className="mt-2 text-gray-500">Vista general de métricas y resumen.</p>
    </div>
);

const SimpleProgresoPage = () => (
    <div className="p-8 text-center bg-white rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-700">Métricas y Progreso</h2>
        <p className="mt-2 text-gray-500">Aquí se mostrarían gráficas de peso y medidas.</p>
    </div>
);


const AnalizadorPage = () => {
    const [currentPage, setCurrentPage] = useState('comparaciones'); 
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [userId, setUserId] = useState(null);
    
    // Auth initialization and state listener
    useEffect(() => {
        initializeAuth(); // Llama al servicio de inicialización

        const unsubscribeAuth = onAuthStateChanged(getAuthInstance(), (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null); 
            }
            setIsAuthReady(true);
        });

        return () => unsubscribeAuth();
    }, []);

    const renderPage = () => {
        const pageProps = { isAuthReady, userId };
        
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage {...pageProps} />;
            case 'progreso':
                return <SimpleProgresoPage {...pageProps} />;
            case 'comparaciones':
                return <ComparacionesPage {...pageProps} />; 
            default:
                return <DashboardPage {...pageProps} />;
        }
    };

    // Navigation Item Component
    const NavItem = ({ page, label, icon }) => (
        <button
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-3 rounded-lg text-sm font-medium transition duration-150 flex items-center w-full justify-start space-x-3
                ${currentPage === page 
                    ? 'bg-indigo-600 text-white shadow-xl' 
                    : 'text-indigo-200 hover:bg-gray-700 hover:text-white'
                }`
            }
        >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex min-h-screen bg-gray-100 font-inter">
            {/* Sidebar (Navegación) */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-2xl">
                <div className="text-3xl font-bold text-indigo-400 mb-10 pt-4 border-b border-indigo-500/50 pb-4">
                    Ruta<span className="font-light">Fitness</span>
                </div>
                <nav className="flex-grow space-y-3">
                    <NavItem page="dashboard" label="Dashboard" icon="📊" />
                    <NavItem page="progreso" label="Progreso" icon="📈" />
                    <NavItem page="comparaciones" label="Comparaciones" icon="📸" />
                    <div className="border-t border-gray-700 my-4 pt-3"></div>
                    <NavItem page="metrica" label="Métricas" icon="📏" />
                    <NavItem page="rutinas" label="Rutinas" icon="💪" />
                    <NavItem page="comunidad" label="Comunidad" icon="👥" />
                </nav>
                <div className="mt-auto pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2 truncate">ID de Usuario: {userId || 'Anónimo'}</p>
                    <button className="text-red-400 hover:text-red-300 transition duration-150 w-full text-left p-2 rounded-lg hover:bg-gray-700">
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-grow p-4 md:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {renderPage()}
                </div>
            </main>
        </div>
    );
};

export default AnalizadorPage;