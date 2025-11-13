import React, { useState } from 'react'
import llamados from '../../services/ServicesUsuarios'
import llamadosD from '../../services/ServicesUserD'

function FormRegistro() {
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [edad, setEdad] = useState("")
  const [peso, setPeso] = useState("")
  const [altura, setAltura] = useState("")
  const [nivelActividad, setNivelActividad] = useState("")
  const [lugarEntrenamiento, setLugarEntrenamiento] = useState("")

  async function cargarDatos() {
    try {
      //Crear usuario base
      const userData = await llamadosD.postUsuariosD({
        username: correo,
        email: correo,
        first_name: nombre,
        last_name: apellido,
        password: password,
      });



      console.log("Usuario base creado:", userData);

      //Crear perfil extendido
      const usuarioData = {
        idUser: userData.id,
        edad,
        peso,
        altura,
        nivel_actividad: nivelActividad,
        lugar_entrenamiento: lugarEntrenamiento,
      };

      const respuesta = await llamados.postUsuarios(usuarioData);
      console.log("Perfil Usuarios creado:", respuesta);

      alert("Cuenta creada correctamente");
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al crear la cuenta");
    }
  }

  return (
    <div>
      <h1>Crear Cuenta</h1>
      <p>Completa tus datos para recibir una rutina personalizada</p>

      <label>Nombre:</label><br />
      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} /><br />

      <label>Apellido:</label><br />
      <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} /><br />

      <label>Correo:</label><br />
      <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} /><br />

      <label>Contraseña:</label><br />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />

      <label>Edad:</label><br />
      <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} /><br />

      <label>Peso (kg):</label><br />
      <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} /><br />

      <label>Altura (cm):</label><br />
      <input type="number" value={altura} onChange={(e) => setAltura(e.target.value)} /><br />

      <label>Nivel de Actividad:</label><br />
      <select value={nivelActividad} onChange={(e) => setNivelActividad(e.target.value)}>
        <option value="">Seleccione un nivel</option>
        <option value="bajo">Bajo</option>
        <option value="medio">Medio</option>
        <option value="alto">Alto</option>
      </select><br />

      <label>Lugar de Entrenamiento:</label><br />
      <select value={lugarEntrenamiento} onChange={(e) => setLugarEntrenamiento(e.target.value)}>
        <option value="">Seleccione un lugar</option>
        <option value="casa">En Casa</option>
        <option value="gimnasio">Gimnasio</option>
        <option value="aire_libre">Aire Libre</option>
      </select><br />

      <button onClick={cargarDatos}>Crear mi cuenta</button>
    </div>
  )
}

export default FormRegistro
