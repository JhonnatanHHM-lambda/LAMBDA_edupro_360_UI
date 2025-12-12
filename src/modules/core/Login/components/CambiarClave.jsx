import React, { useState } from 'react';
import Swal from 'sweetalert2';
import "../utils/AuthLayout.scss"
import useCambiarClave from '../hooks/useCambiarClave';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import logo from "../../../../assets/LogoUni.png";

export default function CambiarClave() {
    const { newPassword, errors, setNewPassword, handleChangePassword } = useCambiarClave();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordsMatch) {
            Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
            return;
        }
        await handleChangePassword(e);
    };

    return (
        <div className="auth-wrapper">

            {/* LADO IZQUIERDO */}
            <div className="auth-left">
                <div className="auth-overlay">
                    <div className="auth-brand">
                        <img src={logo} alt="EduPro 360" className="auth-logo" />
                        <h1>EduPro 360</h1>
                        <p>Gestión Académica Integral</p>
                    </div>
                </div>
            </div>

            {/* LADO DERECHO - NUEVA CONTRASEÑA */}
            <div className="auth-right">
                <div className="auth-container-cc">
                    <div className="auth-header">
                        <h2>Crear nueva contraseña</h2>
                        <p>Ingresa y confirma tu nueva contraseña</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-group">
                            <label>Nueva contraseña</label>
                            <div className="password-input">
                                <input
                                    className='auth-input'
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                                {confirmPassword && (
                                    <div className={`password-match-indicator ${passwordsMatch ? 'match' : 'no-match'}`}>
                                        {passwordsMatch ? <FiCheck /> : <FiX />}
                                    </div>
                                )}
                            </div>
                            {errors.new_password && <span className="error-text">{errors.new_password.join(" ")}</span>}
                        </div>

                        <div className="auth-group">
                            <label>Confirmar contraseña</label>
                            <div className="password-input ">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                {confirmPassword && (
                                    <div className={`password-match-indicator ${passwordsMatch ? 'match' : 'no-match'}`}>
                                        {passwordsMatch ? <FiCheck /> : <FiX />}
                                    </div>
                                )}
                            </div>
                            {confirmPassword && !passwordsMatch && (
                                <span className="error-text">Las contraseñas no coinciden</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={!passwordsMatch || !newPassword}
                        >
                            Cambiar contraseña
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>© 2025 EduPro 360 — Todos los derechos reservados</p>
                    </div>
                </div>
            </div>
        </div>
    );
}