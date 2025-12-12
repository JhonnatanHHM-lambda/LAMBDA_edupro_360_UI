import useUsuarios from "../hooks/useUsuarios";
import DataTable from "../../core/Tabla/components/DataTable";
import Modal from "../../core/Modal/components/Modal";
import "../utils/Usuarios.scss";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Usuarios = () => {
    const {
        usuarios,
        loading,
        modalOpen,
        editingUsuario,
        formData,
        setFormData,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        gruposDisponibles,
        abrirModalCrear,
        abrirModalEditar,
        cerrarModal,
        handleSubmit,
        eliminarUsuario,
        toggleGrupo,
    } = useUsuarios();

    const columns = [
        { key: "nombre_completo", label: "Nombre Completo", sortable: true },
        { key: "correo", label: "Correo", sortable: true },
        { key: "cedula", label: "Cédula", sortable: true },
        {
            key: "rol",
            label: "Rol Principal",
            render: (row) => (
                <span className={`tag rol ${row.rol?.toLowerCase() || "sinrol"}`}>
                    {row.rol || "Sin rol"}
                </span>
            ),
        },
        { key: "telefono", label: "Teléfono" },
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
        <div className="usuarios-container">
            <div className="header">
                <h1>Gestión de Usuarios<button onClick={abrirModalCrear} className="btn-crear-usuario">
                    +
                </button></h1>

            </div>

            <DataTable
                data={usuarios}
                columns={columns}
                onEdit={abrirModalEditar}
                onDelete={eliminarUsuario}
                loading={loading}
                emptyMessage="No hay usuarios registrados"
                renderActions={(row) => (
                    <div className="table-actions">
                        <button onClick={() => abrirModalEditar(row)} className="action-btn edit" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5l3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button onClick={() => eliminarUsuario(row)} className="action-btn delete" title="Eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                )}
            />

            <Modal
                isOpen={modalOpen}
                onClose={cerrarModal}
                title={editingUsuario ? "Editar Usuario" : "Crear Nuevo Usuario"}
            >
                <form onSubmit={handleSubmit}>
                    {/* Fila 1: Nombres y Apellidos */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nombres *</label>
                            <input
                                type="text"
                                value={formData.nombres || ""}
                                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellidos *</label>
                            <input
                                type="text"
                                value={formData.apellidos || ""}
                                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Fila 2: Cédula y Teléfono */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Cédula *</label>
                            <input
                                type="text"
                                value={formData.cedula || ""}
                                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="text"
                                value={formData.telefono || ""}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Fila 3: Correo (ancho completo) */}
                    <div className="form-grid full-width">
                        <div className="form-group">
                            <label>Correo Electrónico *</label>
                            <input
                                type="email"
                                value={formData.correo || ""}
                                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Fila 4: Fecha y Género */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Fecha de Nacimiento</label>
                            <input
                                type="date"
                                value={formData.fecha_nacimiento || ""}
                                onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Género</label>
                            <select
                                value={formData.genero || ""}
                                onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                            >
                                <option value="">Seleccionar</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </select>
                        </div>
                    </div>

                    {/* Fila 5: Contraseña (ancho completo) */}
                    <div className="form-grid full-width">
                        <div className="form-group">
                            <label>
                                Contraseña {editingUsuario ? "(dejar vacío para no cambiar)" : "*"}
                            </label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password || ""}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={editingUsuario ? "••••••••" : ""}
                                    minLength="8"
                                    {...(!editingUsuario && { required: true })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="toggle-password-btn"
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Confirmar contraseña (solo al crear) */}
                    {!editingUsuario && (
                        <div className="form-grid full-width">
                            <div className="form-group">
                                <label>Confirmar Contraseña *</label>
                                <div className="password-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="toggle-password-btn"
                                    >
                                        {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Roles */}
                    <div className="form-grid full-width">
                        <div className="form-group">
                            <label>Roles (Grupos)</label>
                            <div className="grupos-grid">
                                {gruposDisponibles.map((grupo) => (
                                    <label key={grupo.name} className="grupo-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={formData.grupos.includes(grupo.name)}
                                            onChange={() => toggleGrupo(grupo.name)}
                                        />
                                        <span>{grupo.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">
                            {editingUsuario ? "Actualizar" : "Crear"} Usuario
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

export default Usuarios;