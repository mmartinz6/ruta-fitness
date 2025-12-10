import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const heroSlides = [
  {
    title: "Tu Camino Hacia una Vida Más Saludable",
    description:
      "Ruta Fitness te acompaña con rutinas personalizadas, consejos de nutrición y una comunidad que te motiva.",
    image:
      "https://hiraoka.com.pe/media/mageplaza/blog/post/e/j/ejercicio-casa-aplicaciones.jpg",
    cta: "Comenzar Ahora",
  },
  {
    title: "Ejercicio Diseñado para Principiantes",
    description:
      "No importa tu nivel actual, tenemos el plan perfecto para ti. Empieza desde cero con confianza.",
    image:
      "https://www.prettyopinionated.com/wp-content/uploads/2020/09/Workouts-You-Can-Do-Outside-Alone-jump-rope.jpg",
    cta: "Explorar Rutinas",
  },
  {
    title: "Transforma Tu Cuerpo y Mente",
    description:
      "Más que ejercicio: nutrición, bienestar y hábitos sostenibles para toda la vida.",
    image:
      "https://sunnyhealthfitness.com/cdn/shop/articles/outdoor-workouts-01.jpg?v=1594403737",
    cta: "Únete Gratis",
  },
];

function Carrusel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center text-center h-full px-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {slide.title}
        </h1>

        <p className="text-gray-200 max-w-2xl text-lg md:text-xl mb-6">
          {slide.description}
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {slide.cta}
        </button>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2
                   bg-black/20 hover:bg-black/40 
                   text-white rounded-full p-3 text-2xl
                   transition z-30 cursor-pointer"
      >
        ←
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2
                   bg-black/20 hover:bg-black/40 
                   text-white rounded-full p-3 text-2xl
                   transition z-30 cursor-pointer"
      >
        →
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {heroSlides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition 
              ${index === currentIndex ? "bg-green-500" : "bg-gray-300 hover:bg-green-300"}
            `}
          />
        ))}
      </div>
    </div>
  );
}

export default Carrusel;