import API from "../api";

export const getAllTasks = (params) => {
  return API.get("/tasks/paged", { params });
};

export const searchTasks = (keyword, params = {}) => {
  return API.get("/tasks/search", {
    params: {
      keyword,
      ...params
    }
  });
};

export const getTasksByStatus = (status) => {
  return API.get(`/tasks/status/${status}`);
};

export const getTasksByPriority = (priority) => {
  return API.get(`/tasks/priority/${priority}`);
};

export const getTasksByCategory = (category) => {
  return API.get(`/tasks/category/${category}`);
};

export const createTask = (taskData) => {
  return API.post("/tasks", taskData);
};

export const completeTask = (id) => {
  return API.patch(`/tasks/${id}/complete`);
};
export const updateTask = (id, taskData) => {
  return API.put(`/tasks/${id}`, taskData);
};
export const deleteTask = (id) => {
  return API.delete(`/tasks/${id}`);
};

export const getTaskById = (id) => {
  return API.get(`/tasks/${id}`);
};

export const getUpcomingTasks = () => {
    return api.get("/tasks/upcoming");
};

export const getOverdueTasks = () => {
    return api.get("/tasks/overdue");
};

export const getCalendarData = () => {
    return api.get("/tasks/calendar");
};

export const getAchievements = () =>
    api.get("/tasks/achievements");

import axios from "axios";

export const cancelTask = (id) => {
  return axios.put(`http://localhost:8080/tasks/${id}/cancel`);
};
export const uploadFile = (taskId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post(`/tasks/${taskId}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};