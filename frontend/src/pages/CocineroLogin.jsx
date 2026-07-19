import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

const API_URL = import.meta.env.VITE_API_URL;

function CocineroLogin() {
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    async function ingresarCocinero(correo, password) {
        setMensaje("");

        if (!API_URL) {
            setMensaje(
                "La URL del servidor no está configurada"
            );
            return;
        }

        try {
            const respuesta = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        correo,
                        password
                    })
                }
            );

            const tipoContenido =
                respuesta.headers.get("content-type");

            const datos = tipoContenido?.includes(
                "application/json"
            )
                ? await respuesta.json()
                : {
                      mensaje:
                          "El servidor devolvió una respuesta no válida"
                  };

            if (!respuesta.ok) {
                setMensaje(
                    datos.mensaje ||
                    "No se pudo iniciar sesión"
                );
                return;
            }

            if (datos.rol !== "cocinero") {
                setMensaje(
                    "Esta cuenta no pertenece a un cocinero"
                );
                return;
            }

            navigate("/cocinero");

        } catch (error) {
            console.error(
                "Error al iniciar sesión como cocinero:",
                error
            );

            setMensaje(
                "No se pudo conectar con el servidor"
            );
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">

                <h1 className="text-4xl font-bold text-orange-600 mb-2">
                    Restaurante
                </h1>

                <p className="text-gray-600 mb-8">
                    Acceso para Cocinero
                </p>

                <Login onIngresar={ingresarCocinero} />

                {mensaje && (
                    <p className="text-red-600 mt-4">
                        {mensaje}
                    </p>
                )}

            </div>
        </div>
    );
}

export default CocineroLogin;