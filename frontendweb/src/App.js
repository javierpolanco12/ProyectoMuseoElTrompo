import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import Login from "./components/Login";
import Admin from "./components/AdminPage/inicioA";
import Usuario from "./components/UsuarioPage/inicioU";
import MenuAdmin from "./components/menus/MenuAdmin";
import MenuUsuario from "./components/menus/MenuUsuario"
import RegistrarInteractivo  from "./components/AdminPage/RegistroInteractivo";
import ListaInteractivos from "./components/AdminPage/ListaInteractivos";
import ProgrmarMantenimiento from "./components/AdminPage/ProgramarMantenimiento"
import PerfilA from "./components/AdminPage/PerfilA";
import ReportesA from "./components/AdminPage/ReportesA";
import CalendarioAdmin from "./components/AdminPage/CalendarioAdmin";
import RegistroUsuarios from "./components/AdminPage/RegistroUsuarios"

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/InicioAdmin" element={<Admin/>} />
        <Route path="/InicioUsuario" element={<Usuario />} />
        <Route path="/MenuAdmin" element={<MenuAdmin/>} />
        <Route path="/MenuUsuario" element={<MenuUsuario />} />
        <Route path="/Registro-de-Interactivo" element={<RegistrarInteractivo />} />
        <Route path="/Lista-de-interactivos" element={<ListaInteractivos/>} />
        <Route path="/Programar-Mantenimiento" element={<ProgrmarMantenimiento/>} />
        <Route path="/Perfil-Administrador" element={<PerfilA/>}/>
        <Route path="/Reportes-Administrador" element={<ReportesA/>}/>
        <Route path="/Calendario-Admin" element={<CalendarioAdmin/>}/>
        <Route path="/Registro-de-Usuarios" element={<RegistroUsuarios/>}/>
        

      </Routes>
    </Router>
  );
}

export default App;
