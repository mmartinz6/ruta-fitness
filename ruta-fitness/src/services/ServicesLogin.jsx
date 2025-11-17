async function loginUsuario(credenciales) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credenciales),
    });
<<<<<<< HEAD
    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }
=======

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

>>>>>>> e9613ade3e485c026ae572bb08038a9a0117732c
    const data = await response.json();
    return data; // devuelve { access, refresh }
  } catch (error) {
    console.error("Error en el login:", error);
    throw error;
  }
}
<<<<<<< HEAD
export default { loginUsuario };
=======

export default { loginUsuario };
>>>>>>> e9613ade3e485c026ae572bb08038a9a0117732c
