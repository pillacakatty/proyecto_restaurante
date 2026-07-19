import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { conectarDB } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        await conectarDB();

        const servidorHttp = http.createServer(app);

        const io = new Server(servidorHttp, {
    cors: {
        origin:
            process.env.FRONTEND_URL ||
            "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});


        app.set("io", io);

        io.on("connection", (socket) => {
            console.log("Cliente conectado:", socket.id);

            socket.on("disconnect", () => {
                console.log("Cliente desconectado:", socket.id);
            });
        });

        servidorHttp.listen(PORT, () => {
            console.log(
                `Servidor ejecutándose en http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error("No se pudo iniciar el servidor");
    }
}

iniciarServidor();