import { ObjectId } from "mongodb";
import verifyJWT from "../middleware/verifyJWT.js";

const productRoutes = (app, collections) => {
  const productsCollection = collections.products;

  // GET /products — Get all products (with optional search)
  app.get("/products", async (req, res) => {
    const searchText = req.query.searchText;

    let query = {};
    if (searchText) {
      query = {
        name: { $regex: searchText, $options: "i" },
      };
    }

    const result = await productsCollection.find(query).toArray();
    res.send(result);
  });

  // GET /products/filter — Filter products by category, price, size, carate, search
  app.get("/products/filter", async (req, res) => {
    const { category, minPrice, maxPrice, priceOrder, size, carate, search } =
      req.query;

    let query = {};

    // Category filter
    if (category && category.toLowerCase() !== "all") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.$or = [
        {
          discountPrice: {
            ...(minPrice && { $gte: parseFloat(minPrice) }),
            ...(maxPrice && { $lte: parseFloat(maxPrice) }),
          },
        },
        {
          price: {
            ...(minPrice && { $gte: parseFloat(minPrice) }),
            ...(maxPrice && { $lte: parseFloat(maxPrice) }),
          },
        },
      ];
    }

    // Size filter
    if (size && size.toLowerCase() !== "all") {
      query.size = size;
    }

    // Carate filter
    if (carate && carate.toLowerCase() !== "all") {
      query.carate = carate;
    }

    // Search filter
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Sort order
    let sortOption = {};
    if (priceOrder === "asc") {
      sortOption = { price: 1 };
    } else if (priceOrder === "desc") {
      sortOption = { price: -1 };
    }

    const result = await productsCollection
      .find(query)
      .sort(sortOption)
      .toArray();
    res.send(result);
  });

  // POST /products — Add new product (admin)
  app.post("/products", verifyJWT, async (req, res) => {
    const product = req.body;
    product.createdAt = new Date();
    product.reviews = [];

    const result = await productsCollection.insertOne(product);
    res.send(result);
  });

  // PUT /products/:id — Update product (admin)
  app.put("/products/:id", verifyJWT, async (req, res) => {
    const id = req.params.id;
    const product = req.body;

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: product }
    );

    res.send(result);
  });

  // POST /products/add-review/:productId — Add review to a product
  app.post("/products/add-review/:productId", verifyJWT, async (req, res) => {
    const productId = req.params.productId;
    const reviewData = req.body;
    reviewData.addedAt = new Date();
    reviewData.likes = [];

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(productId) },
      { $push: { reviews: reviewData } }
    );

    res.send(result);
  });

  // DELETE /products/delete-review/:productId/reviewer-email/:email
  app.delete(
    "/products/delete-review/:productId/reviewer-email/:email",
    verifyJWT,
    async (req, res) => {
      const { productId, email } = req.params;

      const result = await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $pull: { reviews: { reviewerEmail: email } } }
      );

      res.send(result);
    }
  );

  // POST /single-product-like-update — Toggle like on a product review
  app.post("/single-product-like-update", verifyJWT, async (req, res) => {
    const { productId, reviewId, email } = req.body;

    const product = await productsCollection.findOne({
      _id: new ObjectId(productId),
      "reviews._id": reviewId,
    });

    if (!product) {
      return res.status(404).send({ error: true, message: "Product or review not found" });
    }

    const review = product.reviews?.find((r) => r._id === reviewId);
    const alreadyLiked = review?.likes?.includes(email);

    let result;
    if (alreadyLiked) {
      result = await productsCollection.updateOne(
        { _id: new ObjectId(productId), "reviews._id": reviewId },
        { $pull: { "reviews.$.likes": email } }
      );
    } else {
      result = await productsCollection.updateOne(
        { _id: new ObjectId(productId), "reviews._id": reviewId },
        { $push: { "reviews.$.likes": email } }
      );
    }

    res.send(result);
  });
};

export default productRoutes;
