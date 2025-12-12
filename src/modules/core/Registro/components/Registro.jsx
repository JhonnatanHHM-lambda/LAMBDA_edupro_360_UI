import { useState } from "react";
import "../utils/Registro.scss";
import { Link, useNavigate } from "react-router-dom";
import useRegistro from "../hooks/useRegistro";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiOutlineLogin } from "react-icons/hi";

const Registro = () => {
    const {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
    } = useRegistro();

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(prev => !prev);

    return (
        <div className="registro-container">
            <div className="registro-card">

                <h1>Crear cuenta</h1>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-grid">
                        {/* Cédula */}
                        <div className="form-field">
                            <label htmlFor="cedula">Cédula</label>
                            <input
                                type="text"
                                id="cedula"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleChange}
                                placeholder="Ej: 0958478263"
                                disabled={isSubmitting}
                            />
                            {errors.cedula && <span className="error-text">{errors.cedula.join(" ")}</span>}
                        </div>

                        {/* Teléfono */}
                        <div className="form-field">
                            <label htmlFor="telefono">Teléfono</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="Ej: 3105978462"
                                disabled={isSubmitting}
                            />
                            {errors.telefono && <span className="error-text">{errors.telefono.join(" ")}</span>}
                        </div>

                        {/* Nombres */}
                        <div className="form-field">
                            <label htmlFor="nombres">Nombres</label>
                            <input
                                type="text"
                                id="nombres"
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                placeholder="Tus nombres"
                                disabled={isSubmitting}
                            />
                            {errors.nombres && <span className="error-text">{errors.nombres.join(" ")}</span>}
                        </div>

                        {/* Apellidos */}
                        <div className="form-field">
                            <label htmlFor="apellidos">Apellidos</label>
                            <input
                                type="text"
                                id="apellidos"
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                placeholder="Tus apellidos"
                                disabled={isSubmitting}
                            />
                            {errors.apellidos && <span className="error-text">{errors.apellidos.join(" ")}</span>}
                        </div>

                        {/* Correo */}
                        <div className="form-field full-width">
                            <label htmlFor="correo">Correo electrónico</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                autoComplete="off"
                                value={formData.correo}
                                onChange={handleChange}
                                placeholder="tucorreo@ejemplo.com"
                                disabled={isSubmitting}
                            />
                            {errors.correo && <span className="error-text">{errors.correo.join(" ")}</span>}
                        </div>

                        {/* Fecha nacimiento */}
                        <div className="form-field">
                            <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
                            <input
                                type="date"
                                id="fecha_nacimiento"
                                name="fecha_nacimiento"
                                value={formData.fecha_nacimiento}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            {errors.fecha_nacimiento && <span className="error-text">{errors.fecha_nacimiento.join(" ")}</span>}
                        </div>

                        {/* Género */}
                        <div className="form-field">
                            <label htmlFor="genero">Género</label>
                            <select
                                id="genero"
                                name="genero"
                                value={formData.genero}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            >
                                <option value="">Seleccionar</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </select>
                            {errors.genero && <span className="error-text">{errors.genero.join(" ")}</span>}
                        </div>

                        {/* Contraseña */}
                        <div className="form-field full-width">
                            <label htmlFor="password">Contraseña</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    autoComplete="off"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Crea una contraseña segura"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="toggle-btn"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                            {errors.password && <span className="error-text">{errors.password.join(" ")}</span>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creando cuenta..." : "Registrar usuario"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Registro;