import React from "react";
/* import heroImg from "./img/contacto.jpg"; */

function HeroComunidad() {
  return (
    <section className="relative w-full h-[50vh] bg-gray-50">
      <img
        /* src={heroImg} */
        alt="Contacto"
        className="w-full h-full object-cover brightness-75"
      />

      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">
          COMUNIDAD
        </h1>
        <p className="text-white text-lg md:text-2xl max-w-xl">
        Comparte tu progreso, consejos y motivación con otros miembros
        </p>
      </div>
    </section>
  );
}

export default HeroComunidad;