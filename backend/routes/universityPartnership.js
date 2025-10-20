import express from "express";
const router = express.Router();
import UniversityPartnership from "../models/UniversityPartnership.js";

// ✅ POST — Submit a new partnership form
router.post("/", async (req, res) => {
  try {
    const form = new UniversityPartnership(req.body);
    await form.save();
    res.status(201).json({ message: "University partnership form submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET — Fetch all partnership forms
router.get("/", async (req, res) => {
  try {
    const forms = await UniversityPartnership.find().sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE — Remove a specific form
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await UniversityPartnership.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Form not found" });
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
