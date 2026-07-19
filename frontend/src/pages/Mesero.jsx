import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import DashboardCard from "../components/DashboardCard";
import NuevoPedido from "../components/NuevoPedido";
import PedidoCard from "../components/PedidoCard";

const API_URL = import.meta.env.VITE_API_URL;

const socket = io(API_URL);

function Mesero() {
    const [pedidos, setPedidos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(true);

    const platos = [
        {
            id: 1,
            nombre: "Hamburguesa",
            precio: 18
        },
        {
            id: 2,
            nombre: "Pizza personal",
            precio: 20
        },
        {
            id: 3,
            nombre: "Pollo a la plancha",
            precio: 22
        },
        {
            id: 4,
            nombre: "Ensalada César",
            precio: 15
        },
        {
            id: 5,
            nombre: "Gaseosa",
            precio: 5
        }
    ];

    async function cargarPedidos() {
        try {
            setCargando(true);
            setMensaje("");

            const respuesta = await fetch(
                `${API_URL}/api/pedidos`
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setMensaje(
                    datos.mensaje ||
                    "No se pudieron cargar los pedidos"
                );
                return;
            }

            setPedidos(datos.pedidos);

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
        function recibirPedidoActualizado(datos) {
            setPedidos((pedidosActuales) =>
                pedidosActuales.map((pedido) =>
                    pedido._id === datos.id
                        ? {
                              ...pedido,
                              estado: datos.estado
                          }
                        : pedido
                )
            );
        }

        function recibirPedidoEliminado(datos) {
            setPedidos((pedidosActuales) =>
                pedidosActuales.filter(
                    (pedido) => pedido._id !== datos.id
                )
            );
        }

        socket.on(
            "pedidoActualizado",
            recibirPedidoActualizado
        );

        socket.on(
            "pedidoEliminado",
            recibirPedidoEliminado
        );

        return () => {
            socket.off(
                "pedidoActualizado",
                recibirPedidoActualizado
            );

            socket.off(
                "pedidoEliminado",
                recibirPedidoEliminado
            );
        };
    }, []);

    async function registrarPedido(nuevoPedido) {
        setMensaje("");

        try {
            const respuesta = await fetch(
                `${API_URL}/api/pedidos`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(nuevoPedido)
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setMensaje(
                    datos.mensaje ||
                    "No se pudo registrar el pedido"
                );

                return false;
            }

            setPedidos((pedidosActuales) => [
                datos.pedido,
                ...pedidosActuales
            ]);

            setMensaje(
                "Pedido registrado correctamente"
            );

            return true;

        } catch (error) {
            console.error(
                "Error al registrar pedido:",
                error
            );

            setMensaje(
                "No se pudo conectar con el servidor"
            );

            return false;
        }
    }

    async function marcarComoEntregado(id) {
        setMensaje("");

        try {
            const respuesta = await fetch(
                `${API_URL}/api/pedidos/${id}`,
                {
                    method: "DELETE"
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setMensaje(
                    datos.mensaje ||
                    "No se pudo entregar el pedido"
                );

                return;
            }

            setPedidos((pedidosActuales) =>
                pedidosActuales.filter(
                    (pedido) => pedido._id !== id
                )
            );

            setMensaje(
                "Pedido entregado correctamente"
            );

        } catch (error) {
            console.error(
                "Error al entregar pedido:",
                error
            );

            setMensaje(
                "No se pudo conectar con el servidor"
            );
        }
    }

    const pedidosPendientes = pedidos.filter(
        (pedido) => pedido.estado === "Pendiente"
    );

    const pedidosEnPreparacion = pedidos.filter(
        (pedido) =>
            pedido.estado === "En preparación"
    );

    const pedidosListos = pedidos.filter(
        (pedido) =>
            pedido.estado === "Listo para recoger"
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">

                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-blue-700">
                        Panel del Mesero
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Revisa pedidos y registra nuevos pedidos
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
                        cantidad={pedidos.length}
                        color="purple"
                    />
                </section>

                {mensaje && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl mb-6">
                        {mensaje}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

                    <section className="xl:col-span-2">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Mis pedidos
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    Los estados cambian en tiempo real.
                                </p>
                            </div>

                            <span className="text-gray-500">
                                {pedidos.length} activos
                            </span>
                        </div>

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
                                    Crea un pedido desde el panel lateral.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {pedidos.map((pedido) => (
                                    <PedidoCard
                                        key={pedido._id}
                                        pedido={pedido}
                                        tipo="mesero"
                                        onEntregar={marcarComoEntregado}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    <aside className="xl:col-span-1 xl:sticky xl:top-6">
                        <NuevoPedido
                            platos={platos}
                            onEnviar={registrarPedido}
                        />
                    </aside>

                </div>
            </div>
        </div>
    );
}

export default Mesero;