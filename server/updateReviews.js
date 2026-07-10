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

const reviews = [
  {
    name: "Ananya Sharma",
    location: "Mumbai, Maharashtra",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    review: "The Jewelz Store has an exquisite collection of kundan and gold jewellery! The website is so elegant, easy to navigate, and ordering was absolutely seamless. Truly a luxury online shopping experience.",
    rating: 5,
  },
  {
    name: "Priya Mehta",
    location: "Jaipur, Rajasthan",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
    review: "Ordered a bridal set for my wedding — it arrived beautifully packaged and the quality exceeded expectations. Every detail was perfect. Highly recommend!",
    rating: 5,
  },
  {
    name: "Aarav Patel",
    location: "Ahmedabad, Gujarat",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    review: "Bought a gold chain for my father and it is magnificent! Genuine 22K gold, great weight, and the customer support team was very helpful throughout.",
    rating: 5,
  },
  {
    name: "Deepika Nair",
    location: "Kochi, Kerala",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
    review: "The temple jewellery collection is absolutely stunning! Authentic designs and premium craftsmanship. I'm now a loyal customer.",
    rating: 4,
  },
  {
    name: "Rahul Verma",
    location: "Delhi, NCR",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
    review: "Exceptional customer support and highly secure packaging. The diamond ring is even more stunning in person than on the site. Truly a top-class web store!",
    rating: 5,
  },
];

async function updateReviews() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    const db = client.db("the-jewel-store");
    const reviewsCollection = db.collection("reviews");

    // Clear existing reviews
    await reviewsCollection.deleteMany({});
    console.log("🗑️ Cleared existing reviews");

    // Insert new reviews
    const result = await reviewsCollection.insertMany(reviews);
    console.log(`✅ Successfully inserted ${result.insertedCount} Indian reviews!`);
  } catch (error) {
    console.error("❌ Error updating reviews:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

updateReviews();
