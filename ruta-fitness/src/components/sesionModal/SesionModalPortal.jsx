import React from "react";

export default function SesionModalPortal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg w-96 text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Sesión por Expirar
        </h3>
        <p className="text-gray-600 mb-6">
          Su sesión está por expirar. ¿Desea continuar?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
