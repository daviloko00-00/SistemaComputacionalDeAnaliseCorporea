import axios from "axios";

const api = axios.create({
  baseURL: "https://c312-2804-868-d057-4274-2886-64c9-196e-1bb6.ngrok-free.app"
});

export default api;