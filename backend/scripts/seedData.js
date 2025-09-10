import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Assignment from '../models/Assignment.js';
import Forum from '../models/Forum.js';
import Notification from '../models/Notification.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Assignment.deleteMany({});
    await Forum.deleteMany({});
    await Notification.deleteMany({});

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@rassacademy.com',
      password: hashedPassword,
      role: 'admin',
      profile: {
        bio: 'Platform Administrator',
        phone: '+91-9876543210'
      },
      emailVerified: true
    });

    // Instructors
    const instructors = await User.create([
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh@rassacademy.com',
        password: hashedPassword,
        role: 'instructor',
        profile: {
          bio: 'Full Stack Developer with 10+ years experience',
          phone: '+91-9876543211',
          education: 'PhD in Computer Science',
          experience: '10+ years in web development and teaching'
        },
        emailVerified: true
      },
      {
        name: 'Priya Sharma',
        email: 'priya@rassacademy.com',
        password: hashedPassword,
        role: 'instructor',
        profile: {
          bio: 'Data Science Expert and AI Researcher',
          phone: '+91-9876543212',
          education: 'MS in Data Science',
          experience: '8 years in data science and machine learning'
        },
        emailVerified: true
      },
      {
        name: 'Arjun Patel',
        email: 'arjun@rassacademy.com',
        password: hashedPassword,
        role: 'instructor',
        profile: {
          bio: 'Mobile App Development Specialist',
          phone: '+91-9876543213',
          education: 'BE in Computer Engineering',
          experience: '6 years in mobile app development'
        },
        emailVerified: true
      }
    ]);

    // Students
    const students = await User.create([
      {
        name: 'Amit Singh',
        email: 'amit@student.com',
        password: hashedPassword,
        role: 'student',
        profile: {
          bio: 'Aspiring web developer',
          phone: '+91-9876543214',
          education: 'BCA Graduate'
        },
        emailVerified: true
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@student.com',
        password: hashedPassword,
        role: 'student',
        profile: {
          bio: 'Data science enthusiast',
          phone: '+91-9876543215',
          education: 'BTech in IT'
        },
        emailVerified: true
      },
      {
        name: 'Rohit Gupta',
        email: 'rohit@student.com',
        password: hashedPassword,
        role: 'student',
        profile: {
          bio: 'Mobile app developer',
          phone: '+91-9876543216',
          education: 'MCA'
        },
        emailVerified: true
      },
      {
        name: 'Kavya Nair',
        email: 'kavya@student.com',
        password: hashedPassword,
        role: 'student',
        profile: {
          bio: 'UI/UX Designer transitioning to development',
          phone: '+91-9876543217',
          education: 'Design Graduate'
        },
        emailVerified: true
      },
      {
        name: 'Vikram Joshi',
        email: 'vikram@student.com',
        password: hashedPassword,
        role: 'student',
        profile: {
          bio: 'DevOps engineer',
          phone: '+91-9876543218',
          education: 'BTech in CSE'
        },
        emailVerified: true
      }
    ]);

    // Create Courses
    const courses = await Course.create([
      {
        title: 'Complete React.js Development',
        description: 'Master React.js from basics to advanced concepts including hooks, context, and modern patterns.',
        instructor: instructors[0]._id,
        category: 'Web Development',
        level: 'intermediate',
        price: 4999,
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
        modules: [
          {
            title: 'Introduction to React',
            description: 'Understanding React fundamentals and JSX',
            videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            duration: 45,
            order: 1,
            resources: [
              { title: 'React Documentation', url: 'https://react.dev', type: 'link' },
              { title: 'Setup Guide', url: 'https://example.com/setup.pdf', type: 'pdf' }
            ]
          },
          {
            title: 'Components and Props',
            description: 'Building reusable components with props',
            videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
            duration: 60,
            order: 2,
            resources: []
          },
          {
            title: 'State and Hooks',
            description: 'Managing state with useState and useEffect',
            videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
            duration: 75,
            order: 3,
            resources: []
          }
        ],
        isPublished: true,
        tags: ['react', 'javascript', 'frontend'],
        requirements: ['Basic JavaScript knowledge', 'HTML/CSS fundamentals'],
        learningOutcomes: ['Build modern React applications', 'Understand component lifecycle', 'Master React hooks']
      },
      {
        title: 'Data Science with Python',
        description: 'Complete data science course covering pandas, numpy, matplotlib, and machine learning basics.',
        instructor: instructors[1]._id,
        category: 'Data Science',
        level: 'beginner',
        price: 5999,
        thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
        modules: [
          {
            title: 'Python Fundamentals',
            description: 'Python basics for data science',
            duration: 90,
            order: 1,
            resources: []
          },
          {
            title: 'Data Analysis with Pandas',
            description: 'Working with dataframes and data manipulation',
            duration: 120,
            order: 2,
            resources: []
          }
        ],
        isPublished: true,
        tags: ['python', 'data-science', 'pandas'],
        requirements: ['Basic programming knowledge'],
        learningOutcomes: ['Analyze data with Python', 'Create visualizations', 'Build ML models']
      },
      {
        title: 'React Native Mobile Development',
        description: 'Build cross-platform mobile apps with React Native and Expo.',
        instructor: instructors[2]._id,
        category: 'Mobile Development',
        level: 'intermediate',
        price: 6999,
        thumbnail: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=800',
        modules: [
          {
            title: 'React Native Setup',
            description: 'Setting up development environment',
            duration: 30,
            order: 1,
            resources: []
          },
          {
            title: 'Navigation and Routing',
            description: 'Implementing navigation in mobile apps',
            duration: 45,
            order: 2,
            resources: []
          }
        ],
        isPublished: true,
        tags: ['react-native', 'mobile', 'expo'],
        requirements: ['React.js knowledge', 'JavaScript proficiency'],
        learningOutcomes: ['Build mobile apps', 'Publish to app stores', 'Handle device features']
      },
      {
        title: 'DevOps and Cloud Computing',
        description: 'Learn Docker, Kubernetes, AWS, and CI/CD pipelines for modern deployment.',
        instructor: instructors[0]._id,
        category: 'DevOps',
        level: 'advanced',
        price: 7999,
        thumbnail: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800',
        modules: [
          {
            title: 'Docker Fundamentals',
            description: 'Containerization with Docker',
            duration: 60,
            order: 1,
            resources: []
          }
        ],
        isPublished: true,
        tags: ['docker', 'kubernetes', 'aws'],
        requirements: ['Linux basics', 'Command line experience'],
        learningOutcomes: ['Deploy applications', 'Manage containers', 'Setup CI/CD']
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to machine learning algorithms and practical implementation.',
        instructor: instructors[1]._id,
        category: 'AI/ML',
        level: 'intermediate',
        price: 8999,
        thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
        modules: [
          {
            title: 'ML Introduction',
            description: 'Understanding machine learning concepts',
            duration: 75,
            order: 1,
            resources: []
          }
        ],
        isPublished: true,
        tags: ['machine-learning', 'python', 'ai'],
        requirements: ['Python knowledge', 'Statistics basics'],
        learningOutcomes: ['Build ML models', 'Understand algorithms', 'Deploy models']
      }
    ]);

    // Update course enrollment counts and instructor references
    for (let course of courses) {
      course.enrollmentCount = Math.floor(Math.random() * 100) + 20;
      course.rating.average = (Math.random() * 2 + 3).toFixed(1);
      course.rating.count = Math.floor(Math.random() * 50) + 10;
      await course.save();
    }

    // Create Enrollments
    const enrollments = [];
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const coursesToEnroll = courses.slice(0, Math.floor(Math.random() * 3) + 1);
      
      for (let course of coursesToEnroll) {
        const enrollment = await Enrollment.create({
          student: student._id,
          course: course._id,
          progress: course.modules.map(module => ({
            moduleId: module._id,
            completed: Math.random() > 0.5,
            watchTime: Math.floor(Math.random() * module.duration * 60)
          })),
          paymentStatus: 'completed'
        });
        enrollments.push(enrollment);
        
        // Add to student's enrolled courses
        student.enrolledCourses.push(course._id);
        await student.save();
      }
    }

    // Create Assignments
    for (let course of courses) {
      await Assignment.create({
        title: `${course.title} - Project Assignment`,
        description: `Complete a project demonstrating the concepts learned in ${course.title}`,
        course: course._id,
        module: course.modules[0]._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxPoints: 100,
        instructions: 'Submit your project with proper documentation and code comments.',
        submissions: enrollments
          .filter(e => e.course.toString() === course._id.toString())
          .slice(0, 2)
          .map(enrollment => ({
            student: enrollment.student,
            content: 'Project submitted with all requirements completed.',
            grade: Math.floor(Math.random() * 30) + 70,
            feedback: 'Good work! Keep improving your coding skills.'
          }))
      });
    }

    // Create Forum Posts
    for (let course of courses) {
      await Forum.create([
        {
          title: `Welcome to ${course.title}!`,
          content: 'Welcome everyone! Feel free to ask questions and share your progress.',
          author: course.instructor,
          course: course._id,
          category: 'announcement',
          isPinned: true,
          replies: [
            {
              author: students[0]._id,
              content: 'Thank you! Excited to start learning.',
              createdAt: new Date()
            }
          ]
        },
        {
          title: 'Assignment Help Discussion',
          content: 'Having trouble with the assignment? Let\'s discuss here.',
          author: students[1]._id,
          course: course._id,
          category: 'assignment',
          replies: [
            {
              author: course.instructor,
              content: 'I\'m here to help! What specific part are you struggling with?',
              createdAt: new Date()
            }
          ]
        }
      ]);
    }

    // Create Notifications
    for (let student of students) {
      await Notification.create([
        {
          recipient: student._id,
          title: 'Welcome to RASS Academy!',
          message: 'Your account has been created successfully. Start exploring courses!',
          type: 'system'
        },
        {
          recipient: student._id,
          title: 'New Assignment Available',
          message: 'A new assignment has been posted in your enrolled course.',
          type: 'assignment'
        },
        {
          recipient: student._id,
          title: 'Course Progress Update',
          message: 'Great job! You\'ve completed 50% of your current course.',
          type: 'course'
        }
      ]);
    }

    console.log('Mock data seeded successfully!');
    console.log('Login credentials:');
    console.log('Admin: admin@rassacademy.com / password123');
    console.log('Instructor: rajesh@rassacademy.com / password123');
    console.log('Student: amit@student.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();