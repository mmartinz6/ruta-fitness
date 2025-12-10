import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout con sidebar (solo para rutas privadas)
import MainLayout from '../components/layout/MainLayout';

// Páginas públicas
import Inicio from "../pages/Inicio";
import Comunidad from "../pages/Comunidad";
import Contacto from "../pages/Contacto";
import BienestarPage from "../pages/Bienestar";
import Login from '../pages/Login';
import Registro from '../pages/Registro';

// Páginas privadas
import DashboardPage from '../pages/DashboardPage';
import DashboardAdmin from '../pages/DashboardAdmin';
import DashboardEntrenador from '../pages/DashboardEntrenador';
import PrivateRoute from "./PrivateRoute";

// Simulaciones / placeholders
const RutinasPage = () => <div className="p-8 text-2xl font-bold text-gray-700">Página de Rutinas</div>;
const ProgresoPage = () => <div className="p-8 text-2xl font-bold text-gray-700">Página de Progreso</div>;
const ConfiguracionPage = () => <div className="p-8 text-2xl font-bold text-gray-700">Página de Configuración</div>;

function Routing() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===========================
             PÁGINAS PÚBLICAS SIN LAYOUT
           =========================== */}
        <Route path="/" element={<Inicio />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/comunidad" element={<Comunidad />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/bienestar" element={<BienestarPage />} />

        <Route path="/dashboardadmin" element={<DashboardAdmin />} />
        <Route path="/dashboardentrenador" element={<DashboardEntrenador />} />


        {/* Login y Registro también sin sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />


        {/* ===========================
             PÁGINAS PRIVADAS CON LAYOUT
           =========================== */}
        <Route path="/dashboard" element={<PrivateRoute><MainLayout><DashboardPage /></MainLayout></PrivateRoute>}/>
        <Route path="/rutinas" element={<PrivateRoute><MainLayout><RutinasPage /></MainLayout></PrivateRoute>}/>
        <Route path="/progreso" element={<PrivateRoute><MainLayout><ProgresoPage /></MainLayout></PrivateRoute>}/>
        <Route path="/configuracion" element={<PrivateRoute><MainLayout><ConfiguracionPage /></MainLayout></PrivateRoute>}/>

        {/* 404 ERROR */}
        <Route path="*" element={<div>404 | Página No Encontrada</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default Routing;