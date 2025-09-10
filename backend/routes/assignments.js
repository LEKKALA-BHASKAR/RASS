import express from 'express';
import Assignment from '../models/Assignment.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get assignments for a course
router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create assignment (Instructor/Admin only)
router.post('/', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit assignment
router.post('/:id/submit', authenticate, async (req, res) => {
  try {
    const { content, fileUrl } = req.body;
    
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      // Update existing submission
      existingSubmission.content = content;
      existingSubmission.fileUrl = fileUrl;
      existingSubmission.submittedAt = new Date();
    } else {
      // Create new submission
      assignment.submissions.push({
        student: req.user._id,
        content,
        fileUrl
      });
    }

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Grade assignment (Instructor/Admin only)
router.post('/:id/grade', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { studentId, grade, feedback } = req.body;
    
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.find(
      sub => sub.student.toString() === studentId
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.gradedAt = new Date();
    submission.gradedBy = req.user._id;

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;