import React, { useState } from 'react';

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

      // Guarda los tokens en localStorage
      localStorage.setItem("access", datos.access);
      localStorage.setItem("refresh", datos.refresh);

      alert("Inicio de sesión exitoso");
      // Aquí podrías redirigir al usuario a otra página
      // window.location.href = "/inicio";

    } catch (error) {
      alert("Error: usuario o contraseña incorrectos");
    }
  }

  return (
    <div>
      <h1>Iniciar Sesión</h1>

      <label>Correo:</label><br />
      <input
        type="text"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      /><br />

      <label>Contraseña:</label><br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      <button onClick={manejarLogin}>Ingresar</button>
    </div>
  );
}

export default FormLogin;