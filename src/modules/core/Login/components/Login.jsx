import { useState } from "react";
import "../utils/Login.scss";
import RestablecerClave from './RestablecerClave';
import useAuth from "../hooks/useAuth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../../../../assets/LogoUni.png";

const Login = () => {
    const { correo, password, errors, setCorreo, setPassword, handleLogin } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="login-wrapper">
            {/* LADO IZQUIERDO */}
            <div className="login-left">
                <div className="login-overlay">
                    <div className="login-brand">
                        <img src={logo} alt="EduPro 360" className="login-logo" />
                        <h1>EduPro 360</h1>
                        <p>Gestión Académica Integral</p>
                    </div>
                </div>
            </div>

            {/* LADO DERECHO */}
            <div className="login-right">
                <div className="login-container">
                    {isLogin ? (
                        <>
                            <div className="login-header">
                                <h2>¡Bienvenido!</h2>
                                <p>Inicia sesión para continuar</p>
                            </div>

                            <form onSubmit={handleLogin} autoComplete="off" className="login-form">
                                <div className="form-group">
                                    <label>Correo electrónico</label>
                                    <input
                                        type="email"
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        placeholder="tu@correo.com"
                                        required
                                    />
                                    {errors.correo && <span className="error-text">{errors.correo.join(" ")}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Contraseña</label>
                                    <div className="password-input">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="toggle-password"
                                        >
                                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                        </button>
                                    </div>
                                    {errors.password && <span className="error-text">{errors.password.join(" ")}</span>}
                                </div>

                                <div className="form-options">
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(false)}
                                        className="link-button"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>

                                <button type="submit" className="login-btn">
                                    Iniciar Sesión
                                </button>
                            </form>

                        </>
                    ) : (
                        <RestablecerClave setIsLogin={setIsLogin} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;