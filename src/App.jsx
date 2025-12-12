// importaciones de react
import './index.css';
import { Routes, Route } from 'react-router-dom';

// importaciones generales 
import Login from './modules/core/Login/components/Login'
import CambiarClave from './modules/core/Login/components/CambiarClave';
import Perfil from './modules/usuarios/components/Perfil';
import ProtectedRoute from './modules/core/ProtectedRoute/components/ProtectedRoute';
import Grupos from './modules/grupos/components/Grupos';
import TienePermiso from './modules/core/TienePermiso/components/TienePermiso';
import Usuarios from './modules/usuarios/components/Usuarios';
import Periodos from './modules/periodos/components/Periodos';
import Layout from './modules/core/Layout/components/Layout';
import Asignaturas from './modules/asignaturas/components/Asignaturas';
import Inscripciones from './modules/inscripciones/components/Inscripciones';
import Tareas from './modules/tareas/components/Tareas';
import MisTareasEstudiante from './modules/tareasEstudiante/components/MisTareasEstudiante';
import EntregarActividad from './modules/entregarActividad/components/EntregarActividad';
import EntregasDocente from './modules/entregas/components/EntregasDocente';
import DashboardEstudiante from './modules/dashboard/components/DashboardEstudiante';
import RedireccionarDash from './modules/core/RedireccionarDash/components/RedireccionarDash';
import MisAsignaturasDocente from './modules/dashboard/components/MisAsignaturasDocente';



function App() {
  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restablecer-contrasena/:token" element={<CambiarClave />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/app/perfil" element={<Perfil />} />
            <Route path="/app/dashboard" element={<TienePermiso permiso="can_view_own_grades"><DashboardEstudiante /></TienePermiso>} />
            <Route path="/app/dashboard-docente" element={<TienePermiso permiso="can_grade_task"><MisAsignaturasDocente /></TienePermiso>} />
            <Route path="/app/grupos" element={<TienePermiso permiso="view_group"><Grupos /></TienePermiso>} />
            <Route path="/app/usuarios" element={<TienePermiso permiso="view_usuario"><Usuarios /></TienePermiso>} />
            <Route path="/app/inicio" element={<RedireccionarDash />} />
            <Route path="/app/periodos" element={<TienePermiso permiso="change_periodoacademico"><Periodos /></TienePermiso>} />
            <Route path="/app/asignaturas" element={<TienePermiso permiso="change_asignatura"><Asignaturas /></TienePermiso>} />
            <Route path="/app/inscripciones" element={<TienePermiso permiso="puede_inscribirse"><Inscripciones /></TienePermiso>} />
            <Route path="/app/tareas" element={<TienePermiso permiso="change_tarea"><Tareas /></TienePermiso>} />
            <Route path="/app/mis-tareas" element={<TienePermiso permiso="puede_inscribirse"><MisTareasEstudiante /></TienePermiso>} />
            <Route path="/app/entregar/:tareaId" element={<EntregarActividad />} />
            <Route path="/app/entregas-docente" element={<TienePermiso permiso="can_grade_task"><EntregasDocente /></TienePermiso>} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App
