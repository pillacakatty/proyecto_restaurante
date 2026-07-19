import { useState } from "react";
import PlatoCard from "./PlatoCard";
import ResumenPedido from "./ResumenPedido";

function NuevoPedido({
    platos,
    onEnviar
}) {
    const [mesa, setMesa] = useState("");
    const [platosSeleccionados, setPlatosSeleccionados] =
        useState([]);
    const [mensaje, setMensaje] = useState("");
    const [enviando, setEnviando] = useState(false);

    function seleccionarPlato(plato) {
        const platoExiste = platosSeleccionados.some(
            (item) => item.id === plato.id
        );

        if (platoExiste) {
            setPlatosSeleccionados(
                platosSeleccionados.filter(
                    (item) => item.id !== plato.id
                )
            );

            return;
        }

        setPlatosSeleccionados([
            ...platosSeleccionados,
            plato
        ]);
    }

    async function enviarPedido() {
        setMensaje("");

        if (!mesa) {
            setMensaje("Selecciona una mesa");
            return;
        }

        if (platosSeleccionados.length === 0) {
            setMensaje("Selecciona al menos un plato");
            return;
        }

        const nuevoPedido = {
            mesa,
            platos: platosSeleccionados
        };

        try {
            setEnviando(true);

            const resultado = await onEnviar(nuevoPedido);

            if (resultado === false) {
                return;
            }

            setMesa("");
            setPlatosSeleccionados([]);
            setMensaje("Pedido registrado correctamente");

        } catch (error) {
            console.error(error);
            setMensaje("No se pudo registrar el pedido");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <aside className="xl:sticky xl:top-6 h-fit">
            <div className="bg-white p-5 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold">
                    Nuevo pedido
                </h2>

                <p className="text-sm text-gray-500 mt-1 mb-4">
                    Selecciona una mesa y los platos.
                </p>

                <label className="block font-semibold mb-2">
                    Mesa
                </label>

                <select
                    value={mesa}
                    onChange={(evento) =>
                        setMesa(evento.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 mb-5"
                >
                    <option value="">
                        Selecciona una mesa
                    </option>

                    <option value="Mesa 1">Mesa 1</option>
                    <option value="Mesa 2">Mesa 2</option>
                    <option value="Mesa 3">Mesa 3</option>
                    <option value="Mesa 4">Mesa 4</option>
                    <option value="Mesa 5">Mesa 5</option>
                </select>

                <h3 className="font-bold mb-3">
                    Menú
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-1">
                    {platos.map((plato) => {
                        const seleccionado =
                            platosSeleccionados.some(
                                (item) =>
                                    item.id === plato.id
                            );

                        return (
                            <PlatoCard
                                key={plato.id}
                                plato={plato}
                                seleccionado={seleccionado}
                                onSeleccionar={
                                    seleccionarPlato
                                }
                            />
                        );
                    })}
                </div>

                {mensaje && (
                    <div
                        className={`mt-4 p-3 rounded-lg text-sm ${
                            mensaje.includes("correctamente")
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                    >
                        {mensaje}
                    </div>
                )}

                <ResumenPedido
                    mesa={mesa}
                    platosSeleccionados={
                        platosSeleccionados
                    }
                    onEnviar={enviarPedido}
                    enviando={enviando}
                />
            </div>
        </aside>
    );
}

export default NuevoPedido;