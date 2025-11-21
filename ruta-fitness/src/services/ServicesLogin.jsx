async function loginUsuario(credenciales) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credenciales),
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const data = await response.json();

    return data; // devuelve { access, refresh }
  } catch (error) {
    console.error("Error en el login:", error);
    throw error;
  }
}

export default { loginUsuario };