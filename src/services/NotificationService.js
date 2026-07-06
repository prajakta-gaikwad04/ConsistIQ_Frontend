import API from "../api";

export const getNotifications = () => {
    return API.get("/notifications");
};

export const getUnreadCount = () => {
    return API.get("/notifications/unread-count");
};

export const markAsRead = (id) => {
    return API.put(`/notifications/read/${id}`);
};