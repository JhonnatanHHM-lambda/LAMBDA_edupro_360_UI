import { useState, useEffect } from "react";
import api from "../../../services/api";

const useDashboardEstudiante = () => {
    const [notasDetalladas, setNotasDetalladas] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [filtroPeriodo, setFiltroPeriodo] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const [resNotas, resPeriodos] = await Promise.all([
                    api.get("/mis-notas/"),
                    api.get("/periodos/")
                ]);

                setNotasDetalladas(resNotas.data);
                setPeriodos(resPeriodos.data);

                const hoy = new Date(); 
                const actual = resPeriodos.data.find(p => {
                    const inicio = new Date(p.fecha_inicio);
                    const fin = new Date(p.fecha_fin);
                    return hoy >= inicio && hoy <= fin;
                });

                if (actual) {
                    setFiltroPeriodo(actual.id.toString());
                }
            } catch (err) {
                console.error("Error cargando dashboard:", err);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    // Filtrar por período
    const datosFiltrados = filtroPeriodo
        ? notasDetalladas.filter(asig => {
            const periodo = periodos.find(p => p.id === parseInt(filtroPeriodo));
            return periodo && asig.periodo === periodo.nombre;
        })
        : notasDetalladas;

    return {
        datosFiltrados,
        periodos,
        filtroPeriodo,
        setFiltroPeriodo,
        loading,
    };
};

export default useDashboardEstudiante;