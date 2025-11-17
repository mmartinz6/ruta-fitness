import React from 'react'

import Navbar from '../components/navbar/Navbar'
import HeroContacto from '../components/contacto/HeroContacto'
import ContactoSeccion from '../components/contacto/ContactoSeccion'
import Footer from '../components/footer/Footer'

function Contacto() {
  return (
    <div>
        <Navbar />
        <HeroContacto />
        <ContactoSeccion />
        <Footer />
    </div>
  )
}

export default Contacto