// En rutafitness/avances/HistorialActividades.jsx

import React from 'react';

/**
 * Muestra el historial de actividades deportivas.
 * @param {Array<Object>} historial - El array de historial pasado como prop desde el componente padre.
 */
const HistorialActividades = ({ historial }) => { 
    
    // El historial ya viene cargado y filtrado desde AvancesUsuario.jsx
    const hasHistorial = historial && historial.length > 0;

    return (
        // Usamos la tarjeta limpia y estilizada de Tailwind
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Historial de Actividades</h2>
            
            {hasHistorial ? (
                // Estilos de lista y scroll para el historial
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {historial.map((h, i) => (
                        <div 
                            key={i} 
                            // Estilo de tarjeta individual con hover
                            className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-green-50 transition duration-150"
                        >
                            <p className="text-green-600 font-bold text-base flex justify-between items-center">
                                {/* Asume que tu objeto 'h' tiene 'ejercicio' y 'duracion' */}
                                <span>🏋️ {h.ejercicio}</span>
                                <span className="text-lg font-extrabold">{h.duracion} min</span>
                            </p>
                            {/* Asume que tu objeto 'h' tiene 'fecha' */}
                            <p className="text-gray-500 text-sm mt-1">Fecha: {h.fecha}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    No hay actividades registradas aún. ¡Empieza tu rutina!
                </p>
            )}
        </div>
    );
};

export default HistorialActividades;