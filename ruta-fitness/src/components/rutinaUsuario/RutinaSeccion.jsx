import React, { useEffect, useState, useRef } from "react";
import llamadorutina from "../../services/ServicesUsuarioRutina";

function RutinaSeccion() {
  const [rutina, setRutina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modoRutina, setModoRutina] = useState(false);
  const [ejercicioActualIndex, setEjercicioActualIndex] = useState(0);
  const [temporizador, setTemporizador] = useState(0);
  const [enDescanso, setEnDescanso] = useState(false);

  const audioRef = useRef(null);

  /* ===================== CARGA ===================== */
  useEffect(() => {
    cargarRutina();
  }, []);

  /* ===================== TEMPORIZADOR ===================== */
  useEffect(() => {
    if (!enDescanso || temporizador <= 0) return;

    const timer = setTimeout(() => {
      setTemporizador(prev => {
        if (prev <= 1) {
          audioRef.current?.play();
          setEnDescanso(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [temporizador, enDescanso]);

  /* ===================== FUNCIONES ===================== */
  const cargarRutina = async () => {
    try {
      setLoading(true);
      const data = await llamadorutina.obtenerMisRutinas();
      const activa = Array.isArray(data)
        ? data.find(r => r.estado === "activa")
        : null;

      setRutina(activa || null);
    } catch {
      setError("No se pudo cargar la rutina.");
    } finally {
      setLoading(false);
    }
  };

  const generarRutina = async () => {
    if (rutina) {
      setError("Ya tienes una rutina activa.");
      return;
    }
    try {
      setLoading(true);
      await llamadorutina.generarRutina();
      await cargarRutina();
    } catch {
      setError("No se pudo generar la rutina.");
    } finally {
      setLoading(false);
    }
  };

  const iniciarRutina = () => {
    setModoRutina(true);
    setEjercicioActualIndex(0);
  };

  /* ===================== COMPLETAR EJERCICIO (CORREGIDO) ===================== */
  const completarSerie = async () => {
  if (enDescanso) return;

  const ejercicios = rutina.rutina.ejercicios_rutina;
  const ejercicio = ejercicios[ejercicioActualIndex];

  try {
    const data = await llamadorutina.completarSerie(
      ejercicio.ejercicio.id
    );

    if (data?.mensaje?.fin_rutina || ejercicioActualIndex === ejercicios.length - 1) {
      alert("¡Rutina del día completada!");
      setModoRutina(false);
      await cargarRutina();
      return;
    }

    setEjercicioActualIndex(prev => prev + 1);
    setEnDescanso(true);
    setTemporizador(Number(ejercicio.descanso) || 15);

  } catch {
    setError("Error al completar ejercicio.");
  }
};



  const getEmbedUrl = (url) => {
    if (!url) return "";
    const id =
      url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  };

  /* ===================== RENDER ===================== */
  if (loading) return <p className="p-6">Cargando rutina...</p>;

  if (!rutina)
    return (
      <div className="p-8 text-center">
        <p>No tienes una rutina activa.</p>
        <button
          onClick={generarRutina}
          className="mt-4 bg-green-600 text-white px-6 py-3 rounded"
        >
          Generar rutina automática
        </button>
      </div>
    );

  if (modoRutina) {
    const ejercicios = rutina.rutina.ejercicios_rutina;
    const ejercicio = ejercicios[ejercicioActualIndex];
    const embedUrl = getEmbedUrl(ejercicio.ejercicio.video_url);

    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        {enDescanso ? (
          <div className="text-center animate-pulse mt-20">
            <p className="text-red-600 text-xl font-bold">DESCANSO</p>
            <p className="text-5xl font-bold text-red-700">
              {temporizador}s
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-1">
              {ejercicio.ejercicio.nombre}
            </h2>

            <p className="text-gray-600 mb-2">
              Ejercicio {ejercicioActualIndex + 1} de {ejercicios.length}
            </p>

            <p className="mb-4">
              Repeticiones: <strong>{ejercicio.repeticiones}</strong>
            </p>

            {embedUrl && (
              <iframe
                className="mb-4"
                width="100%"
                height="315"
                src={embedUrl}
                title="Video ejercicio"
                allowFullScreen
              />
            )}

            <button
              onClick={completarSerie}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold"
            >
              Completar ejercicio
            </button>
          </>
        )}

        <audio ref={audioRef} src="/audio/fin_temporizador.mp3" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {rutina.rutina.nombre}
      </h1>

      <button
        onClick={iniciarRutina}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded"
      >
        Iniciar rutina
      </button>

      {rutina.rutina.ejercicios_rutina.map((re, i) => (
        <div key={i} className="mb-4 p-4 bg-white rounded shadow">
          <h4 className="font-semibold">
            {i + 1}. {re.ejercicio.nombre}
          </h4>
          <p className="text-sm text-gray-600">
            {re.ejercicio.descripcion}
          </p>
        </div>
      ))}
    </div>
  );
}

export default RutinaSeccion;
