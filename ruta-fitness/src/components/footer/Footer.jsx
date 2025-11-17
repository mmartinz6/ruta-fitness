import { Activity } from "lucide-react";

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Columna 1 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-green-500" />
              <span className="text-lg font-semibold text-white">Ruta Fitness</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Tu compañero en el camino hacia una vida más saludable.
            </p>
          </div>

          {/* Columna 2 */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explora</h4>
            <ul className="space-y-2">
              {[
                ["learn", "Aprende"],
                ["wellness", "Bienestar"],
                ["community", "Comunidad"],
                ["contact", "Contacto"],
              ].map(([section, label]) => (
                <li key={section}>
                  <button
                    onClick={() => onNavigate(section)}
                    className="text-gray-400 hover:text-green-500 transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h4 className="text-white font-semibold mb-4">Información</h4>
            <p className="text-gray-400 leading-relaxed">
              Esta plataforma está diseñada con fines educativos y de bienestar.
              Consulta a un profesional de la salud antes de iniciar cualquier programa de ejercicio.
            </p>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          © 2025 <span className="text-white">Ruta Fitness</span>. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
