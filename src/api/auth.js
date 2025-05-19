import createAuthClient from './authClient';

// Клиент без интерсепторов для /auth
const AUTH = createAuthClient();

/**
 * POST /login
 * Использует AUTH, чтобы не ловить наш response-интерсептор.
 */
export function login(email, password) {
  return AUTH.post('/login', { email, password });       // ← CHANGED: возвращаем полный axios-ответ
}

/**
 * Запрос на отправку письма для сброса пароля.
 * @param {string} email
 */
export function forgotPassword(email) {
  return AUTH.post('/forgot-password', { email });
}

/**
 * Запрос на сброс пароля по токену.
 * @param {string} token
 * @param {string} newPassword
 * @param {string} confirmPassword
 */
export function resetPassword(token, newPassword, confirmPassword) {
  return AUTH.post(`/reset-password/${token}`, {
    newPassword,
    confirmPassword,
  });
}