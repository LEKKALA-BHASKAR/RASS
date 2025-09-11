import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Enroll in course
router.post('/', authenticate, async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create enrollment with progress tracking
    const enrollment = new Enrollment({
      student: req.user._id,
      course: courseId,
      progress: course.modules.map(module => ({
        moduleId: module._id,
        completed: false,
        watchTime: 0
      }))
    });

    await enrollment.save();

    // Update course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    // Add to user's enrolled courses
    req.user.enrolledCourses.push(courseId);
    await req.user.save();

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's enrollments
router.get('/my-courses', authenticate, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title description thumbnail instructor totalDuration')
      .populate('course.instructor', 'name')
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update module progress
router.post('/progress', authenticate, async (req, res) => {
  try {
    const { courseId, moduleId, watchTime, completed } = req.body;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const progressIndex = enrollment.progress.findIndex(
      p => p.moduleId.toString() === moduleId
    );

    if (progressIndex === -1) {
      return res.status(404).json({ message: 'Module not found' });
    }

    enrollment.progress[progressIndex].watchTime = watchTime || 0;
    enrollment.progress[progressIndex].completed = completed || false;
    
    if (completed) {
      enrollment.progress[progressIndex].completedAt = new Date();
    }

    // Check if course is completed
    const allCompleted = enrollment.progress.every(p => p.completed);
    if (allCompleted && !enrollment.completed) {
      enrollment.completed = true;
      enrollment.completedAt = new Date();
    }

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;