import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import Login from "./components/Login";
import Admin from "./components/AdminPage/inicioA";
import Usuario from "./components/UsuarioPage/inicioU";
import MenuAdmin from "./components/menus/MenuAdmin";
import MenuUsuario from "./components/menus/MenuUsuario";
import RegistrarInteractivo  from "./components/AdminPage/RegistroInteractivo";
import SalasMuseo from "./components/AdminPage/SalasMuseo";
import ProgrmarMantenimiento from "./components/AdminPage/ProgramarMantenimiento";
import PerfilA from "./components/AdminPage/PerfilA";
import ReportesA from "./components/AdminPage/ReportesA";
import CalendarioAdmin from "./components/AdminPage/CalendarioAdmin";
import Usuarios from "./components/AdminPage/Usuarios";
import Integra from "./components/Salas/Integra";
import Explica from "./components/Salas/Explica";
import Experimenta from "./components/Salas/Experimenta";
import Genera from  "./components/Salas/Genera";
import Educa from  "./components/Salas/Educa";
import Valora from "./components/Salas/Valora";
import SalaUsosMultiples from "./components/Salas/SalaUsosMultiples";
import SalaDeProyeccion from "./components/Salas/SalaProyeccion";
import ProyectoresIntegra from "./components/Proyectores/ProyectoresIntegra"


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
        <Route path="/Salas-del-Museo" element={<SalasMuseo/>} />
        <Route path="/Programar-Mantenimiento" element={<ProgrmarMantenimiento/>} />
        <Route path="/Perfil-Administrador" element={<PerfilA/>}/>
        <Route path="/Reportes-Administrador" element={<ReportesA/>}/>
        <Route path="/Calendario-Admin" element={<CalendarioAdmin/>}/>
        <Route path="/Usuarios" element={<Usuarios/>}/>
        <Route path="/Sala-Integra" element={<Integra/>}/>
        <Route path="/Sala-Explica" element={<Explica/>}/>
        <Route path="/Sala-Experimenta" element={<Experimenta/>}/>
        <Route path="/Sala-Genera" element={<Genera/>}/>
        <Route path="/Sala-Educa" element={<Educa/>}/>
        <Route path="/Sala-Valora" element={<Valora/>}/>
        <Route path="/Sala-de-Usos-Mltiples" element={<SalaUsosMultiples/>}/>
        <Route path="/Sala-De-Proyeccin" element={<SalaDeProyeccion/>}/>
         <Route path="/ProyectoresIntegra" element={<ProyectoresIntegra/>}/>



      </Routes>
    </Router>
  );
}

export default App;
