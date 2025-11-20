import { Heart, BookOpen, Users, TrendingUp, Brain, Activity } from "lucide-react";

export default function InicioBeneficios() {
  const features = [
    {
      icon: Heart,
      title: "Rutinas Personalizadas",
      desc: "Recibe un plan de ejercicios adaptado a tu edad, peso, altura y nivel de condición física.",
    },
    {
      icon: BookOpen,
      title: "Educación Continua",
      desc: "Aprende sobre nutrición, bienestar y técnicas de ejercicio con contenido confiable.",
    },
    {
      icon: Users,
      title: "Comunidad Activa",
      desc: "Comparte experiencias, consejos y motivación con otros miembros en tu misma jornada.",
    },
    {
      icon: TrendingUp,
      title: "Seguimiento de Progreso",
      desc: "Registra tus avances con gráficas visuales y mantén la motivación al ver tus resultados.",
    },
    {
      icon: Brain,
      title: "Bienestar Integral",
      desc: "Cuida tanto tu cuerpo como tu mente con técnicas de relajación y manejo del estrés.",
    },
    {
      icon: Activity,
      title: "Videos Educativos",
      desc: "Aprende la técnica correcta con videos explicativos para cada ejercicio de tu rutina.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Por Qué Elegir Ruta Fitness?
          </h2>
          <p className="text-gray-600 text-lg">
            Una plataforma integral diseñada para tu éxito
          </p>
        </div>

        {/* Tarjetas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 border border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 transition-transform transform hover:scale-110">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
