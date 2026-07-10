import { ObjectId } from "mongodb";
import verifyJWT from "../middleware/verifyJWT.js";

const orderRoutes = (app, collections) => {
  const ordersCollection = collections.orders;

  // GET /orders?email= — Get orders by user email
  app.get("/orders", verifyJWT, async (req, res) => {
    const email = req.query.email;

    if (!email) {
      return res.status(400).send({ error: true, message: "Email is required" });
    }

    const result = await ordersCollection
      .find({ email })
      .sort({ date: -1 })
      .toArray();
    res.send(result);
  });

  // POST /orders — Create new order
  app.post("/orders", verifyJWT, async (req, res) => {
    const orderData = req.body;
    orderData.date = new Date(orderData.date);

    const result = await ordersCollection.insertOne(orderData);
    res.send(result);
  });

  // DELETE /delete-order/:id — Cancel/delete an order
  app.delete("/delete-order/:id", verifyJWT, async (req, res) => {
    const id = req.params.id;
    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  });
};

export default orderRoutes;
