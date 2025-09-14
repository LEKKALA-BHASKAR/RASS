import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle expired tokens safely
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

// --- APIs ---
export const authAPI = {
  login: (email: string, password: string) => apiClient.post("/auth/login", { email, password }),
  register: (name: string, email: string, password: string, role: string) =>
    apiClient.post("/auth/register", { name, email, password, role }),
  getCurrentUser: () => apiClient.get("/auth/me"),
  updateProfile: (data: any) => apiClient.put("/users/profile", data),
};

export const courseAPI = {
  getAllCourses: (params?: any) => apiClient.get("/courses", { params }),
  getCourse: (id: string) => apiClient.get(`/courses/${id}`),
  createCourse: (data: any) => apiClient.post("/courses", data),
  updateCourse: (id: string, data: any) => apiClient.put(`/courses/${id}`, data),
  getInstructorCourses: () => apiClient.get("/courses/instructor/my-courses"),
};

export const enrollmentAPI = {
  enrollInCourse: (courseId: string) => apiClient.post("/enrollments", { courseId }),
  getMyEnrollments: () => apiClient.get("/enrollments/my-courses"),
  updateProgress: (data: any) => apiClient.post("/enrollments/progress", data),
};

export const assignmentAPI = {
  getCourseAssignments: (courseId: string) =>
    apiClient.get(`/assignments/course/${courseId}`),  // ✅ not assigments
  createAssignment: (data: any) =>
    apiClient.post('/assignments', data),
  submitAssignment: (id: string, data: any) =>
    apiClient.post(`/assignments/${id}/submit`, data).then(res => res.data),
  gradeAssignment: (id: string, data: any) =>
    apiClient.post(`/assignments/${id}/grade`, data),
};



// ✅ Updated Forum API (supports both global forum + course-specific forum)
export const forumAPI = {
  getCourseForums: (courseId: string, category?: string) =>
    apiClient.get(`/forums/course/${courseId}`, { params: { category } }),
  createPost: (data: any) =>
    apiClient.post('/forums', data),
  addReply: (postId: string, content: string) =>
    apiClient.post(`/forums/${postId}/reply`, { content }),
  likePost: (postId: string) =>
    apiClient.post(`/forums/${postId}/like`),
};


export const notificationAPI = {
  getNotifications: () => apiClient.get("/notifications"),
  markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put("/notifications/read-all"),
  getUnreadCount: () => apiClient.get("/notifications/unread-count"), // 🔥 new
};


export const userAPI = {
  getAllUsers: (params?: any) => 
    apiClient.get('/users', { params }),
  updateUserStatus: (id: string, isActive: boolean) => 
    apiClient.put(`/users/${id}/status`, { isActive }),
};

export const liveSessionAPI = {
  getCourseSessions: (courseId: string) =>
    apiClient.get(`/live-sessions/course/${courseId}`),
  getMySessions: () => apiClient.get("/live-sessions/my-sessions"), // ✅ ensure this exists
  createSession: (data: any) =>
    apiClient.post("/live-sessions", data),
  joinSession: (sessionId: string) =>
    apiClient.post(`/live-sessions/${sessionId}/join`),
  updateSessionStatus: (sessionId: string, status: string) =>
    apiClient.put(`/live-sessions/${sessionId}/status`, { status }),
};

export const certificateAPI = {
  getMyCertificates: () => 
    apiClient.get('/certificates/my-certificates'),
  generateCertificate: (courseId: string) => 
    apiClient.post('/certificates/generate', { courseId }),
  verifyCertificate: (certificateId: string) => 
    apiClient.get(`/certificates/verify/${certificateId}`),
};

export const supportTicketAPI = {
  getMyTickets: () => 
    apiClient.get('/support-tickets/my-tickets'),
  getAllTickets: (params?: any) => 
    apiClient.get('/support-tickets', { params }),
  createTicket: (data: any) => 
    apiClient.post('/support-tickets', data),
  addMessage: (ticketId: string, message: string) => 
    apiClient.post(`/support-tickets/${ticketId}/message`, { message }),
  updateTicketStatus: (ticketId: string, status: string, assignedTo?: string) => 
    apiClient.put(`/support-tickets/${ticketId}/status`, { status, assignedTo }),
};

export const chatAPI = {
  // Student sends to course (instructor + admins)
  sendMessageToCourse: (courseId: string, content: string) =>
    apiClient.post(`/chats/${courseId}`, { content }),

  // Mentor/Admin sends to student
  sendMessageToStudent: (courseId: string, studentId: string, content: string) =>
    apiClient.post(`/chats/${courseId}/${studentId}`, { content }),

  // Get student chats
  getStudentChats: () => apiClient.get("/chats/student"),

  // Get mentor/admin chats
  getMentorChats: () => apiClient.get("/chats/mentor"),

  // Get specific chat
  getChatById: (chatId: string) => apiClient.get(`/chats/${chatId}`),
};




export default apiClient;
