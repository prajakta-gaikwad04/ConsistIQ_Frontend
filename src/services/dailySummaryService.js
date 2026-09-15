import axios from "axios";

const API_URL = "https://consistiq-backend.onrender.com";
export const getDailySummary = () => {
    const token = localStorage.getItem("token");

    return axios.get(`${API_URL}/tasks/daily-summary`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};