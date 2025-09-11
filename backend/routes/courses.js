import express from "express";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

/* =============================
   Public Routes
   ============================= */

// Get all published courses
router.get("/", async (req, res) => {
  try {
    const { category, level, search, instructor } = req.query;
    let query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (instructor) query.instructor = instructor;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(query)
      .populate("instructor", "name profile.avatar")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email profile"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   Instructor/Admin Routes
   ============================= */

// Create course
router.post(
  "/",
  authenticate,
  authorize("instructor", "admin"),
  async (req, res) => {
    try {
      const courseData = {
        ...req.body,
        instructor: req.user._id,
      };

      const course = new Course(courseData);
      await course.save();

      // Add to instructor's created courses
      req.user.createdCourses.push(course._id);
      await req.user.save();

      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update course
router.put(
  "/:id",
  authenticate,
  authorize("instructor", "admin"),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Ownership check
      if (
        req.user.role !== "admin" &&
        course.instructor.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this course" });
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate("instructor", "name email");

      res.json(updatedCourse);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete course
router.delete(
  "/:id",
  authenticate,
  authorize("instructor", "admin"),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) return res.status(404).json({ message: "Course not found" });

      if (
        req.user.role !== "admin" &&
        course.instructor.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this course" });
      }

      await course.deleteOne();
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Publish/unpublish course
router.patch(
  "/:id/publish",
  authenticate,
  authorize("instructor", "admin"),
  async (req, res) => {
    try {
      const { isPublished } = req.body;
      const course = await Course.findById(req.params.id);

      if (!course) return res.status(404).json({ message: "Course not found" });

      if (
        req.user.role !== "admin" &&
        course.instructor.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to change publish status" });
      }

      course.isPublished = isPublished;
      await course.save();

      res.json({
        message: `Course ${
          isPublished ? "published" : "unpublished"
        } successfully`,
        course,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get instructor's courses
router.get(
  "/instructor/my-courses",
  authenticate,
  authorize("instructor", "admin"),
  async (req, res) => {
    try {
      const courses = await Course.find({ instructor: req.user._id })
        .populate("instructor", "name email")
        .sort({ createdAt: -1 });

      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* =============================
   Module Management
   ============================= */

// Add module
router.post(
  "/:id/modules",
  authenticate,
  authorize("instructor", "admin"),
  async (req, res) => {
    try {
      const { title, description, videoUrl, duration, order, resources } =
        req.body;
      const course = await Course.findById(req.params.id);

      if (!course) return res.status(404).json({ message: "Course not found" });

      if (
        req.user.role !== "admin" &&
        course.instructor.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to add module" });
      }

      course.modules.push({
        title,
        description,
        videoUrl,
        duration,
        order,
        resources,
      });
      await course.save();

      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update module
router.put(
  "/:courseId/modules/:moduleId",
  authenticate,
  authorize("instructor", "admin"),
  async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const course = await Course.findById(courseId);

      if (!course) return res.status(404).json({ message: "Course not found" });

      const module = course.modules.id(moduleId);
      if (!module) return res.status(404).json({ message: "Module not found" });

      if (
        req.user.role !== "admin" &&
        course.instructor.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update module" });
      }

      Object.assign(module, req.body);
      await course.save();

      res.json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete module
router.delete(
  "/:courseId/modules/:moduleId",
  authenticate,
  authorize("instructor", "admin"),
  async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const course = await Course.findById(courseId);

      if (!course) return res.status(404).json({ message: "Course not found" });

      const module = course.modules.id(moduleId);
      if (!module) return res.status(404).json({ message: "Module not found" });

      if (
        req.user.role !== "admin" &&
        course.instructor.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete module" });
      }

      module.deleteOne();
      await course.save();

      res.json({ message: "Module deleted successfully", course });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* =============================
   Instructor Utility
   ============================= */

// View students enrolled in a course
router.get(
  "/:id/students",
  authenticate,
  authorize("instructor", "admin"),
  async (req, res) => {
    try {
      const enrollments = await Enrollment.find({
        course: req.params.id,
      }).populate("student", "name email");
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
