import { ObjectId } from "mongodb";
import verifyJWT from "../middleware/verifyJWT.js";

const cartRoutes = (app, collections) => {
  const cartCollection = collections.cart;

  // GET /cart?email= — Get cart items by email
  app.get("/cart", verifyJWT, async (req, res) => {
    const email = req.query.email;

    if (!email) {
      return res.status(400).send({ error: true, message: "Email is required" });
    }

    const result = await cartCollection.find({ email }).toArray();
    res.send(result);
  });

  // GET /cart/subtotal?email= — Get cart subtotal
  app.get("/cart/subtotal", verifyJWT, async (req, res) => {
    const email = req.query.email;

    if (!email) {
      return res.status(400).send({ error: true, message: "Email is required" });
    }

    const cartItems = await cartCollection.find({ email }).toArray();
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.price) * parseInt(item.quantity);
    }, 0);

    res.send({ subtotal: subtotal.toFixed(2) });
  });

  // POST /cart — Add item to cart
  app.post("/cart", verifyJWT, async (req, res) => {
    const cartItem = req.body;

    const existingItem = await cartCollection.findOne({
      email: cartItem.email,
      productId: cartItem.productId,
    });

    if (existingItem) {
      const result = await cartCollection.updateOne(
        { _id: existingItem._id },
        { $inc: { quantity: cartItem.quantity || 1 } }
      );
      return res.send({ ...result, insertedId: existingItem._id });
    }

    const result = await cartCollection.insertOne(cartItem);
    res.send(result);
  });

  // PATCH /cart/:id — Update cart item quantity
  app.patch("/cart/:id", verifyJWT, async (req, res) => {
    const id = req.params.id;
    const { quantity, operation } = req.body;

    let updateQuantity;
    if (operation === "plus") {
      updateQuantity = parseInt(quantity) + 1;
    } else if (operation === "minus") {
      updateQuantity = Math.max(1, parseInt(quantity) - 1);
    } else {
      updateQuantity = parseInt(quantity);
    }

    const result = await cartCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { quantity: updateQuantity } }
    );

    res.send(result);
  });

  // DELETE /cart/:id — Remove item from cart
  app.delete("/cart/:id", verifyJWT, async (req, res) => {
    const id = req.params.id;
    const result = await cartCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  });

  // DELETE /delete-cart-items?email= — Clear all cart items for user (after order)
  app.delete("/delete-cart-items", verifyJWT, async (req, res) => {
    const email = req.query.email;

    if (!email) {
      return res.status(400).send({ error: true, message: "Email is required" });
    }

    const result = await cartCollection.deleteMany({ email });
    res.send(result);
  });
};

export default cartRoutes;
