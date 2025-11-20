import React from 'react';
import { Activity, Dumbbell, Clock, Calendar } from 'lucide-react';

// Datos simulados para que el componente muestre algo
const mockActivities = [
    { id: 1, name: 'Press Banca', sets: 4, reps: 10, weight: 80, date: 'Hoy, 10:30 AM' },
    { id: 2, name: 'Sentadillas', sets: 3, reps: 12, weight: 60, date: 'Ayer, 18:00 PM' },
    { id: 3, name: 'Peso Muerto', sets: 5, reps: 5, weight: 100, date: 'Martes, 19:15 PM' },
];

/**
 * Componente que muestra la actividad reciente del usuario (simulada).
 */
const RecentActivity = () => {
    // Si más adelante usas servicios, reemplazarás mockActivities por datos de un useState
    const activities = mockActivities;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 divide-y divide-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 p-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                Tu Última Actividad
            </h3>
            
            {activities.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                    <p>Aún no hay actividad reciente para mostrar.</p>
                </div>
            ) : (
                activities.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <Dumbbell className="w-5 h-5 text-indigo-500" />
                                <span className="font-medium text-gray-800">{activity.name}</span>
                            </div>
                            <span className="text-sm text-gray-500 flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {activity.date}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 ml-8">
                            {activity.sets} sets de {activity.reps} reps con {activity.weight} Kg
                        </p>
                    </div>
                ))
            )}
            
            <div className="p-4 text-center">
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Ver historial completo
                </button>
            </div>
        </div>
    );
};

export default RecentActivity;