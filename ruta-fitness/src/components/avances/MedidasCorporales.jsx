import React, { useState } from 'react';
import api from '../../api/axios'; // Axios con token

const MedidasCorporales = ({ onMedidaRegistrada }) => {
  const [formData, setFormData] = useState({
    peso: '', hombros: '', espalda: '', abdomen: '', gluteos: '',
    pierna1: '', pierna2: '', brazo1: '', brazo2: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.replace(',', '.') }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.peso || parseFloat(formData.peso) <= 0) {
      setMessage('El campo Peso es obligatorio y debe ser mayor que cero.');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage('');
    setIsError(false);

    // Preparar datos según modelo
    const dataToSend = {
      peso_actual: parseFloat(formData.peso),
      hombros: formData.hombros ? parseFloat(formData.hombros) : null,
      espalda: formData.espalda ? parseFloat(formData.espalda) : null,
      abdomen: formData.abdomen ? parseFloat(formData.abdomen) : null,
      gluteos: formData.gluteos ? parseFloat(formData.gluteos) : null,
      pierna1: formData.pierna1 ? parseFloat(formData.pierna1) : null,
      pierna2: formData.pierna2 ? parseFloat(formData.pierna2) : null,
      brazo1: formData.brazo1 ? parseFloat(formData.brazo1) : null,
      brazo2: formData.brazo2 ? parseFloat(formData.brazo2) : null,
    };

    try {
      await api.post('/progreso-usuario/', dataToSend);

      setMessage('✅ ¡Medición registrada con éxito!');
      setIsError(false);
      setFormData({
        peso: '', hombros: '', espalda: '', abdomen: '', gluteos: '',
        pierna1: '', pierna2: '', brazo1: '', brazo2: ''
      });

      if (onMedidaRegistrada) onMedidaRegistrada();

    } catch (error) {
      console.error('Error al registrar medición:', error.response || error);
      const detail = error.response?.data?.detail || 'Verifique los datos o la conexión.';
      setMessage(`❌ Error: No se pudo registrar la medición. ${detail}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
        Actualizar Medidas Corporales
      </h2>

      {message && (
        <div className={`p-3 mb-4 rounded-lg text-sm ${isError 
          ? 'bg-red-100 text-red-700 border border-red-300' 
          : 'bg-green-100 text-green-700 border border-green-300'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso Actual (kg) <span className="text-red-500">*</span>
          </label>
          <input type="number" name="peso" value={formData.peso} onChange={handleChange} step="0.1" placeholder="Ej: 75.5" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Hombros (cm)</label>
          <input type="number" name="hombros" value={formData.hombros} onChange={handleChange} step="0.1" placeholder="Ej: 100" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Espalda (cm)</label>
          <input type="number" name="espalda" value={formData.espalda} onChange={handleChange} step="0.1" placeholder="Ej: 95" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Abdomen (cm)</label>
          <input type="number" name="abdomen" value={formData.abdomen} onChange={handleChange} step="0.1" placeholder="Ej: 80" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Glúteos (cm)</label>
          <input type="number" name="gluteos" value={formData.gluteos} onChange={handleChange} step="0.1" placeholder="Ej: 90" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pierna 1 (cm)</label>
          <input type="number" name="pierna1" value={formData.pierna1} onChange={handleChange} step="0.1" placeholder="Ej: 55" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pierna 2 (cm)</label>
          <input type="number" name="pierna2" value={formData.pierna2} onChange={handleChange} step="0.1" placeholder="Ej: 55" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Brazo 1 (cm)</label>
          <input type="number" name="brazo1" value={formData.brazo1} onChange={handleChange} step="0.1" placeholder="Ej: 35" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Brazo 2 (cm)</label>
          <input type="number" name="brazo2" value={formData.brazo2} onChange={handleChange} step="0.1" placeholder="Ej: 35" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="md:col-span-4 flex justify-end mt-2">
          <button type="submit" disabled={loading} className={`py-2 px-4 rounded-lg font-semibold transition duration-200 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'}`}>
            {loading ? 'Registrando...' : 'Guardar Medición'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedidasCorporales;
