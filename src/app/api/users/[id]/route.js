import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const { id } = await params
    const results = await collection.findOne({ _id: new ObjectId(id) })

    return Response.json(results);
}


export async function PUT(request, { params }) {
    const content = request.headers.get('content-type')

    if (content != 'application/json')
        return Response.json({ message: 'Debes proporcionar datos JSON' })

    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const { id } = await params
    const { nombre, edad } = await request.json() // Read body request
    const results = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { nombre, edad } });

    return Response.json(results);
}


export async function DELETE(request, { params }) {
    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const { id } = await params
    const results = await collection.deleteOne({ _id: new ObjectId(id) })

    return Response.json(results);
}
