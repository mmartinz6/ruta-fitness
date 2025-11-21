import React from 'react'
import Navbar from '../components/navbar/Navbar'
import HeroComunidad from '../components/comunidad/HeroComunidad'
import CrearPost from '../components/comunidad/CrearPost'
import ListaPost from '../components/comunidad/ListaPost'
import Footer from '../components/footer/Footer'

function Comunidad() {
  return (
    <div>
        <Navbar />
        <HeroComunidad />
        <CrearPost />
        <ListaPost /> 
        <Footer />
        
    </div>
  )
}

export default Comunidad