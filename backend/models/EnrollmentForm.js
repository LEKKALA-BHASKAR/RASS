import mongoose from 'mongoose';

const enrollmentFormSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  hasPriorExperience: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  experienceDetails: {
    type: String,
    default: ''
  },
  isStudent: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for better query performance
enrollmentFormSchema.index({ student: 1, course: 1 });
enrollmentFormSchema.index({ course: 1, submittedAt: -1 });

export default mongoose.model('EnrollmentForm', enrollmentFormSchema);