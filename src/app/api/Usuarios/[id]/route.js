import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
    try {
        const { database } = await connectToDatabase()
        const collection = database.collection("usuarios")

        const { id } = params
        if (!ObjectId.isValid(id)) {
            return Response.json({ message: "Id inválido" }, { status: 400 })
        }

        const usuario = await collection.findOne({ _id: new ObjectId(id) })
        if (!usuario) {
            return Response.json({ message: "Usuario no encontrado" }, { status: 404 })
        }

        return Response.json(usuario, { status: 200 })
    } catch (error) {
        return Response.json({ message: "Error al obtener usuario", error: error.message }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const { database } = await connectToDatabase()
        const collection = database.collection("usuarios")

        const { id } = params
        if (!ObjectId.isValid(id)) {
            return Response.json({ message: "Id inválido" }, { status: 400 })
        }

        const datosActualizados = await request.json()
        const resultado = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: datosActualizados }
        )

        if (resultado.matchedCount === 0) {
            return Response.json({ message: "Usuario no encontrado" }, { status: 404 })
        }

        return Response.json({ message: "Usuario actualizado" }, { status: 200 })
    } catch (error) {
        return Response.json({ message: "Error al actualizar usuario", error: error.message }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        const { database } = await connectToDatabase()
        const collection = database.collection("usuarios")

        const { id } = params
        if (!ObjectId.isValid(id)) {
            return Response.json({ message: "Id inválido" }, { status: 400 })
        }

        const resultado = await collection.deleteOne({ _id: new ObjectId(id) })
        if (resultado.deletedCount === 0) {
            return Response.json({ message: "Usuario no encontrado" }, { status: 404 })
        }

        return Response.json({ message: "Usuario eliminado" }, { status: 200 })
    } catch (error) {
        return Response.json({ message: "Error al eliminar usuario", error: error.message }, { status: 500 })
    }
}

// Opcionalmente un POST con id (no muy común, normalmente POST es sin id)
// Si no lo necesitas, puedes omitir esta función
export async function POST(request, { params }) {
    try {
        const { database } = await connectToDatabase()
        const collection = database.collection("usuarios")

        const { id } = params
        if (!ObjectId.isValid(id)) {
            return Response.json({ message: "Id inválido" }, { status: 400 })
        }

        const nuevoUsuario = await request.json()
        // Crear con _id explícito
        nuevoUsuario._id = new ObjectId(id)

        const resultado = await collection.insertOne(nuevoUsuario)

        return Response.json({ message: "Usuario creado con id", usuarioId: resultado.insertedId }, { status: 201 })
    } catch (error) {
        return Response.json({ message: "Error al crear usuario", error: error.message }, { status: 500 })
    }
}
