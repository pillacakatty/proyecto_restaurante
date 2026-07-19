import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

const socket = io(API_URL);

function Cocinero() {
    const [pedidos, setPedidos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

    async function cargarPedidos() {
        try {
            setCargando(true);

            const respuesta = await 
                fetch(`${API_URL}/login`

            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setMensaje(
                    datos.mensaje || "No se pudieron cargar los pedidos"
                );
                return;
            }

            // El cocinero solamente verá pedidos activos.
            const pedidosActivos = datos.pedidos.filter(
                (pedido) =>
                    pedido.estado !== "Listo para recoger"
            );

            setPedidos(pedidosActivos);

        } catch (error) {
            console.error("Error al cargar pedidos:", error);
            setMensaje("No se pudo conectar con el servidor");
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarPedidos();
    }, []);

    useEffect(() => {
        function recibirNuevoPedido(pedidoNuevo) {
            setPedidos((pedidosActuales) => {
                const pedidoExiste = pedidosActuales.some(
                    (pedido) => pedido._id === pedidoNuevo._id
                );

                if (pedidoExiste) {
                    return pedidosActuales;
                }

                return [
                    pedidoNuevo,
                    ...pedidosActuales
                ];
            });
        }

        function recibirPedidoActualizado(datos) {
            setPedidos((pedidosActuales) => {
                // Si queda listo, desaparece del panel del cocinero.
                if (datos.estado === "Listo para recoger") {
                    return pedidosActuales.filter(
                        (pedido) => pedido._id !== datos.id
                    );
                }

                return pedidosActuales.map((pedido) =>
                    pedido._id === datos.id
                        ? {
                              ...pedido,
                              estado: datos.estado
                          }
                        : pedido
                );
            });
        }

        socket.on("nuevoPedido", recibirNuevoPedido);
        socket.on(
            "pedidoActualizado",
            recibirPedidoActualizado
        );

        return () => {
            socket.off("nuevoPedido", recibirNuevoPedido);

            socket.off(
                "pedidoActualizado",
                recibirPedidoActualizado
            );
        };
    }, []);

    async function cambiarEstado(id, nuevoEstado) {
        setMensaje("");

        try {
            const respuesta = await fetch(
              `${API_URL}/login`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        estado: nuevoEstado
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setMensaje(
                    datos.mensaje ||
                        "No se pudo actualizar el pedido"
                );
                return;
            }

            if (nuevoEstado === "Listo para recoger") {
                setPedidos((pedidosActuales) =>
                    pedidosActuales.filter(
                        (pedido) => pedido._id !== id
                    )
                );

                setMensaje(
                    "Pedido terminado y enviado al mesero"
                );

                return;
            }

            setPedidos((pedidosActuales) =>
                pedidosActuales.map((pedido) =>
                    pedido._id === id
                        ? {
                              ...pedido,
                              estado: nuevoEstado
                          }
                        : pedido
                )
            );

            setMensaje("Pedido puesto en preparación");

        } catch (error) {
            console.error(
                "Error al cambiar el estado:",
                error
            );

            setMensaje("No se pudo conectar con el servidor");
        }
    }

    function obtenerClaseEstado(estado) {
        if (estado === "Pendiente") {
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }

        if (estado === "En preparación") {
            return "bg-blue-100 text-blue-800 border-blue-200";
        }

        return "bg-gray-100 text-gray-700 border-gray-200";
    }

    const pedidosPendientes = pedidos.filter(
        (pedido) => pedido.estado === "Pendiente"
    );

    const pedidosEnPreparacion = pedidos.filter(
        (pedido) => pedido.estado === "En preparación"
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">

                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-orange-600">
                        Panel del Cocinero
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Pedidos activos de cocina en tiempo real
                    </p>
                </header>

                {/* Resumen superior */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

                    <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-yellow-500">
                        <p className="text-gray-500 font-medium">
                            Pedidos pendientes
                        </p>

                        <p className="text-4xl font-bold text-yellow-600 mt-2">
                            {pedidosPendientes.length}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
                        <p className="text-gray-500 font-medium">
                            En preparación
                        </p>

                        <p className="text-4xl font-bold text-blue-600 mt-2">
                            {pedidosEnPreparacion.length}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-orange-500">
                        <p className="text-gray-500 font-medium">
                            Total de pedidos activos
                        </p>

                        <p className="text-4xl font-bold text-orange-600 mt-2">
                            {pedidos.length}
                        </p>
                    </div>

                </section>

                {mensaje && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl mb-6">
                        {mensaje}
                    </div>
                )}

                {cargando ? (
                    <div className="bg-white p-8 rounded-2xl shadow-md text-center">
                        <p className="text-gray-500">
                            Cargando pedidos...
                        </p>
                    </div>
                ) : pedidos.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl shadow-md text-center">
                        <p className="text-2xl font-bold text-gray-700">
                            No hay pedidos activos
                        </p>

                        <p className="text-gray-500 mt-2">
                            Los pedidos nuevos aparecerán automáticamente.
                        </p>
                    </div>
                ) : (
                    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {pedidos.map((pedido) => (
                            <article
                                key={pedido._id}
                                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
                            >
                                <div className="p-6">

                                    <div className="flex items-center justify-between gap-3 mb-5">
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {pedido.mesa}
                                        </h2>

                                        <span
                                            className={`px-3 py-2 rounded-full border text-sm font-semibold ${obtenerClaseEstado(
                                                pedido.estado
                                            )}`}
                                        >
                                            {pedido.estado}
                                        </span>
                                    </div>

                                    <div className="mb-5">
                                        <h3 className="font-semibold text-gray-700 mb-2">
                                            Platos solicitados
                                        </h3>

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
                                    </div>

                                    {pedido.fecha && (
                                        <p className="text-sm text-gray-500 mb-5">
                                            Pedido recibido:{" "}
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

                                    {pedido.estado === "Pendiente" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                cambiarEstado(
                                                    pedido._id,
                                                    "En preparación"
                                                )
                                            }
                                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                                        >
                                            Empezar preparación
                                        </button>
                                    )}

                                    {pedido.estado ===
                                        "En preparación" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                cambiarEstado(
                                                    pedido._id,
                                                    "Listo para recoger"
                                                )
                                            }
                                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                                        >
                                            Finalizar pedido
                                        </button>
                                    )}

                                </div>
                            </article>
                        ))}

                    </section>
                )}

            </div>
        </div>
    );
}

export default Cocinero;