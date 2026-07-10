import { ObjectId } from "mongodb";
import verifyJWT from "../middleware/verifyJWT.js";

const adminRoutes = (app, collections) => {
  const usersCollection = collections.users;
  const productsCollection = collections.products;
  const ordersCollection = collections.orders;
  const reviewsCollection = collections.reviews;
  const categoriesCollection = collections.categories;

  // GET /admin/users — Get all users
  app.get("/admin/users", verifyJWT, async (req, res) => {
    const result = await usersCollection.find().toArray();
    res.send(result);
  });

  // PATCH /admin/users/make-admin/:email — Make user admin
  app.patch("/admin/users/make-admin/:email", verifyJWT, async (req, res) => {
    const email = req.params.email;
    const { admin } = req.body;

    const result = await usersCollection.updateOne(
      { email },
      { $set: { admin: admin !== undefined ? admin : true } }
    );

    res.send(result);
  });

  // DELETE /admin/delete-user/:email — Delete user
  app.delete("/admin/delete-user/:email", verifyJWT, async (req, res) => {
    const email = req.params.email;
    const result = await usersCollection.deleteOne({ email });
    res.send(result);
  });

  // GET /admin/orders — Get all orders
  app.get("/admin/orders", verifyJWT, async (req, res) => {
    const result = await ordersCollection
      .find()
      .sort({ date: -1 })
      .toArray();
    res.send(result);
  });

  // PATCH /admin/update-order/:orderId — Update order status
  app.patch("/admin/update-order/:orderId", verifyJWT, async (req, res) => {
    const orderId = req.params.orderId;
    const { orderStatus } = req.body;

    let result = await ordersCollection.updateOne(
      { orderId },
      { $set: { orderStatus } }
    );

    if (result.matchedCount === 0) {
      try {
        result = await ordersCollection.updateOne(
          { _id: new ObjectId(orderId) },
          { $set: { orderStatus } }
        );
      } catch {
        // Ignored
      }
    }

    res.send(result);
  });

  // DELETE /admin/delete-product/:id — Delete product
  app.delete("/admin/delete-product/:id", verifyJWT, async (req, res) => {
    const id = req.params.id;
    const result = await productsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  });

  // GET /admin/total-spent — Total spent by all users (aggregated from orders)
  app.get("/admin/total-spent", verifyJWT, async (req, res) => {
    const pipeline = [
      {
        $group: {
          _id: "$email",
          totalSpent: { $sum: { $toDouble: "$total" } },
          name: { $first: "$name" },
        },
      },
      { $sort: { totalSpent: -1 } },
    ];

    const result = await ordersCollection.aggregate(pipeline).toArray();
    res.send(result);
  });

  // GET /admin-dashboard/stats — Dashboard summary stats
  app.get("/admin-dashboard/stats", verifyJWT, async (req, res) => {
    try {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const firstDayCurrentMonth = new Date(currentYear, currentMonth, 1);
      const firstDayLastMonth = new Date(currentYear, currentMonth - 1, 1);

      const currentMonthOrders = await ordersCollection
        .find({ date: { $gte: firstDayCurrentMonth } })
        .toArray();

      const lastMonthOrders = await ordersCollection
        .find({
          date: { $gte: firstDayLastMonth, $lt: firstDayCurrentMonth },
        })
        .toArray();

      const totalSells = currentMonthOrders.reduce(
        (sum, o) => sum + parseFloat(o.total || 0),
        0
      );
      const totalOrders = currentMonthOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalSells / totalOrders : 0;

      const lastMonthTotalSells = lastMonthOrders.reduce(
        (sum, o) => sum + parseFloat(o.total || 0),
        0
      );
      const lastMonthTotalOrders = lastMonthOrders.length;
      const lastMonthAvgOrderValue =
        lastMonthTotalOrders > 0
          ? lastMonthTotalSells / lastMonthTotalOrders
          : 0;

      const newCustomers = await usersCollection.countDocuments({
        createdAt: { $gte: firstDayCurrentMonth },
      });
      const lastMonthNewCustomers = await usersCollection.countDocuments({
        createdAt: {
          $gte: firstDayLastMonth,
          $lt: firstDayCurrentMonth,
        },
      });

      const calcPercentage = (current, previous) => {
        if (previous === 0) return { direction: "up", percentageValue: 100 };
        const diff = ((current - previous) / previous) * 100;
        return {
          direction: diff >= 0 ? "up" : "down",
          percentageValue: Math.abs(parseFloat(diff.toFixed(1))),
        };
      };

      const lastMonth = new Date(currentYear, currentMonth - 1, 1);

      res.send({
        currentMonthStatsData: {
          totalSells: parseFloat(totalSells.toFixed(2)),
          totalOrders,
          averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
        },
        lastMonthStatsData: {
          lastMonth: lastMonth.toLocaleString("en-US", { month: "long" }),
          year: lastMonth.getFullYear(),
        },
        customerStatsData: {
          newCustomers,
        },
        lastMonthComparisonPercentage: {
          totalSellsPercentage: calcPercentage(totalSells, lastMonthTotalSells),
          totalOrdersPercentage: calcPercentage(
            totalOrders,
            lastMonthTotalOrders
          ),
          averageOrderValuePercentage: calcPercentage(
            averageOrderValue,
            lastMonthAvgOrderValue
          ),
          customersPercentage: calcPercentage(
            newCustomers,
            lastMonthNewCustomers
          ),
        },
      });
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).send({ error: true, message: "Failed to fetch stats" });
    }
  });

  // GET /admin-dashboard/top-selling-categories — Top selling categories
  app.get(
    "/admin-dashboard/top-selling-categories",
    verifyJWT,
    async (req, res) => {
      try {
        const totalCategories = await categoriesCollection.countDocuments();

        const pipeline = [
          { $unwind: "$orderDetails" },
          {
            $group: {
              _id: "$orderDetails.category",
              totalSold: { $sum: "$orderDetails.quantity" },
            },
          },
          { $sort: { totalSold: -1 } },
          { $limit: 6 },
        ];

        const categoryStats = await ordersCollection
          .aggregate(pipeline)
          .toArray();

        const topCategories = categoryStats.map((cat) => ({
          subject: cat._id || "Other",
          A: cat.totalSold,
          B: Math.floor(cat.totalSold * 0.8),
          fullMark: 150,
        }));

        res.send({ totalCategories, topCategories });
      } catch (error) {
        console.error("Top categories error:", error);
        res.send({ totalCategories: 0, topCategories: [] });
      }
    }
  );

  // GET /admin-dashboard/income-stats — Monthly income stats
  app.get("/admin-dashboard/income-stats", verifyJWT, async (req, res) => {
    try {
      const pipeline = [
        {
          $group: {
            _id: {
              month: { $month: "$date" },
              year: { $year: "$date" },
            },
            Income: { $sum: { $toDouble: "$total" } },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
      ];

      const monthlyStats = await ordersCollection
        .aggregate(pipeline)
        .toArray();

      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      const result = monthlyStats.map((stat) => ({
        name: monthNames[stat._id.month - 1],
        Income: parseFloat(stat.Income.toFixed(2)),
        Expense: parseFloat((stat.Income * 0.3).toFixed(2)),
      }));

      res.send(result);
    } catch (error) {
      console.error("Income stats error:", error);
      res.send([]);
    }
  });

  // GET /admin-dashboard/popular-products — Best selling products
  app.get("/admin-dashboard/popular-products", verifyJWT, async (req, res) => {
    try {
      const pipeline = [
        { $unwind: "$orderDetails" },
        {
          $group: {
            _id: "$orderDetails.productId",
            name: { $first: "$orderDetails.name" },
            category: { $first: "$orderDetails.category" },
            price: { $first: "$orderDetails.price" },
            img: { $first: "$orderDetails.img" },
            sold: { $sum: "$orderDetails.quantity" },
          },
        },
        { $sort: { sold: -1 } },
        { $limit: 5 },
      ];

      const result = await ordersCollection.aggregate(pipeline).toArray();
      res.send(result);
    } catch (error) {
      console.error("Popular products error:", error);
      res.send([]);
    }
  });

  // GET /admin-dashboard/recent-reviews — Recent reviews
  app.get("/admin-dashboard/recent-reviews", verifyJWT, async (req, res) => {
    try {
      const result = await reviewsCollection
        .find()
        .sort({ addedAt: -1 })
        .limit(5)
        .toArray();
      res.send(result);
    } catch (error) {
      console.error("Recent reviews error:", error);
      res.send([]);
    }
  });
};

export default adminRoutes;
