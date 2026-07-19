import express from "express";

import {
    crearPedido,
    listarPedidos,
    cambiarEstadoPedido,
    entregarPedido
} from "../controllers/pedidoController.js";

const router = express.Router();

router.get("/", listarPedidos);
router.post("/", crearPedido);
router.put("/:id", cambiarEstadoPedido);
router.delete("/:id", entregarPedido);

export default router;