import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request) {
    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const results = await collection.find({}).toArray();

    return Response.json(results);
}

export async function POST(request) {
    const content = request.headers.get('content-type')

    if (content != 'application/json')
        return Response.json({ message: 'Debes proporcionar datos JSON' })

    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.MONGODB_COLLECTION)

    const { nombre, edad } = await request.json() // Read body request
    const results = await collection.insertOne({ nombre, edad });

    return Response.json(results)
}

