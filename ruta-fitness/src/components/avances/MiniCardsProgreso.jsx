import React from 'react';

const MiniCardsProgreso = ({ progresoData, historialData, logrosData, usuarioData }) => {
    
    const pesoActual = progresoData?.peso || usuarioData?.peso || 'N/A';
    const pesoDesdeInicio = progresoData?.diferencia_peso || 0; 

    const alturaMetros = usuarioData?.altura ? usuarioData.altura / 100 : null;
    const imcCalculado = pesoActual && alturaMetros
      ? (pesoActual / (alturaMetros * alturaMetros)).toFixed(1)
      : null;

    const imc = progresoData?.imc || imcCalculado || 'N/A';

    // Color según el valor del IMC
    let imcColor = 'text-gray-500';
    if (imcCalculado) {
        if (imcCalculado < 18.5) imcColor = 'text-blue-600';
        else if (imcCalculado < 25) imcColor = 'text-green-600';
        else if (imcCalculado < 30) imcColor = 'text-orange-600';
        else imcColor = 'text-red-600';
    }

    const diasActivos = historialData?.length || 0; 
    const logrosAlcanzados = logrosData?.length || 0;

    const sexo = usuarioData?.sexo || 'N/A';
    const edad = usuarioData?.edad || 'N/A';
    const altura = usuarioData?.altura || 'N/A';
    const nivelActividad = usuarioData?.nivel_actividad || 'N/A';
    const lugarEntrenamiento = usuarioData?.lugar_entrenamiento || 'N/A';

    const pesoCambioColor = pesoDesdeInicio < 0 ? 'text-green-600' : 
                            pesoDesdeInicio > 0 ? 'text-red-600' : 
                            'text-gray-500';

    const pesoCambioIcono = pesoDesdeInicio < 0 ? '⬇️' : 
                            pesoDesdeInicio > 0 ? '⬆️' : 
                            '➖';

    const pesoCambioTexto = `${pesoCambioIcono} ${Math.abs(pesoDesdeInicio)} kg desde inicio`;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> 
            
            {/* PESO ACTUAL */}
            <div className="bg-white rounded-xl shadow-md p-4 border-b-4 border-indigo-500 hover:shadow-lg transition duration-200">
                <h3 className="text-sm font-semibold text-gray-500 flex items-center mb-1">⚖️ Peso Actual</h3>
                <p className="text-3xl font-extrabold text-gray-800">{pesoActual} kg</p>
                <p className={`text-xs font-semibold mt-1 ${pesoCambioColor}`}>{pesoCambioTexto}</p>
            </div>

            {/* IMC */}
            <div className="bg-white rounded-xl shadow-md p-4 border-b-4 border-green-500 hover:shadow-lg transition duration-200">
                <h3 className="text-sm font-semibold text-gray-500 flex items-center mb-1">📏 IMC</h3>
                <p className={`text-3xl font-extrabold ${imcColor}`}>{imc}</p>
                <p className="text-xs text-gray-500 mt-1">Índice de masa corporal</p>
            </div>

            {/* DÍAS ACTIVOS */}
            <div className="bg-white rounded-xl shadow-md p-4 border-b-4 border-yellow-500 hover:shadow-lg transition duration-200">
                <h3 className="text-sm font-semibold text-gray-500 flex items-center mb-1">🏃 Días Activos</h3>
                <p className="text-3xl font-extrabold text-yellow-600">{diasActivos} días</p>
                <p className="text-xs text-gray-500 mt-1">Actividades registradas</p>
            </div>
            
            {/* LOGROS */}
            <div className="bg-white rounded-xl shadow-md p-4 border-b-4 border-purple-500 hover:shadow-lg transition duration-200">
                <h3 className="text-sm font-semibold text-gray-500 flex items-center mb-1">🏆 Logros</h3>
                <p className="text-3xl font-extrabold text-purple-600">{logrosAlcanzados}</p>
                <p className="text-xs text-gray-500 mt-1">Objetivos alcanzados</p>
            </div>

            {/* SEXO / EDAD */}
            <div className="bg-white rounded-xl shadow-md p-4 border-b-4 border-pink-500 hover:shadow-lg transition duration-200">
                <h3 className="text-sm font-semibold text-gray-500 flex items-center mb-1">👤 Sexo / Edad</h3>
                <p className="text-2xl font-bold">{sexo} / {edad} años</p>
            </div>

            {/* ALTURA */}
            <div className="bg-white rounded-xl shadow-md p-4 border-b-4 border-blue-500 hover:shadow-lg transition duration-200">
                <h3 className="text-sm font-semibold text-gray-500 flex items-center mb-1">📏 Altura</h3>
                <p className="text-2xl font-bold">{altura} cm</p>
            </div>

            {/* NIVEL DE ACTIVIDAD */}
            <div className="bg-white rounded-xl shadow-md p-4 border-b-4 border-orange-500 hover:shadow-lg transition duration-200">
                <h3 className="text-sm font-semibold text-gray-500 flex items-center mb-1">⚡ Nivel Actividad</h3>
                <p className="text-2xl font-bold">{nivelActividad}</p>
            </div>

            {/* LUGAR ENTRENAMIENTO */}
            <div className="bg-white rounded-xl shadow-md p-4 border-b-4 border-teal-500 hover:shadow-lg transition duration-200">
                <h3 className="text-sm font-semibold text-gray-500 flex items-center mb-1">🏋️ Lugar Entrenamiento</h3>
                <p className="text-2xl font-bold">{lugarEntrenamiento}</p>
            </div>

        </div>
    );
};

export default MiniCardsProgreso;

