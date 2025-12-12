// rutafitness/avances/LogrosUsuario.jsx

import React from 'react';

const LogrosUsuario = ({ logros }) => { 
    const hasLogros = logros && logros.length > 0;

    return (
        <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100 h-full">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-2">Logros Desbloqueados</h2>
            
            {hasLogros ? (
                // Grid para galería
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {logros.map((l, i) => (
                        <div 
                            key={i} 
                            className="bg-green-50 p-4 rounded-xl shadow-lg border border-green-200 
                                       flex flex-col items-center justify-center text-center 
                                       transition duration-300 transform hover:scale-105 hover:shadow-xl"
                        >
                            <span className="text-4xl mb-2">🏅</span> 
                            
                            <p className="font-bold text-green-800 text-sm leading-snug">{l.titulo}</p>
                            <p className="text-xs text-gray-600 mt-1">{l.descripcion}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                {/* Asegúrate que l.fecha_obtencion exista y tenga el formato correcto en Django */}
                                {new Date(l.fecha_obtencion || '2025-01-01').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    Aún no has conseguido logros. ¡Sigue progresando!
                </p>
            )}
        </div>
    );
};

export default LogrosUsuario;