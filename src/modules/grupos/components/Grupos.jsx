import useGrupos from "../hooks/useGrupos";
import DataTable from "../../core/Tabla/components/DataTable";
import Modal from "../../core/Modal/components/Modal";
import TienePermiso from "../../core/TienePermiso/components/TienePermiso";
import { permisosTraducidos } from "../utils/permisosTraducidos";
import "../utils/Grupos.scss";

const Grupos = () => {
    const {
        grupos,
        loading,
        modalOpen,
        editingGrupo,
        formData,
        setFormData,
        permisosDisponibles,
        abrirModal,
        cerrarModal,
        handleSubmit,
        eliminarGrupo,
        togglePermiso,
    } = useGrupos();

    const columns = [
        { key: "name", label: "Nombre del Rol", sortable: true },
        {
            key: "permisos_leidos",
            label: "Permisos",
            render: (row) => (
                <div className="permisos-tags">
                    {row.permisos_leidos.slice(0, 3).map((p) => (
                        <span key={p} className="tag permiso">
                            {permisosTraducidos[p] || p}
                        </span>
                    ))}
                    {row.permisos_leidos.length > 3 && (
                        <span className="tag more">+{row.permisos_leidos.length - 3}</span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <TienePermiso permiso="view_group" silent={false}>
            <div className="grupos-container">
                <div className="header">
                    <h1>
                        Gestión de Roles
                        <TienePermiso permiso="add_group">
                            <button onClick={() => abrirModal()} className="btn-crear">
                                +
                            </button>
                        </TienePermiso>
                    </h1>
                </div>

                <DataTable
                    data={grupos}
                    columns={columns}
                    onEdit={abrirModal}
                    onDelete={eliminarGrupo}
                    loading={loading}
                    emptyMessage="No hay roles creados"
                    editPermission="change_group"
                    deletePermission="delete_group"
                    renderActions={(row) => (
                        <div className="table-actions">
                            <TienePermiso permiso="change_group">
                                <button
                                    onClick={() => abrirModal(row)}
                                    className="action-btn edit"
                                    title="Editar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5l3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                            </TienePermiso>
                            <TienePermiso permiso="delete_group">
                                <button
                                    onClick={() => eliminarGrupo(row)}
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
                    title={editingGrupo ? "Editar Rol" : "Crear Nuevo Rol"}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid full-width">
                            <div className="form-group">
                                <label>Nombre del Rol *</label>
                                <input
                                    type="text"
                                    value={formData.name || ""}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    autoFocus
                                    placeholder="Ej: Administrador, Docente, Estudiante"
                                />
                            </div>
                        </div>

                        <div className="form-grid full-width">
                            <div className="form-group">
                                <label>Permisos del Rol</label>
                                <div className="permisos-grid">
                                    {permisosDisponibles.map((codename) => (
                                        <label key={codename} className="permiso-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={formData.permisos.includes(codename)}
                                                onChange={() => togglePermiso(codename)}
                                            />
                                            <span>{permisosTraducidos[codename] || codename}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="submit" className="btn-primary">
                                {editingGrupo ? "Actualizar" : "Crear"} Rol
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

export default Grupos;