import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Dumbbell, Activity, Settings, LogOut, Users, Heart, Mail,
  Menu, X, BarChart2, MessageCircle
} from 'lucide-react';

function AppHeader({ toggleSidebar }) {
    return (
        <header
            className="bg-white shadow-md h-16 flex items-center justify-between px-4 border-b border-gray-200
            fixed top-0 z-50 w-full 
            lg:left-64 lg:w-[calc(100%-16rem)]"
        >
            <button
                onClick={toggleSidebar}
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 lg:hidden"
            >
                <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 text-gray-800 text-xl font-semibold hidden lg:block">
                TU SALUD ES NUESTRO PRIORIDAD
            </div>
        </header>
    );
}

const navItems = [
    { name: 'Inicio', icon: Home, route: '/inicio' },
    { name: 'IA_comparacion', icon: BarChart2, route: '/comparador' },
    { name: 'Rutinas', icon: Dumbbell, route: '/rutinas' },
    { name: 'Progreso', icon: Activity, route: '/avances' },
    { name: 'Comunidad', icon: Users, route: '/comunidad' },
    { name: 'Bienestar', icon: Heart, route: '/bienestar' },
    { name: 'Contacto', icon: Mail, route: '/contacto' },
    { name: 'Configuración', icon: Settings, route: '/configuracion' },
    { name: 'Chat', icon: MessageCircle, route: '/chat' }, // ✅ ya funciona
];

function Navigation({ currentPage, navigate, toggleSidebar, isOpen, onLogout }) {
    const linkClasses = (route) => {
        const isActive = currentPage === route;
        return `
            flex items-center p-3 rounded-xl transition-colors duration-200 group w-full
            ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
        `;
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
                onClick={toggleSidebar}
            ></div>

            <div
                className={`
                    flex flex-col h-screen bg-gray-800 w-64 space-y-6 py-7 px-4 fixed inset-y-0 left-0 
                    transform transition duration-300 ease-in-out z-40
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:fixed lg:top-0 lg:bottom-0
                `}
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
                    {navItems.map((item) => (
                        <button
                            key={item.route}
                            onClick={() => {
                                navigate(item.route);
                                toggleSidebar();
                            }}
                            className={linkClasses(item.route)}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span className="font-semibold">{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto space-y-2 border-t border-gray-700 pt-4">
                    <button
                        onClick={onLogout}
                        className="flex items-center p-3 rounded-xl transition-colors duration-200 
                        text-red-400 hover:bg-gray-700 hover:text-red-300 w-full"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-semibold">Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </>
    );
}

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // 🔥 CIERRE TOTAL DE SESIÓN
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans overflow-x-hidden">
            <Navigation
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                navigate={navigate}
                currentPage={location.pathname}
                onLogout={handleLogout}
            />

            <div className="hidden lg:block w-64 h-screen flex-shrink-0"></div>

            <div className="flex-1 flex flex-col">
                <AppHeader toggleSidebar={toggleSidebar} />

                <div className="flex-1 overflow-y-auto pt-16 p-4">
                    <main className="flex-1 bg-gray-100 min-h-full">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
