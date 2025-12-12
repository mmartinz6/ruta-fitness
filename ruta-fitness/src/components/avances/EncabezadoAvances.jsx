// En rutafitness/avances/EncabezadoAvances.jsx

import React from "react";

// Recibe opcionalmente el nombre de usuario para personalizar el saludo
const EncabezadoAvances = ({ nombreUsuario }) => {
    return (
        // Contenedor principal del encabezado con fondo y sombra
        <div className="bg-indigo-700 text-white rounded-xl shadow-xl p-6 md:p-8 mb-8 border-b border-indigo-500/50">
            
            {/* Título principal */}
            <h1 className="text-4xl font-extrabold tracking-tight">
                Panel de Avances
            </h1>
            
            {/* Subtítulo o saludo personalizado */}
            <p className="text-xl font-light mt-2 text-indigo-100">
                {nombreUsuario 
                    ? `Bienvenido, ${nombreUsuario}. Monitorea tu progreso en tiempo real.`
                    : "Monitorea tu progreso en tiempo real."
                }
            </p>
        </div>
    );
};

export default EncabezadoAvances;