import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import DashboardCard from "../components/DashboardCard";
import PedidoCard from "../components/PedidoCard";

const API_URL = import.meta.env.VITE_API_URL;

function Cocinero() {
    const [pedidos, setPedidos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(true);

    async function leerRespuesta(respuesta) {
        const contenido = await respuesta.text();

        if (!contenido) {
            return {};
        }

        try {
            return JSON.parse(contenido);
        } catch {
            return {
                mensaje: contenido
            };
        }
    }

    async function cargarPedidos() {
        if (!API_URL) {
            setMensaje("La URL del servidor no está configurada");
            setCargando(false);
            return;
        }

        try {
            setCargando(true);
            setMensaje("");

            const respuesta = await fetch(
                `${API_URL}/api/pedidos`
            );

            const datos = await leerRespuesta(respuesta);

            if (!respuesta.ok) {
                setMensaje(
                    datos.mensaje ||
                    `No se pudieron cargar los pedidos (${respuesta.status})`
                );
                return;
            }

            setPedidos(
                Array.isArray(datos.pedidos)
                    ? datos.pedidos
                    : []
            );
        } catch (error) {
            console.error("Error al cargar pedidos:", error);

            setMensaje(
                "No se pudo conectar con el servidor"
            );
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarPedidos();
    }, []);

    useEffect(() => {
        if (!API_URL) {
            return;
        }

        const socket = io(API_URL, {
            transports: ["websocket", "polling"]
        });

        function recibirNuevoPedido(datos) {
            const nuevoPedido = datos?.pedido || datos;

            if (!nuevoPedido?._id) {
                return;
            }

            setPedidos((pedidosActuales) => {
                const existe = pedidosActuales.some(
                    (pedido) =>
                        pedido._id === nuevoPedido._id
                );

                if (existe) {
                    return pedidosActuales;
                }

                return [
                    nuevoPedido,
                    ...pedidosActuales
                ];
            });
        }

        function recibirPedidoActualizado(datos) {
            const pedidoActualizado =
                datos?.pedido || datos;

            const id =
                pedidoActualizado?._id ||
                datos?.id;

            const estado =
                pedidoActualizado?.estado ||
                datos?.estado;

            if (!id || !estado) {
                return;
            }

            setPedidos((pedidosActuales) =>
                pedidosActuales.map((pedido) =>
                    pedido._id === id
                        ? {
                              ...pedido,
                              ...pedidoActualizado,
                              estado
                          }
                        : pedido
                )
            );
        }

        function recibirPedidoEliminado(datos) {
            const id = datos?.id || datos?._id;

            if (!id) {
                return;
            }

            setPedidos((pedidosActuales) =>
                pedidosActuales.filter(
                    (pedido) => pedido._id !== id
                )
            );
        }

        socket.on("nuevoPedido", recibirNuevoPedido);
        socket.on(
            "pedidoActualizado",
            recibirPedidoActualizado
        );
        socket.on(
            "pedidoEliminado",
            recibirPedidoEliminado
        );

        socket.on("connect_error", (error) => {
            console.error(
                "Error de Socket.IO:",
                error.message
            );
        });

        return () => {
            socket.off("nuevoPedido", recibirNuevoPedido);
            socket.off(
                "pedidoActualizado",
                recibirPedidoActualizado
            );
            socket.off(
                "pedidoEliminado",
                recibirPedidoEliminado
            );
            socket.disconnect();
        };
    }, []);

    async function cambiarEstado(id, nuevoEstado) {
        if (!id) {
            setMensaje(
                "No se encontró el identificador del pedido"
            );
            return;
        }

        try {
            setMensaje("");

            const respuesta = await fetch(
                `${API_URL}/api/pedidos/${id}`,
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

            const datos = await leerRespuesta(respuesta);

            if (!respuesta.ok) {
                setMensaje(
                    datos.mensaje ||
                    `No se pudo actualizar el pedido (${respuesta.status})`
                );
                return;
            }

            const pedidoActualizado =
                datos.pedido || {
                    _id: id,
                    estado: nuevoEstado
                };

            setPedidos((pedidosActuales) =>
                pedidosActuales.map((pedido) =>
                    pedido._id === id
                        ? {
                              ...pedido,
                              ...pedidoActualizado,
                              estado:
                                  pedidoActualizado.estado ||
                                  nuevoEstado
                          }
                        : pedido
                )
            );

            setMensaje(
                `Pedido actualizado a: ${nuevoEstado}`
            );
        } catch (error) {
            console.error(
                "Error al actualizar pedido:",
                error
            );

            setMensaje(
                "No se pudo conectar con el servidor"
            );
        }
    }

    const pedidosActivos = pedidos.filter(
        (pedido) =>
            pedido.estado !== "Entregado" &&
            pedido.estado !== "Finalizado"
    );

    const pedidosPendientes = pedidosActivos.filter(
        (pedido) => pedido.estado === "Pendiente"
    );

    const pedidosEnPreparacion = pedidosActivos.filter(
        (pedido) =>
            pedido.estado === "En preparación"
    );

    const pedidosListos = pedidosActivos.filter(
        (pedido) =>
            pedido.estado === "Listo para recoger"
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-orange-600">
                        Panel del Cocinero
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Revisa los pedidos y actualiza su estado
                    </p>
                </header>

                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    <DashboardCard
                        titulo="Pendientes"
                        cantidad={pedidosPendientes.length}
                        color="yellow"
                    />

                    <DashboardCard
                        titulo="En preparación"
                        cantidad={pedidosEnPreparacion.length}
                        color="blue"
                    />

                    <DashboardCard
                        titulo="Listos para recoger"
                        cantidad={pedidosListos.length}
                        color="green"
                    />

                    <DashboardCard
                        titulo="Total activos"
                        cantidad={pedidosActivos.length}
                        color="purple"
                    />
                </section>

                {mensaje && (
                    <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-xl mb-6">
                        {mensaje}
                    </div>
                )}

                <section>
                    <div className="mb-5">
                        <h2 className="text-2xl font-bold">
                            Pedidos recibidos
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Los pedidos aparecen en tiempo real.
                        </p>
                    </div>

                    {cargando ? (
                        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
                            Cargando pedidos...
                        </div>
                    ) : pedidosActivos.length === 0 ? (
                        <div className="bg-white p-10 rounded-2xl shadow-md text-center">
                            <p className="text-2xl font-bold text-gray-700">
                                No hay pedidos pendientes
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {pedidosActivos.map((pedido) => (
                                <PedidoCard
                                    key={pedido._id}
                                    pedido={pedido}
                                    tipo="cocinero"
                                    onCambiarEstado={
                                        cambiarEstado
                                    }
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Cocinero;