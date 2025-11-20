import React from 'react'

import Navbar from '../components/navbar/Navbar'
import Carrusel from '../components/inicio/carrusel/Carrusel'
import InicioBeneficios from '../components/inicio/inicioBeneficios/InicioBeneficios'
import InicioProblemaSolucion from '../components/inicio/inicioProblemaSolucion/InicioProblemaSolucion'
import Footer from '../components/footer/Footer'

function Inicio() {
  return (
    <div>
        <Navbar />
        <Carrusel />
        <InicioBeneficios />
        <InicioProblemaSolucion />
        <Footer />
    </div>
  )
}

export default Inicio