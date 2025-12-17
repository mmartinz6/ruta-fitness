import axios from "axios";

const API_URL = "http://localhost:8000/api";

const usuarioRutinaService = {

  obtenerMisRutinas: async () => {
    const res = await axios.get(`${API_URL}/usuario-rutinas/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return res.data;
  },

  generarRutina: async () => {
    const res = await axios.post(
      `${API_URL}/generar-rutina/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    return res.data;
  },

  completarRutina: async (rutinaId) => {
    const res = await axios.post(
      `${API_URL}/usuario-rutinas/${rutinaId}/completar/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    return res.data;
  }
};

export default usuarioRutinaService;

