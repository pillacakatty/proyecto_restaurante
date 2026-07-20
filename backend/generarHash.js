import bcrypt from "bcryptjs";

async function generarHash() {
    const password = "123456"; // Cambia aquí la contraseña que quieras hashear

    const hash = await bcrypt.hash(password, 10);

    console.log("Contraseña original:", password);
    console.log("Hash generado:");
    console.log(hash);
}

generarHash();