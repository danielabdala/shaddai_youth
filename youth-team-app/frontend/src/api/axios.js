import axios from "axios";

console.log("Base URL in axios.js:", import.meta.env.VITE_API_URL); // keep this

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
  },
});

export default api;
