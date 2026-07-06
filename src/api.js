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

    // attach token only if exists
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

    // ❌ avoid multiple redirects / loops
    if (status === 401 || status === 403) {
      const token = localStorage.getItem("token");

      if (token) {
        localStorage.removeItem("token");
        console.log("Token removed due to auth failure");

        // avoid repeated alerts if multiple API calls fail
        if (!window.__authRedirectTriggered) {
          window.__authRedirectTriggered = true;

          alert("Session expired. Please login again.");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;