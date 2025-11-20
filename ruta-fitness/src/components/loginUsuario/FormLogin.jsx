import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../loginUsuario/FormLogin.css';
import login from '../../services/servicesLogin';

function FormLogin() {
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function manejarLogin() {
    try {
      const datos = await login.loginUsuario({
        username: identificador,
        password: password,
      });

      console.log("Login exitoso:", datos);

      // Guardar tokens y datos del usuario
      localStorage.setItem("access", datos.access);
      localStorage.setItem("refresh", datos.refresh);
      if (datos.role) localStorage.setItem("role", datos.role);
      if (datos.id) localStorage.setItem("userId", datos.id);

      alert("Inicio de sesión exitoso");

      //marca que el usuario está logueado
      localStorage.setItem("auth", "true");

      // redirige a la comunidad ****
      navigate("/comunidad");

      // recarga para que navbar + permisos se actualicen
      window.location.reload();

    } catch (error) {
      console.error("Error en login:", error);
      alert("Error: usuario o contraseña incorrectos");
    }
  }
  
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Iniciar Sesión
        </h1>

        <label className="block text-gray-700 text-sm font-medium mb-1">
          Usuario o Correo:
        </label>

        <input
          type="text"
          value={identificador}
          onChange={(e) => setIdentificador(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4
                     focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
        />

        <label className="block text-gray-700 text-sm font-medium mb-1">
          Contraseña:
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6
                     focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
        />

        <button
          onClick={manejarLogin}
          className="w-full bg-green-600 text-white py-3 rounded-lg
                     hover:bg-green-700 transition font-medium"
        >
          Ingresar
        </button>

      </div>
    </div>
  );
}

export default FormLogin;