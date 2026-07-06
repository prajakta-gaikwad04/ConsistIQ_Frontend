import API from "../api";

export const getDashboardData = async () => {
    return await API.get("/tasks/dashboard");
};