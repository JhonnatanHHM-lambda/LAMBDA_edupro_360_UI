import React from 'react';
import Swal from 'sweetalert2';
import '../utils/AuthLayout.scss';
import useReset from '../hooks/useReset';
import { FiMail } from "react-icons/fi";

const RestablecerClave = ({ setIsLogin }) => {
    const { correo, setCorreo, errors, handleReset, success } = useReset();

    React.useEffect(() => {
        if (success) {
            Swal.fire({
                icon: 'success',
                title: '¡Correo enviado!',
                text: 'Revisa tu bandeja de entrada. Te hemos enviado las instrucciones.',
                confirmButtonText: 'Volver al login',
                confirmButtonColor: '#10b981',
            }).then(() => setIsLogin(true));
        }
    }, [success, setIsLogin]);

    React.useEffect(() => {
        if (errors.correo) {
            Swal.fire('Error', errors.correo.join(' '), 'error');
        }
    }, [errors]);

    if (success) return null;

    return (
        <div className="auth-wrapper">

            {/* LADO DERECHO - FORMULARIO RESTABLECER */}
            <div className="auth-right">
                <div className="auth-container">
                    <div className="auth-header">
                        <h2>Restablecer contraseña</h2>
                        <p>Ingresa tu correo y te enviaremos las instrucciones</p>
                    </div>

                    <form onSubmit={handleReset} className="auth-form">
                        <div className="auth-group">
                            <label>Correo electrónico</label>
                            <div className="auth-password">
                                <input
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    placeholder="tu@correo.com"
                                    required
                                />
                                <FiMail size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            </div>
                            {errors.correo && <span className="error-text">{errors.correo.join(" ")}</span>}
                        </div>

                        <div className="form-options">
                            <button type="button" onClick={() => setIsLogin(true)} className="link-button">
                                ← Volver al login
                            </button>
                        </div>

                        <button type="submit" className="auth-btn">
                            Enviar instrucciones
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RestablecerClave;