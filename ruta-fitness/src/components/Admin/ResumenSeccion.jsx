import React, { useEffect, useState } from "react";
import { Users, Dumbbell, Shield, Activity } from "lucide-react";
import resumenService from "../../services/ServicesResumenAdmin";


function ResumenSeccion({ setActivePage }) {
  const [data, setData] = useState({});

  useEffect(() => {
    resumenService.getResumen()
      .then(res => setData(res))
      .catch(err => console.error(err));
  }, []);

  // ⬇ Aquí se inyectan los valores reales desde la API (ya no hay números fijos)
  const stats = [
    { label: "Usuarios Registrados", value: data?.usuarios || "—", icon: Users, color: "text-green-600" },
    { label: "Rutinas", value: data?.rutinas || "—", icon: Dumbbell, color: "text-blue-600" },
    { label: "Entrenadores", value: data?.entrenadores || "—", icon: Shield, color: "text-purple-600" },
    { label: "Sesiones Activas", value: data?.sesiones || "—", icon: Activity, color: "text-yellow-600" },
  ];

  return (
    <div className="p-6 bg-[#f6f6f6] min-h-screen">

      {/* Título */}
      <div className="mb-6">
        <h2 className="text-gray-800 font-semibold text-xl mb-1">Resumen General</h2>
        <p className="text-gray-500 text-sm">Estado actual del sistema</p>
      </div>

      {/* Tarjetas con métricas */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">
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
                  <p className="text-gray-700 text-lg font-semibold">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Acciones */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-800 font-semibold mb-4">Acciones rápidas</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setActivePage("users")}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 flex flex-col gap-2 items-center transition"
          >
            <Users className="w-6 h-6 text-green-600" />
            <span>Usuarios</span>
          </button>

          <button
            onClick={() => setActivePage("routines")}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 flex flex-col gap-2 items-center transition"
          >
            <Dumbbell className="w-6 h-6 text-blue-600" />
            <span>Rutinas</span>
          </button>

          <button
            onClick={() => setActivePage("trainers")}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 flex flex-col gap-2 items-center transition"
          >
            <Shield className="w-6 h-6 text-purple-600" />
            <span>Entrenadores</span>
          </button>
        </div>
      </div>

    </div>
  );
}

export default ResumenSeccion;
