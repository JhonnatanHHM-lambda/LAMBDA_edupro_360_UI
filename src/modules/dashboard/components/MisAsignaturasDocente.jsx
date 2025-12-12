import CardGrid from "../../core/tarjetas/components/CardGrid";
import useMisAsignaturasDocente from "../hooks/useMisAsignaturasDocente";
import "../utils/MisAsignaturasDocente.scss";

const MisAsignaturasDocente = () => {
    const { asignaturas, loading } = useMisAsignaturasDocente();

    const renderAsignaturaCard = (asig) => (
        <>
            <div className="asig-header">
                <h3>{asig.nombre}</h3>
                <span className="codigo">{asig.codigo}</span>
            </div>
            <div className="asig-info">
                <p>
                    <strong>Período:</strong> {asig.periodo_nombre}
                </p>
                <p>
                    <strong>Estado:</strong>
                    <span className={`tag ${asig.estado ? "active" : "inactive"}`}>
                        {asig.estado ? "Activa" : "Inactiva"}
                    </span>
                </p>
                {asig.descripcion && (
                    <p className="descripcion">{asig.descripcion}</p>
                )}
            </div>
        </>
    );

    if (loading) {
        return <div className="loading">Cargando tus asignaturas...</div>;
    }

    return (
        <div className="mis-asignaturas-docente">
            <header className="page-header">
                <h1>Mis Asignaturas</h1>
                <p>Bienvenido, aquí puedes gestionar tus clases activas</p>
            </header>

            {asignaturas.length === 0 ? (
                <div className="empty-state">
                    <p>No tienes asignaturas asignadas actualmente.</p>
                </div>
            ) : (
                <CardGrid
                    items={asignaturas}
                    renderCard={renderAsignaturaCard}
                    emptyMessage="No tienes asignaturas asignadas"
                />
            )}
        </div>
    );
};

export default MisAsignaturasDocente;