import mongoose from 'mongoose';
import slugify from "slugify";



const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  videoUrl: String,
  duration: Number,
  order: {
    type: Number,
    required: true
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'doc', 'link', 'other']
    }
  }]
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  thumbnail: String,
  modules: [moduleSchema],
  totalDuration: Number,
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  slug: {
  type: String,
  unique: true,
  trim: true
},
  isPublished: {
    type: Boolean,
    default: true
  },
  tags: [String],
  requirements: [String],
  learningOutcomes: [String]
}, {
  timestamps: true
});

courseSchema.pre("save", function(next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  this.totalDuration = this.modules.reduce((total, module) => total + (module.duration || 0), 0);
  next();
});

export default mongoose.model('Course', courseSchema);