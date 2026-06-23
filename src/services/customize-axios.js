import axios from "axios";

const api = axios.create({
  // baseURL: "https://hotel-booking-api-xojn.onrender.com",
  baseURL: "http://localhost:8080",
});


export default api;
