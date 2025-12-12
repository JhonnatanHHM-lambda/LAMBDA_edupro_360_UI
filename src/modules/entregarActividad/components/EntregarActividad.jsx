import { useNavigate } from "react-router-dom";
import useEntregarActividad from "../hooks/useEntregarActividad";
import "../utils/EntregarActividad.scss";
import { HiOutlineLogin } from "react-icons/hi";

const EntregarActividad = () => {
    const navigate = useNavigate();
    const {
        tarea,
        entrega,
        archivo,
        setArchivo,
        comentarios,
        setComentarios,
        loading,
        uploading,
        dragOver,
        setDragOver,
        handleDrop,
        handleFileChange,
        handleSubmit,
        puedeEditar,
    } = useEntregarActividad();

    if (loading) {
        return <div className="loading">Cargando actividad...</div>;
    }

    if (!tarea) {
        return <div className="error">Actividad no encontrada</div>;
    }

    const esCalificada = entrega?.estado_entrega === "C";
    const vencida = new Date(tarea.fecha_vencimiento) < new Date();

    return (
        <div className="entregar-actividad">
            <div className="header">
                <button onClick={() => navigate(-1)} className="btn-volver">
                    <HiOutlineLogin size={28} color="black" />
                </button>

                <h1>{tarea.titulo}</h1>
            </div>

            <div className="tarea-info">
                <div className="info-row">
                    <span>Tipo:</span>
                    <strong className={tarea.tipo_tarea === "E" ? "examen" : "tarea"}>
                        {tarea.tipo_tarea === "E" ? "EXAMEN" : "TAREA"}
                    </strong>
                </div>
                <div className="info-row">
                    <span>Peso:</span>
                    <strong>{parseFloat(tarea.peso_porcentual).toFixed(1)}%</strong>
                </div>
                <div className="info-row vencimiento">
                    <span>Vence:</span>
                    <strong className={vencida ? "vencida" : ""}>
                        {new Date(tarea.fecha_vencimiento).toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </strong>
                </div>
            </div>

            <div className="descripcion">
                <h3>Instrucciones</h3>
                <p>{tarea.descripcion || "Sin descripción"}</p>
            </div>

            {!puedeEditar && !esCalificada && (
                <div className="alerta vencida">
                    Esta actividad ya venció. No puedes entregarla.
                </div>
            )}

            {esCalificada && (
                <div className="alerta calificada">
                    <h3>Calificada</h3>
                    <div className="nota-final">
                        Nota: {entrega.nota?.toFixed(1) || "—"}
                    </div>
                    {entrega.retroalimentacion && (
                        <p><strong>Comentario del docente:</strong><br />{entrega.retroalimentacion}</p>
                    )}
                </div>
            )}

            {puedeEditar && (
                <div
                    className={`upload-zone ${dragOver ? "drag-over" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="archivo"
                        onChange={(e) => handleFileChange(e.target.files[0])}
                        accept=".pdf,.doc,.docx,.zip,.rar"
                        style={{ display: "none" }}
                    />

                    {archivo || entrega?.archivo_entrega ? (
                        <div className="archivo-preview">
                            <iframe
                                src={archivo ? URL.createObjectURL(archivo) : entrega.archivo_entrega}
                                title="Vista previa"
                                className="pdf-preview"
                            />
                            <div className="archivo-info">
                                <strong>{archivo?.name || "Archivo actual"}</strong>
                                <button onClick={() => document.getElementById("archivo").click()} className="btn-cambiar">
                                    Cambiar archivo
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label htmlFor="archivo" className="drop-label">
                            <div className="icon">↑</div>
                            <h3>Arrastra tu archivo aquí</h3>
                            <p>o haz clic para seleccionar</p>
                            <span>PDF, Word, ZIP • Máx. 50MB</span>
                        </label>
                    )}

                    <textarea
                        placeholder="Comentarios opcionales para el docente..."
                        value={comentarios}
                        onChange={(e) => setComentarios(e.target.value)}
                        rows="4"
                        className="comentarios"
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={uploading || esCalificada}
                        className={`btn-entregar ${esCalificada ? "calificada" : ""}`}
                    >
                        {uploading
                            ? "Enviando..."
                            : esCalificada
                                ? "Ya calificada"
                                : entrega
                                    ? "Actualizar Entrega" : "Entregar Actividad"
                        }
                    </button>
                </div>
            )}

            {entrega && !puedeEditar && !esCalificada && (
                <div className="entrega-actual">
                    <h3>Tu entrega actual</h3>
                    <a href={entrega.archivo_entrega} target="_blank" rel="noopener noreferrer" className="btn-descargar">
                        Descargar archivo entregado
                    </a>
                    {entrega.comentarios_estudiante && (
                        <p><strong>Tus comentarios:</strong><br />{entrega.comentarios_estudiante}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default EntregarActividad;