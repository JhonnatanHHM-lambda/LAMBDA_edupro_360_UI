import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../../services/api";
import { FiEye, FiEyeOff } from "react-icons/fi";

const CambiarContrasenaForm = ({ onSuccess }) => {
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const [form, setForm] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
        if (name === "new_password" || name === "confirm_password") {
            setErrors((prev) => ({ ...prev, confirm_password: null }));
        }
    };

    const toggleVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validación local
        if (form.new_password !== form.confirm_password) {
            setErrors({ confirm_password: ["Las contraseñas no coinciden"] });
            return;
        }

        const result = await Swal.fire({
            title: "¿Cambiar contraseña?",
            text: "Se cerrará tu sesión actual después de cambiarla",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#fbbf24",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Sí, cambiar",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        Swal.fire({
            title: "Actualizando contraseña...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            await api.post("cambiar-contrasena/", {
                old_password: form.old_password,
                new_password: form.new_password,
            });

            await Swal.fire({
                icon: "success",
                title: "¡Contraseña actualizada!",
                text: "Por seguridad, inicia sesión nuevamente.",
                confirmButtonColor: "#10b981",
                timer: 2500,
                timerProgressBar: true,
            });

            onSuccess(); // Cierra el modal

        } catch (error) {
            const data = error.response?.data || {};
            setErrors(data);

            let errorMsg = "No se pudo cambiar la contraseña";

            if (data.old_password) errorMsg = data.old_password.join(" ");
            else if (data.new_password) errorMsg = data.new_password.join(" ");
            else if (data.detail) errorMsg = data.detail;
            else if (data.non_field_errors) errorMsg = data.non_field_errors.join(" ");

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMsg,
                confirmButtonColor: "#ef4444",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Contraseña Actual */}
            <div className="form-grid full-width">
                <div className="form-group">
                    <label>Contraseña Actual *</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword.old ? "text" : "password"}
                            name="old_password"
                            value={form.old_password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => toggleVisibility("old")}
                            tabIndex="-1"
                        >
                            {showPassword.old ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>
                    {errors.old_password && (
                        <span className="error-text">
                            {errors.old_password.join(" ")}
                        </span>
                    )}
                </div>
            </div>

            {/* Nueva Contraseña */}
            <div className="form-grid full-width">
                <div className="form-group">
                    <label>Nueva Contraseña *</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword.new ? "text" : "password"}
                            name="new_password"
                            value={form.new_password}
                            onChange={handleChange}
                            required
                            minLength="8"
                            placeholder="Mínimo 8 caracteres"
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => toggleVisibility("new")}
                            tabIndex="-1"
                        >
                            {showPassword.new ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>
                    {errors.new_password && (
                        <span className="error-text">
                            {errors.new_password.join(" ")}
                        </span>
                    )}
                </div>
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div className="form-grid full-width">
                <div className="form-group">
                    <label>Confirmar Nueva Contraseña *</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword.confirm ? "text" : "password"}
                            name="confirm_password"
                            value={form.confirm_password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => toggleVisibility("confirm")}
                            tabIndex="-1"
                        >
                            {showPassword.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>
                    {errors.confirm_password && (
                        <span className="error-text">
                            {errors.confirm_password.join?.(" ") || errors.confirm_password}
                        </span>
                    )}
                </div>
            </div>

            {/* Botones del Modal */}
            <div className="modal-actions">
                <button type="submit" className="btn-primary">
                    Cambiar Contraseña
                </button>
                <button type="button" className="btn-secondary" onClick={onSuccess}>
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default CambiarContrasenaForm;