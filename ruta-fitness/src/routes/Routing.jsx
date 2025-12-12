import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Componente Layout que contiene el Sidebar
import MainLayout from '../components/layout/MainLayout';
// Importaciones de Páginas
import DashboardPage from '../pages/DashboardPage';
import Registro from '../pages/Registro';
import Login from '../pages/Login';
import BienestarPage from "../pages/Bienestar";
import Inicio from "../pages/Inicio";
import Comunidad from "../pages/Comunidad";
import Contacto from "../pages/Contacto";
import linkClasses from '../components/layout/Sidebar';
import ComparadorPage from "../pages/ComparadorPage";
import AvancesUsuarioPage from "../pages/PaginaAvances";

import DashboardAdmin from '../pages/DashboardAdmin';
import DashboardEntrenador from '../pages/DashboardEntrenador';


// Componentes Placeholder simples
const RutinasPage = () => <div className="p-8 text-2xl font-bold text-gray-700">Página de Rutinas</div>;
const ProgresoPage = () => <div className="p-8 text-2xl font-bold text-gray-700">Página de Progreso</div>;
const ConfiguracionPage = () => <div className="p-8 text-2xl font-bold text-gray-700">Página de Configuración</div>;
function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. RUTAS SIN LAYOUT (Login y Registro) */}
        <Route path='/registro' element={<Registro />} />
        <Route path='/login' element={<Login />} />
        <Route path="/dashboardadmin" element={<DashboardAdmin />} />
        <Route path="/dashboardentrenador" element={<DashboardEntrenador />} />
        {/* 2. CONTENEDOR PRINCIPAL CON SIDEBAR */}
        <Route element={<MainLayout />}>
          {/* Ruta Raíz: Redirige de '/' a '/dashboard' */}
          <Route path='/' element={<Navigate to="/dashboard" replace />} />
          {/* RUTAS PRIVADAS: aparecerán al lado del sidebar */}
          <Route path='/inicio' element={<Inicio />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/rutinas' element={<RutinasPage />} />
          <Route path='/progreso' element={<AvancesUsuarioPage />} />
          <Route path='/comunidad' element={<Comunidad />} />
          <Route path='/bienestar' element={<BienestarPage />} />
          <Route path='/contacto' element={<Contacto />} />
          <Route path='/configuracion' element={<ConfiguracionPage />} />
           <Route path="/comparador" element={<ComparadorPage />} />
         
           <Route path='/avances' element={<AvancesUsuarioPage />} />
        </Route>
        {/* Ruta comodín */}
        <Route path='*' element={<div>404 | Página No Encontrada</div>} />
        
      </Routes>
    </BrowserRouter>
  );
}
export default Routing;