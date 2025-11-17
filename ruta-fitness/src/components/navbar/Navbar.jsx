

import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Activity, Menu, X } from 'lucide-react';

function Navbar() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { id: '/inicio', label: 'Inicio' },
   /*  { id: '/wellness', label: 'Bienestar' }, */
    /* { id: '/community', label: 'Comunidad' }, */
    { id: '/contacto', label: 'Contacto' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Barra superior */}
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <Activity className="w-8 h-8 text-green-600" />
            <span className="text-gray-900 font-semibold text-lg">Ruta Fitness</span>
          </Link>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-6">

            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                className="text-gray-700 hover:text-green-600 transition text-base"
              >
                {item.label}
              </Link>
            ))}

            {/* Botones Login / Registro */}
            <Link to="/login">
              <button className="px-4 py-2 text-base border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">
                Iniciar sesión
              </button>
            </Link>

            <Link to="/registro">
              <button className="px-4 py-2 text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Registrarse
              </button>
            </Link>

          </div>

          {/* Botón menú móvil */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2">
            {open ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Menú móvil */}
        {open && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <div className="flex flex-col gap-3">

              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.id}
                  onClick={() => setOpen(false)}
                  className="text-left text-gray-700 hover:text-green-600 px-2 py-1 transition text-base"
                >
                  {item.label}
                </Link>
              ))}

              {/* Botones móvil */}
              <Link to="/login" onClick={() => setOpen(false)}>
                <button className="px-3 py-2 text-base border border-green-600 text-green-600 rounded-lg w-full text-left">
                  Iniciar sesión
                </button>
              </Link>

              <Link to="/registro" onClick={() => setOpen(false)}>
                <button className="px-3 py-2 text-base bg-green-600 text-white rounded-lg w-full text-left">
                  Registrarse
                </button>
              </Link>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

