import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Activity, Menu, X } from 'lucide-react'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [auth, setAuth] = useState(localStorage.getItem("auth") === "true")
  const [username, setUsername] = useState(localStorage.getItem("username") || "")
  const [role, setRole] = useState(localStorage.getItem("role") || "")
  const navigate = useNavigate()

  useEffect(() => {
    setAuth(localStorage.getItem("auth") === "true")
    setUsername(localStorage.getItem("username") || "")
    setRole(localStorage.getItem("role") || "")
  }, [])

  function cerrarSesion() {
    localStorage.clear()
    setAuth(false)
    navigate("/")
  }

  const menuItems = [
    { id: '/inicio', label: 'Inicio' },
    { id: '/comunidad', label: 'Comunidad' },
    { id: '/contacto', label: 'Contacto' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/inicio" className="flex items-center gap-2 cursor-pointer">
            <Activity className="w-8 h-8 text-green-600" />
            <span className="text-gray-900 font-semibold text-lg">Ruta Fitness</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link key={item.id} to={item.id} className="text-gray-700 hover:text-green-600">
                {item.label}
              </Link>
            ))}

            {auth ? (
              role === "Cliente" ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdown(!dropdown)}
                    className="px-4 py-2 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    {username}
                  </button>

                  {dropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border rounded-lg overflow-hidden">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                        onClick={() => setDropdown(false)}
                      >
                        Mi perfil
                      </Link>

                      <button
                        onClick={cerrarSesion}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : null
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50">
                    Iniciar sesión
                  </button>
                </Link>
                <Link to="/registro">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Registrarse
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2">
            {open ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <Link key={item.id} to={item.id} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}

              {auth ? (
                role === "Cliente" ? (
                  <>
                    <button
                      onClick={() => setDropdown(!dropdown)}
                      className="px-3 py-2 font-medium bg-green-600 text-white rounded-lg text-left"
                    >
                      {username}
                    </button>

                    {dropdown && (
                      <div className="ml-3 flex flex-col gap-2">
                        <Link
                          to="/dashboard"
                          className="text-gray-700"
                          onClick={() => { setOpen(false); setDropdown(false) }}
                        >
                          Mi perfil
                        </Link>

                        <button
                          onClick={cerrarSesion}
                          className="text-red-600 text-left"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    )}
                  </>
                ) : null
              ) : (
                <>
                  <Link to="/login">
                    <button className="px-3 py-2 border border-green-600 text-green-600 rounded-lg w-full text-left">
                      Iniciar sesión
                    </button>
                  </Link>
                  <Link to="/registro">
                    <button className="px-3 py-2 bg-green-600 text-white rounded-lg w-full text-left">
                      Registrarse
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar