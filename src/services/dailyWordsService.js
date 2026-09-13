import API from "../api";

export const getDailyWords = async () => {
    return await API.get("/api/daily-words");
};