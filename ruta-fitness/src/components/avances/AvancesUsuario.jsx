import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAvancesData, getUsuarioData, AUTH_LOGOUT_ERROR } from "../../services/rutinasService";
import HistorialActividades from "./HistorialActividades";
import LogrosUsuario from "./LogrosUsuario";
import EncabezadoAvances from "./EncabezadoAvances";
import MedidasCorporales from "./MedidasCorporales";
import MiniCardsProgreso from "./MiniCardsProgreso";

const performLogout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("usuarioActivo");
};

const AvancesUsuario = () => {
  const navigate = useNavigate();

  const usuarioActivo = useMemo(() => {
    const raw = localStorage.getItem("usuarioActivo");
    try {
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }, []);

  const userId = usuarioActivo?.perfil?.id ?? usuarioActivo?.id_user ?? null;

  console.log("soy el id",userId);
  

  const [progresoData, setProgresoData] = useState({});
  const [medicionesData, setMedicionesData] = useState([]);
  const [historialData, setHistorialData] = useState([]);
  const [logrosData, setLogrosData] = useState([]);
  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const data = await getAvancesData(userId);
      setProgresoData(data.progresoResumen);
      setMedicionesData(data.medicionesData);
      setHistorialData(data.historialData);
      setLogrosData(data.logrosData);

      const userData = await getUsuarioData(userId);
      setUsuarioData(userData);
    } catch (err) {
      if (err.message === AUTH_LOGOUT_ERROR) {
        performLogout();
        navigate("/login");
        return;
      }
      setError("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [userId]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <EncabezadoAvances nombreUsuario={usuarioActivo?.nombre} />

      <MiniCardsProgreso
        progresoData={progresoData}
        historialData={historialData}
        logrosData={logrosData}
        usuarioData={usuarioData}
      />

      <LogrosUsuario logros={logrosData} />
      <HistorialActividades historial={historialData} />
      <MedidasCorporales onMedidaRegistrada={loadAllData} />
    </div>
  );
};

export default AvancesUsuario;
