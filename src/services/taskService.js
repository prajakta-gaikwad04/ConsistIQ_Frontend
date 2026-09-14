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
  return API.get("/tasks/upcoming");
};


export const getOverdueTasks = () => {
  return API.get("/tasks/overdue");
};

export const getCalendarData = () => {
  return API.get("/tasks/calendar");
};

export const getAchievements = () => {
  return API.get("/tasks/achievements");
};


export const cancelTask = (id) => {
  return API.put(`/tasks/${id}/cancel`);
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

export const getAttachments = (taskId) =>
  API.get(`/tasks/${taskId}/attachments`);

export const getAttachment = (taskId, attachmentId) =>
  API.get(`/tasks/${taskId}/attachments/${attachmentId}`, {
    responseType: "blob"
  });

export const deleteAttachment = (taskId, attachmentId) =>
  API.delete(`/tasks/${taskId}/attachments/${attachmentId}`);