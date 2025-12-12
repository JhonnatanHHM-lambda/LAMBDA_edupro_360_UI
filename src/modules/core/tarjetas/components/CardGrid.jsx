import "../utils/CardGrid.scss";

const CardGrid = ({
    title = "",
    items = [],
    renderCard, 
    emptyMessage = "No hay elementos para mostrar",
    filterComponent = null, 
}) => {
    if (items.length === 0) {
        return (
            <div className="card-grid-empty">
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="card-grid">
            {(title || filterComponent) && (
                <div className="card-grid-header">
                    {title && <h2>{title}</h2>}
                    {filterComponent && <div className="card-grid-filter">{filterComponent}</div>}
                </div>
            )}
            <div className="cards-container">
                {items.map((item) => (
                    <div key={item.id} className="card">
                        {renderCard(item)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardGrid;