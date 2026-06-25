import axios from "axios";

const api = axios.create({
  // baseURL: "https://hotel-booking-api-xojn.onrender.com",
  baseURL: "https://api-hotel.la-pizzaia.site",
  // baseURL: "http://localhost:8080",
});


export default api;
