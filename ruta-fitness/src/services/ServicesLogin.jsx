const API_URL = "http://127.0.0.1:8000/api";

/**
 * Hace login y devuelve tokens + usuario activo
 */
async function loginUsuario(credenciales) {
  try {
    console.log("📌 Enviando credenciales:", credenciales);

    // 1️⃣ LOGIN → obtener tokens
    const tokenResponse = await fetch(`${API_URL}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credenciales),
    });

    if (!tokenResponse.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const tokenData = await tokenResponse.json();
    console.log("🔑 Tokens recibidos:", tokenData);

    // 2️⃣ OBTENER usuario activo
    const userResponse = await fetch(`${API_URL}/usuarios/me/`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenData.access}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("No se pudo obtener el usuario actual");
    }

    const userData = await userResponse.json();
    console.log("👤 Usuario activo:", userData);

    // 3️⃣ Guardar usuario en localStorage
    localStorage.setItem("usuarioActivo", JSON.stringify(userData));

    return {
      ...tokenData,
      usuario: userData,
    };
  } catch (error) {
    console.error("❌ Error en loginUsuario:", error);
    throw error;
  }
}

/**
 * Obtiene usuario activo desde localStorage
 */
function getUsuarioActivo() {
  const data = localStorage.getItem("usuarioActivo");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Error parseando usuarioActivo:", error);
    return null;
  }
}

/**
 * Logout → elimina tokens y usuarioActivo
 */
function logoutUsuario() {
  localStorage.removeItem("usuarioActivo");
  // Si guardas tokens también eliminarlos:
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export default {
  loginUsuario,
  getUsuarioActivo,
  logoutUsuario,
};