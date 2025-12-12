import React, { useState } from 'react'; 

import ResumenEntrenadorSeccion from './ResumenEntrenadorSeccion';
import UsuariosEntrenadorSeccion from './UsuariosEntrenadorSeccion';
import RutinasGereradasSeccion from './RutinasGereradasSeccion';
import ChatSeccion from './ChatSeccion';

function EntrenadorDashboard() {
  const [activePage, setActivePage] = useState('overview');
  const [showSidebar, setShowSidebar] = useState(true);
  const currentUser = { name: 'Entrenador' };

  const menuItems = [
    { label: 'Resumen', page: 'overview' },
    { label: 'Usuarios', page: 'users' },
    { label: 'Rutinas gereradas', page: 'routines' },
    { label: 'Chat', page: 'chat' },
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'users':
        return <UsuariosEntrenadorSeccion setActivePage={setActivePage}/>; 
      case 'routines':
        return <RutinasGereradasSeccion setActivePage={setActivePage}/>;
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
        <aside
          className="w-64 text-gray-200 flex flex-col border-r shadow-sm"
          style={{ backgroundColor: "#2C2C2C", borderColor: "#1F1F1F" }}
        >
          
          {/* Header */}
          <div className="p-4 flex items-center gap-3" style={{ borderBottom: "1px solid #1F1F1F" }}>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: "#1B63F2" }}
            >
              A
            </div>
            <div>
              <h2 className="font-semibold text-white">Ruta Fitness</h2>
              <p className="text-xs text-gray-400">Panel Entrenador</p>
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

            <div className="my-3" style={{ borderTop: "1px solid #3A3A3A" }} />

            <button className="w-full p-2 rounded hover:bg-gray-800 text-left text-gray-300 transition">
              Mi Perfil
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 mt-auto" style={{ borderTop: "1px solid #1F1F1F" }}>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: "#1B63F2" }}
              >
                A
              </div>
              <div className="flex-1">
                <p className="text-sm text-white truncate">{currentUser.name}</p>
                <span
                  className="text-xs px-2 py-0.5 rounded text-white"
                  style={{ backgroundColor: "#1B63F2" }}
                >
                  Entrenador
                </span>
              </div>
            </div>

            <button
  className="w-full p-2 rounded transition"
  style={{
    border: "1px solid #EF4444",
    color: "#EF4444",
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = "#B91C1C";
    e.target.style.color = "white";
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#EF4444";
  }}
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