import React from 'react';
// Importamos los iconos que se necesitan para este componente
import { Clock, Zap, PlayCircle, Dumbbell } from 'lucide-react'; 


const RoutineCard = ({ name, duration, focus, color }) => {
    
    // Función para determinar los colores de fondo basados en la propiedad 'color'
    // Los colores usados en DashboardPage.jsx son: bg-indigo-500, bg-green-500, bg-red-500
    // Usamos el color base para el botón y el texto si es necesario.
    const getBaseColorClass = (baseColor) => {
        // Ejemplo simple: transforma bg-indigo-500 a text-indigo-700
        const colorName = baseColor.split('-')[1]; 
        return `text-${colorName}-700`;
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
                {/* Solución al error: Ahora lee 'name' correctamente */}
                <h3 className="text-lg font-bold text-gray-900">{name}</h3> 
                
                {/* Etiqueta de foco (focus) */}
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${color}`}>
                    {focus}
                </span>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-600">
                {/* Duración */}
                <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                    <span>Duración: {duration}</span>
                </div>
                {/* Foco o tipo de ejercicio */}
                <div className="flex items-center">
                    <Dumbbell className={`w-4 h-4 mr-2 ${getBaseColorClass(color)}`} />
                    <span>Foco: {focus}</span>
                </div>
            </div>

            {/* Botón de acción principal */}
            <button className={`flex items-center justify-center w-full py-2 ${color} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-lg`}>
                <PlayCircle className="w-5 h-5 mr-2" />
                Iniciar Rutina
            </button>
        </div>
    );
};

export default RoutineCard;