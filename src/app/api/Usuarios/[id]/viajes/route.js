import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return new Response(
                JSON.stringify({ message: "ID inválido" }),
                { status: 400 }
            );
        }

        const { database } = await connectToDatabase();
        const collection = database.collection("usuarios");

        // Solo traemos los viajes del usuario
        const usuario = await collection.findOne(
            { _id: new ObjectId(id) },
            { projection: { viajes: 1 } }
        );

        if (!usuario) {
            return new Response(
                JSON.stringify({ message: "Usuario no encontrado" }),
                { status: 404 }
            );
        }

        // Retornamos todos los viajes (puede ser un array vacío si no hay viajes)
        return new Response(JSON.stringify(usuario.viajes || []), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Error al obtener viajes", error: error.message }),
            { status: 500 }
        );
    }
}




export async function POST(request, { params }) {
    try {
        const { id } = params // id del usuario
        const nuevoViaje = await request.json()

        const { database } = await connectToDatabase()
        const collection = database.collection("usuarios")

        // Agregar nuevo viaje al array "viajes" del usuario
        const resultado = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $push: { viajes: nuevoViaje } }
        )

        if (resultado.matchedCount === 0) {
            return new Response(JSON.stringify({ message: "Usuario no encontrado" }), { status: 404 })
        }

        return new Response(JSON.stringify({ message: "Viaje agregado" }), { status: 201 })
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error al agregar viaje", error: error.message }), { status: 500 })
    }
}
