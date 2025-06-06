import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request) {
    try {
        const { database } = await connectToDatabase()
        const collection = database.collection("usuarios")

        const usuarios = await collection.find({}).toArray()

        return Response.json(usuarios, { status: 200 })
    } catch (error) {
        return Response.json({ message: "Error al obtener usuarios", error: error.message }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const { database } = await connectToDatabase()
        const collection = database.collection("usuarios")

        const nuevoUsuario = await request.json()

        const resultado = await collection.insertOne(nuevoUsuario)

        return Response.json({ message: "Usuario creado", usuarioId: resultado.insertedId }, { status: 201 })
    } catch (error) {
        return Response.json({ message: "Error al crear usuario", error: error.message }, { status: 500 })
    }
}
