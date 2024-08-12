import { MongoClient } from "mongodb";

let db;
async function connectToDB(cb) {
    const url = "mongodb+srv://leelamadhavnulakani:9133603383@cluster0.fhipcg5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    const client = new MongoClient(url);
    await client.connect();
    db = client.db("hackthon");
    cb();
}

// connectToDB()

export { connectToDB, db };