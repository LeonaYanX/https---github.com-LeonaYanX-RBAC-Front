// src/pages/UserDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/apiClient';
import '../styles/UserDetailPage.css';

export default function UserDetailPage() {
  const { id } = useParams();               // получаем id из URL
  const [user, setUser]     = useState(null);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GET /api/users/:id
    API.get(`/users/${id}`)
      .then(res => setUser(res.data.data)) // ответ в { status, data: {...} }
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch user'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading user…</div>;
  if (error)   return <div className="error">{error}</div>;
  if (!user)   return null;

  return (
    <div className="user-detail-page">
      <h2>User Detail</h2>
      <div className="user-detail">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong>    {user.email}</p>
        <p><strong>Role:</strong>     {user.role}</p>
        <p><strong>Status:</strong>   {user.status}</p>
        {user.avatar && (
          <div>
            <strong>Avatar:</strong><br/>
            <img src={user.avatar} alt="Avatar" width={100} />
          </div>
        )}
        {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
      </div>
      <Link to="/users" className="back-link">← Back to list</Link>
    </div>
  );
}
