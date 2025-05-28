import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
    try {
        const { database } = await connectToDatabase();
        const collection = database.collection(process.env.MONGODB_COLLECTION);

        const { id } = params;
        const viaje = await collection.findOne({ _id: new ObjectId(id) });

        if (!viaje) {
            return Response.json({ message: "Viaje no encontrado" }, { status: 404 });
        }

        return Response.json(viaje, { status: 200 });
    } catch (error) {
        return Response.json({ message: "Error al obtener viaje", error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { database } = await connectToDatabase();
        const collection = database.collection(process.env.MONGODB_COLLECTION);

        const { id } = params;
        const datosActualizados = await request.json();

        const resultado = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: datosActualizados }
        );

        if (resultado.matchedCount === 0) {
            return Response.json({ message: "Viaje no encontrado" }, { status: 404 });
        }

        return Response.json({ message: "Viaje actualizado" }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "Error al actualizar viaje", error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { database } = await connectToDatabase();
        const collection = database.collection(process.env.MONGODB_COLLECTION);

        const { id } = params;
        const resultado = await collection.deleteOne({ _id: new ObjectId(id) });

        if (resultado.deletedCount === 0) {
            return Response.json({ message: "Viaje no encontrado" }, { status: 404 });
        }

        return Response.json({ message: "Viaje eliminado" }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "Error al eliminar viaje", error: error.message }, { status: 500 });
    }
}
