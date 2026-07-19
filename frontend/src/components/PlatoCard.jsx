function PlatoCard({
    plato,
    seleccionado,
    onSeleccionar
}) {
    return (
        <article
            className={`border rounded-xl p-3 transition ${
                seleccionado
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
            }`}
        >
            <div className="flex justify-between items-start gap-3">
                <div>
                    <h3 className="font-bold text-gray-800">
                        {plato.nombre}
                    </h3>

                    <p className="text-sm text-gray-600 mt-1">
                        S/ {plato.precio}
                    </p>
                </div>

                {seleccionado && (
                    <span className="text-blue-600 font-bold">
                        ✓
                    </span>
                )}
            </div>

            <button
                type="button"
                onClick={() => onSeleccionar(plato)}
                className={`w-full mt-3 py-2 rounded-lg text-sm text-white font-semibold transition ${
                    seleccionado
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {seleccionado ? "Quitar" : "Agregar"}
            </button>
        </article>
    );
}

export default PlatoCard;