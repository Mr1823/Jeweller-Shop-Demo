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

async function updateDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    const db = client.db("the-jewel-store");
    const productsCollection = db.collection("products");

    // 1. Set flashSale: true for Bestsellers
    const result = await productsCollection.updateMany(
      { badge: "Bestseller" },
      { $set: { flashSale: true } }
    );
    
    // 2. Set flashSale: true for Premium products
    const result2 = await productsCollection.updateMany(
      { badge: "Premium" },
      { $set: { flashSale: true } }
    );

    // 3. Set newArrival: true and addedAt: new Date() for Diamond Rings and Bangles
    const result3 = await productsCollection.updateMany(
      { category: { $in: ["Diamond Rings", "Bangles", "Gold Necklaces"] } },
      { $set: { newArrival: true, addedAt: new Date() } }
    );

    console.log(`✅ Updated ${result.modifiedCount + result2.modifiedCount} products with flashSale: true`);
    console.log(`✅ Updated ${result3.modifiedCount} products with newArrival: true and addedAt timestamp`);
  } catch (error) {
    console.error("❌ Error updating database:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

updateDatabase();
