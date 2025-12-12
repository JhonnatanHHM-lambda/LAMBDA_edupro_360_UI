import { useState, useEffect } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";

const useTareas = () => {
    const [tareas, setTareas] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTarea, setEditingTarea] = useState(null);

    const [formData, setFormData] = useState({
        asignatura: "",
        titulo: "",
        descripcion: "",
        fecha_publicacion: "",
        fecha_vencimiento: "",
        peso_porcentual: "",
        tipo_tarea: "T",
    });

    const cargarTareas = async () => {
        try {
            setLoading(true);
            const res = await api.get("/tareas/");
            setTareas(res.data);
        } catch (err) {
            Swal.fire("Error", "No se pudieron cargar las tareas", "error");
        } finally {
            setLoading(false);
        }
    };

    const cargarAsignaturasDocente = async () => {
        try {
            const res = await api.get("/docente/mis-asignaturas/");
            setAsignaturas(res.data.filter(a => a.docente_responsable));
        } catch (err) {
            console.warn("No se pudieron cargar asignaturas");
        }
    };

    useEffect(() => {
        cargarTareas();
        cargarAsignaturasDocente();
    }, []);

    const abrirModalCrear = () => {
        setEditingTarea(null);
        setFormData({
            asignatura: "",
            titulo: "",
            descripcion: "",
            fecha_publicacion: new Date().toISOString().slice(0, 16),
            fecha_vencimiento: "",
            peso_porcentual: "",
            tipo_tarea: "T",
        });
        setModalOpen(true);
    };

    const abrirModalEditar = (tarea) => {
        setEditingTarea(tarea);
        setFormData({
            asignatura: tarea.asignatura,
            titulo: tarea.titulo,
            descripcion: tarea.descripcion || "",
            fecha_publicacion: tarea.fecha_publicacion.slice(0, 16),
            fecha_vencimiento: tarea.fecha_vencimiento.slice(0, 16),
            peso_porcentual: tarea.peso_porcentual,
            tipo_tarea: tarea.tipo_tarea,
        });
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setEditingTarea(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            id: editingTarea.id,
            asignatura: parseInt(formData.asignatura),
            titulo: formData.titulo.trim(),
            descripcion: formData.descripcion.trim(),
            fecha_publicacion: formData.fecha_publicacion,
            fecha_vencimiento: formData.fecha_vencimiento,
            peso_porcentual: parseFloat(formData.peso_porcentual),
            tipo_tarea: formData.tipo_tarea,
        };

        try {
            if (editingTarea) {
                await api.put(`/tareas/${editingTarea.id}/`, payload);
                Swal.fire("Éxito", "Tarea actualizada", "success");
            } else {
                await api.post("/tareas/", payload);
                Swal.fire("Éxito", "Tarea creada y notificada a estudiantes", "success");
            }
            cerrarModal();
            cargarTareas();
        } catch (err) {
            const msg = err.response?.data?.non_field_errors?.[0] ||
                        err.response?.data?.peso_porcentual?.[0] ||
                        "Error al guardar la tarea";
            Swal.fire("Error", msg, "error");
        }
    };

    const eliminarTarea = async (tarea) => {
        const result = await Swal.fire({
            title: `¿Eliminar tarea "${tarea.titulo}"?`,
            text: "Los estudiantes ya no la verán",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Sí, eliminar",
        });

        if (!result.isConfirmed) return;

        try {
            // Tu backend solo hace soft delete (estado=False)
            await api.delete(`/tareas/${tarea.id}/`);
            Swal.fire("Eliminada", "Tarea eliminada", "success");
            cargarTareas();
        } catch (err) {
            Swal.fire("Error", "No se pudo eliminar", "error");
        }
    };

    return {
        tareas,
        asignaturas,
        loading,
        modalOpen,
        editingTarea,
        formData,
        setFormData,
        abrirModalCrear,
        abrirModalEditar,
        cerrarModal,
        handleSubmit,
        eliminarTarea,
    };
};

export default useTareas;