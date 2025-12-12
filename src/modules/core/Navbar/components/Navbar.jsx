import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../utils/Navbar.scss";

const Navbar = () => {
    const [user, setUser] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(storedUser);
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: "¿Cerrar sesión?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, cerrar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc2626",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                navigate("/");
            }
        });
    };

    const menuItems = [
        { label: "Inicio", path: "/app/inicio" },
        { label: "Períodos", path: "/app/periodos" },
        { label: "Usuarios", path: "/app/usuarios" },
        { label: "Grupos / Roles", path: "/app/grupos" },
    ];

    return (
        <header className="navbar">
            <div className="navbar-container">
                {/* Menú hamburguesa (izquierda) */}
                <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                {/* Usuario + engranaje (derecha) */}
                <div className="user-section">
                    <div className="user-info" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                        <div className="user-text">
                            <strong>{user.nombre_completo || "Usuario"}</strong>
                            <span className="user-role">{user.rol || "Sin rol"}</span>
                        </div>
                        <div className="user-gear">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Dropdown del usuario */}
                    {userMenuOpen && (
                        <div className="user-dropdown">
                            <Link to="/app/perfil" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                Mi Perfil
                            </Link>
                            <button className="dropdown-item logout" onClick={handleLogout}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Menú lateral que se abre desde el hamburguesa */}
            {menuOpen && (
                <>
                    <div className="navbar-menu-overlay" onClick={() => setMenuOpen(false)} />
                    <div className="navbar-menu">
                        <div className="navbar-menu-header">
                            <strong>Menú</strong>
                            <button onClick={() => setMenuOpen(false)}>×</button>
                        </div>
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="navbar-menu-item"
                                onClick={() => setMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </header>
    );
};

export default Navbar;