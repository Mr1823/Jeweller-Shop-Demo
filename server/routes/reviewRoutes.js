import verifyJWT from "../middleware/verifyJWT.js";

const reviewRoutes = (app, collections) => {
  const reviewsCollection = collections.reviews;

  // GET /reviews — Get all site-wide reviews
  app.get("/reviews", async (req, res) => {
    const result = await reviewsCollection
      .find()
      .sort({ addedAt: -1 })
      .toArray();
    res.send(result);
  });

  // POST /add-review — Add site-wide review
  app.post("/add-review", verifyJWT, async (req, res) => {
    const reviewData = req.body;

    const existing = await reviewsCollection.findOne({
      email: reviewData.email,
    });

    if (existing) {
      return res.send({
        message: "You have already submitted a review",
        insertedId: null,
      });
    }

    const result = await reviewsCollection.insertOne(reviewData);
    res.send(result);
  });

  // DELETE /delete-review/:email — Delete site review by email
  app.delete("/delete-review/:email", verifyJWT, async (req, res) => {
    const email = req.params.email;
    const result = await reviewsCollection.deleteOne({ email });
    res.send(result);
  });

  // GET /nav-notifications — Get navigation bar notifications
  app.get("/nav-notifications", async (req, res) => {
    const notificationsCollection = collections.notifications;

    const result = await notificationsCollection.find().toArray();

    if (result.length === 0) {
      return res.send([
        "Free shipping on orders above ₹5000!",
        "New arrivals every week 💎",
        "Use code JEWEL10 for 10% off",
      ]);
    }

    res.send(result);
  });
};

export default reviewRoutes;
