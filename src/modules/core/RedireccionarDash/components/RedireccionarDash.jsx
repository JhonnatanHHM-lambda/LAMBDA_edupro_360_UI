import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../utils/RedireccionarDash.scss";

const RedireccionarDash = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const permisos = user.permisos_rol || [];

        // Si es DOCENTE (tiene permiso de calificar)
        if (permisos.includes("add_group")) {
            navigate("/app/periodos", { replace: true });
        }
        // Si es ESTUDIANTE (puede ver sus notas)
        else if (permisos.includes("can_view_own_grades")) {
            navigate("/app/dashboard", { replace: true });
        }
        // Si no tiene ninguno de los dos → lo mandamos al inicio genérico
        else if (permisos.includes("can_grade_task")) {
            navigate("/app/entregas-docente", { replace: true });
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