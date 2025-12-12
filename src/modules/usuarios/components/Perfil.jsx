import { useState } from "react";
import usePerfil from "../hooks/usePerfil";
import Modal from "../../core/Modal/components/Modal";
import CambiarContrasenaForm from "./CambiarContrasenaForm";
import "../utils/Perfil.scss";
import Swal from "sweetalert2";
import { FiUser, FiUserCheck } from "react-icons/fi";
import { HiOutlineLogin } from "react-icons/hi";
import { Link } from "react-router-dom";

const Perfil = () => {
    const {
        userData,
        formData,
        errors,
        isLoading,
        isEditing,
        setIsEditing,
        handleChange,
        handleSubmit,
    } = usePerfil();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (isLoading) {
        return (
            <div className="perfil-loading">
                <div className="spinner"></div>
                <p>Cargando perfil...</p>
            </div>
        );
    }

    // Avatar según género
    const getAvatarIcon = () => {
        if (!userData?.genero) return <FiUser size={50} />;
        if (userData.genero === "M") {
            return <div className="avatar-male"><FiUserCheck size={50} /></div>;
        }
        if (userData.genero === "F") {
            return <div className="avatar-female"><FiUserCheck size={50} /></div>;
        }
        return <FiUser size={50} />;
    };

    return (
        <div className="perfil-container">
            <div className="perfil-card">
                <div className="back-btn">
                    <Link to="/app/inicio" className="Login-btn">
                        <HiOutlineLogin size={28} color="black" />
                    </Link>
                </div>

                <div className="perfil-header">
                    <div className="avatar-wrapper">
                        <div className="avatar">
                            {getAvatarIcon()}
                        </div>
                    </div>
                    <h1>Perfil</h1>
                    <p>{userData?.nombre_completo || `${userData?.nombres} ${userData?.apellidos}`}</p>
                </div>

                <form id="perfil-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Cédula</label>
                            <input
                                type="text"
                                value={userData?.cedula || ""}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nombres">Nombres</label>
                            <input
                                type="text"
                                id="nombres"
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                            {errors.nombres && <span className="error-text">{errors.nombres.join(" ")}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="apellidos">Apellidos</label>
                            <input
                                type="text"
                                id="apellidos"
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                            {errors.apellidos && <span className="error-text">{errors.apellidos.join(" ")}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="correo">Correo electrónico</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                            {errors.correo && <span className="error-text">{errors.correo.join(" ")}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                            {errors.telefono && <span className="error-text">{errors.telefono.join(" ")}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
                            <input
                                type="date"
                                id="fecha_nacimiento"
                                name="fecha_nacimiento"
                                value={formData.fecha_nacimiento}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="genero">Género</label>
                            <select
                                id="genero"
                                name="genero"
                                value={formData.genero}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <button
                                type="button"
                                className="btn-cambiar-clave"
                                onClick={() => {
                                    Swal.fire({
                                        title: "¿Cambiar contraseña?",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonText: "Sí, cambiar",
                                        cancelButtonText: "Cancelar",
                                        confirmButtonColor: '#10b981',
                                        cancelButtonColor: '#ef4444',
                                    }).then((result) => {
                                        if (result.isConfirmed) openModal();
                                    });
                                }}
                            >
                                Cambiar contraseña
                            </button>
                        </div>
                    </div>
                </form>

                <div className="actions">
                    {isEditing ? (
                        <>
                            <button type="submit" form="perfil-form" className="btn-primary">
                                Guardar cambios
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                        >
                            Editar perfil
                        </button>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title="Cambiar contraseña">
                <CambiarContrasenaForm onSuccess={closeModal} />
            </Modal>
        </div>
    );
};

export default Perfil;