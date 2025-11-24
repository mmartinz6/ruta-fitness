import React, { useState } from "react";
import llamados from "../../services/ServicesUsuarios";
import llamadosD from "../../services/ServicesUserD";
import llamadosGrupo from "../../services/servicesGrupo"

function FormRegistro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [nivelActividad, setNivelActividad] = useState("");
  const [lugarEntrenamiento, setLugarEntrenamiento] = useState("");

  // ERRORES
  const [errors, setErrors] = useState({});

  function validarCampos() {
    const newErrors = {};

    if (!nombre.trim()) newErrors.nombre = "Este campo es obligatorio.";
    if (!apellido.trim()) newErrors.apellido = "Este campo es obligatorio.";
    if (!correo.trim()) newErrors.correo = "Ingrese un correo válido.";
    if (!username.trim()) newErrors.username = "Este campo es obligatorio.";
    if (!password.trim()) newErrors.password = "La contraseña no puede estar vacía.";

    if (!edad.trim()) newErrors.edad = "Ingrese su edad.";
    if (!peso.trim()) newErrors.peso = "Ingrese su peso.";
    if (!altura.trim()) newErrors.altura = "Ingrese su altura.";

    if (!nivelActividad.trim()) newErrors.nivelActividad = "Seleccione una opción.";
    if (!lugarEntrenamiento.trim()) newErrors.lugarEntrenamiento = "Seleccione una opción.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function cargarDatos() {
    if (!validarCampos()) return;

    try {
      const userData = await llamadosD.postUsuariosD({
        username: username.trim(),
        email: correo.trim(),
        first_name: nombre.trim(),
        last_name: apellido.trim(),
        password: password.trim(),
      });

      const usuarioData = {
        idUser: userData.id,
        edad,
        peso,
        altura,
        nivel_actividad: nivelActividad,
        lugar_entrenamiento: lugarEntrenamiento,
      };

      await llamados.postUsuarios(usuarioData);

      await llamadosGrupo.postGrupos({ user: userData.id, group: 3 });

      alert("Cuenta creada correctamente");
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al crear la cuenta");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-6">

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">Crear Cuenta</h1>
          <p className="text-gray-600">
            Completa tus datos para recibir una rutina personalizada
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-10 border border-gray-200">

          <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-gray-800 mb-1">Nombre:</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                />
                {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre}</p>}
              </div>

              <div>
                <label className="block text-gray-800 mb-1">Apellido:</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                />
                {errors.apellido && <p className="text-red-600 text-sm">{errors.apellido}</p>}
              </div>

              <div>
                <label className="block text-gray-800 mb-1">Correo:</label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                />
                {errors.correo && <p className="text-red-600 text-sm">{errors.correo}</p>}
              </div>

              <div>
                <label className="block text-gray-800 mb-1">Nombre de usuario:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                />
                {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-gray-800 mb-1">Contraseña:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                />
                {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-gray-900 mb-4 font-medium">Información Personal</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-800 mb-1">Edad:</label>
                  <input
                    type="number"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                  />
                  {errors.edad && <p className="text-red-600 text-sm">{errors.edad}</p>}
                </div>

                <div>
                  <label className="block text-gray-800 mb-1">Peso (kg):</label>
                  <input
                    type="number"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                  />
                  {errors.peso && <p className="text-red-600 text-sm">{errors.peso}</p>}
                </div>

                <div>
                  <label className="block text-gray-800 mb-1">Altura (cm):</label>
                  <input
                    type="number"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                  />
                  {errors.altura && <p className="text-red-600 text-sm">{errors.altura}</p>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-800 mb-1">Nivel de Actividad:</label>
              <select
                value={nivelActividad}
                onChange={(e) => setNivelActividad(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-white focus:ring-2 focus:ring-green-600 outline-none"
              >
                <option value="">Seleccione un nivel</option>
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </select>
              {errors.nivelActividad && <p className="text-red-600 text-sm">{errors.nivelActividad}</p>}
            </div>

            <div>
              <label className="block text-gray-800 mb-1">Lugar de Entrenamiento:</label>
              <select
                value={lugarEntrenamiento}
                onChange={(e) => setLugarEntrenamiento(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-white focus:ring-2 focus:ring-green-600 outline-none"
              >
                <option value="">Seleccione un lugar</option>
                <option value="casa">En Casa</option>
                <option value="gimnasio">Gimnasio</option>
                <option value="aire_libre">Aire Libre</option>
              </select>
              {errors.lugarEntrenamiento && <p className="text-red-600 text-sm">{errors.lugarEntrenamiento}</p>}
            </div>

            <button
              onClick={cargarDatos}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Crear mi cuenta
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default FormRegistro;