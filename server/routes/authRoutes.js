import jwt from "jsonwebtoken";

const authRoutes = (app, collections) => {
  // POST /jwt — Generate JWT token for authenticated user
  app.post("/jwt", (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ error: true, message: "Email is required" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.send({ token });
  });
};

export default authRoutes;
