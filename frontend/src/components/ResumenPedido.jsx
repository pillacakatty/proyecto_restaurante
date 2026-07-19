function ResumenPedido({
    mesa,
    platosSeleccionados,
    onEnviar,
    enviando = false
}) {
    const total = platosSeleccionados.reduce(
        (acumulado, plato) =>
            acumulado + Number(plato.precio),
        0
    );

    return (
        <div className="mt-5 bg-gray-50 border border-gray-200 p-4 rounded-xl">
            <h3 className="text-lg font-bold mb-3">
                Resumen
            </h3>

            <p className="mb-3">
                <strong>Mesa:</strong>{" "}
                {mesa || "No seleccionada"}
            </p>

            {platosSeleccionados.length === 0 ? (
                <p className="text-gray-500 text-sm">
                    No hay platos seleccionados.
                </p>
            ) : (
                <ul className="space-y-2">
                    {platosSeleccionados.map((plato) => (
                        <li
                            key={plato.id}
                            className="flex justify-between border-b border-gray-200 pb-2"
                        >
                            <span className="text-sm">
                                {plato.nombre}
                            </span>

                            <span className="font-medium text-sm">
                                S/ {plato.precio}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <div className="flex justify-between items-center mt-4">
                <span className="font-bold">
                    Total
                </span>

                <span className="text-xl font-bold text-green-700">
                    S/ {total}
                </span>
            </div>

            <button
                type="button"
                onClick={onEnviar}
                disabled={enviando}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {enviando
                    ? "Enviando..."
                    : "Enviar pedido"}
            </button>
        </div>
    );
}

export default ResumenPedido;