// src/pages/app/EntregasDocente.jsx
import { MdGrade } from "react-icons/md";
import useEntregasDocente from "../hooks/useEntregasDocente";
import DataTable from "../../core/Tabla/components/DataTable";
import Modal from "../../core/Modal/components/Modal";
import "../utils/EntregasDocente.scss";

const EntregasDocente = () => {
    const {
        asignaturas,
        entregas,
        filtroAsignatura,
        setFiltroAsignatura,
        filtroEstado,
        setFiltroEstado,
        loading,
        modalOpen,
        editingEntrega,
        formData,
        setFormData,
        abrirModal,
        cerrarModal,
        handleCalificar,
    } = useEntregasDocente();

    const columns = [
        {
            key: "estudiante_codigo",
            label: "Código",
            render: (row) => row.estudiante_codigo || "—",
        },
        {
            key: "estudiante_nombre",
            label: "Estudiante",
            render: (row) => row.estudiante_nombre || "Sin nombre",
        },
        {
            key: "tarea_titulo",
            label: "Tarea",
            render: (row) => row.tarea_titulo,
        },
        {
            key: "fecha_entrega",
            label: "Entregada",
            render: (row) => new Date(row.fecha_entrega).toLocaleDateString("es-ES", {
                day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
            }),
        },
        {
            key: "comentarios_estudiante",
            label: "Comentarios",
            render: (row) => row.comentarios_estudiante || "—",
        },
        {
            key: "archivo_entrega",
            label: "Archivo",
            render: (row) => row.archivo_entrega ? (
                <a href={row.archivo_entrega} target="_blank" rel="noopener noreferrer" className="link-download">
                    Descargar
                </a>
            ) : "Sin archivo",
        },
        {
            key: "nota",
            label: "Nota",
            render: (row) => row.nota ? (
                <strong style={{ color: row.nota >= 60 ? "#065f46" : "#991b1b" }}>
                    {row.nota.toFixed(1)}
                </strong>
            ) : "Pendiente",
        },
    ];

    return (
        <div className="entregas-docente">
            <div className="header">
                <h1>Gestión de Entregas</h1>
            </div>

            <div className="filtros">
                <div className="filtro-group">
                    <label>Asignatura</label>
                    <select value={filtroAsignatura} onChange={(e) => setFiltroAsignatura(e.target.value)}>
                        <option value="">Todas</option>
                        {asignaturas.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.codigo} - {a.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="filtro-group">
                    <label>Estado</label>
                    <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                        <option value="entregadas">Pendientes de calificar</option>
                        <option value="calificadas">Ya calificadas</option>
                    </select>
                </div>
            </div>

            <DataTable
                data={entregas}
                columns={columns}
                loading={loading}
                emptyMessage="No hay entregas"
                renderActions={(row) => (
                    <div className="actions-group">
                        {/* Siempre mostramos el botón de editar/calificar */}
                        <button
                            onClick={() => abrirModal(row)}
                            className={`action-btn ${row.nota ? "edit" : "grade"}`}
                            title={row.nota ? "Editar calificación" : "Calificar"}
                        >
                            {row.nota ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5l3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            ) : (
                                <MdGrade size={20} />
                            )}
                        </button>

                    </div>
                )}
            />

            {/* MODAL DE CALIFICAR / EDITAR */}
            <Modal isOpen={modalOpen} onClose={cerrarModal} title={editingEntrega?.nota ? "Editar Calificación" : "Calificar Entrega"}>
                {editingEntrega && (
                    <form onSubmit={handleCalificar}>
                        <div className="info-entrega">
                            <p><strong>Estudiante:</strong> {editingEntrega.estudiante_nombre}</p>
                            <p><strong>Código:</strong> {editingEntrega.estudiante_codigo}</p>
                            <p><strong>Tarea:</strong> {editingEntrega.tarea_titulo}</p>
                            <p><strong>Fecha entrega:</strong> {
                                new Date(editingEntrega.fecha_entrega).toLocaleDateString("es-ES")
                            }</p>
                            {editingEntrega.nota && (
                                <p><strong>Nota actual:</strong> <span style={{ fontWeight: "bold", color: editingEntrega.nota >= 60 ? "#065f46" : "#991b1b" }}>
                                    {editingEntrega.nota.toFixed(1)}
                                </span></p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Nota (0-100) *</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={formData.nota || editingEntrega.nota || ""}
                                onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
                                required
                                placeholder="85.5"
                            />
                        </div>

                        <div className="form-group">
                            <label>Retroalimentación</label>
                            <textarea
                                rows="5"
                                value={formData.retroalimentacion_docente || ""}
                                onChange={(e) => setFormData({ ...formData, retroalimentacion_docente: e.target.value })}
                                placeholder="Excelente trabajo..."
                            />
                        </div>

                        <div className="modal-actions">
                            <button type="submit" className="btn-primary">
                                {editingEntrega.nota ? "Actualizar Calificación" : "Guardar Calificación"}
                            </button>
                            <button type="button" onClick={cerrarModal} className="btn-secondary">
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default EntregasDocente;