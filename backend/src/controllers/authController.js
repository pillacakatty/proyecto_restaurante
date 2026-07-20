import bcrypt from "bcryptjs";
import { buscarUsuarioPorCorreo } from "../models/authModel.js";

async function login(req, res) {
    try {
        const { correo, password } = req.body || {};

        if (!correo || !password) {
            return res.status(400).json({
                ok: false,
                mensaje: "Correo y contraseña son obligatorios"
            });
        }

        const usuario = await buscarUsuarioPorCorreo(correo);

        if (!usuario) {
            return res.status(401).json({
                ok: false,
                mensaje: "Correo o contraseña incorrectos"
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                ok: false,
                mensaje: "Correo o contraseña incorrectos"
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
            mensaje: "Error interno del servidor"
        });
    }
}

export { login };