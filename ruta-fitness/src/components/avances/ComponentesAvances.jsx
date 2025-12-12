// En rutafitness/avances/ComponentesAvances.jsx

import React from "react";

// ========================= RESUMEN =========================
export function ResumenProgreso({ progreso }) {
  const hasProgreso = progreso && Object.keys(progreso).length > 0 && progreso.peso;
  
  return (
    // Tarjeta con un gradiente llamativo para destacar el resumen
    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl shadow-2xl p-6 h-full transition duration-300 transform hover:scale-[1.01]">
      <h2 className="text-2xl font-bold mb-4 border-b border-white/50 pb-2">Tu Progreso Actual</h2>
      
      {hasProgreso ? (
        <div className="space-y-3">
          <p className="flex justify-between items-center text-lg">
            <span className="font-semibold flex items-center"><span className="text-xl mr-2">⚖️</span> Peso actual:</span>
            <span className="text-2xl font-extrabold">{progreso.peso} kg</span>
          </p>
          <p className="flex justify-between items-center text-lg">
            <span className="font-semibold flex items-center"><span className="text-xl mr-2">🧈</span> Grasa corporal:</span>
            <span className="text-2xl font-extrabold">{progreso.grasa}%</span>
          </p>
          <p className="flex justify-between items-center text-lg">
            <span className="font-semibold flex items-center"><span className="text-xl mr-2">💪</span> Masa muscular:</span>
            <span className="text-2xl font-extrabold">{progreso.musculo}%</span>
          </p>
        </div>
      ) : (
        <p className="text-indigo-100 mt-4">Registra tu primera medición para ver el resumen de tu composición.</p>
      )}
    </div>
  );
}

// ========================= MEDICIONES =========================
export function Mediciones({ mediciones }) {
  const hasMediciones = mediciones && mediciones.length > 0;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Historial de Mediciones</h2>
      
      {hasMediciones ? (
        // Añadimos scroll si la lista es muy larga
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2"> 
          {mediciones.map((m, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-indigo-50 transition duration-150">
              <p className="text-indigo-600 font-bold text-sm">Fecha: {m.fecha}</p>
              <div className="flex justify-between mt-1 text-gray-700 text-sm">
                <p>Peso: <span className="font-medium">{m.peso} kg</span></p>
                <p>Cintura: <span className="font-medium">{m.cintura} cm</span></p>
                {/* Asumiendo que 'pecho' también está en las mediciones si usas el formulario */}
                {m.pecho && <p>Pecho: <span className="font-medium">{m.pecho} cm</span></p>} 
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No hay mediciones registradas.</p>
      )}
    </div>
  );
}

// ========================= HISTORIAL DE ACTIVIDADES =========================
export function HistorialActividades({ historial }) {
  const hasHistorial = historial && historial.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Historial de Actividades</h2>
      
      {hasHistorial ? (
        // Añadimos scroll si la lista es muy larga
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {historial.map((h, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-green-50 transition duration-150">
              <p className="text-green-600 font-bold text-base flex justify-between items-center">
                <span>🏋️ {h.ejercicio}</span>
                <span className="text-lg font-extrabold">{h.duracion} min</span>
              </p>
              <p className="text-gray-500 text-sm mt-1">Fecha: {h.fecha}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No hay actividades registradas aún. ¡Empieza tu rutina!</p>
      )}
    </div>
  );
}

// ========================= LOGROS =========================
export function Logros({ logros }) {
  const hasLogros = logros && logros.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Logros Desbloqueados</h2>
      
      {hasLogros ? (
        // Grid para mostrar los logros como insignias
        <div className="grid grid-cols-2 gap-4">
          {logros.map((l, i) => (
            <div key={i} className="bg-yellow-50 p-3 rounded-lg shadow-sm border border-yellow-300 flex flex-col items-center justify-center text-center transition duration-150 hover:bg-yellow-100">
              <span className="text-3xl mb-1">🏆</span>
              <p className="font-semibold text-yellow-800 text-sm leading-tight">{l.titulo}</p>
              <p className="text-xs text-gray-600 mt-1">{l.descripcion}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Aún no has conseguido logros. ¡Sigue progresando!</p>
      )}
    </div>
  );
}