import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../../../assets/LogoUni.png";
import "../utils/Sidebar.scss";

const menuItems = [
    {
        label: "Inicio",
        path: "/app/dashboard",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        ),
        permiso: "can_view_own_grades",
    },
    {
        label: "Inicio",
        path: "/app/dashboard-docente",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        ),
        permiso: "can_grade_task",
    },
    {
        label: "Períodos",
        path: "/app/periodos",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
        ),
        permiso: "change_periodoacademico",
    },
    {
        label: "Asignaturas",
        path: "/app/asignaturas",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                <path d="M9 7h6"></path>
                <path d="M9 11h6"></path>
                <path d="M9 15h4"></path>
            </svg>
        ),
        permiso: "change_asignatura",
    },
    {
        label: "Entregas",
        path: "/app/entregas-docente",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
        ),
        permiso: "can_grade_task",
    },
    {
        label: "Inscripciones",
        path: "/app/inscripciones",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <path d="M9 14l2 2 4-4"></path>
            </svg>
        ),
        permiso: "puede_inscribirse",
    },
    {
        label: "Actividades",
        path: "/app/tareas",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                <path d="M12 3a9 9 0 0 1 0 18"></path>
            </svg>
        ),
        permiso: "view_tarea",
    },
    {
        label: "Mis Actividades",
        path: "/app/mis-tareas",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                <path d="M12 3a9 9 0 0 1 0 18"></path>
            </svg>
        ),
        permiso: "puede_inscribirse",
    },
    {
        label: "Usuarios",
        path: "/app/usuarios",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        ),
        permiso: "view_usuario",
    },
    {
        label: "Grupos / Roles",
        path: "/app/grupos",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
            </svg>
        ),
        permiso: "view_group",
    },
];

// ← Al inicio del componente, después de los hooks
const esSuperAdmin = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.permisos_rol?.includes("add_group") || false;
};

const tienePermisoMenu = (permiso) => {
    if (!permiso) return true;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.permisos_rol?.includes(permiso) || false;
};

// ← Filtrado inteligente
const menuItemsFiltrados = esSuperAdmin()
    ? menuItems.filter(item =>
        item.path !== "/app/dashboard" &&
        item.path !== "/app/dashboard-docente"
    )
    : menuItems.filter(item =>
        !item.permiso || tienePermisoMenu(item.permiso)
    );


const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const nombre = user.nombre_completo || `${user.nombres || ""} ${user.apellidos || ""}`.trim() || "Usuario";

    }, []);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCollapsed(true);  // En móvil siempre empieza contraído
            } else {
                setCollapsed(false); // En desktop siempre abierto
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ← NUEVO: Cerrar al hacer click fuera (solo en móvil)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (window.innerWidth <= 768 && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setCollapsed(true);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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


    return (
        <>
            <aside ref={sidebarRef} className={`sidebar ${collapsed ? "collapsed" : ""}`}>

                <div className="sidebar-header">
                    <img
                        src={logo}
                        alt="Universidad"
                        className="logo"
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <h2>EduPro 360</h2>
                </div>

                <nav className="sidebar-nav">
                    {menuItemsFiltrados.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${isActive ? "active" : ""}`}
                                onClick={() => window.innerWidth <= 768 && setCollapsed(true)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {!collapsed && <span className="nav-label">{item.label}</span>}
                            </Link>
                        );
                    })}

                    {/* Mi Perfil - Destacado en la parte inferior */}
                    <div className="perfil-section">
                        <Link
                            to="/app/perfil"
                            className={`nav-item perfil-item ${location.pathname === "/app/perfil" ? "active" : ""}`}
                        >
                            <span className="nav-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </span>
                            {!collapsed && (
                                <>
                                    <span className="nav-label">Mi Perfil</span>
                                    <svg className="arrow-right" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </>
                            )}
                        </Link>
                    </div>
                </nav>

                {/* Footer con cerrar sesión */}
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"></path>
                            <polyline points="10 17 15 12 10 7"></polyline>
                            <line x1="15" y1="12" x2="3" y2="12"></line>
                        </svg>
                        {!collapsed && <span>Cerrar sesión</span>}
                    </button>
                </div>
            </aside>

            {/* ← NUEVO: Overlay oscuro en móvil */}
            {collapsed && window.innerWidth <= 768 && (
                <div className="mobile-logo-trigger" onClick={() => setCollapsed(false)}>
                    <img src={logo} alt="Universidad Autónoma" className="mobile-logo" />
                </div>
            )}

        </>
    );
};

export default Sidebar