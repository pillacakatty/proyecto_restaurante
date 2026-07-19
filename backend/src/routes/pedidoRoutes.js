import express from "express";

import {
    crearPedido,
    listarPedidos,
    cambiarEstadoPedido,
    entregarPedido
} from "../controllers/pedidoController.js";

const router = express.Router();

router.post("/", crearPedido);
router.get("/", listarPedidos);
router.put("/:id/estado", cambiarEstadoPedido);
router.delete("/:id", entregarPedido);

export default router;