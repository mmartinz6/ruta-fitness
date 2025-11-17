import React from 'react';
import { Trophy, CheckCircle, Target } from 'lucide-react';

/**
 * Componente AchievementsCard.jsx
 * Muestra los logros desbloqueados y el progreso hacia la siguiente meta.
 */
const AchievementsCard = () => {
  const mockAchievements = [
    { name: 'Primer Mes', description: '30 días de consistencia', progress: 100, icon: CheckCircle, unlocked: true },
    { name: 'Rompe Barreras', description: 'Levantar 100Kg de peso muerto', progress: 75, icon: Target, unlocked: false },
    { name: 'Maratonista', description: 'Correr 10 Km sin parar', progress: 40, icon: Target, unlocked: false },
  ];

  const unlockedCount = mockAchievements.filter(a => a.unlocked).length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Trophy className="w-7 h-7 mr-2 text-yellow-500" />
          Mis Logros ({unlockedCount} / {mockAchievements.length})
        </h2>
        <a href="/logros" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
          Ver Todos
        </a>
      </div>

      {/* Grid de Logros */}
      <div className="grid grid-cols-1 gap-4">
        {mockAchievements.map((achievement, index) => (
          <div 
            key={index} 
            className={`
              flex items-start p-4 rounded-lg transition-all duration-200
              ${achievement.unlocked 
                ? 'bg-green-50 border-2 border-green-400 shadow-sm' 
                : 'bg-gray-50 border border-gray-300 opacity-80'
              }
              hover:shadow-md hover:scale-[1.01]
            `}
          >
            
            {/* Ícono */}
            <div className="flex-shrink-0 mr-4 mt-1">
              <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? 'text-green-600' : 'text-gray-500'}`} />
            </div>

            {/* Detalles del Logro */}
            <div className="flex-grow">
              <h3 className={`text-sm font-semibold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-600'}`}>
                {achievement.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2">{achievement.description}</p>
              
              {/* Barra de Progreso */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${achievement.unlocked ? 'bg-green-500' : 'bg-indigo-500'} h-2 rounded-full transition-all duration-500`} 
                  style={{ width: `${achievement.progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                {achievement.progress}% {achievement.unlocked ? 'Completado' : 'Faltante'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsCard;