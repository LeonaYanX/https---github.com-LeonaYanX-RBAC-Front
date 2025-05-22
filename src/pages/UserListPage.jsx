// src/pages/UserListPage.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/apiClient';
import UserCard from '../components/UserCard';
import { AuthContext } from '../context/AuthContext';
import { fetchRoles } from '../api/admin';
import '../styles/UserListPage.css';

export default function UserListPage() {
  const [users, setUsers]     = useState([]);
  const [roles, setRoles]     = useState([]);      // Список ролей для выпадающего списка
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const { authData }          = useContext(AuthContext);
  const perms                 = authData?.user?.permissions || [];
  const navigate              = useNavigate();

  // 1) Загрузка пользователей
  useEffect(() => {
    API.get('/users')
      .then(res => setUsers(res.data.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch users'))
      .finally(() => setLoading(false));
  }, []);

  // 2) Загрузка списка ролей (для Assign Role)
  useEffect(() => {
    fetchRoles()
      .then(res => setRoles(res.data.data))
      .catch(() => setRoles([]));
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="user-list-page">
      {/* CREATE BUTTON ABOVE THE LIST */}
      {perms.includes('user.create') && (
        <button
          className="create-user-btn"
          onClick={() => navigate('/create-user')}
        >
          Create User
        </button>
      )}

      <h2>Users</h2>
      <div className="user-list">
        {users.map(u => (
          <div
            key={u.id}
            className="user-card-wrapper"
            // Навигация по клику на карточку, но не на кнопки/селекты внутри
            onClick={() => navigate(`/users/${u.id}`)}
          >
            <UserCard 
              user={u} 
              roles={roles}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
