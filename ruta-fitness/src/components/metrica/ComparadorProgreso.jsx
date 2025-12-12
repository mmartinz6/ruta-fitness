import React, { useState } from 'react';
import { Play, Plus } from 'lucide-react';
import { subirFotoCloudinary, compararFotosIA } from "../../services/fotosService";

const DEFAULT_BEFORE = 'image_874e73.png';
const DEFAULT_AFTER = 'image_8670bd.png';

const ImageComparisonViewer = () => {
  const [beforeImg, setBeforeImg] = useState(DEFAULT_BEFORE);
  const [afterImg, setAfterImg] = useState(DEFAULT_AFTER);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleImageUpload = async (e, setImage) => {
    const file = e.target.files[0];
    if (!file) return;

    const urlCloud = await subirFotoCloudinary(file);
    if (urlCloud) setImage(urlCloud);
  };

  const handleAnalizar = async () => {
    setResultado({ loading: true });

    try {
      const data = await compararFotosIA(beforeImg, afterImg);

      if (data.error) {
        setResultado({ error: data.details || "No se pudo conectar con la API" });
      } else {
        const r = data.resultado;
        setResultado({
          analisis: r.analisis,
          diferencia_media: r.diferencia_media.toFixed(2),
          nota: r.nota,
        });
      }
    } catch (error) {
      setResultado({ error: "Error inesperado: " + error.message });
    }
  };

  const Card = ({ title, img, setImg }) => (
    <div className="relative flex flex-col items-center bg-white p-4 rounded-xl shadow-lg h-full">
      <h4 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-200 pb-2 w-full text-center">
        {title}
      </h4>

      <img
        src={img}
        alt={title}
        className="w-full object-contain rounded-lg shadow-md"
      />

      <label className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg cursor-pointer transition flex items-center justify-center">
        <Plus className="w-6 h-6" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e, setImg)}
        />
      </label>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
        📈 Comparación de Progreso Visual
      </h2>

      {!analysisStarted && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setAnalysisStarted(true)}
            className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xl font-semibold shadow-xl hover:bg-indigo-700 transform hover:scale-105 transition"
          >
            <Play className="w-7 h-7" />
            Iniciar Comparación
          </button>
        </div>
      )}

      {analysisStarted && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mt-10">
            <Card title="ANTES" img={beforeImg} setImg={setBeforeImg} />
            <Card title="DESPUÉS" img={afterImg} setImg={setAfterImg} />
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={handleAnalizar}
              className="px-8 py-4 bg-green-600 text-white rounded-2xl text-xl font-semibold shadow-lg hover:bg-green-700 transform hover:scale-105 transition"
            >
              Analizar con IA
            </button>
          </div>

          {/* Resultado en tarjetas grandes y en negrita */}
          {resultado && (
            <div className="mt-10 max-w-3xl mx-auto grid grid-cols-1 gap-6">
              {resultado.loading && (
                <div className="p-6 bg-yellow-100 rounded-xl text-center font-bold text-xl">
                  Analizando...
                </div>
              )}
              {resultado.error && (
                <div className="p-6 bg-red-100 rounded-xl text-center font-bold text-xl text-red-700">
                  {resultado.error}
                </div>
              )}
              {resultado.analisis && (
                <>
                  <div className="p-6 bg-blue-100 rounded-xl font-bold text-2xl">
                    Análisis: {resultado.analisis}
                  </div>
                  <div className="p-6 bg-green-100 rounded-xl font-bold text-2xl">
                    Diferencia media: {resultado.diferencia_media}
                  </div>
                  <div className="p-6 bg-purple-100 rounded-xl font-bold text-2xl">
                    Nota: {resultado.nota}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageComparisonViewer;