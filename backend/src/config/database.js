import { MongoClient } from "mongodb";

let db;

async function conectarDB() {
    try {
        const cliente = new MongoClient(process.env.MONGODB_URI);

        await cliente.connect();

        db = cliente.db("RestauranteBD");

        console.log("MongoDB Atlas conectado correctamente");
    } catch (error) {
        console.error("Error al conectar con MongoDB Atlas:");
        console.error(error.message);

        throw error;
    }
}

function obtenerDB() {
    if (!db) {
        throw new Error("La base de datos no está conectada");
    }

    return db;
}

export { conectarDB, obtenerDB };