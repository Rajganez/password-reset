import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const dbName = process.env.DB_Name || "";
const dbUser = process.env.DB_User || "";
const dbPassword = process.env.DB_Pass || "";
const dbCluster = process.env.DB_Cluster || "";
const dbUrl = `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}/?retryWrites=true&w=majority&appName=passwordreset`;

const client = new MongoClient(dbUrl);

const db = client.db(dbName);

const connectToDB = async () => {
  try {
    await client.connect();
    console.log("Connected to DB");
  } catch (error) {
    console.log("Error connecting to DB: ", error);
    process.exit(1);
  }
};

export { db };
export default connectToDB;
