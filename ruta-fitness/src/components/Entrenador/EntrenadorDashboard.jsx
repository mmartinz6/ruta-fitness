import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import ResumenEntrenadorSeccion from './ResumenEntrenadorSeccion';
import UsuariosEntrenadorSeccion from './UsuariosEntrenadorSeccion';
import RutinasGereradasSeccion from './rutinasGeneradas/RutinasGereradasSeccion';
import ChatSeccion from './ChatSeccion';
import EjerciciosSeccion from '../Entrenador/ejercicios/EjerciciosSeccion';

function EntrenadorDashboard() {
  const [activePage, setActivePage] = useState('overview');
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentUser, setCurrentUser] = useState({ name: '', role: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username") || "Entrenador";
    const role = localStorage.getItem("role") || "Entrenador";
    setCurrentUser({ name: username, role });
  }, []);

  function cerrarSesion() {
    localStorage.clear();
    navigate("/login");
  }

  const menuItems = [
    { label: 'Resumen', page: 'overview' },
   /*  { label: 'Usuarios', page: 'users' }, */
    { label: 'Rutinas gereradas', page: 'routines' },
    { label: 'Ejercicios', page: 'exercises' },
    { label: 'Chat', page: 'chat' },
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'users':
        return <UsuariosEntrenadorSeccion setActivePage={setActivePage}/>; 
      case 'routines':
        return <RutinasGereradasSeccion setActivePage={setActivePage}/>;
      case 'exercises':
        return <EjerciciosSeccion setActivePage={setActivePage}/>;
      case 'chat':
        return <ChatSeccion setActivePage={setActivePage}/>; 
      default:
        return <ResumenEntrenadorSeccion setActivePage={setActivePage}/>; 
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR COMPLETAMENTE OCULTABLE */}
      {showSidebar && (
        <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col border-r border-gray-800 shadow-sm">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-white">Ruta Fitness</h2>
              <p className="text-xs text-gray-400">{currentUser.role}</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.page}
                onClick={() => setActivePage(item.page)}
                className={`flex items-center gap-2 w-full p-2 rounded text-left transition ${
                  activePage === item.page
                    ? 'bg-gray-700 text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="my-3 border-t border-gray-700" />

            {/* <button
              className="w-full p-2 rounded hover:bg-gray-800 text-left text-gray-300 transition"
              onClick={() => navigate("/dashboardentrenador")} // Redirige al perfil o dashboard
            >
              Mi Perfil
            </button> */}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 mt-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white truncate">{currentUser.name}</p>
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                  {currentUser.role}
                </span>
              </div>
            </div>

            <button
              className="w-full p-2 border border-gray-700 text-gray-200 rounded hover:bg-gray-800 transition"
              onClick={cerrarSesion}
            >
              Cerrar Sesión
            </button>
          </div>
        </aside>
      )}

      {/* PANEL DERECHO */}
      <div className="flex-1">

        {/* TOPBAR */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            className="text-gray-700 hover:text-gray-900"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            ☰
          </button>

          <h1 className="text-gray-900 font-medium">Ruta Fitness</h1>
        </div>

        <main>{renderContent()}</main>
      </div>

    </div>
  );
}

export default EntrenadorDashboard;
