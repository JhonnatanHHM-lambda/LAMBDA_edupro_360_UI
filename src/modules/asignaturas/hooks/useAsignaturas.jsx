import { useState, useEffect } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";

const useAsignaturas = () => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAsignatura, setEditingAsignatura] = useState(null);

    const [formData, setFormData] = useState({
        nombre: "",
        codigo: "",
        descripcion: "",
        docente_responsable: "",
        periodo_academico: "",
    });

    const cargarAsignaturas = async () => {
        try {
            setLoading(true);
            const res = await api.get("/asignaturas/");
            setAsignaturas(res.data);
        } catch (err) {
            Swal.fire("Error", "No se pudieron cargar las asignaturas", "error");
        } finally {
            setLoading(false);
        }
    };

    const cargarPeriodos = async () => {
        try {
            const res = await api.get("/periodos/");
            setPeriodos(res.data.filter(p => p.estado));
        } catch (err) {
            console.warn("No se pudieron cargar períodos");
        }
    };

    const cargarDocentes = async () => {
        try {
            const res = await api.get("/docentes/");
            setDocentes(res.data);
        } catch (err) {
            console.warn("No se pudieron cargar docentes");
        }
    };

    useEffect(() => {
        cargarAsignaturas();
        cargarPeriodos();
        cargarDocentes();
    }, []);

    const abrirModalCrear = () => {
        setEditingAsignatura(null);
        setFormData({
            nombre: "",
            codigo: "",
            descripcion: "",
            docente_responsable: "",
            periodo_academico: "",
        });
        setModalOpen(true);
    };

    const abrirModalEditar = (asignatura) => {
        setEditingAsignatura(asignatura);
        setFormData({
            nombre: asignatura.nombre,
            codigo: asignatura.codigo,
            descripcion: asignatura.descripcion || "",
            docente_responsable: asignatura.docente_responsable || "",
            periodo_academico: asignatura.periodo_academico,
        });
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setEditingAsignatura(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion.trim() || null,
            docente_responsable: formData.docente_responsable || null,
            periodo_academico: parseInt(formData.periodo_academico),
        };

        try {
            if (editingAsignatura) {
                await api.put(`/asignaturas/${editingAsignatura.id}/`, payload);
                Swal.fire("Éxito", "Asignatura actualizada correctamente", "success");
            } else {
                await api.post("/asignaturas/", payload);
                Swal.fire("Éxito", "Asignatura creada correctamente", "success");
            }
            cerrarModal();
            cargarAsignaturas();
        } catch (err) {
            const errorMsg = err.response?.data?.codigo?.[0] ||
                err.response?.data?.nombre?.[0] ||
                err.response?.data?.non_field_errors?.[0] ||
                "Error al guardar la asignatura";
            Swal.fire("Error", errorMsg, "error");
        }
    };

    const eliminarAsignatura = async (asignatura) => {
        const result = await Swal.fire({
            title: `¿Desactivar asignatura "${asignatura.nombre}"?`,
            text: "Se desactivará permanentemente",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Sí, desactivar",
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/asignaturas/${asignatura.id}/`);
                Swal.fire("Desactivada", "Asignatura desactivada", "success");
                cargarAsignaturas();
            } catch (err) {
                Swal.fire("Error", "No se pudo desactivar", "error");
            }
        }
    };

    return {
        asignaturas,
        periodos,
        docentes,
        loading,
        modalOpen,
        editingAsignatura,
        formData,
        setFormData,
        abrirModalCrear,
        abrirModalEditar,
        cerrarModal,
        handleSubmit,
        eliminarAsignatura,
    };
};

export default useAsignaturas;