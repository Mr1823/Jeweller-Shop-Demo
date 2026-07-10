import { ObjectId } from "mongodb";
import verifyJWT from "../middleware/verifyJWT.js";

const wishlistRoutes = (app, collections) => {
  const wishlistCollection = collections.wishlist;

  // GET /wishlist?email= — Get wishlist items by email
  app.get("/wishlist", verifyJWT, async (req, res) => {
    const email = req.query.email;

    if (!email) {
      return res.status(400).send({ error: true, message: "Email is required" });
    }

    const result = await wishlistCollection.find({ email }).toArray();
    res.send(result);
  });

  // POST /wishlist?email= — Add item to wishlist
  app.post("/wishlist", verifyJWT, async (req, res) => {
    const wishlistItem = req.body;
    const email = req.query.email;

    if (!email) {
      return res.status(400).send({ error: true, message: "Email is required" });
    }

    const existing = await wishlistCollection.findOne({
      email,
      productId: wishlistItem.productId,
    });

    if (existing) {
      return res.send({ message: "Already in wishlist", insertedId: null });
    }

    const result = await wishlistCollection.insertOne(wishlistItem);
    res.send(result);
  });

  // DELETE /wishlist/:id — Remove item from wishlist
  app.delete("/wishlist/:id", verifyJWT, async (req, res) => {
    const id = req.params.id;
    const result = await wishlistCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  });
};

export default wishlistRoutes;
