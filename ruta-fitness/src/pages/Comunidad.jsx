import React from 'react';
import Navbar from '../components/navbar/Navbar';
import HeroComunidad from '../components/comunidad/HeroComunidad';
import CrearPost from '../components/comunidad/CrearPost';
import ListaPost from '../components/comunidad/ListaPost';
import SidebarComunidad from '../components/comunidad/SidebarComunidad';
import Footer from '../components/footer/Footer';

function Comunidad() {
  return (
    <div>
      <Navbar />
      <HeroComunidad />

      {/* Layout principal */}
      <div className="flex gap-6 max-w-7xl mx-auto px-4 py-10">

        {/* Columna izquierda */}
        <div className="flex-1 space-y-6">
          <CrearPost />
          <ListaPost />
        </div>

        {/* Sidebar derecha fijo */}
        <div className="w-80 sticky top-24 h-fit">
          <SidebarComunidad />
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Comunidad;