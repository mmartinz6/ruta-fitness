import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProgressChart from '../components/dashboard/ProgressChart'; // <-- Asegura que esté aquí
import AchievementsCard from '../components/dashboard/AchievementsCard'; // <-- Asegura que esté aquí
import RoutineCard from '../components/dashboard/RoutineCard'; // <-- Asegura que esté aquí
import RecentActivity from '../components/dashboard/RecentActivity'; // <-- Asegura que esté aquí

// Mock data para las rutinas
const mockRoutines = [
  { id: 1, name: 'Rutina Full Body', duration: '45 min', focus: 'Fuerza', color: 'bg-indigo-600' },
  { id: 2, name: 'Cardio HIIT', duration: '30 min', focus: 'Quema Grasa', color: 'bg-green-600' },
  { id: 3, name: 'Estiramiento Post-Entreno', duration: '15 min', focus: 'Recuperación', color: 'bg-red-600' },
];

/**
 * Componente de Página: DashboardPage
 * Muestra el contenido principal del usuario.
 * @param {function} navigate - Función para navegar (pasada desde App.jsx)
 * @param {function} onLogout - Función para cerrar sesión (pasada desde App.jsx)
 */
const DashboardPage = ({ navigate, onLogout }) => {
  return (
    // MainLayout provee la estructura con Sidebar y Header
    <MainLayout navigate={navigate} onLogout={onLogout}>
      <div className="p-4 sm:p-6 lg:p-8">
        
        {/* 1. Encabezado de bienvenida */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 sm:mb-8">
          ¡Hola, Juan! 👋
        </h1>

        {/* 2. Sección de Progreso y Logros (2 Columnas) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Gráfico de Progreso */}
          <ProgressChart />

          {/* Tarjeta de Logros */}
          <AchievementsCard />
          
        </section>

        {/* 3. Sección de Rutinas (3 Columnas) */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Rutinas Sugeridas
        </h2>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {mockRoutines.map(routine => (
            <RoutineCard 
              key={routine.id}
              name={routine.name}
              duration={routine.duration}
              focus={routine.focus}
              color={routine.color}
            />
          ))}
        </section>
        
        {/* 4. Sección de Actividad Reciente (1 Columna) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivity />
          <div className="bg-gray-100 rounded-3xl p-6 flex items-center justify-center border-dashed border-2 border-gray-300">
              <span className="text-gray-500 font-medium">Más espacio para widgets futuros (Ej. Nutrición)</span>
          </div>
        </section>

      </div>
    </MainLayout>
  );
};

export default DashboardPage;