import { buscarUsuarioPorCorreo } from "../models/authModel.js";

async function login(req, res) {
    try {
        const { correo, password } = req.body || {};

        console.log("Correo enviado:", correo);
        console.log("Contraseña enviada:", password);

        if (!correo || !password) {
            return res.status(400).json({
                ok: false,
                mensaje: "Correo y contraseña son obligatorios"
            });
        }

        const usuario = await buscarUsuarioPorCorreo(correo);

        console.log("Usuario encontrado:", usuario);

        if (!usuario) {
            return res.status(401).json({
                ok: false,
                mensaje: "El correo no existe en la base de datos"
            });
        }

        console.log("Contraseña guardada:", usuario.password);

        if (usuario.password !== password) {
            return res.status(401).json({
                ok: false,
                mensaje: "La contraseña es incorrecta"
            });
        }

        return res.status(200).json({
            ok: true,
            mensaje: "Inicio de sesión correcto",
            rol: usuario.rol,
            correo: usuario.correo
        });

    } catch (error) {
        console.error("Error del login:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor",
            error: error.message
        });
    }
}

export { login };