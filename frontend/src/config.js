// src/config.js
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://opencalendar-jfsc.onrender.com/";

export default API_BASE_URL;
