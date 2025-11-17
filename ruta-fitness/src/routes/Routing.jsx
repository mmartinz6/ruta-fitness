import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "../pages/Inicio";
import Registro from "../pages/Registro";
import Login from "../pages/Login";
import Contacto from "../pages/Contacto";


function Routing() {
  return (
      <Router>
        <Routes>
          <Route path='/inicio' element={<Inicio />} />
          <Route path='/registro' element={<Registro />} />
          <Route path='/login' element={<Login />} />
          <Route path='/contacto' element={<Contacto />} />

        </Routes>
      </Router>
  );
}

export default Routing







