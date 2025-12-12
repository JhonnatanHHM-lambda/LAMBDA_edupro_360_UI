import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TienePermiso = ({ permiso, fallback = null, children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const permisos = user.permisos_rol || [];

        // Si no tiene el permiso requerido
        if (!permisos.includes(permiso)) {
            Swal.fire({
                icon: "error",
                title: "Acceso Denegado",
                text: "No tienes permisos para acceder a esta sección.",
                confirmButtonText: "Volver al inicio",
                allowOutsideClick: false,
            }).then(() => {
                navigate("/app/inicio"); // o donde quieras redirigir
            });
        }
    }, [permiso, navigate]);

    // Obtenemos los permisos para verificar (evita renderizado innecesario)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const tienePermiso = user.permisos_rol?.includes(permiso);

    // Si no tiene permiso → no renderiza nada (o puedes poner un fallback)
    if (!tienePermiso) {
        return fallback || null;
    }

    // Si tiene permiso → renderiza el contenido
    return <>{children}</>;
};

export default TienePermiso;