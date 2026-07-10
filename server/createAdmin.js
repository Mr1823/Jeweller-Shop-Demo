import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const adminEmails = [
  "admin@buildwithus",
  "admin@buildwithus.com"
];

async function createAdmin() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    const db = client.db("the-jewel-store");
    const usersCollection = db.collection("users");

    for (const email of adminEmails) {
      const result = await usersCollection.updateOne(
        { email },
        {
          $set: {
            name: "Admin",
            email,
            img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200",
            admin: true,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
      console.log(`✅ Upserted admin account for: ${email}`);
    }

    console.log("\n🎉 Admin creation complete!");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

createAdmin();
