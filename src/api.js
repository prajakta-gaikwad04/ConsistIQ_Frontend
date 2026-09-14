import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081",
});

// =======================
// REQUEST INTERCEPTOR
// =======================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("API CALL:", config.url);
    console.log("TOKEN:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =======================
// RESPONSE INTERCEPTOR
// =======================
API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    console.log("API ERROR:", status, error.response?.data);

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userEmail");

      if (!window.__authRedirectTriggered) {
        window.__authRedirectTriggered = true;

        alert("Session expired. Please login again.");

        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default API;