import { ObjectId } from "mongodb";
import verifyJWT from "../middleware/verifyJWT.js";

const categoryRoutes = (app, collections) => {
  const categoriesCollection = collections.categories;

  // GET /categories — Get all categories (public)
  app.get("/categories", async (req, res) => {
    const result = await categoriesCollection.find().toArray();
    res.send(result);
  });

  // GET /admin/categories — Get categories with IDs for admin management
  app.get("/admin/categories", verifyJWT, async (req, res) => {
    const categories = await categoriesCollection.find().toArray();

    const result = categories.map((cat) => ({
      categoryId: cat._id.toString(),
      categoryName: cat.categoryName,
      categoryPic: cat.categoryPic,
    }));

    res.send(result);
  });

  // POST /categories — Add new category
  app.post("/categories", verifyJWT, async (req, res) => {
    const { categoryName, categoryPic } = req.body;

    if (!categoryName) {
      return res.status(400).send({ error: true, message: "Category name is required" });
    }

    const result = await categoriesCollection.insertOne({
      categoryName,
      categoryPic: categoryPic || "",
      createdAt: new Date(),
    });

    res.send(result);
  });

  // PATCH /categories/:id — Update category
  app.patch("/categories/:id", verifyJWT, async (req, res) => {
    const id = req.params.id;
    const { categoryName, categoryPic } = req.body;

    const updateData = {};
    if (categoryName) updateData.categoryName = categoryName;
    if (categoryPic) updateData.categoryPic = categoryPic;

    const result = await categoriesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    res.send(result);
  });
};

export default categoryRoutes;
