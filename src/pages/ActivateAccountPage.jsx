// src/pages/ActivateAccountPage.jsx

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ActivateAccountPage.css'; // приведён ниже

export default function ActivateAccountPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  // Локальный стейт для полей формы
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone]       = useState('');
  const [photos, setPhotos]     = useState([]);  // массив File
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleFileChange = e => {
    setPhotos(Array.from(e.target.files)); // собираем FileList в массив
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('phone', phone);
      photos.forEach((file, idx) => {
        formData.append('photos', file);
      });

      // POST /api/activate/:token
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/activate/${token}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // После успешной активации — редирект на логин
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Activation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activate-page">
      <h2>Activate Your Account</h2>
      {error && <div className="error">{error}</div>}

      <form className="activate-form" onSubmit={handleSubmit}>
        <div>
          <label>Username *</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password *</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label>Upload Photos</label>
          <input
            type="file"
            name="photos"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Activating…' : 'Activate Account'}
        </button>
      </form>

      <p>
        Already activated? <Link to="/login">Go to Login</Link>
      </p>
    </div>
  );
}
