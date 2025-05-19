// src/pages/CreateUserPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { inviteUser, fetchRoles } from '../api/admin';
import { AuthContext } from '../context/AuthContext';
import '../styles/CreateUserPage.css';

export default function CreateUserPage() {
  const [email, setEmail]       = useState('');
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles]       = useState([]);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  useEffect(() => {
    // Загружаем список ролей
    fetchRoles()
      .then(res => setRoles(res.data.data))
      .catch(() => setError('Failed to load roles'));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');

    try {
      await inviteUser({ email, roleName });
      setSuccess('Invitation sent!');
      // через пару секунд возвращаемся на список
      setTimeout(() => navigate('/users'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invitation');
    }
  };

  // Если у меня нет права – редирект
  if (!authData?.user?.permissions.includes('user.create')) {
    navigate('/users');
    return null;
  }

  return (
    <div className="create-user-page">
      <h2>Create New User</h2>

      {error   && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Role:</label>
          <select
            value={roleName}
            onChange={e => setRoleName(e.target.value)}
            required
          >
            <option value="">-- Select role --</option>
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <button type="submit">Invite User</button>
      </form>
    </div>
  );
}
