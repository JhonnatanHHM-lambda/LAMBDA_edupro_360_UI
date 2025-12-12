import useTareas from "../hooks/useTareas";
import DataTable from "../../core/Tabla/components/DataTable";
import Modal from "../../core/Modal/components/Modal";
import "../utils/Tareas.scss";

const Tareas = () => {
    const {
        tareas,
        asignaturas,
        loading,
        modalOpen,
        editingTarea,
        formData,
        setFormData,
        abrirModalCrear,
        abrirModalEditar,
        cerrarModal,
        handleSubmit,
        eliminarTarea,
    } = useTareas();

    // Mapa rápido para buscar asignatura por ID
    const asignaturaMap = Object.fromEntries(
        asignaturas.map(a => [a.id, a])
    );

    const columns = [
        {
            key: "codigo",
            label: "Código",
            render: (row) => asignaturaMap[row.asignatura]?.codigo || "-",
        },
        {
            key: "asignatura",
            label: "Asignatura",
            render: (row) => asignaturaMap[row.asignatura]?.nombre || "Sin asignatura",
        },
        {
            key: "titulo",
            label: "Título",
            sortable: true
        },
        {
            key: "tipo_tarea",
            label: "Tipo",
            render: (row) => (
                <span className={`tag tipo ${row.tipo_tarea === "E" ? "examen" : "tarea"}`}>
                    {row.tipo_tarea === "E" ? "EXAMEN" : "TAREA"}
                </span>
            ),
        },
        {
            key: "peso_porcentual",
            label: "Peso %",
            render: (row) => `${row.peso_porcentual}%`,
        },
        {
            key: "fecha_vencimiento",
            label: "Vence",
            render: (row) => {
                const fecha = new Date(row.fecha_vencimiento);
                return fecha.toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                });
            },
        },
    ];

    return (
            <div className="tareas-container">
                <div className="header">
                    <h1>Gestión de Actividades
                            <button onClick={abrirModalCrear} className="btn-crear">
                                +
                            </button>
                    </h1>
                </div>

                <DataTable
                    data={tareas}
                    columns={columns}
                    loading={loading}
                    emptyMessage="No has creado tareas aún"
                    renderActions={
                        // Aquí usamos una expresión condicional (ternaria) válida en JSX
                        localStorage.getItem("user") &&
                            JSON.parse(localStorage.getItem("user") || "{}").permisos_rol?.includes("change_tarea")
                            ? (row) => (
                                <div className="table-actions">
                                    <button
                                        onClick={() => abrirModalEditar(row)}
                                        className="action-btn edit"
                                        title="Editar actividad"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5l3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => eliminarTarea(row)}
                                        className="action-btn delete"
                                        title="Eliminar actividad"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            )
                            : () => null  // No tiene permiso → celda vacía, pero la columna SÍ aparece
                    }
                />

                {/* Modal de Crear/Editar */}
                <Modal
                    isOpen={modalOpen}
                    onClose={cerrarModal}
                    title={editingTarea ? "Editar Actividad" : "Crear Nueva Actividad"}
                >
                        <form onSubmit={handleSubmit}>
                            {/* Asignatura */}
                            <div className="form-grid full-width">
                                <div className="form-group">
                                    <label>Asignatura *</label>
                                    <select
                                        value={formData.asignatura}
                                        onChange={(e) => setFormData({ ...formData, asignatura: e.target.value })}
                                        required
                                    >
                                        <option value="">Seleccionar asignatura</option>
                                        {asignaturas.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.codigo} - {a.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Título y Tipo */}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Título *</label>
                                    <input
                                        type="text"
                                        value={formData.titulo}
                                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                        required
                                        maxLength="100"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tipo *</label>
                                    <select
                                        value={formData.tipo_tarea}
                                        onChange={(e) => setFormData({ ...formData, tipo_tarea: e.target.value })}
                                    >
                                        <option value="T">Tarea</option>
                                        <option value="E">Examen</option>
                                    </select>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="form-grid full-width">
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <textarea
                                        rows="4"
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                        placeholder="Instrucciones detalladas para los estudiantes..."
                                    />
                                </div>
                            </div>

                            {/* Fechas */}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Fecha de Publicación *</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.fecha_publicacion}
                                        onChange={(e) => setFormData({ ...formData, fecha_publicacion: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Fecha de Vencimiento *</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.fecha_vencimiento}
                                        onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Peso */}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Peso porcentual *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max="100"
                                        value={formData.peso_porcentual}
                                        onChange={(e) => setFormData({ ...formData, peso_porcentual: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">
                                    {editingTarea ? "Actualizar" : "Crear"} Actividad
                                </button>
                                <button type="button" onClick={cerrarModal} className="btn-secondary">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                </Modal>
            </div>
    );
};

export default Tareas;