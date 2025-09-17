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

/* ---------------- AUTH ---------------- */
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }),
  register: (name: string, email: string, password: string, role: string) =>
    apiClient.post("/auth/register", { name, email, password, role }),
  getCurrentUser: () => apiClient.get("/auth/me"),
  updateProfile: (data: any) => apiClient.put("/users/profile", data),
};

/* ---------------- COURSES & MODULES ---------------- */
export const courseAPI = {
  getAllCourses: () => apiClient.get("/courses"),
  getCourse: (id: string) => apiClient.get(`/courses/${id}`),
  createCourse: (data: any) => apiClient.post("/courses", data),
  updateCourse: (id: string, data: any) => apiClient.put(`/courses/${id}`, data),
  deleteCourse: (id: string) => apiClient.delete(`/courses/${id}`),
  getInstructorCourses: () => apiClient.get("/courses/instructor/my-courses"),

  // --- Module Management ---
  createModule: (courseId: string, data: any) =>
    apiClient.post(`/courses/${courseId}/modules`, data),
  updateModule: (courseId: string, moduleId: string, data: any) =>
    apiClient.put(`/courses/${courseId}/modules/${moduleId}`, data),
  deleteModule: (courseId: string, moduleId: string) =>
    apiClient.delete(`/courses/${courseId}/modules/${moduleId}`),
};

/* ---------------- ENROLLMENTS ---------------- */
export const enrollmentAPI = {
  enrollInCourse: (courseId: string) =>
    apiClient.post("/enrollments", { courseId }),
  getMyEnrollments: () => apiClient.get("/enrollments/my-courses"),
  updateProgress: (data: any) => apiClient.post("/enrollments/progress", data),
};

/* ---------------- ASSIGNMENTS ---------------- */
export const assignmentAPI = {
  getCourseAssignments: (courseId: string) =>
    apiClient.get(`/assignments/course/${courseId}`),
  createAssignment: (data: any) => apiClient.post("/assignments", data),
  updateAssignment: (id: string, data: any) =>
    apiClient.put(`/assignments/${id}`, data),
  deleteAssignment: (id: string) => apiClient.delete(`/assignments/${id}`),
  submitAssignment: (id: string, data: any) =>
    apiClient.post(`/assignments/${id}/submit`, data),
  gradeAssignment: (id: string, data: any) =>
    apiClient.post(`/assignments/${id}/grade`, data),
};

/* ---------------- FORUM ---------------- */
export const forumAPI = {
  getCourseForums: (courseId: string, category?: string) =>
    apiClient.get(`/forums/course/${courseId}`, { params: { category } }),
  createPost: (data: any) => apiClient.post("/forums", data),
  addReply: (postId: string, content: string) =>
    apiClient.post(`/forums/${postId}/reply`, { content }),
  likePost: (postId: string) => apiClient.post(`/forums/${postId}/like`),
};

/* ---------------- NOTIFICATIONS ---------------- */
export const notificationAPI = {
  getNotifications: () => apiClient.get("/notifications"),
  markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put("/notifications/read-all"),
  getUnreadCount: () => apiClient.get("/notifications/unread-count"),
};


//export const userAPI = {
//  getAllUsers: (params?: any) => 
//    apiClient.get('/users', { params }),
//  updateUserStatus: (id: string, isActive: boolean) => 
//    apiClient.put(`/users/${id}/status`, { isActive }),
//  
//};

export const userAPI = {
  createUser: async (userData: any) => {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // The server responded with an error status
        throw error;
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('Network error. Please check your connection.');
      } else {
        // Something happened in setting up the request
        throw new Error('An unexpected error occurred.');
      }
    }
  },
  getAllUsers: (params?: any) => 
    apiClient.get('/users', { params }),
  updateUserStatus: (id: string, isActive: boolean) => 
    apiClient.put(`/users/${id}/status`, { isActive }),
  
  // Other user API methods...
  // For example:
};

/* ---------------- LIVE SESSIONS ---------------- */
export const liveSessionAPI = {
  getCourseSessions: (courseId: string) =>
    apiClient.get(`/live-sessions/course/${courseId}`),
  getMySessions: () => apiClient.get("/live-sessions/my"),
  createSession: (data: any) => apiClient.post("/live-sessions", data),
  updateSession: (id: string, data: any) =>
    apiClient.put(`/live-sessions/${id}`, data),
  deleteSession: (id: string) => apiClient.delete(`/live-sessions/${id}`),
  joinSession: (sessionId: string) =>
    apiClient.post(`/live-sessions/${sessionId}/join`),
  updateSessionStatus: (sessionId: string, status: string) =>
    apiClient.put(`/live-sessions/${sessionId}/status`, { status }),
};

/* ---------------- CERTIFICATES ---------------- */
export const certificateAPI = {
  getMyCertificates: () => apiClient.get("/certificates/my-certificates"),
  generateCertificate: (courseId: string) =>
    apiClient.post("/certificates/generate", { courseId }),
  verifyCertificate: (certificateId: string) =>
    apiClient.get(`/certificates/verify/${certificateId}`),
};

/* ---------------- SUPPORT TICKETS ---------------- */
export const supportTicketAPI = {
  getMyTickets: () => apiClient.get("/support-tickets/my-tickets"),
  getAllTickets: (params?: any) => apiClient.get("/support-tickets", { params }),
  createTicket: (data: any) => apiClient.post("/support-tickets", data),
  addMessage: (ticketId: string, message: string) =>
    apiClient.post(`/support-tickets/${ticketId}/message`, { message }),
  updateTicketStatus: (ticketId: string, status: string, assignedTo?: string) =>
    apiClient.put(`/support-tickets/${ticketId}/status`, { status, assignedTo }),
};

/* ---------------- CHAT ---------------- */
export const chatAPI = {
  sendMessageToCourse: (courseId: string, content: string) =>
    apiClient.post(`/chats/${courseId}`, { content }),
  sendMessageToStudent: (courseId: string, studentId: string, content: string) =>
    apiClient.post(`/chats/${courseId}/${studentId}`, { content }),
  getStudentChats: () => apiClient.get("/chats/student"),
  getMentorChats: () => apiClient.get("/chats/mentor"),
  getChatById: (chatId: string) => apiClient.get(`/chats/${chatId}`),
};

export default apiClient;
