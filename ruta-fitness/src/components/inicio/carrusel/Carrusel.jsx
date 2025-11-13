import React, { useState, useEffect } from "react";

const heroSlides = [
  {
    title: "Tu Camino Hacia una Vida Más Saludable",
    description:
      "Ruta Fitness te acompaña en cada paso con rutinas personalizadas, consejos de nutrición y una comunidad que te motiva.",
    image:
      "https://images.unsplash.com/photo-1573858129038-6f98c3cb2ac7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    cta: "Comenzar Ahora",
  },
  {
    title: "Ejercicio Diseñado para Principiantes",
    description:
      "No importa tu nivel actual, tenemos el plan perfecto para ti. Empieza desde cero con confianza.",
    image:
      "https://images.unsplash.com/photo-1628829706300-d1ed475bfc9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    cta: "Explorar Rutinas",
  },
  {
    title: "Transforma Tu Cuerpo y Mente",
    description:
      "Más que ejercicio: aprende sobre nutrición, bienestar y crea hábitos que duran para siempre.",
    image:
      "https://images.unsplash.com/photo-1597376833295-40a54d5e69fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    cta: "Únete Gratis",
  },
];

function Carrusel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambio automático cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Funciones manuales
  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  const nextSlide = () =>
    setCurrentIndex((prev) =>
      prev === heroSlides.length - 1 ? 0 : prev + 1
    );

  const slide = heroSlides[currentIndex];

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${slide.image})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {slide.title}
        </h1>
        <p className="text-gray-200 max-w-2xl text-lg md:text-xl mb-6">
          {slide.description}
        </p>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition">
          {slide.cta}
        </button>
      </div>

      {/* Botón Izquierdo */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-60 text-white text-3xl rounded-full p-2 transition"
      >
        ❮
      </button>

      {/* Botón Derecho */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-60 text-white text-3xl rounded-full p-2 transition"
      >
        ❯
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              index === currentIndex
                ? "bg-green-500"
                : "bg-gray-300 hover:bg-green-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carrusel;
