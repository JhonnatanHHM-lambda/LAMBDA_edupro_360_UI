import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../utils/RedireccionarDash.scss";

const RedireccionarDash = () => {
    const navigate = useNavigate();

useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const permisos = user.permisos_rol || [];

    if (permisos.includes("add_group")) {
        // Superadmin o admin full
        navigate("/app/periodos", { replace: true });
    } 
    else if (permisos.includes("can_grade_task")) {
        // Docentes (califican tareas)
        navigate("/app/dashboard-docente", { replace: true });
    } 
    else if (permisos.includes("can_view_own_grades")) {
        // Estudiantes puros
        navigate("/app/dashboard", { replace: true });
    } 
    else {
        // Fallback: perfil o login
        navigate("/app/perfil", { replace: true });
    }
}, [navigate]);

    return (
        <div className="redirect-loading">
            <div className="spinner"></div>
            <p>Redirigiendo a tu espacio...</p>
        </div>
    );
};

export default RedireccionarDash;