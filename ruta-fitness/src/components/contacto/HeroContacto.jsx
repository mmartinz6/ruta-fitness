import React from "react";
import heroImg from "./img/contacto.jpg";

function HeroContacto() {
  return (
    <section className="relative w-full h-[50vh] bg-gray-50">
      <img
        src={heroImg}
        alt="Contacto"
        className="w-full h-full object-cover brightness-75"
      />

      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">
          CONTACTO
        </h1>
        <p className="text-white text-lg md:text-2xl max-w-xl">
          ¿Tienes dudas o sugerencias? Estamos aquí para responderte rápidamente.
        </p>
      </div>
    </section>
  );
}

export default HeroContacto;
