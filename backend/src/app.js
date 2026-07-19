import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensaje: "Backend del restaurante funcionando"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/pedidos", pedidoRoutes);


export default app;