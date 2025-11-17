import React, { useState } from 'react';
import '../loginUsuario/FormLogin.css'
import login from '../../services/servicesLogin';
function FormLogin() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  async function manejarLogin() {
    try {
      const datos = await login.loginUsuario({
        username: correo,
        password: password,
      });
      console.log("Login exitoso:", datos);
      localStorage.setItem("access", datos.access);
      localStorage.setItem("refresh", datos.refresh);
      alert("Inicio de sesión exitoso");
    } catch (error) {
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
          Correo:
        </label>
        <input
          type="text"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
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