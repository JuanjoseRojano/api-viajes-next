import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request) {
    try {
        const { database } = await connectToDatabase()
        const collection = database.collection("viajes")

        const viajes = await collection.find({}).toArray()

        return Response.json(viajes, { status: 200 })
    } catch (error) {
        return Response.json({ message: "Error al obtener viajes", error: error.message }, { status: 500 })
    }
}


export async function POST(request) {
    try {
        const { database } = await connectToDatabase()
        const collection = database.collection("viajes")

        const nuevoViaje = await request.json()

        const resultado = await collection.insertOne(nuevoViaje)

        return Response.json({ message: "Viaje creado", viajeId: resultado.insertedId }, { status: 201 })
    } catch (error) {
        return Response.json({ message: "Error al crear viaje", error: error.message }, { status: 500 })
    }
}