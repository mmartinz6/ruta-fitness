import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, LogOut, Settings } from 'lucide-react'

// El componente Sidebar ahora acepta los enlaces, el estado de apertura y las funciones
const Sidebar = ({ links, isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPage = location.pathname;

    const onLogout = () => {
        console.log('Sesión cerrada (simulado)'); 
        navigate('/login'); // Redirección a la página de login
    };

    const linkClasses = (path) => {
        const isActive = currentPage === path;
        return `flex items-center p-3 rounded-xl transition-colors duration-200 group w-full ${
            isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`;
    };
    
    // Separamos los enlaces de ajustes/configuración para mostrarlos al final
    const mainLinks = links.filter(item => item.name !== 'Configuración');
    const settingsLink = links.find(item => item.name === 'Configuración');

    return (
        <>
            {/* Overlay para móvil */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
                onClick={toggleSidebar}
            ></div>

            {/* Sidebar real: Fijo y ocupa toda la altura */}
            <div
                className={`flex flex-col h-screen bg-gray-800 w-64 space-y-6 py-7 px-4 fixed inset-y-0 left-0 transform transition duration-300 ease-in-out z-40 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 lg:fixed lg:top-0 lg:bottom-0`} 
            >
                <div className="flex items-center justify-between px-3 mb-6">
                    <h1 className="text-2xl font-extrabold text-white tracking-wider">
                        Ruta<span className="text-indigo-500">Fitness</span>
                    </h1>
                    <button className="lg:hidden text-gray-300 hover:text-white" onClick={toggleSidebar}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto">
                    {mainLinks.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => { navigate(item.path); toggleSidebar(); }} 
                            className={linkClasses(item.path)}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span className="font-semibold">{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto space-y-2 border-t border-gray-700 pt-4">
                    {/* Botón de configuración */}
                    {settingsLink && (
                        <button 
                            onClick={() => { navigate(settingsLink.path); toggleSidebar(); }} 
                            className={linkClasses(settingsLink.path)}
                        >
                            <Settings className="w-5 h-5 mr-3" />
                            <span className="font-semibold">Configuración</span>
                        </button>
                    )}

                    {/* Botón de cerrar sesión */}
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

export default Sidebar;