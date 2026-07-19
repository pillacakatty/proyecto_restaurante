import { ObjectId } from "mongodb";
import { obtenerDB } from "../config/database.js";

async function guardarPedido(pedido) {
    const db = obtenerDB();

    return await db
        .collection("pedidos")
        .insertOne(pedido);
}

async function obtenerPedidos() {
    const db = obtenerDB();

    return await db
        .collection("pedidos")
        .find()
        .sort({ fecha: -1 })
        .toArray();
}

async function actualizarEstadoPedido(id, nuevoEstado) {
    const db = obtenerDB();

    return await db
        .collection("pedidos")
        .updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    estado: nuevoEstado
                }
            }
        );
}

async function eliminarPedido(id) {
    const db = obtenerDB();

    return await db
        .collection("pedidos")
        .deleteOne({
            _id: new ObjectId(id)
        });
}

export {
    guardarPedido,
    obtenerPedidos,
    actualizarEstadoPedido,
    eliminarPedido
};