import { obtenerDB } from "../config/database.js";

async function buscarUsuarioPorCorreo(correo) {
    const db = obtenerDB();

    console.log("Base de datos utilizada:", db.databaseName);
    console.log("Colección utilizada: usuarios");

    const usuario = await db.collection("usuarios").findOne({
        correo: correo.trim()
    });

    return usuario;
}

export { buscarUsuarioPorCorreo };