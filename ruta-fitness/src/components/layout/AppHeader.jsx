import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

/**
 * Componente del Encabezado (Header).
 * @param {function} toggleSidebar - Función para abrir la sidebar en móvil.
 */
function AppHeader({ toggleSidebar }) {
    return (
        <header className="bg-white shadow-md h-16 flex items-center justify-between px-4 border-b border-gray-200 lg:ml-64 lg:static fixed w-full top-0 z-20">
            {/* Botón de menú visible solo en móvil (a la izquierda) */}
            <button 
                onClick={toggleSidebar} 
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 lg:hidden"
            >
                <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex-1 hidden lg:block">
                 {/* Espacio vacío para centrar el contenido o push del logo */}
            </div>

            {/* Controles de la derecha */}
            <div className="flex items-center space-x-4">
                {/* Icono de Notificaciones */}
                <button className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                    <Bell className="w-6 h-6" />
                </button>
                
                {/* Foto de Perfil / Icono de Usuario */}
                <div className="flex items-center space-x-2 cursor-pointer">
                    <User className="w-8 h-8 p-1 rounded-full text-indigo-600 bg-indigo-100" />
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">Juan Pérez</span>
                </div>
            </div>
        </header>
    );
}

export default AppHeader;