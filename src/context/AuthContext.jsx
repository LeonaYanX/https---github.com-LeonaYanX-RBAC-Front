// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { login as loginApi } from '../api/auth';

export const AuthContext = createContext();

/**
 * AuthProvider хранит:
 *  - authData: { accessToken, refreshToken, user }
 *  - функцию login
 *  - функцию logout
 */
export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(() => {
    // при инициализации подтягиваем из localStorage, если есть
    const stored = localStorage.getItem('authData');
    return stored ? JSON.parse(stored) : null;
  });

  /**
   * Логин: вызываем API, сохраняем в state и в localStorage.
   * При этом раздельно сохраняем токены, чтобы apiClient их «видел».
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} authData
   */
  const login = async (email, password) => {
    const res = await loginApi(email, password);
    const { accessToken, refreshToken, user } = res.data.data;

    const newAuth = { accessToken, refreshToken, user };
    setAuthData(newAuth);

    // сохраняем весь объект
    localStorage.setItem('authData', JSON.stringify(newAuth));
    // и токены отдельно
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return newAuth;
  };

  /**
   * Логаут: чистим все и редиректим на страницу логина.
   */
  const logout = () => {
    localStorage.removeItem('authData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthData(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
