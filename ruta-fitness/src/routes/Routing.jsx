import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registro from "../pages/Registro";


function Routing() {
  return (
      <Router>
        <Routes>
          <Route path='/Registro' element={<Registro />} />
          {/*  <Route path='/FormLogin' element={<FormLoginContainer />} /> */}

        </Routes>
      </Router>
  );
}

export default Routing







