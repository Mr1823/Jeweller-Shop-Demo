import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

// Route imports
import authRoutes from "../server/routes/authRoutes.js";
import userRoutes from "../server/routes/userRoutes.js";
import productRoutes from "../server/routes/productRoutes.js";
import categoryRoutes from "../server/routes/categoryRoutes.js";
import cartRoutes from "../server/routes/cartRoutes.js";
import orderRoutes from "../server/routes/orderRoutes.js";
import wishlistRoutes from "../server/routes/wishlistRoutes.js";
import reviewRoutes from "../server/routes/reviewRoutes.js";
import paymentRoutes from "../server/routes/paymentRoutes.js";
import adminRoutes from "../server/routes/adminRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

let client = null;
let collections = null;

async function connectDB() {
  if (collections) return { client, collections };

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is not defined!");
    throw new Error("MONGODB_URI environment variable is not defined!");
  }

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  const db = client.db("the-jewel-store");

  collections = {
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

  app.get("/api", (req, res) => {
    res.send("The Jewel Store Server is running on Vercel 💎");
  });

  return { client, collections };
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
});

export default app;
