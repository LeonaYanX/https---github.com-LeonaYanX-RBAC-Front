// src/api/user.js
import API from './apiClient';

export function assignRole(userId, roleName) {
  return API.put(`/users/${userId}/role`, { roleName });
}

export function deleteUser(userId) {
  return API.delete(`/users/${userId}`);
}
