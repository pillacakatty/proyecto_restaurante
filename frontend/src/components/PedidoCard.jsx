import EstadoBadge from "./EstadoBadge";

function PedidoCard({
    pedido,
    tipo,
    onCambiarEstado,
    onEntregar
}) {
    const total = pedido.platos.reduce(
        (acumulado, plato) =>
            acumulado + Number(plato.precio),
        0
    );

    return (
        <article className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5">

                <div className="flex justify-between items-start gap-3 mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {pedido.mesa}
                        </h3>

                        {pedido.fecha && (
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date(
                                    pedido.fecha
                                ).toLocaleTimeString(
                                    "es-PE",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }
                                )}
                            </p>
                        )}
                    </div>

                    <EstadoBadge
                        estado={pedido.estado}
                    />
                </div>

                <h4 className="font-semibold text-gray-700 mb-3">
                    Platos
                </h4>

                <ul className="space-y-2">
                    {pedido.platos.map(
                        (plato, indice) => (
                            <li
                                key={`${pedido._id}-${plato.id}-${indice}`}
                                className="flex justify-between border-b border-gray-100 pb-2"
                            >
                                <span>
                                    {plato.nombre}
                                </span>

                                <span className="font-medium text-gray-600">
                                    S/ {plato.precio}
                                </span>
                            </li>
                        )
                    )}
                </ul>

                <div className="flex justify-between mt-4 font-bold">
                    <span>Total</span>
                    <span className="text-green-700">
                        S/ {total}
                    </span>
                </div>

                {tipo === "mesero" && (
                    <div className="mt-5">
                        {pedido.estado === "Pendiente" && (
                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                <p className="text-yellow-700 text-sm font-medium">
                                    Esperando atención de cocina.
                                </p>
                            </div>
                        )}

                        {pedido.estado ===
                            "En preparación" && (
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                <p className="text-blue-700 text-sm font-medium">
                                    Cocina está preparando el pedido.
                                </p>
                            </div>
                        )}

                        {pedido.estado ===
                            "Listo para recoger" && (
                            <div className="bg-green-50 border border-green-300 p-4 rounded-lg">
                                <p className="text-green-700 font-bold">
                                    Pedido listo
                                </p>

                                <p className="text-green-700 text-sm mt-1">
                                    Recoge el pedido y entrégalo a la mesa.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onEntregar(pedido._id)
                                    }
                                    className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                                >
                                    Marcar como entregado
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {tipo === "cocinero" && (
                    <div className="mt-5">
                        {pedido.estado === "Pendiente" && (
                            <button
                                type="button"
                                onClick={() =>
                                    onCambiarEstado(
                                        pedido._id,
                                        "En preparación"
                                    )
                                }
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                            >
                                Empezar preparación
                            </button>
                        )}

                        {pedido.estado ===
                            "En preparación" && (
                            <button
                                type="button"
                                onClick={() =>
                                    onCambiarEstado(
                                        pedido._id,
                                        "Listo para recoger"
                                    )
                                }
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                            >
                                Finalizar pedido
                            </button>
                        )}
                    </div>
                )}

            </div>
        </article>
    );
}

export default PedidoCard;