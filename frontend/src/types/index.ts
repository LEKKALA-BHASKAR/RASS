export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  profile?: {
    bio?: string;
    phone?: string;
    avatar?: string;
    dateOfBirth?: string;
    education?: string;
    experience?: string;
  };
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
    profile?: {
      avatar?: string;
    };
  };
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  thumbnail?: string;
  modules: Module[];
  totalDuration: number;
  enrollmentCount: number;
  rating: {
    average: number;
    count: number;
  };
  isPublished: boolean;
  tags: string[];
  requirements: string[];
  learningOutcomes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration: number;
  order: number;
  resources: Resource[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'pdf' | 'doc' | 'link' | 'other';
}

export interface Enrollment {
  _id: string;
  student: string;
  course: Course;
  enrolledAt: string;
  progress: ModuleProgress[];
  completed: boolean;
  completedAt?: string;
  certificateIssued: boolean;
  certificateUrl?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  completionPercentage: number;
}

export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  completedAt?: string;
  watchTime: number;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: string;
  module: string;
  dueDate?: string;
  maxPoints: number;
  instructions?: string;
  attachments: {
    filename: string;
    url: string;
  }[];
  submissions: Submission[];
  autoGrade: boolean;
  createdAt: string;
}

export interface Submission {
  _id: string;
  student: User;
  submittedAt: string;
  fileUrl?: string;
  content?: string;
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: User;
}

export interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: User;
  course: string;
  category: 'general' | 'assignment' | 'technical' | 'announcement';
  replies: Reply[];
  likes: string[];
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  _id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface Notification {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  type: 'course' | 'assignment' | 'announcement' | 'payment' | 'system' | 'chat' | 'support' | 'discussion' | 'live-session';
  relatedId?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
}

export interface LiveSession {
  _id: string;
  title: string;
  description?: string;
  course: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
  scheduledAt: string;
  duration: number;
  meetingLink?: string;
  meetingId?: string;
  password?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  attendees: {
    student: string;
    joinedAt?: string;
    leftAt?: string;
  }[];
  recording?: {
    url?: string;
    available: boolean;
  };
  maxAttendees: number;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  _id: string;
  student: string;
  course: {
    _id: string;
    title: string;
    instructor: {
      name: string;
    };
  };
  certificateId: string;
  issuedAt: string;
  certificateUrl?: string;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C';
  completionDate: string;
  verified: boolean;
}

export interface SupportTicket {
  _id: string;
  ticketId: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'course' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  messages: {
    _id: string;
    sender: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
    message: string;
    timestamp: string;
    isStaff: boolean;
  }[];
  attachments: {
    filename: string;
    url: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}