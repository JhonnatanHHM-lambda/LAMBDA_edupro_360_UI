import { useState, useEffect } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
import { permisosTraducidos } from "../utils/permisosTraducidos";

const useGrupos = () => {
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingGrupo, setEditingGrupo] = useState(null);
    const [formData, setFormData] = useState({ name: "", permisos: [] });

    // Usuario desde localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const permisosDisponibles = Object.keys(permisosTraducidos);

    // Cargar grupos
    const cargarGrupos = async () => {
        try {
            setLoading(true);
            const res = await api.get("/grupos/");
            setGrupos(res.data);
        } catch (err) {
            Swal.fire("Error", "No se pudieron cargar los grupos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarGrupos();
    }, []);

    // Abrir modal (crear o editar)
    const abrirModal = (grupo = null) => {
        setEditingGrupo(grupo);
        setFormData({
            name: grupo?.name || "",
            permisos: grupo?.permisos_leidos || [],
        });
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setEditingGrupo(null);
        setFormData({ name: "", permisos: [] });
    };

    // Guardar (crear o actualizar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                permisos: formData.permisos,
            };

            if (editingGrupo) {
                await api.patch(`/grupos/${editingGrupo.id}/`, payload);
                Swal.fire("Éxito", "Rol actualizado correctamente", "success");
            } else {
                console.log(payload)
                await api.post("/grupos/", payload);
                Swal.fire("Éxito", "Rol creado correctamente", "success");
            }

            cerrarModal();
            cargarGrupos();
        } catch (err) {
            const errorMsg = err.response?.data?.permisos?.[0] || err.response?.data?.permisos || "Error al guardar el rol";
            Swal.fire("Error", errorMsg, "error");
        }
    };

    // Eliminar grupo
    const eliminarGrupo = async (grupo) => {
        const result = await Swal.fire({
            title: `¿Eliminar el rol "${grupo.name}"?`,
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/grupos/${grupo.id}/`);
                Swal.fire("Eliminado", "El rol ha sido eliminado", "success");
                cargarGrupos();
            } catch (err) {
                Swal.fire("Error", "No se pudo eliminar el rol", "error");
            }
        }
    };

    // Toggle permiso
    const togglePermiso = (codename) => {
        setFormData((prev) => ({
            ...prev,
            permisos: prev.permisos.includes(codename)
                ? prev.permisos.filter((p) => p !== codename)
                : [...prev.permisos, codename],
        }));
    };

    return {
        grupos,
        loading,
        modalOpen,
        editingGrupo,
        formData,
        setFormData,
        permisosDisponibles,
        abrirModal,
        cerrarModal,
        handleSubmit,
        eliminarGrupo,
        togglePermiso,
        cargarGrupos,
    };
};

export default useGrupos;