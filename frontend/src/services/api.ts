import axios from "axios";

// Use a simpler approach for environment variable
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "https://rass-cq8t.onrender.com/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }, 
});

// Add request interceptor for logging
apiClient.interceptors.request.use((config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.baseURL, config.url, config.data);
  return config;
});

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.message);
    return Promise.reject(error);
  }
);

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
// In your api.ts file, update the courseAPI section:

/* ---------------- COURSES & MODULES ---------------- */
export const courseAPI = {
  getAllCourses: (searchTerm?: string) => 
    apiClient.get("/courses", { params: { search: searchTerm } }),
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
  getCourseEnrollments: (courseId: string) =>
    apiClient.get(`/enrollments/course/${courseId}`),
};

// ✅ New Enrollment Form API
export const enrollmentFormAPI = {
  submitForm: (data: any) => apiClient.post("/enrollment-forms", data),
  getMyForms: () => apiClient.get("/enrollment-forms/my-forms"),
  getCourseForms: (courseId: string) => apiClient.get(`/enrollment-forms/course/${courseId}`),
  updatePaymentStatus: (id: string, paymentStatus: string) => 
    apiClient.put(`/enrollment-forms/${id}/payment-status`, { paymentStatus }),
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

/* ---------------- FORUM (Discussions) ---------------- */
export const forumAPI = {
  getCourseForums: (courseId: string, category?: string) =>
    apiClient.get(`/forums/course/${courseId}`, { params: { category } }),
  getForumById: (id: string) => apiClient.get(`/forums/${id}`),
  createPost: (data: any) => apiClient.post("/forums", data),
  addReply: (postId: string, content: string) =>
    apiClient.post(`/forums/${postId}/reply`, { content }),
  likePost: (postId: string) => apiClient.post(`/forums/${postId}/like`),
  likeReply: (forumId: string, replyId: string) =>
    apiClient.post(`/forums/${forumId}/reply/${replyId}/like`),
  pinPost: (postId: string) => apiClient.post(`/forums/${postId}/pin`),
  lockPost: (postId: string) => apiClient.post(`/forums/${postId}/lock`),
};

/* ---------------- NOTIFICATIONS ---------------- */
export const notificationAPI = {
  getNotifications: () => apiClient.get("/notifications"),
  markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put("/notifications/read-all"),
  getUnreadCount: () => apiClient.get("/notifications/unread-count"),
};

/* ---------------- USERS ---------------- */
export const userAPI = {
  createUser: async (userData: any) => {
    try {
      const response = await apiClient.post("/users", userData);
      return response.data;
    } catch (error: any) {
      if (error.response) throw error;
      else if (error.request) throw new Error("Network error. Please check your connection.");
      else throw new Error("An unexpected error occurred.");
    }
  },

  getAllUsers: (params?: any) => {
    // Support for enrollment filtering
    if (params?.enrollment) {
      // Convert enrollment filter to backend format
      if (params.enrollment === 'enrolled') {
        params.hasEnrollments = true;
      } else if (params.enrollment === 'unenrolled') {
        params.hasEnrollments = false;
      }
      delete params.enrollment;
    }
    return apiClient.get("/users", { params });
  },

  updateUserStatus: (id: string, isActive: boolean) =>
    apiClient.put(`/users/${id}/status`, { isActive }),

  // New API methods for enrollment features
  
  // Get students with enrollment status
  getStudentsByEnrollment: async (status: 'enrolled' | 'unenrolled' | 'all', params?: any) => {
    try {
      const requestParams: any = { ...params };
      if (status !== 'all') {
        requestParams.hasEnrollments = status === 'enrolled';
      }
      requestParams.role = 'student'; // Only get students
      
      const response = await apiClient.get("/users", { params: requestParams });
      return response.data;
    } catch (error: any) {
      if (error.response) throw error;
      else if (error.request) throw new Error("Network error. Please check your connection.");
      else throw new Error("Failed to fetch students.");
    }
  },

  // Get student's enrolled courses
  getStudentCourses: async (studentId: string) => {
    try {
      const response = await apiClient.get(`/users/${studentId}/courses`);
      return response.data;
    } catch (error: any) {
      if (error.response) throw error;
      else if (error.request) throw new Error("Network error. Please check your connection.");
      else throw new Error("Failed to fetch student courses.");
    }
  },

  // Enroll student in a course
  enrollStudent: async (studentId: string, courseId: string) => {
    try {
      const response = await apiClient.post(`/users/${studentId}/enroll`, { courseId });
      return response.data;
    } catch (error: any) {
      if (error.response) throw error;
      else if (error.request) throw new Error("Network error. Please check your connection.");
      else throw new Error("Failed to enroll student.");
    }
  },

  // Unenroll student from a course
  unenrollStudent: async (studentId: string, courseId: string) => {
    try {
      const response = await apiClient.delete(`/users/${studentId}/courses/${courseId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) throw error;
      else if (error.request) throw new Error("Network error. Please check your connection.");
      else throw new Error("Failed to unenroll student.");
    }
  },

  // Get enrollment statistics
  getEnrollmentStats: async () => {
    try {
      const response = await apiClient.get("/users/stats/enrollment");
      return response.data;
    } catch (error: any) {
      if (error.response) throw error;
      else if (error.request) throw new Error("Network error. Please check your connection.");
      else throw new Error("Failed to fetch enrollment statistics.");
    }
  },

  // Update user profile
  updateUser: async (id: string, userData: any) => {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error: any) {
      if (error.response) throw error;
      else if (error.request) throw new Error("Network error. Please check your connection.");
      else throw new Error("Failed to update user.");
    }
  },

  // Delete user
  deleteUser: async (id: string) => {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) throw error;
      else if (error.request) throw new Error("Network error. Please check your connection.");
      else throw new Error("Failed to delete user.");
    }
  },

  // Get user by ID
  getUserById: async (id: string) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) throw error;
      else if (error.request) throw new Error("Network error. Please check your connection.");
      else throw new Error("Failed to fetch user details.");
    }
  },

  // Bulk operations
  bulkUpdateUsers: async (userIds: string[], updates: any) => {
    try {
      const response = await apiClient.put("/users/bulk", { userIds, updates });
      return response.data;
    } catch (error: any) {
      if (error.response) throw error;
      else if (error.request) throw new Error("Network error. Please check your connection.");
      else throw new Error("Failed to update users.");
    }
  },

  // Export users data
  exportUsers: async (params?: any) => {
    try {
      const response = await apiClient.get("/users/export", { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      if (error.response) throw error;
      else if (error.request) throw new Error("Network error. Please check your connection.");
      else throw new Error("Failed to export users.");
    }
  }
};

/* ---------------- LIVE SESSIONS ---------------- */// ✅ make sure this import exists at top

export const liveSessionAPI = {
  getCourseSessions: (courseId: string) =>
    apiClient.get(`/live-sessions/course/${courseId}`),

  getMySessions: () => apiClient.get("/live-sessions/my"),

  createSession: (courseId: string, data: any) =>
    apiClient.post(`/live-sessions/course/${courseId}`, data),

  updateSession: (id: string, data: any) =>
    apiClient.put(`/live-sessions/${id}`, data),

  deleteSession: (id: string) =>
    apiClient.delete(`/live-sessions/${id}`),

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
  // 📌 Student’s own tickets
  getMyTickets: () => apiClient.get("/support-tickets/my-tickets"),
  createTicket: (data: any) => apiClient.post("/support-tickets", data),

  // 📌 Instructor – only tickets from courses they teach
  getInstructorTickets: () => apiClient.get("/support-tickets/instructor"),

  // 📌 Admin – all tickets across all users & courses
  getAllTickets: () => apiClient.get("/support-tickets/admin"),

  // 📌 Common actions
  addMessage: (ticketId: string, message: string) =>
    apiClient.post(`/support-tickets/${ticketId}/message`, { message }),
  updateTicketStatus: (ticketId: string, status: string, assignedTo?: string) =>
    apiClient.put(`/support-tickets/${ticketId}/status`, { status, assignedTo }),
};

/* ---------------- CHAT ---------------- */
export const chatAPI = {
  // 📌 Student → Instructor + Admins
  sendMessageToCourse: (courseId: string, content: string) =>
    apiClient.post(`/chats/${courseId}`, { content }),

  // 📌 Instructor/Admin → Student
  sendMessageToStudent: (courseId: string, studentId: string, content: string) =>
    apiClient.post(`/chats/${courseId}/${studentId}`, { content }),

  // 📌 Get chats for Student
  getStudentChats: () => apiClient.get("/chats/student"),

  // 📌 Get chats for Mentor/Instructor/Admin
  getMentorChats: () => apiClient.get("/chats/mentor"),

  // 📌 Get a single chat by ID (for refreshing after sending a message)
  getChatById: (chatId: string) => apiClient.get(`/chats/${chatId}`),
};

/* ---------------- MEDIA PRESENCE ---------------- */
export const mediaPresenceAPI = {
  // Public endpoint - no authentication required
  getActiveMediaItems: () => apiClient.get("/media-presence"),
  
  // Admin endpoints - authentication required
  getAllMediaItems: () => apiClient.get("/media-presence/all"),
  createMediaItem: (data: any) => apiClient.post("/media-presence", data),
  updateMediaItem: (id: string, data: any) => apiClient.put(`/media-presence/${id}`, data),
  deleteMediaItem: (id: string) => apiClient.delete(`/media-presence/${id}`),
};

export default apiClient;