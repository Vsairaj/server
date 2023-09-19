import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI ;
console.log(connectionString);

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log("Successfully connected to Atlas");
} catch(e) {
  console.error(e);
}

let db = conn.db("capstone");

export default db;