import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import Swal from "sweetalert2";

const useEntregarActividad = () => {
    const { tareaId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const tareaDesdeLista = location.state?.tarea;

    const [tarea, setTarea] = useState(tareaDesdeLista || null);
    const [entrega, setEntrega] = useState(null);
    const [archivo, setArchivo] = useState(null);
    const [comentarios, setComentarios] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    useEffect(() => {
        if (!tareaDesdeLista) {
            Swal.fire("Error", "No se pudo cargar la actividad", "error");
            navigate("/app/mis-tareas");
            return;
        }

        const cargarEntrega = async () => {
            try {
                const response = await api.get(`/estudiante/entrega/tarea/${tareaId}/`);
                setEntrega(response.data);
                setComentarios(response.data.comentarios_estudiante || "");
            } catch (err) {
                if (err.response?.status !== 404) {
                    console.error("Error cargando entrega:", err);
                }
                setEntrega(null);
            } finally {
                setLoading(false);
            }
        };

        cargarEntrega();
    }, [tareaId, tareaDesdeLista, navigate]);

    const handleFileChange = (file) => {
        if (file && file.size > 50 * 1024 * 1024) {
            Swal.fire("Error", "El archivo no puede pesar más de 50MB", "error");
            return;
        }
        setArchivo(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!archivo && !entrega) {
            Swal.fire("Error", "Debes subir un archivo", "error");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("tarea", tareaId);  // ← CORRECTO
        if (comentarios) formData.append("comentarios_estudiante", comentarios);
        if (archivo) formData.append("archivo_entrega", archivo);  // ← CORREGIDO: era "form"

        try {
            if (entrega) {
                await api.put("/entregas/", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                Swal.fire("¡Actualizada!", "Tu entrega ha sido actualizada", "success");
            } else {
                await api.post("/entregas/", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                Swal.fire("¡Entregada!", "Tu actividad ha sido enviada correctamente", "success");
            }
            navigate("/app/mis-tareas");
        } catch (err) {
            console.error("Error completo:", err.response?.data);
            const msg = err.response?.data?.archivo_entrega?.[0] ||
                        err.response?.data?.tarea?.[0] ||
                        err.response?.data?.detail ||
                        "Error al enviar la entrega";
            Swal.fire("Error", msg, "error");
        } finally {
            setUploading(false);
        }
    };

    const puedeEditar = tarea && new Date(tarea.fecha_vencimiento) > new Date();
    const estaCalificada = entrega?.estado_entrega === "C";

    return {
        tarea,
        entrega,
        archivo,
        setArchivo,
        comentarios,
        setComentarios,
        loading,
        uploading,
        dragOver,
        setDragOver,
        handleDrop,
        handleFileChange,
        handleSubmit,
        puedeEditar,
        estaCalificada,
    };
};

export default useEntregarActividad;