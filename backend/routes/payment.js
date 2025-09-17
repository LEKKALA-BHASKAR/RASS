import express from require("express");
import Razorpay from require("razorpay");
import crypto from   require("crypto");
import Enrollment from require("../models/Enrollment");
import Course from require("../models/Course");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/order", async (req, res) => {
  try {
    const { amount, currency, courseId } = req.body;

    const options = {
      amount: amount * 1, // amount in paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify payment & enroll
// backend/routes/enrollmentRoutes.js
router.post("/create-order/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const options = {
      amount: course.price * 100, // paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order); // ✅ must return JSON
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
