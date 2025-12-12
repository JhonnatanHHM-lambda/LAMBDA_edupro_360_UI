import { useState, useEffect } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";

const useInscripciones = () => {
    const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);
    const [misAsignaturas, setMisAsignaturas] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarAsignaturasDisponibles = async () => {
        try {
            const res = await api.get("/asignaturas/");
            setAsignaturasDisponibles(res.data);
        } catch (err) {
            console.warn("No se pudieron cargar asignaturas disponibles");
        }
    };

    const cargarMisAsignaturas = async () => {
        try {
            const res = await api.get("/mis-asignaturas/");
            setMisAsignaturas(res.data);
        } catch (err) {
            console.warn("No se pudieron cargar tus asignaturas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarAsignaturasDisponibles();
        cargarMisAsignaturas();
    }, []);

    const inscribirse = async (asignaturaId) => {
        const result = await Swal.fire({
            title: "¿Inscribirte en esta asignatura?",
            text: "Podrás retirarte más adelante si lo deseas",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#fbbf24",
            cancelButtonColor: "#94a3b8",
            confirmButtonText: "Sí, inscribirme",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        try {
            await api.post("/inscribir/", { asignatura: asignaturaId });
            Swal.fire("¡Inscrito!", "Te has inscrito correctamente", "success");
            cargarMisAsignaturas();
            setAsignaturasDisponibles(prev => prev.filter(a => a.id !== asignaturaId));
        } catch (err) {
            const msg = err.response?.data?.asignatura?.[0] || "No se pudo inscribir";
            Swal.fire("Error", msg, "error");
        }
    };

    const retirarse = async (inscripcionId, nombreAsignatura) => {
        const result = await Swal.fire({
            title: `¿Retirarte de "${nombreAsignatura}"?`,
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Sí, retirarme",
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/retirar/${inscripcionId}/`);
            Swal.fire("Retirado", "Te has retirado de la asignatura", "info");
            cargarMisAsignaturas();
            cargarAsignaturasDisponibles();
        } catch (err) {
            Swal.fire("Error", "No se pudo retirar", "error");
        }
    };

    return {
        asignaturasDisponibles,
        misAsignaturas,
        loading,
        inscribirse,
        retirarse,
    };
};

export default useInscripciones;