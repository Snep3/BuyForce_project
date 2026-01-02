import axios from 'axios';

// הכתובת המדויקת לפי ה-IP וה-main.ts שלך
const BASE_URL = 'http://10.100.102.5:4000/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 שניות המתנה
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;