// servicesResumen
import { apiClient } from "./ApiClient";
async function getResumen() {
    try {
        const resumen = await apiClient("http://127.0.0.1:8000/api/resumen/", {
            method: "GET"
        });
        return resumen;
    } catch (error) {
        console.error("Error al obtener el resumen", error);
        throw error;
    }
}

export default { getResumen };
