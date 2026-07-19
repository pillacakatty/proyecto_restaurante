import { useState } from "react";

function Login({ onIngresar }) {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    function enviarFormulario(evento) {
        evento.preventDefault();

        console.log("Enviando desde Login:", correo, password);

        onIngresar(correo, password);
    }

    return (
        <form
            onSubmit={enviarFormulario}
            className="bg-white p-8 rounded-2xl shadow-lg w-96"
        >
            <h2 className="text-3xl font-bold text-center mb-6">
                Iniciar Sesión
            </h2>

            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    Correo electrónico
                </label>

                <input
                    type="email"
                    value={correo}
                    onChange={(evento) => setCorreo(evento.target.value)}
                    placeholder="Ingrese su correo"
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-6">
                <label className="block mb-2 font-medium">
                    Contraseña
                </label>

                <input
                    type="password"
                    value={password}
                    onChange={(evento) => setPassword(evento.target.value)}
                    placeholder="Ingrese su contraseña"
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
                Ingresar
            </button>
        </form>
    );
}

export default Login;