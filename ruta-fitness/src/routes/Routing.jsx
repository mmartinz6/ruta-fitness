import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importaciones

import DashboardPage from '../pages/DashboardPage';
import Registro from '../pages/Registro'; 
import FormLoginContainer from '../pages/FormLogin';

import BienestarPage from "./../pages/Bienestar";


function AppRouting() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path='/registro' element={<Registro />} />
        <Route path='/login' element={<FormLoginContainer />} />

        {/* Ruta raíz - muestra la página de Bienestar por defecto */}
        <Route path='/' element={<BienestarPage />} />

        {/* Ruta del Dashboard */}
        <Route path='/dashboard' element={<DashboardPage />} />

        {/* Otras rutas (Sidebar) */}
        <Route path='/rutinas' element={<div>Página de Rutinas</div>} />
        <Route path='/progreso' element={<div>Página de Progreso</div>} />
        <Route path='/configuracion' element={<div>Página de Configuración</div>} />
        <Route path='/bienestar' element={<BienestarPage />} />

        {/* Ruta comodín para cualquier otra URL */}
        <Route path='*' element={<div>404 | Página No Encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouting;