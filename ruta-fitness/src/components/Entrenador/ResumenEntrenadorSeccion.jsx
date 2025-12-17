import React, { useEffect, useState } from "react";
import { Dumbbell, ListChecks, MessageCircle } from "lucide-react";
import loginService from "../../services/servicesLogin";

function ResumenEntrenadorSeccion({ setActivePage }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = loginService.getUsuarioActivo();
    setUsuario(user);
  }, []);

  const stats = [
    { label: "Rutinas", value: "—", icon: Dumbbell, color: "text-blue-600" },
    { label: "Ejercicios", value: "—", icon: ListChecks, color: "text-green-600" },
    { label: "Chat", value: "—", icon: MessageCircle, color: "text-purple-600" },
  ];

  return (
    <div className="p-6 bg-[#f6f6f6] min-h-screen">

      {/* Bienvenida */}
      {usuario && (
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Bienvenido/a, {usuario.nombre || usuario.first_name}
          </h1>
          <p className="text-gray-500 text-sm">
            Panel de control del entrenador
          </p>
        </div>
      )}

      {/* Tarjetas resumen */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-gray-700 text-lg font-semibold">
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-800 font-semibold mb-4">
          Acciones rápidas
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setActivePage("routines")}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 flex flex-col gap-2 items-center transition"
          >
            <Dumbbell className="w-6 h-6 text-blue-600" />
            <span>Rutinas</span>
          </button>

          <button
            onClick={() => setActivePage("exercises")}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 flex flex-col gap-2 items-center transition"
          >
            <ListChecks className="w-6 h-6 text-green-600" />
            <span>Ejercicios</span>
          </button>

          <button
            onClick={() => setActivePage("chat")}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 flex flex-col gap-2 items-center transition"
          >
            <MessageCircle className="w-6 h-6 text-purple-600" />
            <span>Chat</span>
          </button>
        </div>
      </div>

    </div>
  );
}

export default ResumenEntrenadorSeccion;
