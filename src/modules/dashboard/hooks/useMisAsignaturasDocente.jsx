import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const useMisAsignaturasDocente = () => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarAsignaturas = async () => {
            try {
                setLoading(true);
                const res = await api.get("/docente/mis-asignaturas/");
                setAsignaturas(res.data);
            } catch (err) {
                console.error("Error cargando asignaturas:", err);
                // Si no es docente → redirigir al dashboard de estudiante
                if (err.response?.status === 403 || err.response?.status === 404) {
                    navigate("/app/dashboard", { replace: true });
                }
            } finally {
                setLoading(false);
            }
        };

        cargarAsignaturas();
    }, [navigate]);


    return {
        asignaturas,
        loading,
    };
};

export default useMisAsignaturasDocente;