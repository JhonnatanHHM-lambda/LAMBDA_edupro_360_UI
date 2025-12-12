// src/hooks/useMisTareasEstudiante.js
import { useState, useEffect } from "react";
import api from "../../../services/api";

const useMisTareasEstudiante = () => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [tareasPendientes, setTareasPendientes] = useState([]);
    const [tareasEntregadas, setTareasEntregadas] = useState([]);
    const [tareasCalificadas, setTareasCalificadas] = useState([]);
    const [resumenAsignatura, setResumenAsignatura] = useState(null);
    const [filtroAsignatura, setFiltroAsignatura] = useState("");
    const [loading, setLoading] = useState(true);

    // Cargar datos iniciales (sin filtro)
    useEffect(() => {
        const cargarDatosIniciales = async () => {
            try {
                setLoading(true);

                const [resAsig, resPend, resEnt, resCal] = await Promise.all([
                    api.get("/mis-asignaturas/"),
                    api.get("/estudiante/tareas/pendientes/"),
                    api.get("/estudiante/tareas/entregadas/"),
                    api.get("/mis-notas/"),
                ]);

                setAsignaturas(resAsig.data);
                setTareasPendientes(resPend.data);
                setTareasEntregadas(resEnt.data);

                // Procesar calificadas desde /mis-notas/
                const calificadas = [];
                resCal.data.forEach(asig => {
                    asig.tareas.forEach(tarea => {
                        calificadas.push({
                            id: tarea.id_tarea,
                            ...tarea,
                            asignatura: asig.id_asignatura,
                            asignatura_nombre: asig.asignatura,
                            codigo: asig.codigo,
                            descripcion: tarea.descripcion,
                            docente: asig.docente,
                            periodo: asig.periodo,
                            fecha_vencimiento: tarea.fecha_vencimiento
                        });
                    });
                });
                setTareasCalificadas(calificadas);
            } catch (err) {
                console.error("Error cargando datos iniciales:", err);
            } finally {
                setLoading(false);
            }
        };

        cargarDatosIniciales();
    }, []);

    // Cargar pendientes y entregadas CON FILTRO cuando cambie la asignatura
    useEffect(() => {
        const cargarTareasFiltradas = async () => {
            const params = filtroAsignatura ? { asignatura_id: filtroAsignatura } : {};

            try {
                const [resPend, resEnt] = await Promise.all([
                    api.get("/estudiante/tareas/pendientes/", { params }),
                    api.get("/estudiante/tareas/entregadas/", { params }),
                ]);

                setTareasPendientes(resPend.data);
                setTareasEntregadas(resEnt.data);
            } catch (err) {
                console.error(err);
            }
        };

        cargarTareasFiltradas();
    }, [filtroAsignatura]);

    // Resumen de asignatura
    useEffect(() => {
        if (!filtroAsignatura) {
            setResumenAsignatura(null);
            return;
        }

        const cargarResumen = async () => {
            api.get(`/mis-notas/asignatura/${filtroAsignatura}/`)
                .then(res => setResumenAsignatura(res.data[0] || null))
                .catch(() => setResumenAsignatura(null));
        };

        cargarResumen();
    }, [filtroAsignatura]);

    // Filtro visual (mantenido)
    const filtroComponent = (
        <select
            value={filtroAsignatura}
            onChange={(e) => setFiltroAsignatura(e.target.value)}
            className="filtro-select"
        >
            <option value="">Todas mis asignaturas</option>
            {asignaturas.map(a => (
                <option key={a.asignatura_id} value={a.asignatura_id}>
                    {a.codigo} - {a.nombre}
                </option>
            ))}
        </select>
    );

    return {
        asignaturas,
        tareasPendientes,
        tareasEntregadas,
        tareasCalificadas: tareasCalificadas.filter(t =>
            !filtroAsignatura || t.asignatura === parseInt(filtroAsignatura)
        ),
        resumenAsignatura,
        filtroComponent,
        loading,
    };
};

export default useMisTareasEstudiante;