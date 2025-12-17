import { useEffect } from "react";
import { mostrarModalAsync, tokenExpiraPronto, renovarToken, cerrarSesion } from "../../services/ApiClient";

let modalAbierto = false; // Evita abrir varios modales al mismo tiempo

export default function TokenWatcher() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem("access");

      if (token && tokenExpiraPronto(token)) {
        if (modalAbierto) return; // no abrir otro modal si ya hay uno
        modalAbierto = true;

        try {
          const continuar = await mostrarModalAsync();
          if (!continuar) return cerrarSesion();
          await renovarToken();
        } finally {
          modalAbierto = false; // resetear al cerrar el modal
        }
      }
    }, 30000); // revisar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return null; // no renderiza nada
}
