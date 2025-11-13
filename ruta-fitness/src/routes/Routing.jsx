import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "../pages/Inicio";
import Registro from "../pages/Registro";
import Login from "../pages/Login";


function Routing() {
  return (
      <Router>
        <Routes>
          <Route path='/inicio' element={<Inicio />} />
          <Route path='/registro' element={<Registro />} />
          <Route path='/login' element={<Login />} />

        </Routes>
      </Router>
  );
}

export default Routing







