// backend/routes/payment.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { authenticate } from "../middleware/auth.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_RJqt4AZALMZEYE",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "LhCRU1mwpEJJRP19te0lv8q0",
});

// ----------------------
// Create Order
// ----------------------
router.post("/order", authenticate, async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const options = {
      amount: course.price * 100, // INR → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ order, course });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Error creating order" });
  }
});

// ----------------------
// Verify Payment
// ----------------------
router.post("/verify", authenticate, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", "LhCRU1mwpEJJRP19te0lv8q0")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // ✅ Check if already enrolled
    let enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });

    if (!enrollment) {
      // Create full enrollment with progress
      enrollment = new Enrollment({
        student: req.user._id,
        course: courseId,
        progress: course.modules.map(module => ({
          moduleId: module._id,
          completed: false,
          watchTime: 0,
        })),
        paymentStatus: "completed",
        paymentId: razorpay_payment_id,
      });

      await enrollment.save();

      // Update course count
      course.enrollmentCount += 1;
      await course.save();

      // Add course to user’s enrolledCourses
      req.user.enrolledCourses.push(courseId);
      await req.user.save();
    }

    res.json({ success: true, message: "Payment verified & student enrolled!", enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying payment" });
  }
});


export default router;
