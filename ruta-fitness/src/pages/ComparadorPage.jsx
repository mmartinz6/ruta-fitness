// pages/ComparadorPage.jsx
import ComparadorProgreso from "../components/metrica/ComparadorProgreso";

const ComparadorPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Comparador de Progreso</h1>
      <ComparadorProgreso />
    </div>
  );
};

export default ComparadorPage;