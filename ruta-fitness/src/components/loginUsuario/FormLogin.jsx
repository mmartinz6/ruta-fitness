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
=======
import '../loginUsuario/FormLogin.css';
import login from '../../services/servicesLogin';

function FormLogin() {
  const [identificador, setIdentificador] = useState(''); //correo o username
  const [password, setPassword] = useState('');

  async function manejarLogin() {
    try {
      const datos = await login.loginUsuario({
        username: identificador, // backend acepta el correo o username
        password: password,
      });

      console.log("Login exitoso:", datos);

      // Guardar tokens y datos del usuario en localStorage
      localStorage.setItem("access", datos.access);
      localStorage.setItem("refresh", datos.refresh);
      if (datos.role) localStorage.setItem("role", datos.role);
      if (datos.id) localStorage.setItem("userId", datos.id);

      alert("Inicio de sesión exitoso");

      // Opcional: redireccionar a la página principal
      // window.location.href = "/dashboard";

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

>>>>>>> e9613ade3e485c026ae572bb08038a9a0117732c
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Contraseña:
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6
                     focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
        />
        <button
          onClick={manejarLogin}
          className="w-full bg-green-600 text-white py-3 rounded-lg
=======
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 
                     focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
        />

        <button
          onClick={manejarLogin}
          className="w-full bg-green-600 text-white py-3 rounded-lg 
>>>>>>> e9613ade3e485c026ae572bb08038a9a0117732c
                     hover:bg-green-700 transition font-medium"
        >
          Ingresar
        </button>
<<<<<<< HEAD
=======

>>>>>>> e9613ade3e485c026ae572bb08038a9a0117732c
      </div>
    </div>
  );
}
<<<<<<< HEAD
export default FormLogin;
=======

export default FormLogin;
>>>>>>> e9613ade3e485c026ae572bb08038a9a0117732c
