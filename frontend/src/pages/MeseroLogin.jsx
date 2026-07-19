import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

function MeseroLogin() {
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    async function ingresarMesero(correo, password) {
        setMensaje("");

        try {
            const respuesta = await fetch(
                "http://localhost:3000/api/auth/login",
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

            if (!respuesta.ok) {
                setMensaje(datos.mensaje);
                return;
            }

            if (datos.rol !== "mesero") {
                setMensaje("Esta cuenta no pertenece a un mesero");
                return;
            }

            navigate("/mesero");

        } catch (error) {
            console.error(error);
            setMensaje("No se pudo conectar con el servidor");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">

                <h1 className="text-4xl font-bold text-blue-600 mb-2">
                    Restaurante
                </h1>

                <p className="text-gray-600 mb-8">
                    Acceso para Mesero
                </p>

                <Login onIngresar={ingresarMesero} />

                {mensaje && (
                    <p className="text-red-600 mt-4">
                        {mensaje}
                    </p>
                )}

            </div>
        </div>
    );
}

export default MeseroLogin;