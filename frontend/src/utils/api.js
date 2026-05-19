import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-inky-six-94.vercel.app/api",
});

// Add token to requests
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("studybuddy_user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("studybuddy_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
  updateProfile: (data) => API.put("/auth/profile", data),
  uploadAvatar: (formData) =>
    API.put("/auth/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// Notes API
export const notesAPI = {
  getAll: (params) => API.get("/notes", { params }),
  getOne: (id) => API.get(`/notes/${id}`),
  upload: (formData) =>
    API.post("/notes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => API.delete(`/notes/${id}`),
};

// Summaries API
export const summariesAPI = {
  getAll: () => API.get("/summaries"),
  getOne: (id) => API.get(`/summaries/${id}`),
  generate: (noteId) => API.post(`/summaries/generate/${noteId}`),
  delete: (id) => API.delete(`/summaries/${id}`),
};

// Quizzes API
export const quizzesAPI = {
  getAll: () => API.get("/quizzes"),
  getOne: (id) => API.get(`/quizzes/${id}`),
  generate: (noteId, data) => API.post(`/quizzes/generate/${noteId}`, data),
  submit: (id, data) => API.post(`/quizzes/${id}/submit`, data),
  delete: (id) => API.delete(`/quizzes/${id}`),
};

// Stats API
export const statsAPI = {
  get: () => API.get("/stats"),
};

export default API;
