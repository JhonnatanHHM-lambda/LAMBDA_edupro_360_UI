import { useState } from "react";
import "../utils/DataTable.scss";

const DataTable = ({
    data = [],
    columns = [],
    renderActions,
    onEdit,
    onDelete,
    loading = false,
    emptyMessage = "No hay datos disponibles",
}) => {
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    const handleSort = (key) => {
        const order = sortColumn === key && sortOrder === "asc" ? "desc" : "asc";
        setSortColumn(key);
        setSortOrder(order);
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortColumn) return 0;
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    if (loading) {
        return (
            <div className="datatable-loading">
                <div className="spinner"></div>
                <p>Cargando datos...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return <div className="datatable-empty">{emptyMessage}</div>;
    }

    return (
        <div className="datatable-container">
            <table className="datatable">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                onClick={() => col.sortable !== false && handleSort(col.key)}
                                className={col.sortable !== false ? "sortable" : ""}
                            >
                                {col.label}
                                {col.sortable !== false && sortColumn === col.key && (
                                    <span className="sort-icon">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                )}
                            </th>
                        ))}
                        {renderActions && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, i) => (
                        <tr key={row.id || i}>
                            {columns.map((col) => (
                                <td key={col.key}>
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                            {renderActions && (
                                <td className="actions-cell">
                                    {renderActions(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;