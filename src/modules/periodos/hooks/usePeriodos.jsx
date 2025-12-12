import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from ".././../../services/api"

export const usePeriodos = () => {
    const [periodos, setPeriodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPeriodos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get("/periodos/");
            setPeriodos(response.data);
        } catch (err) {
            const mensaje = err.response?.data?.detail || err.message || "Error al cargar los períodos";
            setError(mensaje);
            Swal.fire("Error", mensaje, "error");
        } finally {
            setLoading(false);
        }
    };

    const crearPeriodo = async (data) => {
        try {
            const response = await api.post("/periodos/", data);
            setPeriodos((prev) => [...prev, response.data]);
            Swal.fire("Éxito", "Período académico creado correctamente", "success");
            return response.data;
        } catch (err) {
            const errores = err.response?.data || {};
            const mensaje = Object.values(errores).flat().join(", ") || "Error al crear el período";
            Swal.fire("Error", mensaje, "error");
            throw new Error(mensaje);
        }
    };

    const actualizarPeriodo = async (id, data) => {
        try {
            const response = await api.put(`/periodos/${id}/`, data);
            setPeriodos((prev) =>
                prev.map((p) => (p.id === id ? response.data : p))
            );
            Swal.fire("Actualizado", "Período actualizado correctamente", "success");
            return response.data;
        } catch (err) {
            const errores = err.response?.data || {};
            const mensaje = Object.values(errores).flat().join(", ") || "Error al actualizar";
            Swal.fire("Error", mensaje, "error");
            throw new Error(mensaje);
        }
    };

    const eliminarPeriodo = async (id) => {
        const result = await Swal.fire({
            title: "¿Desactivar período?",
            text: "El período será desactivado (no se elimina permanentemente)",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#ef4444",
        });

        if (!result.isConfirmed) return false;

        try {
            await api.delete(`/periodos/${id}/`);
            setPeriodos((prev) => prev.filter((p) => p.id !== id));
            Swal.fire("Desactivado", "El período ha sido desactivado", "success");
            return true;
        } catch (err) {
            const mensaje = err.response?.data?.detail || "Error al desactivar el período";
            Swal.fire("Error", mensaje, "error");
            return false;
        }
    };

    useEffect(() => {
        fetchPeriodos();
    }, []);

    return {
        periodos,
        loading,
        error,
        crearPeriodo,
        actualizarPeriodo,
        eliminarPeriodo,
        refetch: fetchPeriodos,
    };
};