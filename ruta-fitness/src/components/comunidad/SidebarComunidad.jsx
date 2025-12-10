import React from 'react';

function SidebarComunidad() {
  return (
    <div className="space-y-6">
      {/* Community Guidelines */}
      <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
        <h3 className="text-gray-900 mb-4">Normas de la Comunidad</h3>

        <ul className="space-y-3 text-gray-600">
          <li className="flex gap-2">
            <span className="text-green-600">•</span>
            <span>Sé respetuoso y amable</span>
          </li>

          <li className="flex gap-2">
            <span className="text-green-600">•</span>
            <span>Comparte conocimiento útil</span>
          </li>

          <li className="flex gap-2">
            <span className="text-green-600">•</span>
            <span>Evita spam y autopromoción</span>
          </li>

          <li className="flex gap-2">
            <span className="text-green-600">•</span>
            <span>Celebra los logros de otros</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SidebarComunidad;