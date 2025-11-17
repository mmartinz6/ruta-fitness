export default function InicioProblemaSolucion() {
  const soluciones = [
    "Orientación personalizada desde el primer momento",
    "Rutinas adaptadas a tu nivel y capacidades",
    "Información confiable sobre nutrición y bienestar",
    "Comunidad de apoyo y motivación constante",
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Columna izquierda - Problema */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              El Problema Que Resolvemos
            </h2>
            <p className="text-gray-600 mb-4">
              La falta de orientación, el miedo al fracaso y la desinformación son los principales
              obstáculos que impiden a las personas iniciar una vida más saludable.
            </p>
            <p className="text-gray-600 mb-4">
              Muchos principiantes se sienten abrumados por la cantidad de información en internet
              o intimidados por el ambiente de los gimnasios.
            </p>
            <p className="text-gray-600">
              En muchos casos, las rutinas no se adaptan a sus necesidades, generando frustración,
              lesiones o desmotivación.
            </p>
          </div>

          {/* Columna derecha - Solución */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Nuestra Solución
            </h3>
            <ul className="space-y-4">
              {soluciones.map((texto, index) => (
                <li key={index} className="flex gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 min-w-[1.5rem]">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <p className="text-gray-600">{texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
