import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Plus, X } from "lucide-react";

// Servicios reales
import userData from "../../services/ServicesUserD";       // Django Users (usuariosD)
import userInfo from "../../services/ServicesUsuarios";    // Perfil (Usuarios)
import gruposAPI from "../../services/servicesGrupo";      // Grupo/roles (usergroup)

function UsuariosSeccion() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalUser, setModalUser] = useState(false);
  const [modalNew, setModalNew] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Cliente",
    activityLevel: "",
    trainingPlace: "",
    age: "",
    weight: "",
    height: "",
  });

  // Filtros
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const baseUsers = await userData.getUsuariosD();
      const infoUsers = await userInfo.getUsuarios();
      const grupos = await gruposAPI.getGrupos();

      const final = baseUsers
        .filter(u => !u.is_superuser)
        .map((u) => {
          const info = infoUsers.find(x => x.idUser === u.id);
          const grupoAsignado = grupos.find(g => g.user === u.id);
          const nombreGrupo = grupoAsignado?.group_name?.trim() || "Cliente";

          return {
            ...u,
            profileId: info?.id || null,
            age: info?.edad || "",
            weight: info?.peso || "",
            height: info?.altura || "",
            activityLevel: info?.nivel_actividad || "",
            trainingPlace: info?.lugar_entrenamiento || "",
            group: nombreGrupo,
            groupEntryId: grupoAsignado?.id || null,
            date_joined: u.date_joined || "",
          };
        });

      setUsuarios(final);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      alert("Error al cargar usuarios. Revisa la consola.");
    }
  };

  const addUser = async () => {
    try {
      if (!form.firstName || !form.lastName || !form.email) {
        alert("Nombre, apellido y correo son obligatorios");
        return;
      }

      const nuevoUsuario = await userData.postUsuariosD({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        username: form.email.split("@")[0].trim(),
        password: "12345678",
      });

      if (!nuevoUsuario?.id) throw new Error("No se recibió ID del usuario creado");

      if (form.role === "Cliente") {
        const nivelActividadMap = { bajo: "bajo", medio: "medio", alto: "alto" };
        const lugarEntrenamientoMap = { Casa: "casa", Gimnasio: "gimnasio", "Aire Libre": "aire_libre" };

        await userInfo.postUsuarios({
          idUser: nuevoUsuario.id,
          edad: Number(form.age) || 0,
          peso: Number(form.weight) || 0,
          altura: Number(form.height) || 0,
          nivel_actividad: nivelActividadMap[form.activityLevel] || "bajo",
          lugar_entrenamiento: lugarEntrenamientoMap[form.trainingPlace] || "casa",
        });
      }

      const roleMap = { Administrador: 1, Entrenador: 2, Cliente: 3 };
      await gruposAPI.postGrupos({
        user: nuevoUsuario.id,
        group: roleMap[form.role] || 3,
      });

      await cargarUsuarios();
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        role: "Cliente",
        activityLevel: "",
        trainingPlace: "",
        age: "",
        weight: "",
        height: "",
      });
      setModalNew(false);
      alert("Usuario agregado correctamente");
    } catch (error) {
      console.error("addUser error:", error);
      alert(error.message || "No se pudo agregar el usuario");
    }
  };

  const getBadgeColor = (group) => {
    switch (group) {
      case "Administrador": return "bg-red-100 text-red-700 px-2 py-1 rounded";
      case "Entrenador": return "bg-blue-100 text-blue-700 px-2 py-1 rounded";
      default: return "bg-green-100 text-green-700 px-2 py-1 rounded";
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const nombre = `${u.first_name} ${u.last_name}`.toLowerCase().includes(filtroNombre.toLowerCase());
    const usuario = u.username.toLowerCase().includes(filtroUsuario.toLowerCase());
    const email = u.email.toLowerCase().includes(filtroEmail.toLowerCase());
    const rol = filtroRol === "Todos" || u.group === filtroRol;
    const fecha = !filtroFecha || u.date_joined?.slice(0, 10) === filtroFecha;
    return nombre && usuario && email && rol && fecha;
  });

  const resetFiltroRol = () => setFiltroRol("Todos");
  const resetFiltroFecha = () => setFiltroFecha("");

  const handleEditar = () => {
    if (!usuarioSeleccionado) return;
    setForm({
      firstName: usuarioSeleccionado.first_name || "",
      lastName: usuarioSeleccionado.last_name || "",
      email: usuarioSeleccionado.email || "",
      role: usuarioSeleccionado.group || "Cliente",
      age: usuarioSeleccionado.age || "",
      weight: usuarioSeleccionado.weight || "",
      height: usuarioSeleccionado.height || "",
      activityLevel: usuarioSeleccionado.activityLevel || "",
      trainingPlace: usuarioSeleccionado.trainingPlace || "",
    });

    setIsEditing(true);
    setModalUser(true);
  };

  const handleGuardarEdicion = async () => {
    try {
      if (!usuarioSeleccionado) throw new Error("No hay usuario seleccionado");

      await userData.putUsuariosD(usuarioSeleccionado.id, {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
      });

      const perfilData = {
        idUser: usuarioSeleccionado.id,
        edad: Number(form.age) || 0,
        peso: Number(form.weight) || 0,
        altura: Number(form.height) || 0,
        nivel_actividad: form.activityLevel || "bajo",
        lugar_entrenamiento: form.trainingPlace || "casa",
      };

      if (usuarioSeleccionado.profileId) {
        await userInfo.putUsuarios(usuarioSeleccionado.profileId, perfilData);
      } else if (form.role === "Cliente") {
        await userInfo.postUsuarios(perfilData);
      }

      const roleMap = { Administrador: 1, Entrenador: 2, Cliente: 3 };
      const grupos = await gruposAPI.getGrupos();
      const grupoActual = grupos.find(g => g.user === usuarioSeleccionado.id);
      const nuevoGroupId = roleMap[form.role] || 3;

      if (grupoActual) {
        if (Number(grupoActual.group) !== Number(nuevoGroupId)) {
          await gruposAPI.deleteGrupos(grupoActual.id);
          await gruposAPI.postGrupos({ user: usuarioSeleccionado.id, group: nuevoGroupId });
        }
      } else {
        await gruposAPI.postGrupos({ user: usuarioSeleccionado.id, group: nuevoGroupId });
      }

      await cargarUsuarios();
      setIsEditing(false);
      setModalUser(false);
      alert("Usuario actualizado correctamente");
    } catch (e) {
      console.error("handleGuardarEdicion error:", e);
      alert(e.message || "Error al actualizar usuario");
    }
  };

  const handleEliminar = async (u) => {
    if (!u) return;
    if (!window.confirm("¿Desea eliminar este usuario permanentemente?")) return;

    try {
      if (u.profileId) await userInfo.deleteUsuarios(u.profileId);
      if (u.groupEntryId) await gruposAPI.deleteGrupos(u.groupEntryId);
      else {
        const grupos = await gruposAPI.getGrupos();
        const grupoEncontrado = grupos.find(g => g.user === u.id);
        if (grupoEncontrado?.id) await gruposAPI.deleteGrupos(grupoEncontrado.id);
      }

      await userData.deleteUsuariosD(u.id);
      await cargarUsuarios();
      setModalUser(false);
      setIsEditing(false);
      alert("Usuario eliminado correctamente");
    } catch (e) {
      console.error("handleEliminar error:", e);
      alert("Error al eliminar usuario");
    }
  };

  const handleDesactivar = async (u) => {
    if (!u) return;
    try {
      await userData.putUsuariosD(u.id, { is_active: !u.is_active });
      await cargarUsuarios();
      alert(`Usuario ${u.is_active ? "desactivado" : "activado"} correctamente`);
    } catch (e) {
      console.error("handleDesactivar error:", e);
      alert("Error al cambiar estado del usuario");
    }
  };

  const cerrarModalUser = () => {
    setModalUser(false);
    setIsEditing(false);
    setUsuarioSeleccionado(null);
  };

  const abrirModalVer = (u) => {
    setUsuarioSeleccionado(u);
    setIsEditing(false);
    setModalUser(true);
  };

  // Separar usuarios activos y desactivados
  const usuariosActivos = usuariosFiltrados.filter(u => u.is_active);
  const usuariosDesactivados = usuariosFiltrados.filter(u => !u.is_active);

  const renderUsuarios = (listaUsuarios) =>
    listaUsuarios.map((u) => (
      <tr
        key={u.id}
        className={`border-b hover:bg-gray-50 transition ${!u.is_active ? "bg-gray-100 text-gray-400 line-through" : ""}`}
      >
        <td className="p-3 font-medium text-gray-800">{u.first_name} {u.last_name}</td>
        <td className="p-3">{u.username}</td>
        <td className="p-3">{u.email}</td>
        <td className="p-3"><span className={getBadgeColor(u.group)}>{u.group}</span></td>
        <td className="p-3 text-gray-700">{u.date_joined?.slice(0, 10)}</td>
        <td className="p-3 flex justify-end gap-2">
          <button
            className="flex items-center gap-1 px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => abrirModalVer(u)}
          >
            <Eye size={16} /> Ver
          </button>
        </td>
      </tr>
    ));


  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-sm text-gray-600">Administración de cuentas y roles</p>
        </div>
        <button
  onClick={() => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      role: "Cliente",
      activityLevel: "",
      trainingPlace: "",
      age: "",
      weight: "",
      height: "",
    });
    setUsuarioSeleccionado(null);  // limpiar selección previa
    setModalNew(true);
  }}
  className="flex items-center gap-2 px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700 text-sm font-semibold"
>
  <Plus size={18} /> Nuevo Usuario
</button>

      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 font-semibold text-gray-700">
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Usuario</th>
                <th className="p-3 text-left">Correo</th>
                <th className="p-3 text-left">Rol / Grupo</th>
                <th className="p-3 text-left">Registrado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosActivos.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No hay usuarios activos que coincidan con los filtros
                  </td>
                </tr>
              )}
              {renderUsuarios(usuariosActivos)}

              {/* Usuarios desactivados */}
              {usuariosDesactivados.length > 0 && (
                <>
                  <tr>
                    <td colSpan="6" className="p-2 bg-gray-200 text-gray-600 font-semibold text-center">
                      Usuarios Desactivados
                    </td>
                  </tr>
                  {renderUsuarios(usuariosDesactivados)}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Usuario (Ver / Editar) */}
      {modalUser && usuarioSeleccionado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white w-[520px] max-w-full p-6 rounded-lg border shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Información del Usuario</h3>
              <button onClick={cerrarModalUser} className="p-1 rounded hover:bg-gray-100">
                <X />
              </button>
            </div>

            {!isEditing && (
              <>
                <div className="space-y-2 mb-4">
                  <p><span className="font-semibold">Nombre:</span> {usuarioSeleccionado.first_name} {usuarioSeleccionado.last_name}</p>
                  <p><span className="font-semibold">Usuario:</span> {usuarioSeleccionado.username}</p>
                  <p><span className="font-semibold">Correo:</span> {usuarioSeleccionado.email}</p>
                  <p><span className="font-semibold">Rol / Grupo:</span> <span className={getBadgeColor(usuarioSeleccionado.group)}>{usuarioSeleccionado.group}</span></p>
                  <p><span className="font-semibold">Fecha registro:</span> {usuarioSeleccionado.date_joined?.slice(0,10)}</p>
                </div>

                {usuarioSeleccionado.group === "Cliente" && (
                  <>
                    <hr className="my-4" />
                    <h4 className="text-md font-semibold mb-3">Datos de Perfil</h4>
                    <div className="space-y-2 mb-4">
                      <p><span className="font-semibold">Edad:</span> {usuarioSeleccionado.age || "—"}</p>
                      <p><span className="font-semibold">Peso:</span> {usuarioSeleccionado.weight || "—"} kg</p>
                      <p><span className="font-semibold">Altura:</span> {usuarioSeleccionado.height || "—"} cm</p>
                      <p><span className="font-semibold">Entrenamiento:</span> {usuarioSeleccionado.trainingPlace || "—"}</p>
                      <p><span className="font-semibold">Nivel actividad:</span> {usuarioSeleccionado.activityLevel || "—"}</p>
                    </div>
                  </>
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={handleEditar}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Pencil size={16} /> Editar
                  </button>

                  <button
                    onClick={() => handleDesactivar(usuarioSeleccionado)}
                    className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    {usuarioSeleccionado.is_active ? "Desactivar" : "Activar"}
                  </button>

                  <button
                    onClick={() => handleEliminar(usuarioSeleccionado)}
                    className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>

                  <button
                    onClick={cerrarModalUser}
                    className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}

            {/* Formulario de edición */}
            {isEditing && (
              <>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border p-2 rounded"
                      placeholder="Nombre"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />
                    <input
                      className="flex-1 border p-2 rounded"
                      placeholder="Apellido"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />
                  </div>

                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Correo"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />

                  <label className="block text-sm font-medium text-gray-700">Tipo de Usuario</label>
                  <select
                    className="w-full p-2 mb-1 border rounded"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option>Cliente</option>
                    <option>Administrador</option>
                    <option>Entrenador</option>
                  </select>

                  {/* Campos de perfil */}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="border p-2 rounded"
                      placeholder="Edad"
                      type="number"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                    />
                    <input
                      className="border p-2 rounded"
                      placeholder="Peso (kg)"
                      type="number"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    />
                    <input
                      className="border p-2 rounded"
                      placeholder="Altura (cm)"
                      type="number"
                      value={form.height}
                      onChange={(e) => setForm({ ...form, height: e.target.value })}
                    />
                    <select
                      className="border p-2 rounded"
                      value={form.activityLevel}
                      onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
                    >
                      <option value="">Nivel actividad</option>
                      <option value="bajo">Bajo</option>
                      <option value="medio">Medio</option>
                      <option value="alto">Alto</option>
                    </select>
                    <select
                      className="border p-2 rounded col-span-2"
                      value={form.trainingPlace}
                      onChange={(e) => setForm({ ...form, trainingPlace: e.target.value })}
                    >
                      <option value="">Lugar de entrenamiento</option>
                      <option value="Casa">Casa</option>
                      <option value="Gimnasio">Gimnasio</option>
                      <option value="Aire Libre">Aire Libre</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => { setIsEditing(false); }}
                    className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleGuardarEdicion}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Guardar cambios
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Nuevo Usuario */}
      {modalNew && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-40">
          <div className="bg-white w-[450px] p-6 rounded-lg border shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Nuevo Usuario</h3>
              <button onClick={() => setModalNew(false)} className="p-1 rounded hover:bg-gray-100">
                <X />
              </button>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario</label>
            <select
              className="w-full p-2 mb-3 border rounded"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>Cliente</option>
              <option>Administrador</option>
              <option>Entrenador</option>
            </select>

            <div className="flex gap-2 mb-3">
              <input
                className="w-1/2 border p-2 rounded"
                placeholder="Nombre"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <input
                className="w-1/2 border p-2 rounded"
                placeholder="Apellido"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>

            <input
              className="w-full border p-2 rounded mb-3"
              placeholder="Correo"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {form.role === "Cliente" && (
              <>
                <hr className="my-3" />
                <h4 className="text-md font-semibold mb-3">Datos de Perfil</h4>

                <input
                  className="w-full border p-2 rounded mb-3"
                  placeholder="Edad"
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />

                <div className="flex gap-2 mb-3">
                  <input
                    className="w-1/2 border p-2 rounded"
                    placeholder="Peso (kg)"
                    type="number"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  />
                  <input
                    className="w-1/2 border p-2 rounded"
                    placeholder="Altura (cm)"
                    type="number"
                    value={form.height}
                    onChange={(e) => setForm({ ...form, height: e.target.value })}
                  />
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Actividad</label>
                <select
                  className="w-full p-2 mb-3 border rounded"
                  value={form.activityLevel}
                  onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
                >
                  <option value="">Seleccione nivel</option>
                  <option value="bajo">Bajo</option>
                  <option value="medio">Medio</option>
                  <option value="alto">Alto</option>
                </select>

                <label className="block text-sm font-medium text-gray-700 mb-1">Lugar de Entrenamiento</label>
                <select
                  className="w-full p-2 mb-3 border rounded"
                  value={form.trainingPlace}
                  onChange={(e) => setForm({ ...form, trainingPlace: e.target.value })}
                >
                  <option value="">Seleccione lugar</option>
                  <option value="Casa">Casa</option>
                  <option value="Gimnasio">Gimnasio</option>
                  <option value="Aire Libre">Aire Libre</option>
                </select>
              </>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalNew(false)}
                className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>

              <button
                onClick={addUser}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsuariosSeccion;
