import React, { useState } from "react";
import { MessageCircle, Mail, Instagram, Facebook } from "lucide-react";

function ContactoSeccion() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSend = () => {
    console.log("Datos a enviar:", formData);
    alert("Mensaje enviado!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2">
          <div className="p-8 border-gray-200 shadow-sm bg-white rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-gray-900 text-xl font-semibold">Envíanos un Mensaje</h2>
                <p className="text-gray-600 text-sm">Responderemos en menos de 24 horas</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700">Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="mt-2 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Correo Electrónico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="mt-2 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700">Asunto</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="¿En qué podemos ayudarte?"
                  className="mt-2 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-gray-700">Mensaje</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Escribe tu mensaje aquí..."
                  className="mt-2 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={6}
                />
              </div>

              <button
                onClick={handleSend}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                <Mail className="w-4 h-4" /> Enviar Mensaje
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-6 border-gray-200 shadow-sm bg-white rounded-lg">
            <h3 className="text-gray-900 text-lg font-semibold mb-4">Síguenos en Redes</h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <Instagram className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Instagram</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <Facebook className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Facebook</span>
              </a>
            </div>
          </div>

          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-gray-900 text-lg font-semibold mb-4">Horario de Atención</h3>
            <div className="space-y-2 text-gray-600">
              <p>Lunes a Viernes: 9:00 - 18:00</p>
              <p>Sábados: 10:00 - 14:00</p>
              <p>Domingos: Cerrado</p>
            </div>
          </div>

          <div className="p-6 border-gray-200 shadow-sm bg-white rounded-lg">
            <h4 className="text-gray-900 mb-2">Nota Importante</h4>
            <p className="text-gray-600">
              Esta plataforma es un complemento educativo. Para casos médicos o lesiones, consulta siempre con un profesional de la salud.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactoSeccion;
