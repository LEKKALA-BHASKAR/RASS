import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  videoUrl: String,
  duration: Number, // in minutes
  order: {
    type: Number,
    required: true,
  },
  resources: [
    {
      title: String,
      url: String,
      type: {
        type: String,
        enum: ["pdf", "doc", "link", "other"],
      },
    },
  ],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    thumbnail: String,
    modules: [moduleSchema],
    totalDuration: Number, // calculated field
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    status: {
      // <-- Admin approval status
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    tags: [String],
    requirements: [String],
    learningOutcomes: [String],
  },
  {
    timestamps: true,
  }
);

courseSchema.pre("save", function () {
  this.totalDuration = this.modules.reduce(
    (total, module) => total + (module.duration || 0),
    0
  );
});

export default mongoose.model("Course", courseSchema);
