import api from '../utils/api'; // Importamos la instancia de Axios configurada

/**
 * Servicio para obtener los datos de progreso del usuario (para la gráfica).
 * @returns {Promise<Array<Object>>} Lista de puntos de datos de progreso.
 */
export const getProgressData = async () => {
    try {
        // Asumiendo que el endpoint para el progreso es '/dashboard/progress/'
        const response = await api.get('/dashboard/progress/');
        return response.data;
    } catch (error) {
        // En un entorno de desarrollo, mostramos el error para depuración
        console.error("Error al obtener datos de progreso:", error.response ? error.response.data : error.message);
        // Si hay un error, devolvemos un array vacío para que los componentes usen los datos simulados (mock)
        throw new Error("Fallo en la comunicación con el servidor para datos de progreso.");
    }
};

/**
 * Servicio para obtener las rutinas recomendadas o destacadas.
 * @returns {Promise<Array<Object>>} Lista de rutinas.
 */
export const getRecommendedRoutines = async () => {
    try {
        // Asumiendo que el endpoint para las rutinas es '/dashboard/routines/'
        const response = await api.get('/dashboard/routines/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener rutinas recomendadas:", error.response ? error.response.data : error.message);
        throw new Error("Fallo en la comunicación con el servidor para rutinas.");
    }
};

/**
 * Servicio para obtener la actividad reciente del usuario (últimos entrenamientos).
 * @returns {Promise<Array<Object>>} Lista de actividades.
 */
export const getRecentActivity = async () => {
    try {
        // Asumiendo que el endpoint para la actividad reciente es '/dashboard/activity/'
        const response = await api.get('/dashboard/activity/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener actividad reciente:", error.response ? error.response.data : error.message);
        throw new Error("Fallo en la comunicación con el servidor para actividad reciente.");
    }
};