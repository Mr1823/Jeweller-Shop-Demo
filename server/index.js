import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI environment variable is not defined!");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function startServer() {
  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB!");

    const db = client.db("the-jewel-store");

    // Collections
    const collections = {
      users: db.collection("users"),
      products: db.collection("products"),
      categories: db.collection("categories"),
      cart: db.collection("cart"),
      orders: db.collection("orders"),
      wishlist: db.collection("wishlist"),
      reviews: db.collection("reviews"),
      notifications: db.collection("notifications"),
    };

    // Register Routes
    authRoutes(app, collections);
    userRoutes(app, collections);
    productRoutes(app, collections);
    categoryRoutes(app, collections);
    cartRoutes(app, collections);
    orderRoutes(app, collections);
    wishlistRoutes(app, collections);
    reviewRoutes(app, collections);
    paymentRoutes(app);
    adminRoutes(app, collections);

    app.get("/", (req, res) => {
      res.send("The Jewel Store Server is running 💎");
    });

    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});
