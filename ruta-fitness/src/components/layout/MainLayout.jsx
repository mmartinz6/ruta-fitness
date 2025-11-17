import React, { useState } from 'react';
import Sidebar from './Sidebar'; 
import AppHeader from './AppHeader'; 
import { useLocation } from 'react-router-dom';

/**
 * MainLayout Componente que define la estructura principal de la aplicación.
 * @param {function} navigate - Función de navegación.
 * @param {function} onLogout - Función para cerrar sesión.
 * @param {ReactNode} children - Contenido de la página (Dashboard, Rutinas, etc.).
 */
function MainLayout({ navigate, onLogout, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    // Obtiene la ruta actual para resaltar el ítem activo
    const currentPage = location.pathname;

    return (
        <div className="flex h-screen bg-gray-50">
            
            {/* 1. Sidebar */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
                navigate={navigate}
                currentPage={currentPage}
                onLogout={onLogout}
            />

            {/* 2. Contenedor principal para el Header y Contenido */}
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300">
                
                {/* 3. Header (Oculto en pantallas grandes, pero maneja la barra superior) */}
                <AppHeader toggleSidebar={toggleSidebar} />
                
                {/* 4. Contenido de la Página - Aseguramos un padding que compense el Header en móvil */}
                <main className="flex-1 pt-16 lg:pt-0"> 
                    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
                
            </div>
        </div>
    );
}

export default MainLayout;