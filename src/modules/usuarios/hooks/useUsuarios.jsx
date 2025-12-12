import { useState, useEffect } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";

const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [gruposDisponibles, setGruposDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        correo: "",
        cedula: "",
        telefono: "",
        fecha_nacimiento: "",
        genero: "",
        password: "",
        grupos: [],
    });

    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            const res = await api.get("/usuarios/");
            setUsuarios(res.data);
        } catch (err) {
            Swal.fire("Error", err.response?.status === 403 ? "Acceso denegado" : "No se pudieron cargar los usuarios", "error");
        } finally {
            setLoading(false);
        }
    };

    const cargarGrupos = async () => {
        try {
            const res = await api.get("/grupos/");
            setGruposDisponibles(res.data);
        } catch (err) {
            console.warn("No se pudieron cargar grupos");
        }
    };

    useEffect(() => {
        cargarUsuarios();
        cargarGrupos();
    }, []);

    const abrirModalCrear = () => {
        setEditingUsuario(null);
        setFormData({
            nombres: "", apellidos: "", correo: "", cedula: "", telefono: "",
            fecha_nacimiento: "", genero: "", password: "", grupos: []
        });
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
        setModalOpen(true);
    };

    const abrirModalEditar = (usuario) => {
        setEditingUsuario(usuario);
        setFormData({
            nombres: usuario.nombres || "",
            apellidos: usuario.apellidos || "",
            correo: usuario.correo || "",
            cedula: usuario.cedula || "",
            telefono: usuario.telefono || "",
            fecha_nacimiento: usuario.fecha_nacimiento || "",
            genero: usuario.genero || "",
            password: "",
            grupos: usuario.groups?.map(g => g.name) || [],
        });
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setEditingUsuario(null);
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const toggleGrupo = (grupoName) => {
        setFormData(prev => ({
            ...prev,
            grupos: prev.grupos.includes(grupoName)
                ? prev.grupos.filter(g => g !== grupoName)
                : [...prev.grupos, grupoName]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.correo)) {
            Swal.fire("Error", "Ingresa un correo electrónico válido", "error");
            return;
        }

        // Validación contraseña al crear
        if (!editingUsuario) {
            if (formData.password !== confirmPassword) {
                Swal.fire("Error", "Las contraseñas no coinciden", "error");
                return;
            }
            if (formData.password.length < 8) {
                Swal.fire("Error", "La contraseña debe tener al menos 8 caracteres", "error");
                return;
            }
        }

        // Alerta al cambiar contraseña en edición
        if (editingUsuario && formData.password) {
            const { isConfirmed } = await Swal.fire({
                title: "¿Cambiar contraseña?",
                text: "Estás a punto de modificar la contraseña del usuario.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#f59e0b",
                cancelButtonColor: "#64748b",
                confirmButtonText: "Sí, cambiar",
                cancelButtonText: "Cancelar",
            });
            if (!isConfirmed) return;
        }

        const payload = {
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            correo: formData.correo,
            cedula: formData.cedula,
            telefono: formData.telefono || null,
            fecha_nacimiento: formData.fecha_nacimiento || null,
            genero: formData.genero || null,
            grupos: formData.grupos,
            ...(formData.password && { password: formData.password }),
        };

        try {
            if (editingUsuario) {
                await api.patch(`/usuarios/${editingUsuario.id}/`, payload);
                Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
            } else {
                await api.post("/registro/", payload);
                Swal.fire("Éxito", "Usuario creado correctamente", "success");
            }
            cerrarModal();
            cargarUsuarios();
        } catch (err) {
            const errorMsg = err.response?.data?.correo?.[0] ||
                            err.response?.data?.cedula?.[0] ||
                            err.response?.data?.non_field_errors?.[0] ||
                            "Error al guardar el usuario";
            Swal.fire("Error", errorMsg, "error");
        }
    };

    const eliminarUsuario = async (usuario) => {
        const result = await Swal.fire({
            title: `¿Desactivar "${usuario.nombre_completo}"?`,
            text: "El usuario será desactivado",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/usuarios/${usuario.id}/`);
                Swal.fire("Desactivado", "Usuario desactivado correctamente", "success");
                cargarUsuarios();
            } catch (err) {
                Swal.fire("Error", "No se pudo desactivar el usuario", "error");
            }
        }
    };

    return {
        usuarios,
        loading,
        modalOpen,
        editingUsuario,
        formData,
        setFormData,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        gruposDisponibles,
        abrirModalCrear,
        abrirModalEditar,
        cerrarModal,
        handleSubmit,
        eliminarUsuario,
        toggleGrupo,
    };
};

export default useUsuarios;