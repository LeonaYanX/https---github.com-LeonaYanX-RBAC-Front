import axios from 'axios';

/**
 * Чистый axios-клиент для /auth,
 * чтобы не зациклить интерсепторы API.
 */
export default function createAuthClient() {
  return axios.create({
    baseURL: process.env.REACT_APP_API_AUTH_URL,         // http://localhost:5000/api/auth
    headers: { 'Content-Type': 'application/json' },
  });
}
