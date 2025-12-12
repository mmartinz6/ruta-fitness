// En rutafitness/PaginaAvances.jsx

import React from "react";
// 🔑 Importamos SOLO el componente contenedor principal
import AvancesUsuario from "../components/avances/AvancesUsuario";

// Nota: Eliminamos las importaciones de EncabezadoAvances, MedidasUsuario, etc.,
// ya que AvancesUsuario debe manejarlas internamente.

export default function PaginaAvances() {
  return (
    
    <AvancesUsuario />
  );
}

