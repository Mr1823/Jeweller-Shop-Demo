import Razorpay from "razorpay";

const paymentRoutes = (app) => {
  // POST /create-razorpay-order — Create Razorpay order
  app.post("/create-razorpay-order", async (req, res) => {
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      return res.status(500).send({
        error: true,
        message: "Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
      });
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    const { orderPrice } = req.body;
    const amount = Math.round(parseFloat(orderPrice) * 100); // Amount in paise (1 INR = 100 paise)

    if (amount < 1) {
      return res.status(400).send({ error: true, message: "Invalid amount" });
    }

    try {
      const options = {
        amount,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.send(order);
    } catch (error) {
      console.error("Razorpay order creation error:", error);
      res.status(500).send({ error: true, message: error.message });
    }
  });
};

export default paymentRoutes;
