import {Link} from "react-router-dom";

function Inicio() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white p-10 rounded-2xl shadow-lg w-96 text-center">

        <h1 className="text-4xl font-bold text-orange-600 mb-8">
          Restaurante
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Seleccione una opción
        </p>

        <div className="space-y-4">
          <Link to="/MeseroLogin">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Ingresar como Mesero
          </button>
          </Link>
          <Link to="/CocineroLogin">
          <button className="w-full bg-green-600 text-white py-3 rounded-lg">
            Ingresar como Cocinero
          </button>
        </Link>
        </div>

      </div>

    </div>
  )
}

export default Inicio