import express from "express";
import {
    listarPedidos,
    crearPedido,
    actualizarEstadoPedido,
    eliminarPedido
} from "../controllers/pedidoController.js";

const router = express.Router();

router.get("/", listarPedidos);
router.post("/", crearPedido);
router.put("/:id", actualizarEstadoPedido);
router.delete("/:id", eliminarPedido);

export default router;