import useDashboardEstudiante from "../hooks/useDashboardEstudiante";
import CardGrid from "../../core/tarjetas/components/CardGrid";
import DataTable from "../../core/Tabla/components/DataTable";
import "../utils/DashboardEstudiante.scss";

const DashboardEstudiante = () => {
    const {
        datosFiltrados,
        periodos,
        filtroPeriodo,
        setFiltroPeriodo,
        loading,
    } = useDashboardEstudiante();

    if (loading) {
        return <div className="loading-dashboard">Cargando tu progreso académico...</div>;
    }

    const renderAsignaturaCard = (asig) => {
        const progreso = asig["peso_calificado_%"] || 0;
        const promedio = parseFloat(asig.promedio_ponderado || 0);

        return (
            <>
                <div className="asig-header">
                    <h3 className="titulo">{asig.asignatura}</h3>
                </div>

                <div className="asignatura-info">
                    <span className="codigo">{asig.codigo}</span>
                    <p className="docente">
                        {asig.docente || "Sin asignar"}
                    </p>
                    <p className="periodo">
                        <strong>Período:</strong> {asig.periodo}
                    </p>
                </div>

                {/* BARRA DE PROGRESO (AHORA SÍ SE VE) */}
                <div className="progress-container small">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progreso}%` }}
                        />
                    </div>
                    <span className="progreso-label">
                        {progreso.toFixed(1)}% calificado
                    </span>
                </div>

                <div className="promedio-asig">
                    <span>Promedio:</span>
                    <div className={`nota-final ${promedio.toFixed(2) >= 60 ? "aprobada" : "reprobada"}`}>
                        {promedio.toFixed(2)}
                    </div>
                </div>



                <div className="tareas-count">
                    {asig.tareas.length} actividad{asig.tareas.length !== 1 ? "es" : ""} calificadas
                </div>
            </>
        );
    };

    const columnsTareas = [
        { key: "titulo", label: "Actividad", sortable: true },
        {
            key: "tipo_tarea",
            label: "Tipo",
            render: (row) => (
                <span className={`tag ${row.tipo_tarea === "E" ? "examen" : "tarea"}`}>
                    {row.tipo_tarea === "E" ? "EXAMEN" : "TAREA"}
                </span>
            ),
        },
        { key: "peso_porcentual", label: "Peso %", render: (row) => `${row.peso_porcentual}%` },
        {
            key: "nota",
            label: "Nota",
            render: (row) => (
                <strong>{row.nota ? row.nota.toFixed(1) : "—"}</strong>
            ),
        },
        {
            key: "fecha_entrega",
            label: "Entregada",
            render: (row) => new Date(row.fecha_entrega).toLocaleDateString("es-ES"),
        },
        {
            key: "estado",
            label: "Estado",
            render: () => <span className="tag calificada">Calificada</span>,
        },
    ];

    return (
        <div className="dashboard-estudiante">
            <header className="dashboard-header">
                <h1>Progreso Académico</h1>
                <div className="filtro-periodo">
                    <select value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)}>
                        {periodos.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                </div>
            </header>

            <CardGrid
                title="Mis Asignaturas"
                items={datosFiltrados}
                renderCard={renderAsignaturaCard}
                emptyMessage="No tienes asignaturas en este período"
            />

            {datosFiltrados.map(asig => (
                <section key={asig.id_asignatura} className="seccion-calificaciones">
                    <h2>
                        {asig.asignatura} ({asig.codigo})
                        <span className="promedio-badge">
                            {parseFloat(asig.promedio_ponderado).toFixed(2)}
                        </span>
                    </h2>

                    {asig.tareas.length === 0 ? (
                        <p className="empty-state">Aún no hay actividades calificadas</p>
                    ) : (
                        <DataTable
                            data={asig.tareas}
                            columns={columnsTareas}
                            emptyMessage="No hay tareas calificadas"
                        />
                    )}
                </section>
            ))}
        </div>
    );
};

export default DashboardEstudiante;