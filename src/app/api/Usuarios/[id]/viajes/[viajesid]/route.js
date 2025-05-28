import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
    try {
        const { id, viajesid } = params;

        if (!ObjectId.isValid(id) || !ObjectId.isValid(viajesid)) {
            return new Response(
                JSON.stringify({ message: "ID inválido" }),
                { status: 400 }
            );
        }

        const { database } = await connectToDatabase();
        const collection = database.collection("usuarios");

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

        const viaje = usuario.viajes.find(
            (v) => v._id.toString() === viajesid
        );

        if (!viaje) {
            return new Response(
                JSON.stringify({ message: "Viaje no encontrado" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(viaje), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Error al obtener viaje", error: error.message }),
            { status: 500 }
        );
    }
}

export async function POST(request, { params }) {
    try {
        const { id } = params;
        const nuevoViaje = await request.json();

        if (!ObjectId.isValid(id)) {
            return new Response(
                JSON.stringify({ message: "ID de usuario inválido" }),
                { status: 400 }
            );
        }

        // Añadimos un _id al nuevo viaje para poder identificarlo luego
        nuevoViaje._id = new ObjectId();

        const { database } = await connectToDatabase();
        const collection = database.collection("usuarios");

        const resultado = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $push: { viajes: nuevoViaje } }
        );

        if (resultado.matchedCount === 0) {
            return new Response(
                JSON.stringify({ message: "Usuario no encontrado" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Viaje agregado", viajeId: nuevoViaje._id }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Error al agregar viaje", error: error.message }),
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id, viajesid } = params;
        const updates = await request.json();

        if (!ObjectId.isValid(id) || !ObjectId.isValid(viajesid)) {
            return new Response(
                JSON.stringify({ message: "ID inválido" }),
                { status: 400 }
            );
        }

        const { database } = await connectToDatabase();
        const collection = database.collection("usuarios");

        // Construir objeto para actualización dinámica
        const updateFields = {};
        for (const [key, value] of Object.entries(updates)) {
            updateFields[`viajes.$.${key}`] = value;
        }

        const resultado = await collection.findOneAndUpdate(
            { _id: new ObjectId(id), "viajes._id": new ObjectId(viajesid) },
            { $set: updateFields },
            { returnDocument: "after" }
        );

        if (!resultado.value) {
            return new Response(
                JSON.stringify({ message: "Usuario o viaje no encontrado" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Viaje actualizado", viaje: resultado.value.viajes.find(v => v._id.toString() === viajesid) }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Error al actualizar viaje", error: error.message }),
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id, viajesid } = params;

        if (!ObjectId.isValid(id) || !ObjectId.isValid(viajesid)) {
            return new Response(
                JSON.stringify({ message: "ID inválido" }),
                { status: 400 }
            );
        }

        const { database } = await connectToDatabase();
        const collection = database.collection("usuarios");

        const resultado = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $pull: { viajes: { _id: new ObjectId(viajesid) } } }
        );

        if (resultado.modifiedCount === 0) {
            return new Response(
                JSON.stringify({ message: "Viaje no encontrado o no eliminado" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Viaje eliminado correctamente" }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Error al eliminar viaje", error: error.message }),
            { status: 500 }
        );
    }
}
