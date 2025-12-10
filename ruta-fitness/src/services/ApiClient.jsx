export async function apiClient(url, options = {}) {
    const token = localStorage.getItem("access");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorText = await response.text();
        console.error("API ERROR:", errorText);
        throw new Error(errorText || "Error en la petición");
    }

    // Evitar error si la respuesta no tiene contenido
    if (response.status === 204 || response.status === 205) {
        return true; // Operación exitosa sin contenido
    }

    // Evitar error si el body está vacío
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}
