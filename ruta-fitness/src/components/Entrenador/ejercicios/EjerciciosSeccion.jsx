import { useState } from "react";
import EjerciciosList from "./EjerciciosList";
import EjercicioForm from "./EjercicioForm";

function EjerciciosSeccion() {
  const [ejercicioEditar, setEjercicioEditar] = useState(null);
  const [recargar, setRecargar] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false); // ← NUEVO

  const onGuardado = () => {
    setEjercicioEditar(null);
    setRecargar(prev => !prev);
    setMostrarModal(false); // ← NUEVO
  };

  const abrirEditar = (ejercicio) => { // ← NUEVO
    setEjercicioEditar(ejercicio);
    setMostrarModal(true);
  };

  const cerrarModal = () => { // ← NUEVO
    setEjercicioEditar(null);
    setMostrarModal(false);
  };

  return (
    <div className="space-y-6">
      {/* FORMULARIO NORMAL (CREAR) */}
      <EjercicioForm
        ejercicio={null}
        onGuardado={onGuardado}
      />

      <EjerciciosList
        onEditar={abrirEditar} // ← AJUSTE
        recargar={recargar}
      />

      {/* MODAL DE EDICIÓN */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded shadow relative">
            <button
              onClick={cerrarModal}
              className="absolute top-2 right-2 text-gray-600"
            >
              ✕
            </button>

            <EjercicioForm
              ejercicio={ejercicioEditar}
              onGuardado={onGuardado}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EjerciciosSeccion;
