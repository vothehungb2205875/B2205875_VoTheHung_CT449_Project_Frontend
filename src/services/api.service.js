import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // hoặc từ biến môi trường
  withCredentials: true, // PHẢI CÓ để gửi cookie
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
