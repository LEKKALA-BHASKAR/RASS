import express from 'express';
import EnrollmentForm from '../models/EnrollmentForm.js';
import Course from '../models/Course.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Submit enrollment form
router.post('/', authenticate, async (req, res) => {
  try {
    const { courseId, fullName, email, mobileNumber, hasPriorExperience, experienceDetails, isStudent } = req.body;

    // Check if form already submitted
    const existingForm = await EnrollmentForm.findOne({
      student: req.user._id,
      course: courseId
    });

    if (existingForm) {
      return res.status(400).json({ message: 'Enrollment form already submitted for this course' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create enrollment form
    const enrollmentForm = new EnrollmentForm({
      student: req.user._id,
      course: courseId,
      fullName,
      email,
      mobileNumber,
      hasPriorExperience,
      experienceDetails: hasPriorExperience === 'yes' ? experienceDetails : '',
      isStudent
    });

    await enrollmentForm.save();

    res.status(201).json(enrollmentForm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's enrollment forms
router.get('/my-forms', authenticate, async (req, res) => {
  try {
    const forms = await EnrollmentForm.find({ student: req.user._id })
      .populate('course', 'title thumbnail instructor price')
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get enrollment forms for a specific course (Instructor/Admin only)
router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if user is instructor of the course or admin
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let forms;
    if (req.user.role === 'admin') {
      // Admin can see all forms
      forms = await EnrollmentForm.find({ course: courseId })
        .populate('student', 'name email')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'instructor' && course.instructor.toString() === req.user._id.toString()) {
      // Instructor can see forms for their own courses
      forms = await EnrollmentForm.find({ course: courseId })
        .populate('student', 'name email')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update enrollment form payment status
router.put('/:id/payment-status', authenticate, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const form = await EnrollmentForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Enrollment form not found' });
    }

    // Check if user is authorized to update
    const course = await Course.findById(form.course);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role !== 'admin' && 
        !(req.user.role === 'instructor' && course.instructor.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    form.paymentStatus = paymentStatus;
    await form.save();

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;