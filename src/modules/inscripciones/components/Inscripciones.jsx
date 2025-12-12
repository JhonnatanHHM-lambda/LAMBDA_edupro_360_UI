import useInscripciones from "../hooks/useInscripciones";
import DataTable from "../../core/Tabla/components/DataTable";
import "../utils/Inscripciones.scss";

const Inscripciones = () => {
    const {
        asignaturasDisponibles,
        misAsignaturas,
        loading,
        inscribirse,
        retirarse,
    } = useInscripciones();

    const columnasDisponibles = [
        { key: "codigo", label: "Código" },
        { key: "nombre", label: "Asignatura" },
        { key: "periodo_nombre", label: "Período" },
        { key: "docente_nombre", label: "Docente", render: (row) => row.docente_nombre || "Sin docente" },
        {
            label: "Acción",
            render: (row) => (
                <button onClick={() => inscribirse(row.id)} className="btn-inscribir">
                    Inscribirme
                </button>
            ),
        },
    ];

    const columnasMisAsignaturas = [
        { key: "codigo", label: "Código" },
        { key: "nombre", label: "Asignatura" },
        { key: "periodo", label: "Período" },
        { key: "docente", label: "Docente" },
        {
            key: "fecha_inscripcion",
            label: "Inscrito el",
            render: (row) => new Date(row.fecha_inscripcion).toLocaleDateString("es-ES"),
        },
        {
            label: "Acción",
            render: (row) => (
                <button onClick={() => retirarse(row.id, row.nombre)} className="btn-retirar">
                    Retirarme
                </button>
            ),
        },
    ];

    return (
        <div className="inscripciones-container">
            <div className="header">
                <h1>Inscripciones</h1>
            </div>

            {/* Mis asignaturas inscritas */}
            <section className="seccion">
                <h2>Mis Asignaturas</h2>
                <DataTable
                    data={misAsignaturas}
                    columns={columnasMisAsignaturas}
                    loading={loading}
                    emptyMessage="No estás inscrito en ninguna asignatura aún"
                />
            </section>

            {/* Asignaturas disponibles */}
            <section className="seccion">
                <h2>Asignaturas Disponibles para Inscripción</h2>
                <DataTable
                    data={asignaturasDisponibles}
                    columns={columnasDisponibles}
                    loading={loading}
                    emptyMessage="No hay asignaturas disponibles en este momento"
                />
            </section>
        </div>
    );
};

export default Inscripciones;