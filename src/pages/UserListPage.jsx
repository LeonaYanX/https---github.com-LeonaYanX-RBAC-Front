// src/pages/UserListPage.jsx

import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/apiClient';
import UserCard from '../components/UserCard';
import { AuthContext } from '../context/AuthContext';
import { fetchRoles } from '../api/admin';
import '../styles/UserListPage.css';

export default function UserListPage() {
  const [users, setUsers]     = useState([]);
  const [roles, setRoles]     = useState([]);      // Список ролей
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const { authData }          = useContext(AuthContext);
  const perms                 = authData?.user?.permissions || [];
  const navigate              = useNavigate();

  // Загрузка пользователей
  useEffect(() => {
    API.get('/users')
      .then(res => setUsers(res.data.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch users'))
      .finally(() => setLoading(false));
  }, []);

  // Загрузка списка ролей (для assign-role)
  useEffect(() => {
    fetchRoles()
      .then(res => setRoles(res.data.data))
      .catch(() => {
        // Если не удалось, оставляем пустой список
        setRoles([]);
      });
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
          <Link 
            to={`/users/${u.id}`} 
            key={u.id} 
            className="user-card-link"
          >
            {/* Передаём роли в карточку для выпадающего списка */}
            <UserCard 
              user={u} 
              roles={roles} 
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
