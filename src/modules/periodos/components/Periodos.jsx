import { useState } from "react";
import DataTable from "../../core/Tabla/components/DataTable";
import Modal from "../../core/Modal/components/Modal";
import TienePermiso from "../../core/TienePermiso/components/TienePermiso";
import { usePeriodos } from "../hooks/usePeriodos";
import "../utils/Periodos.scss";

const Periodos = () => {
    const { periodos, loading, crearPeriodo, actualizarPeriodo, eliminarPeriodo } = usePeriodos();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingPeriodo, setEditingPeriodo] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        fecha_inicio: "",
        fecha_fin: "",
        estado: true,
    });

    // Resetear formulario al abrir modal
    const abrirModalCrear = () => {
        setEditingPeriodo(null);
        setFormData({ nombre: "", fecha_inicio: "", fecha_fin: "", estado: true });
        setModalOpen(true);
    };

    const abrirModalEditar = (row) => {
        setEditingPeriodo(row);
        setFormData({
            nombre: row.nombre || "",
            fecha_inicio: row.fecha_inicio || "",
            fecha_fin: row.fecha_fin || "",
            estado: row.estado ?? true,
        });
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setEditingPeriodo(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            nombre: formData.nombre.trim(),
            fecha_inicio: formData.fecha_inicio,
            fecha_fin: formData.fecha_fin,
            estado: formData.estado,
        };

        try {
            if (editingPeriodo) {
                await actualizarPeriodo(editingPeriodo.id, data);
            } else {
                await crearPeriodo(data);
            }
            cerrarModal();
        } catch (err) {

        }
    };

    const columns = [
        { key: "nombre", label: "Nombre del Período", sortable: true },
        {
            key: "fecha_inicio",
            label: "Fecha Inicio",
            render: (row) => {
                if (!row.fecha_inicio) return "Sin fecha";
                const [year, month, day] = row.fecha_inicio.split("-");
                const date = new Date(year, month - 1, day); 
                return date.toLocaleDateString("es-ES");
            },
        },
        {
            key: "fecha_fin",
            label: "Fecha Fin",
            render: (row) => {
                if (!row.fecha_fin) return "Sin fecha";
                const [year, month, day] = row.fecha_fin.split("-");
                const date = new Date(year, month - 1, day);
                return date.toLocaleDateString("es-ES");
            },
        },
        {
            key: "estado",
            label: "Estado",
            render: (row) => (
                <span className={`tag estado ${row.estado ? "active" : "inactive"}`}>
                    {row.estado ? "Activo" : "Inactivo"}
                </span>
            ),
        },
    ];

    return (
        <TienePermiso permiso="view_periodoacademico" silent={false}>
            <div className="periodos-container">
                <div className="header">
                    <h1>
                        Períodos Académicos
                        <TienePermiso permiso="add_periodoacademico">
                            <button onClick={abrirModalCrear} className="btn-crear">
                                +
                            </button>
                        </TienePermiso>
                    </h1>
                </div>

                <DataTable
                    data={periodos}
                    columns={columns}
                    onEdit={abrirModalEditar}
                    onDelete={(row) => eliminarPeriodo(row.id)}
                    loading={loading}
                    emptyMessage="No hay períodos académicos registrados"
                    editPermission="change_periodoacademico"
                    deletePermission="delete_periodoacademico"
                    renderActions={(row) => (
                        <div className="table-actions">
                            <TienePermiso permiso="change_periodoacademico">
                                <button
                                    onClick={() => abrirModalEditar(row)}
                                    className="action-btn edit"
                                    title="Editar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5l3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                            </TienePermiso>
                            <TienePermiso permiso="delete_periodoacademico">
                                <button
                                    onClick={() => eliminarPeriodo(row.id)}
                                    className="action-btn delete"
                                    title="Eliminar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                            </TienePermiso>
                        </div>
                    )}
                />

                <Modal
                    isOpen={modalOpen}
                    onClose={cerrarModal}
                    title={editingPeriodo ? "Editar Período Académico" : "Crear Nuevo Período"}
                >
                    <form onSubmit={handleSubmit}>
                        {/* Nombre del período */}
                        <div className="form-grid full-width">
                            <div className="form-group">
                                <label>Nombre del Período *</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej: PERIODO I - 2025"
                                    required
                                />
                            </div>
                        </div>

                        {/* Fechas */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Fecha de Inicio *</label>
                                <input
                                    type="date"
                                    value={formData.fecha_inicio}
                                    onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Fecha de Fin *</label>
                                <input
                                    type="date"
                                    value={formData.fecha_fin}
                                    onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Estado */}
                        <div className="form-grid full-width">
                            <div className="form-group">
                                <label>Estado</label>
                                <div className="checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.estado}
                                            onChange={(e) => setFormData({ ...formData, estado: e.target.checked })}
                                        />
                                        <span>Período activo</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="submit" className="btn-primary">
                                {editingPeriodo ? "Actualizar" : "Crear"} Período
                            </button>
                            <button type="button" onClick={cerrarModal} className="btn-secondary">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </TienePermiso>
    );
};

export default Periodos;