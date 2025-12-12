import { useState, useEffect } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";

const useEntregasDocente = () => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [entregas, setEntregas] = useState([]);
    const [filtroAsignatura, setFiltroAsignatura] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("entregadas");
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEntrega, setEditingEntrega] = useState(null);
    const [formData, setFormData] = useState({ nota: "", retroalimentacion_docente: "" });

    // Cargar asignaturas
    useEffect(() => {
        const cargar = async () => {
            try {
                const res = await api.get("/docente/mis-asignaturas/");
                setAsignaturas(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        cargar();
    }, []);

    // Cargar entregas
    useEffect(() => {
        const cargar = async () => {
            try {
                setLoading(true);
                const base = filtroEstado === "entregadas"
                    ? "/docente/entregas/entregadas/"
                    : "/docente/entregas/calificadas/";

                const params = filtroAsignatura ? { asignatura_id: filtroAsignatura } : {};

                const res = await api.get(base, { params });
                setEntregas(res.data);
            } catch (err) {
                console.error("Error:", err);
                setEntregas([]);
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, [filtroAsignatura, filtroEstado]);

    const abrirModal = (entrega) => {
        setEditingEntrega(entrega);
        setFormData({
            nota: entrega.nota ? entrega.nota.toString() : "",
            retroalimentacion_docente: entrega.retroalimentacion || "",
        });
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setEditingEntrega(null);
    };

    const handleCalificar = async (e) => {
        e.preventDefault();
        if (!formData.nota || formData.nota < 0 || formData.nota > 100) {
            Swal.fire("Error", "La nota debe estar entre 0 y 100", "error");
            return;
        }

        const payload = {
            entrega: editingEntrega.id,
            nota: parseFloat(formData.nota),
            retroalimentacion_docente: formData.retroalimentacion_docente || null,
        };

        try {
            if (editingEntrega.nota) {
                // EDITAR CALIFICACIÓN EXISTENTE
                await api.put(`/calificaciones/${editingEntrega.calificacion_id || editingEntrega.id}/`, payload);
                Swal.fire("Actualizada", "Calificación actualizada correctamente", "success");
            } else {
                // CREAR NUEVA CALIFICACIÓN
                await api.post("/calificaciones/", payload);
                Swal.fire("Calificada", "Entrega calificada correctamente", "success");
            }

            cerrarModal();

            // Recargar entregas del estado actual
            const endpoint = filtroEstado === "entregadas"
                ? "/docente/entregas/entregadas/"
                : "/docente/entregas/calificadas/";

            const params = filtroAsignatura ? { asignatura_id: filtroAsignatura } : {};

            const res = await api.get(endpoint, { params });
            setEntregas(res.data);
        } catch (err) {
            console.error("Error completo:", err.response?.data);
            const msg = err.response?.data?.nota?.[0] ||
                        err.response?.data?.detail ||
                        "Error al guardar la calificación";
            Swal.fire("Error", msg, "error");
        }
    };

    return {
        asignaturas,
        entregas,
        filtroAsignatura,
        setFiltroAsignatura,
        filtroEstado,
        setFiltroEstado,
        loading,
        modalOpen,
        editingEntrega,
        formData,
        setFormData,
        abrirModal,
        cerrarModal,
        handleCalificar,
    };
};

export default useEntregasDocente;