import {
    guardarPedido,
    obtenerPedidos,
    actualizarEstadoPedido,
    eliminarPedido
} from "../models/pedidoModel.js";

async function crearPedido(req, res) {
    try {
        const { mesa, platos } = req.body || {};

        if (!mesa) {
            return res.status(400).json({
                ok: false,
                mensaje: "La mesa es obligatoria"
            });
        }

        if (!Array.isArray(platos) || platos.length === 0) {
            return res.status(400).json({
                ok: false,
                mensaje: "Debe seleccionar al menos un plato"
            });
        }

        const nuevoPedido = {
            mesa,
            platos,
            estado: "Pendiente",
            fecha: new Date()
        };

        const resultado = await guardarPedido(nuevoPedido);

        const pedidoGuardado = {
            _id: resultado.insertedId,
            ...nuevoPedido
        };

        const io = req.app.get("io");

        if (io) {
            io.emit("nuevoPedido", pedidoGuardado);
        }

        return res.status(201).json({
            ok: true,
            mensaje: "Pedido registrado correctamente",
            pedido: pedidoGuardado
        });
    } catch (error) {
        console.error("Error al crear pedido:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}

async function listarPedidos(req, res) {
    try {
        const pedidos = await obtenerPedidos();

        return res.status(200).json({
            ok: true,
            pedidos
        });
    } catch (error) {
        console.error("Error al listar pedidos:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}

async function cambiarEstadoPedido(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body || {};

        const estadosPermitidos = [
            "Pendiente",
            "En preparación",
            "Listo para recoger"
        ];

        if (!estado || !estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                ok: false,
                mensaje: "Estado no válido"
            });
        }

        const resultado = await actualizarEstadoPedido(id, estado);

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: "Pedido no encontrado"
            });
        }

        const io = req.app.get("io");

        if (io) {
            io.emit("pedidoActualizado", {
                id,
                estado
            });
        }

        return res.status(200).json({
            ok: true,
            mensaje: "Estado actualizado correctamente",
            pedido: {
                _id: id,
                estado
            }
        });
    } catch (error) {
        console.error("Error al actualizar estado:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}

async function entregarPedido(req, res) {
    try {
        const { id } = req.params;

        const resultado = await eliminarPedido(id);

        if (resultado.deletedCount === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: "Pedido no encontrado"
            });
        }

        const io = req.app.get("io");

        if (io) {
            io.emit("pedidoEliminado", {
                id
            });
        }

        return res.status(200).json({
            ok: true,
            mensaje: "Pedido entregado y eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al entregar pedido:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}

export {
    crearPedido,
    listarPedidos,
    cambiarEstadoPedido,
    entregarPedido
};