// src/api/admin.js
import API from './apiClient';

/**
 * Приглашает нового пользователя (создаёт partial user и шлёт ссылку)
 * @param {{ email: string, roleName: string }} data
 */
export function inviteUser(data) {
  return API.post('/admin/create-user', data);
}

/**
 * Получает все возможные роли
 */
export function fetchRoles() {
  return API.get('/admin/roles');
}
