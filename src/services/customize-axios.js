import axios from "axios";

const api = axios.create({
  baseURL: "https://hotel-booking-api-xojn.onrender.com",
});


export default api;
