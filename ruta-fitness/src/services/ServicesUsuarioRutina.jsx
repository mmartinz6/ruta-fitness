import axios from "axios";

const API_URL = "http://localhost:8000/api";

const usuarioRutinaService = {

  // Obtener rutinas del usuario autenticado
  obtenerMisRutinas: async () => {
    try {
      const res = await axios.get(`${API_URL}/usuario-rutinas/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error obteniendo rutinas:", error.response?.data || error.message);
      throw error;
    }
  },

  // Generar rutina automática
  generarRutina: async () => {
    try {
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
    } catch (error) {
      console.error("Error generando rutina:", error.response?.data || error.message);
      throw error;
    }
  },

  // Completar rutina activa
  completarRutina: async (rutinaId) => {
    try {
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
    } catch (error) {
      console.error("Error completando rutina:", error.response?.data || error.message);
      throw error;
    }
  },

  // Obtener progreso de series
  obtenerProgresoSeries: async () => {
    try {
      const res = await axios.get(`${API_URL}/progreso-series/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error obteniendo progreso:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Completar ejercicio (ENDPOINT CORRECTO)
  completarSerie: async (ejercicioId) => {
    try {
      const res = await axios.post(
        `${API_URL}/rutina/serie/completar/`,
        {
          ejercicio_id: ejercicioId,
          serie_numero: 1
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error completando ejercicio:", error.response?.data || error.message);
      throw error;
    }
  },

};

export default usuarioRutinaService;
