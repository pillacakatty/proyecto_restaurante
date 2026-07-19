function EstadoBadge({ estado }) {
    function obtenerClases() {
        if (estado === "Pendiente") {
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }

        if (estado === "En preparación") {
            return "bg-blue-100 text-blue-800 border-blue-200";
        }

        if (estado === "Listo para recoger") {
            return "bg-green-100 text-green-800 border-green-200";
        }

        return "bg-gray-100 text-gray-700 border-gray-200";
    }

    return (
        <span
            className={`inline-block px-3 py-2 rounded-full border text-sm font-semibold ${obtenerClases()}`}
        >
            {estado}
        </span>
    );
}

export default EstadoBadge;