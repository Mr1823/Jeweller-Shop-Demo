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

const categories = [
  {
    categoryName: "Gold Necklaces",
    categoryPic: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&h=400",
  },
  {
    categoryName: "Diamond Rings",
    categoryPic: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&h=400",
  },
  {
    categoryName: "Bangles",
    categoryPic: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&h=400",
  },
  {
    categoryName: "Earrings",
    categoryPic: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&h=400",
  },
  {
    categoryName: "Bridal Sets",
    categoryPic: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=400&h=400",
  },
  {
    categoryName: "Kundan",
    categoryPic: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&h=400",
  },
  {
    categoryName: "Temple Jewellery",
    categoryPic: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=400&h=400",
  },
  {
    categoryName: "Pendants",
    categoryPic: "https://images.unsplash.com/photo-1599458252573-56ae36120de1?auto=format&fit=crop&w=400&h=400",
  },
];

const products = [
  // ── Gold Necklaces ──
  {
    name: "22K Gold Kundan Bridal Necklace",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&h=600",
    category: "Gold Necklaces",
    price: 185000,
    discountPrice: 165000,
    discountPercentage: "10.81",
    stock: 8,
    sold: 25,
    badge: "Bestseller",
    featured: true,
    carate: "22K",
    size: "Standard",
    description: "Exquisite 22K Gold Kundan Bridal Necklace featuring intricate meenakari work and precious kundan stones. Perfect for weddings and grand celebrations.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "18K Gold Layered Chain Necklace",
    img: "https://images.unsplash.com/photo-1515562141589-67f0d0e6f5b0?auto=format&fit=crop&w=600&h=600",
    category: "Gold Necklaces",
    price: 75000,
    discountPrice: 68000,
    discountPercentage: "9.33",
    stock: 15,
    sold: 18,
    badge: null,
    featured: false,
    carate: "18K",
    size: "Standard",
    description: "Elegant 18K gold layered chain necklace with a modern minimalist design. Perfect for everyday luxury.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "24K Pure Gold Temple Haram",
    img: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=600&h=600",
    category: "Gold Necklaces",
    price: 320000,
    discountPrice: 295000,
    discountPercentage: "7.81",
    stock: 3,
    sold: 12,
    badge: "Premium",
    featured: true,
    carate: "24K",
    size: "Long",
    description: "Magnificent 24K pure gold temple haram with traditional South Indian design. A timeless heirloom piece.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "22K Gold Choker with Ruby",
    img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&h=600",
    category: "Gold Necklaces",
    price: 145000,
    discountPrice: null,
    discountPercentage: null,
    stock: 6,
    sold: 9,
    badge: "New",
    featured: false,
    carate: "22K",
    size: "Choker",
    description: "Stunning 22K gold choker necklace adorned with natural rubies and intricate filigree work.",
    reviews: [],
    createdAt: new Date(),
  },
  // ── Diamond Rings ──
  {
    name: "Solitaire Diamond Engagement Ring",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&h=600",
    category: "Diamond Rings",
    price: 250000,
    discountPrice: 225000,
    discountPercentage: "10.00",
    stock: 5,
    sold: 30,
    badge: "Bestseller",
    featured: true,
    carate: "18K",
    size: "6",
    description: "Classic solitaire diamond engagement ring set in 18K white gold. 1 carat VS1 clarity diamond.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "Rose Gold Diamond Band",
    img: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&w=600&h=600",
    category: "Diamond Rings",
    price: 95000,
    discountPrice: 85000,
    discountPercentage: "10.53",
    stock: 12,
    sold: 20,
    badge: null,
    featured: false,
    carate: "18K",
    size: "7",
    description: "Delicate rose gold diamond band with micro-pavé set diamonds. Perfect as a wedding band or stackable ring.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "Platinum Diamond Cluster Ring",
    img: "https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?auto=format&fit=crop&w=600&h=600",
    category: "Diamond Rings",
    price: 180000,
    discountPrice: 162000,
    discountPercentage: "10.00",
    stock: 4,
    sold: 15,
    badge: "Premium",
    featured: true,
    carate: "Platinum",
    size: "8",
    description: "Luxurious platinum diamond cluster ring featuring a halo of brilliant-cut diamonds around a center stone.",
    reviews: [],
    createdAt: new Date(),
  },
  // ── Bangles ──
  {
    name: "22K Gold Traditional Bangles Set",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&h=600",
    category: "Bangles",
    price: 120000,
    discountPrice: 108000,
    discountPercentage: "10.00",
    stock: 10,
    sold: 35,
    badge: "Bestseller",
    featured: true,
    carate: "22K",
    size: "2.6",
    description: "Set of 4 traditional 22K gold bangles with intricate hand-carved patterns. A must-have for every jewellery collection.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "Meenakari Gold Bangles Pair",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&h=600",
    category: "Bangles",
    price: 85000,
    discountPrice: 79000,
    discountPercentage: "7.06",
    stock: 8,
    sold: 22,
    badge: null,
    featured: false,
    carate: "22K",
    size: "2.4",
    description: "Exquisite Meenakari gold bangles pair with vibrant enamel work in traditional Rajasthani style.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "Diamond Studded Platinum Bangle",
    img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&h=600",
    category: "Bangles",
    price: 210000,
    discountPrice: null,
    discountPercentage: null,
    stock: 3,
    sold: 7,
    badge: "New",
    featured: false,
    carate: "Platinum",
    size: "2.8",
    description: "Sleek platinum bangle studded with channel-set diamonds. A modern classic for the sophisticated woman.",
    reviews: [],
    createdAt: new Date(),
  },
  // ── Earrings ──
  {
    name: "Gold Jhumka Earrings",
    img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&h=600",
    category: "Earrings",
    price: 45000,
    discountPrice: 39000,
    discountPercentage: "13.33",
    stock: 20,
    sold: 45,
    badge: "Bestseller",
    featured: true,
    carate: "22K",
    size: "Standard",
    description: "Traditional gold jhumka earrings with pearl drops and filigree work. Perfect for festive occasions.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "Diamond Stud Earrings",
    img: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=600&h=600",
    category: "Earrings",
    price: 65000,
    discountPrice: 58000,
    discountPercentage: "10.77",
    stock: 15,
    sold: 28,
    badge: null,
    featured: false,
    carate: "18K",
    size: "Standard",
    description: "Elegant diamond stud earrings set in 18K white gold. Each diamond is 0.5 carat with excellent brilliance.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "Chandbali Pearl Drop Earrings",
    img: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=600&h=600",
    category: "Earrings",
    price: 55000,
    discountPrice: 48000,
    discountPercentage: "12.73",
    stock: 10,
    sold: 18,
    badge: "Trending",
    featured: false,
    carate: "22K",
    size: "Standard",
    description: "Beautiful chandbali earrings with natural pearl drops and kundan work. A bridal favourite.",
    reviews: [],
    createdAt: new Date(),
  },
  // ── Bridal Sets ──
  {
    name: "Royal Bridal Jewellery Set",
    img: "https://images.unsplash.com/photo-1599458252573-56ae36120de1?auto=format&fit=crop&w=600&h=600",
    category: "Bridal Sets",
    price: 450000,
    discountPrice: 399000,
    discountPercentage: "11.33",
    stock: 2,
    sold: 8,
    badge: "Premium",
    featured: true,
    carate: "22K",
    size: "Standard",
    description: "Complete royal bridal jewellery set including necklace, earrings, maang tikka, and bangles. Handcrafted in 22K gold with kundan and polki work.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "South Indian Bridal Temple Set",
    img: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=600&h=600",
    category: "Bridal Sets",
    price: 380000,
    discountPrice: 345000,
    discountPercentage: "9.21",
    stock: 3,
    sold: 6,
    badge: null,
    featured: false,
    carate: "22K",
    size: "Standard",
    description: "Authentic South Indian bridal temple jewellery set with traditional Lakshmi motifs. Includes haram, choker, jhumkas, and vaddanam.",
    reviews: [],
    createdAt: new Date(),
  },
  // ── Kundan ──
  {
    name: "Kundan Polki Necklace Set",
    img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&h=600",
    category: "Kundan",
    price: 195000,
    discountPrice: 175000,
    discountPercentage: "10.26",
    stock: 5,
    sold: 14,
    badge: "Trending",
    featured: true,
    carate: "22K",
    size: "Standard",
    description: "Stunning Kundan Polki necklace set with matching earrings. Features uncut diamonds and precious gemstones in 22K gold.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "Kundan Choker with Emeralds",
    img: "https://images.unsplash.com/photo-1515562141589-67f0d0e6f5b0?auto=format&fit=crop&w=600&h=600",
    category: "Kundan",
    price: 165000,
    discountPrice: null,
    discountPercentage: null,
    stock: 4,
    sold: 11,
    badge: "New",
    featured: false,
    carate: "22K",
    size: "Choker",
    description: "Magnificent Kundan choker set with natural emerald drops. A statement piece for weddings and grand celebrations.",
    reviews: [],
    createdAt: new Date(),
  },
  // ── Temple Jewellery ──
  {
    name: "Lakshmi Temple Gold Necklace",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&h=600",
    category: "Temple Jewellery",
    price: 225000,
    discountPrice: 199000,
    discountPercentage: "11.56",
    stock: 4,
    sold: 16,
    badge: "Bestseller",
    featured: true,
    carate: "22K",
    size: "Standard",
    description: "Traditional Lakshmi temple gold necklace with intricate deity motifs. Pure 22K gold with antique finish.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "Temple Coin Gold Haar",
    img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&h=600",
    category: "Temple Jewellery",
    price: 275000,
    discountPrice: 250000,
    discountPercentage: "9.09",
    stock: 2,
    sold: 5,
    badge: null,
    featured: false,
    carate: "22K",
    size: "Long",
    description: "Grand temple coin gold haar (long necklace) with traditional kaasu mala design. Perfect for festive and bridal occasions.",
    reviews: [],
    createdAt: new Date(),
  },
  // ── Pendants ──
  {
    name: "Diamond Heart Pendant",
    img: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=600&h=600",
    category: "Pendants",
    price: 42000,
    discountPrice: 37000,
    discountPercentage: "11.90",
    stock: 18,
    sold: 32,
    badge: "Bestseller",
    featured: false,
    carate: "18K",
    size: "Standard",
    description: "Delicate diamond heart pendant in 18K white gold with 0.25 carat brilliant-cut diamond center stone.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "Gold Ganesh Pendant",
    img: "https://images.unsplash.com/photo-1599458252573-56ae36120de1?auto=format&fit=crop&w=600&h=600",
    category: "Pendants",
    price: 28000,
    discountPrice: 24500,
    discountPercentage: "12.50",
    stock: 25,
    sold: 40,
    badge: null,
    featured: false,
    carate: "22K",
    size: "Standard",
    description: "Beautifully crafted 22K gold Ganesh pendant with fine detailing. A spiritual piece for daily wear.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "Ruby & Gold Floral Pendant",
    img: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&w=600&h=600",
    category: "Pendants",
    price: 52000,
    discountPrice: null,
    discountPercentage: null,
    stock: 10,
    sold: 14,
    badge: "New",
    featured: false,
    carate: "22K",
    size: "Standard",
    description: "Elegant floral pendant with natural rubies set in 22K gold. Comes with a matching gold chain.",
    reviews: [],
    createdAt: new Date(),
  },
  // ── Extra products ──
  {
    name: "Antique Gold Kamarbandh",
    img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&h=600",
    category: "Bridal Sets",
    price: 175000,
    discountPrice: 155000,
    discountPercentage: "11.43",
    stock: 3,
    sold: 10,
    badge: "Trending",
    featured: false,
    carate: "22K",
    size: "Standard",
    description: "Traditional antique gold kamarbandh (waist belt) with temple motifs. A stunning bridal accessory.",
    reviews: [],
    createdAt: new Date(),
  },
  {
    name: "18K Gold Chain for Men",
    img: "https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?auto=format&fit=crop&w=600&h=600",
    category: "Gold Necklaces",
    price: 95000,
    discountPrice: 88000,
    discountPercentage: "7.37",
    stock: 12,
    sold: 19,
    badge: null,
    featured: false,
    carate: "18K",
    size: "Standard",
    description: "Bold 18K gold chain for men with a modern flat link design. Perfect for daily wear or special occasions.",
    reviews: [],
    createdAt: new Date(),
  },
];

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

async function seedDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    const db = client.db("the-jewel-store");

    // Seed Categories
    const categoriesCollection = db.collection("categories");
    const existingCategories = await categoriesCollection.countDocuments();
    if (existingCategories === 0) {
      const catResult = await categoriesCollection.insertMany(categories);
      console.log(`✅ Inserted ${catResult.insertedCount} categories`);
    } else {
      console.log(`⚠️  Categories already exist (${existingCategories}), skipping...`);
    }

    // Seed Products
    const productsCollection = db.collection("products");
    const existingProducts = await productsCollection.countDocuments();
    if (existingProducts === 0) {
      const prodResult = await productsCollection.insertMany(products);
      console.log(`✅ Inserted ${prodResult.insertedCount} products`);
    } else {
      console.log(`⚠️  Products already exist (${existingProducts}), skipping...`);
    }

    // Seed Reviews
    const reviewsCollection = db.collection("reviews");
    const existingReviews = await reviewsCollection.countDocuments();
    if (existingReviews === 0) {
      const revResult = await reviewsCollection.insertMany(reviews);
      console.log(`✅ Inserted ${revResult.insertedCount} reviews`);
    } else {
      console.log(`⚠️  Reviews already exist (${existingReviews}), skipping...`);
    }

    console.log("\n🎉 Database seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

seedDatabase();
