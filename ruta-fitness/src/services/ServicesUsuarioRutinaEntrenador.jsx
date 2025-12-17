// ServicesUsuarioRutina.jsx
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/usuario-rutinas/";

const obtenerTodas = async () => {
  try {
    const token = localStorage.getItem("access"); // <-- AQUI EL NOMBRE DE TU TOKEN

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error obteniendo rutinas asignadas:", error);
    throw error;
  }
};

export default {
  obtenerTodas,
};
