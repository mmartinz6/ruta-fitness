export const AUTH_LOGOUT_ERROR = "No hay token de acceso disponible. Forzando logout.";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Obtener tokens desde localStorage
const getAuthTokens = () => {
  try {
    const tokens = {
      access: localStorage.getItem("access"),
      refresh: localStorage.getItem("refresh"),
    };
    console.log("Tokens leídos:", tokens);
    return tokens;
  } catch (e) {
    console.error("Error leyendo tokens:", e);
    return null;
  }
};

// fetch autenticado
export const authFetch = async (url, options = {}) => {
  console.log("authFetch →", url);

  const tokens = getAuthTokens();

  if (!tokens || !tokens.access) {
    console.log("No hay access token");
    throw new Error(AUTH_LOGOUT_ERROR);
  }

  const finalOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokens.access}`,
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, finalOptions);
  console.log("Status:", response.status);

  if (response.status === 401) {
    console.log("Token expirado. Logout forzado.");
    throw new Error(AUTH_LOGOUT_ERROR);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    console.error("Error HTTP:", response.status, body);
    throw new Error(`Error HTTP ${response.status}: ${body.detail || response.statusText}`);
  }

  return response;
};

// Obtener todos los avances
export const getAvancesData = async (userId) => {
  console.log("getAvancesData(", userId, ")");

  if (!userId) throw new Error("No userId recibido");

  const response = await authFetch(`${API_BASE_URL}/usuarios/${userId}/avances/`);
  const data = await response.json();

  console.log("Datos recibidos:", data);

  return data;
};

// Obtener datos básicos del usuario
export const getUsuarioData = async (userId) => {
  console.log("getUsuarioData(", userId, ")");

  if (!userId) throw new Error("No userId recibido");

  const response = await authFetch(`${API_BASE_URL}/usuarios/${userId}/`);
  const data = await response.json();

  console.log("Datos del usuario:", data);
  return data;
};
