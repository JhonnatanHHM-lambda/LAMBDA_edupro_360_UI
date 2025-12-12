import { useNavigate } from "react-router-dom";
import useMisTareasEstudiante from "../hooks/useMisTareasEstudiante";
import CardGrid from "../../core/tarjetas/components/CardGrid";
import "../utils/MisTareasEstudiante.scss";


const MisTareasEstudiante = () => {
    const navigate = useNavigate();
    const {
        tareasPendientes,
        tareasEntregadas,
        tareasCalificadas,
        resumenAsignatura,
        filtroComponent,
        loading,
        asignaturas,
    } = useMisTareasEstudiante();

    const handleTareaClick = (tarea) => {
        navigate(`/app/entregar/${tarea.id}`, { state: { tarea } });
    };

    const renderTareaCard = (tarea) => {
        const esCalificada = tarea.nota !== undefined;
        const esExamen = tarea.tipo_tarea === "E";
        const peso = parseFloat(tarea.peso_porcentual);
        const nota = tarea.nota ? parseFloat(tarea.nota) : null;

        const asignaturaId = tarea.asignatura;
        const asignatura = asignaturas.find(a => a.asignatura_id === asignaturaId) || {
            codigo: tarea.codigo || "—",
            nombre: tarea.asignatura_nombre || "Asignatura",
            docente: tarea.docente || "Sin docente",
            periodo: tarea.periodo || "Sin período"
        };

        return (
            <div
                className="tarea-card clickable"
                onClick={() => handleTareaClick(tarea)} 
                style={{ cursor: "pointer" }}
            >
                <div className="tarea-header">
                    <span className={`tag ${esExamen ? "examen" : "tarea"}`}>
                        {esExamen ? "EXAMEN" : "TAREA"}
                    </span>
                    {esCalificada && (
                        <div className="nota-destacada">
                            {nota >= 60 ? "Aprobado" : "Reprobado"} {nota.toFixed(1)}
                        </div>
                    )}
                </div>

                <h3 className="titulo">{tarea.titulo}</h3>

                {esCalificada && tarea.periodo && (
                    <div className="periodo-destacado">
                        {tarea.periodo}
                    </div>
                )}

                <div className="asignatura-info">
                    <div className="codigo">{asignatura.codigo}</div>
                    <div className="nombre">{asignatura.nombre}</div>
                    <div className="docente">{asignatura.docente}</div>
                </div>

                {esCalificada && tarea.retroalimentacion && (
                    <div className="retroalimentacion">
                        <strong>Comentario del docente:</strong><br />
                        {tarea.retroalimentacion}
                    </div>
                )}

                <p className="descripcion">{tarea.descripcion}</p>

                <div className="progress-container">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${peso}%` }} />
                    </div>
                    <span className="progress-label">
                        {peso.toFixed(1)}% del total de la asignatura
                    </span>
                </div>

                <div className="tarea-footer">
                    <div className="vencimiento">
                        Fecha límite: {new Date(tarea.fecha_vencimiento).toLocaleDateString("es-ES", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </div>
                    {esCalificada && (
                        <div className={`nota-final ${nota >= 60 ? "aprobada" : "reprobada"}`}>
                            {nota.toFixed(1)}
                        </div>
                    )}
                </div>

                {/* Icono visual de "click" */}
                <div className="click-hint">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="loading-state">Cargando tus actividades...</div>;
    }

    return (
        <div className="mis-tareas-estudiante">
            <div className="filtro-global">
                <h2>Mis Actividades</h2>
                {filtroComponent}
            </div>

            {/* RESUMEN DE ASIGNATURA */}
            {resumenAsignatura && (
                <div className="resumen-asignatura-card">
                    <div className="resumen-header">
                        <h3>{resumenAsignatura.asignatura}</h3>
                        <span className="codigo">{resumenAsignatura.codigo}</span>
                    </div>
                    <div className="resumen-info">
                        <div className="info-item">
                            <span>Docente</span>
                            <strong>{resumenAsignatura.docente}</strong>
                        </div>
                        <div className="info-item">
                            <span>Período</span>
                            <strong>{resumenAsignatura.periodo}</strong>
                        </div>
                        <div className="info-item destacado">
                            <span>Promedio Actual</span>
                            <strong className={resumenAsignatura.promedio_ponderado >= 60 ? "aprobado" : "reprobado"}>
                                {resumenAsignatura.promedio_ponderado.toFixed(2)}
                            </strong>
                        </div>
                        <div className="info-item peso-calificado">
                            <span>Peso Calificado</span>
                            <div className="progress-container small">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${resumenAsignatura["peso_calificado_%"] || 0}%` }}
                                    />
                                </div>
                                <strong>{(resumenAsignatura["peso_calificado_%"] || 0).toFixed(1)}%</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <br />

            <CardGrid
                title="Actividades Pendientes"
                items={tareasPendientes}
                renderCard={renderTareaCard}
                emptyMessage="No tienes actividades pendientes"
            />
            <br /><br />

            <CardGrid
                title="Actividades Entregadas (Sin Calificar)"
                items={tareasEntregadas}
                renderCard={renderTareaCard}
                emptyMessage="No tienes actividades entregadas pendientes de calificación"
            />
            <br /><br />

            <CardGrid
                title="Actividades Calificadas"
                items={tareasCalificadas}
                renderCard={renderTareaCard}
                emptyMessage="Aún no tienes actividades calificadas"
            />
        </div>
    );
};

export default MisTareasEstudiante;