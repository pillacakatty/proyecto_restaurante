function DashboardCard({
    titulo,
    cantidad,
    color = "blue"
}) {
    const colores = {
        yellow: {
            borde: "border-yellow-500",
            texto: "text-yellow-600"
        },
        blue: {
            borde: "border-blue-500",
            texto: "text-blue-600"
        },
        green: {
            borde: "border-green-500",
            texto: "text-green-600"
        },
        orange: {
            borde: "border-orange-500",
            texto: "text-orange-600"
        },
        purple: {
            borde: "border-purple-500",
            texto: "text-purple-600"
        }
    };

    const clases = colores[color] || colores.blue;

    return (
        <div
            className={`bg-white p-5 rounded-2xl shadow-md border-l-4 ${clases.borde}`}
        >
            <p className="text-gray-500 font-medium">
                {titulo}
            </p>

            <p
                className={`text-4xl font-bold mt-2 ${clases.texto}`}
            >
                {cantidad}
            </p>
        </div>
    );
}

export default DashboardCard;