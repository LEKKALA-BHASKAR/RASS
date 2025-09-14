import express from 'express';
import Assignment from '../models/Assignment.js';
import { authenticate, authorize } from '../middleware/auth.js';
import Notification from "../models/Notification.js";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

// Get assignments for a course
router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('submissions.student', '_id name email');

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ Create assignment (Instructor/Admin only)
router.post('/', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();

    // 🔔 Notify all students enrolled in this course
    const enrollments = await Enrollment.find({ course: assignment.course });
    for (const e of enrollments) {
      await Notification.create({
        recipient: e.student,
        title: "New Assignment Posted",
        message: `Assignment "${assignment.title}" has been posted in your course.`,
        type: "assignment",
        relatedId: assignment._id
      });
    }

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit assignment
// Submit assignment
router.post('/:id/submit', authenticate, async (req, res) => {
  try {
    const { content, fileUrl } = req.body;

    let assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // 🔎 Check if student already submitted
    const existingSubmission = assignment.submissions.find(
      (sub) => sub.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      existingSubmission.content = content;
      existingSubmission.fileUrl = fileUrl;
      existingSubmission.submittedAt = new Date();
    } else {
      assignment.submissions.push({
        student: req.user._id,
        content,
        fileUrl,
        submittedAt: new Date(),
      });
    }

    await assignment.save();

    // ✅ Populate before sending back
    const updatedAssignment = await Assignment.findById(req.params.id)
      .populate('submissions.student', '_id name email role');

    res.json(updatedAssignment);  // 🔥 Always send populated
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ Grade assignment (Instructor/Admin only)
router.post('/:id/grade', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { studentId, grade, feedback } = req.body;

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const submission = assignment.submissions.find(sub => sub.student.toString() === studentId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.grade = grade;
    submission.feedback = feedback;
    submission.gradedAt = new Date();
    submission.gradedBy = req.user._id;

    await assignment.save();

    // 🔔 Notify student about grading
    await Notification.create({
      recipient: studentId,
      title: "Assignment Graded",
      message: `Your submission for "${assignment.title}" has been graded.`,
      type: "assignment",
      relatedId: assignment._id
    });

    const updatedAssignment = await Assignment.findById(req.params.id)
      .populate('submissions.student', 'name email role')
      .populate('submissions.gradedBy', 'name email role');

    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
