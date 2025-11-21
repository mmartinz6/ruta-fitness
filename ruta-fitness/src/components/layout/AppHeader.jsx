import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

/**
 * Componente del Encabezado (Header) de la aplicación.
 * @param {function} toggleSidebar - Función para abrir/cerrar la sidebar en móvil.
 */
function AppHeader({ toggleSidebar }) {
    return (
        // El 'fixed w-full top-0 z-20' lo mantiene siempre arriba.
        // El 'lg:ml-64' lo empuja a la derecha del Sidebar.
        <header className="bg-white shadow-md h-16 flex items-center justify-between px-4 border-b border-gray-200 lg:ml-64 fixed w-full top-0 z-20">
            {/* Botón de menú visible solo en móvil */}
            <button 
                onClick={toggleSidebar} 
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 lg:hidden"
            >
                <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex-1 hidden lg:block">
                 {/* Espacio reservado */}
            </div>

            {/* Controles de la derecha: Notificaciones y Perfil */}
            <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-indigo-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100">
                    <Bell className="w-6 h-6" />
                </button>
                
                <div className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <User className="w-8 h-8 p-1 rounded-full text-indigo-600 bg-indigo-100" />
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">Juan Pérez</span>
                </div>
            </div>
        </header>
    );
}

export default AppHeader;