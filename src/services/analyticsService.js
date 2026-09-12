import axios from "axios";

const API_URL = "http://localhost:8081/analytics";

const getToken = () => localStorage.getItem("token");

export const getStats = () =>
    axios.get(`${API_URL}/stats`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

export const getAchievements = () =>
    axios.get("http://localhost:8081/tasks/achievements", {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

export const getWeeklyChart = () =>
    axios.get(`${API_URL}/weekly-chart`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

export const getMonthlyChart = () =>
    axios.get(`${API_URL}/monthly-chart`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

export const getStreak = () =>
    axios.get(`${API_URL}/streak`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

export const getCompletionDates = (startDate, endDate) => {
    const token = getToken();

    return axios.get(`${API_URL}/completion-dates`, {
        params: {
            startDate,
            endDate
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};