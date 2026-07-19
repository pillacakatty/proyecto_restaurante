import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

function CocineroLogin() {
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    async function ingresarCocinero(correo, password) {
        console.log("Entró a ingresarCocinero");
        console.log("Correo:", correo);
        console.log("Password:", password);

        setMensaje("");

        try {
            const respuesta = 
            fetch(`${API_URL}/login`,
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

            const datos = await respuesta.json();

            console.log("Respuesta del backend:", datos);

            if (!respuesta.ok) {
                setMensaje(datos.mensaje || "No se pudo iniciar sesión");
                return;
            }

            if (datos.rol !== "cocinero") {
                setMensaje("Esta cuenta no pertenece a un cocinero");
                return;
            }

            navigate("/cocinero");

        } catch (error) {
            console.error("Error de conexión:", error);
            setMensaje("No se pudo conectar con el servidor");
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
                    <p className="mt-4 text-red-600 font-medium">
                        {mensaje}
                    </p>
                )}
            </div>
        </div>
    );
}

export default CocineroLogin;