import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import InstructorDashboard from './pages/instructor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import CourseCatalog from './pages/courses/CourseCatalog';
import CourseDetail from './pages/courses/CourseDetail';
import CoursePlayer from './pages/courses/CoursePlayer';
import Profile from './pages/Profile';
import LiveSessions from './pages/student/LiveSessions';
import Assignments from './pages/student/Assignments';
import Certificates from './pages/student/Certificates';
import Support from './pages/student/Support';
import CourseManagement from './pages/instructor/CourseManagement';
import Students from './pages/instructor/Students';
import UserManagement from './pages/admin/UserManagement';
import SupportManagement from './pages/admin/SupportManagement';
import SupportTicketsPage from './pages/student/SupportTicketsPage';
import { NotificationProvider } from "./context/NotificationContext";
import DiscussionForum from './pages/student/DiscussionForum';
import Notifications from './pages/student/Notifications';
import Chat from './pages/student/Chat';
import AddUserPage from './pages/admin/AddUserPage';
import AddCoursePage from "./pages/admin/AddCoursePage";
import InstructorDiscussions from './pages/instructor/InstructorDiscussions';
import InstructorChats from './pages/instructor/InstructorChats';
import InstructorTickets from './pages/instructor/InstructorTickets';
import HelpCenter from './pages/publicpages/Help';
import BlogPage from './pages/publicpages/Blog';
import About from './pages/publicpages/About';
import ContactUs from './pages/publicpages/Contact';
import Companies from './pages/Companies';
import UniversitiesPage from './pages/UniversitiesPage';
import AdminTicketsPage from './pages/admin/AdminTicketsPage';
import MediaPresenceManagement from './pages/admin/MediaPresenceManagement';
import ScrollToTop from "./pages/ScrollToTop";
const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ 
  children, 
  roles 
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'instructor':
        return '/instructor/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/universities" element={<UniversitiesPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogPage/>} />
        <Route path="/about" element={<About />} />
        <Route path="/support-tickets" element={<Support />} />
        <Route path="/contact" element={<ContactUs/>}/>
        <Route path="/faq" element={<HelpCenter/>}/>
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to={getDashboardRoute()} /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to={getDashboardRoute()} /> : <Register />} 
        />

        {/* Profile */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/help-center" element={<HelpCenter/>} />
        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute roles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/learn/:courseId" element={
          <ProtectedRoute roles={['student']}>
            <CoursePlayer />
          </ProtectedRoute>
        } />
        <Route path="/student/certificates" element={
          <ProtectedRoute roles={['student']}>
            <Certificates />
          </ProtectedRoute>
        } />
        <Route path="/student/support" element={
          <ProtectedRoute roles={['student']}>
            <Support />
          </ProtectedRoute>
        } />
        <Route path="/student/live-sessions" element={
          <ProtectedRoute roles={['student']}>
            <LiveSessions />
          </ProtectedRoute>
        } />
        <Route path="/student/assignments" element={
          <ProtectedRoute roles={['student']}>
            <Assignments />
          </ProtectedRoute>
        } />
        <Route path="/student/assignments/:courseId" element={
          <ProtectedRoute roles={['student']}>
            <Assignments />
          </ProtectedRoute>
        } />
        <Route path="/student/discussion-forum" element={
          <ProtectedRoute roles={['student']}>
            <DiscussionForum />
          </ProtectedRoute>
        } />
        <Route path="/student/notifications" element={
          <ProtectedRoute roles={['student']}>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/student/chat" element={
          <ProtectedRoute roles={['student']}>
            <Chat />
          </ProtectedRoute>
        } />

        {/* Instructor Routes */}
        <Route path="/instructor/dashboard" element={
          <ProtectedRoute roles={['instructor', 'admin']}>
            <InstructorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/instructor/courses" element={
          <ProtectedRoute roles={['instructor', 'admin']}>
            <CourseManagement />
          </ProtectedRoute>
        } />
        <Route path="/instructor/students" element={
          <ProtectedRoute roles={['instructor', 'admin']}>
            <Students />
          </ProtectedRoute>
        } />
        <Route path="/instructor/chats" element={<InstructorChats />} />
        <Route path="/instructor/discussions" element={<InstructorDiscussions />} />
        <Route path="/instructor/tickets" element={<InstructorTickets />} />


        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-user" element={
          <ProtectedRoute roles={['admin']}>
            <AddUserPage  />
          </ProtectedRoute>
        } />

        <Route path="/admin/add-course" element={<AddCoursePage />} />

        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/support" element={<AdminTicketsPage />} />
        <Route path="/admin/media-presence" element={<MediaPresenceManagement />} />
    
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <ScrollToTop />
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
