import useAsignaturas from "../hooks/useAsignaturas";
import DataTable from "../../core/Tabla/components/DataTable";
import Modal from "../../core/Modal/components/Modal";
import "../utils/Asignaturas.scss";

const Asignaturas = () => {
    const {
        asignaturas,
        periodos,
        docentes,
        loading,
        modalOpen,
        editingAsignatura,
        formData,
        setFormData,
        abrirModalCrear,
        abrirModalEditar,
        cerrarModal,
        handleSubmit,
        eliminarAsignatura,
    } = useAsignaturas();

    const columns = [
        { key: "codigo", label: "Código", sortable: true },
        { key: "nombre", label: "Nombre", sortable: true },
        {
            key: "periodo_academico",
            label: "Período",
            render: (row) => row.periodo_nombre || "Sin período",
        },
        {
            key: "docente_responsable",
            label: "Docente",
            render: (row) => row.docente_nombre || "Sin asignar",
        },
        {
            key: "estado",
            label: "Estado",
            render: (row) => (
                <span className={`tag estado ${row.estado ? "active" : "inactive"}`}>
                    {row.estado ? "Activa" : "Inactiva"}
                </span>
            ),
        },
    ];
    return (
        <div className="asignaturas-container">
            <div className="header">
                <h1>Gestión de Asignaturas
                    <button onClick={abrirModalCrear} className="btn-crear">+</button>
                </h1>
            </div>

            <DataTable
                data={asignaturas}
                columns={columns}
                onEdit={abrirModalEditar}
                onDelete={eliminarAsignatura}
                loading={loading}
                emptyMessage="No hay asignaturas registradas"
                renderActions={(row) => (
                    <div className="table-actions">
                        <button onClick={() => abrirModalEditar(row)} className="action-btn edit" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5l3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button onClick={() => eliminarAsignatura(row)} className="action-btn delete" title="Desactivar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                )}
            />

            <Modal
                isOpen={modalOpen}
                onClose={cerrarModal}
                title={editingAsignatura ? "Editar Asignatura" : "Crear Nueva Asignatura"}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nombre *</label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Código</label>
                            <input
                                type="text"
                                value={formData.codigo}
                                disabled
                                placeholder="Se genera automáticamente"
                            />
                        </div>
                    </div>

                    <div className="form-grid full-width">
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                rows="3"
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Período Académico *</label>
                            <select
                                value={formData.periodo_academico}
                                onChange={(e) => setFormData({ ...formData, periodo_academico: e.target.value })}
                                required
                            >
                                <option value="">Seleccionar período</option>
                                {periodos.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Docente Responsable</label>
                            <select
                                value={formData.docente_responsable}
                                onChange={(e) => setFormData({ ...formData, docente_responsable: e.target.value })}
                            >
                                <option value="">Sin docente</option>
                                {docentes.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.obtener_nombre_completo || `${d.nombres} ${d.apellidos}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">
                            {editingAsignatura ? "Actualizar" : "Crear"} Asignatura
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

export default Asignaturas;