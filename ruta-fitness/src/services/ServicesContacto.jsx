async function postContacto(data) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/contacto/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Error al enviar el mensaje");
    }

    return await response.json();

  } catch (error) {
    console.error("Error en postContacto:", error);
    throw error;
  }
}

export default { postContacto };
