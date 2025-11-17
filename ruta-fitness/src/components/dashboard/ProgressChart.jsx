import React from 'react';
import { TrendingUp, Target, Calendar } from 'lucide-react';

const ProgressChart = () => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 transition-transform duration-200 hover:scale-[1.005]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-7 h-7 text-indigo-500 mr-3" />
          Progreso de Peso
        </h2>
        <span className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors duration-200">
          Ver Detalles
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
        <div className="bg-indigo-50 p-4 rounded-xl flex flex-col items-center justify-center shadow-inner hover:bg-indigo-100 transition-colors duration-200">
          <Calendar className="w-8 h-8 text-indigo-600 mb-2" />
          <p className="text-xl font-bold text-indigo-700">2.0 Kg</p>
          <p className="text-sm text-gray-600">Cambio Total</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl flex flex-col items-center justify-center shadow-inner hover:bg-green-100 transition-colors duration-200">
          <Target className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-xl font-bold text-green-700">0.5 Kg</p>
          <p className="text-sm text-gray-600">Meta Restante</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl flex flex-col items-center justify-center shadow-inner hover:bg-blue-100 transition-colors duration-200">
          <Calendar className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-xl font-bold text-blue-700">85.0 Kg</p>
          <p className="text-sm text-gray-600">Día Inicio</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Historial Reciente</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex justify-between">
            <span>Hoy:</span>
            <span className="font-medium text-green-600">+0.2 Kg (84.8 Kg)</span>
          </li>
          <li className="flex justify-between">
            <span>Ayer:</span>
            <span className="font-medium">84.6 Kg</span>
          </li>
          <li className="flex justify-between">
            <span>Hace 2 días:</span>
            <span className="font-medium">84.5 Kg</span>
          </li>
          <li className="flex justify-between">
            <span>Hace 3 días:</span>
            <span className="font-medium text-red-600">-0.1 Kg (84.6 Kg)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProgressChart;