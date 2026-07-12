import axios from 'axios';

const API = axios.create({
  baseURL: 'https://temple-portal-backend-production.up.railway.app/api'
});

export default API;