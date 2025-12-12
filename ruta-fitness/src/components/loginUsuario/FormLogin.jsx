import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../loginUsuario/FormLogin.css";
import login from "../../services/servicesLogin";

function FormLogin() {
  const [identificador, setIdentificador] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirect") || "/";

  async function manejarLogin() {
    if (!identificador || !password) {
      setErrorMsg("Ingrese su usuario/correo y contraseña.");
      return;
    }

    try {
      // 👉 Login completo (tokens + usuario) hecho desde el SERVICE
      const resultado = await login.loginUsuario({
        username: identificador,
        password: password,
      });

      const usuario = resultado.usuario;

      if (!usuario) {
        setErrorMsg("No se pudo obtener la información del usuario.");
        return;
      }

      // 👉 Redirección automática por rol
      if (usuario.role === "Administrador") {
        navigate("/dashboardadmin");
      } else if (usuario.role === "Entrenador") {
        navigate("/dashboardentrenador");
      } else {
        navigate(redirectTo);
      }

      window.location.reload();
    } catch (error) {
      console.error("Error en login:", error);
      setErrorMsg("Usuario o contraseña incorrectos.");
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2
                     focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
        />

        {errorMsg && (
          <p className="text-red-600 text-sm mt-1 mb-3 text-center">
            {errorMsg}
          </p>
        )}

        <button
          onClick={manejarLogin}
          className="w-full bg-green-600 text-white py-3 rounded-lg
                     hover:bg-green-700 transition font-medium"
        >
          Ingresar
        </button>

        <div className="mt-4 text-center">
          <span className="text-gray-700">¿No tienes cuenta? </span>
          <button
            onClick={() => navigate("/registro")}
            className="text-green-600 font-medium hover:underline"
          >
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormLogin;
