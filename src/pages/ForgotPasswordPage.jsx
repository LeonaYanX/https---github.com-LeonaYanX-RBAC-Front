import React, { useState } from 'react';
import { forgotPassword } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPasswordPage.css';

export default function ForgotPasswordPage() {
  const [email, setEmail]         = useState('');
  const [message, setMessage]     = useState('');
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await forgotPassword(email);  
      setMessage('Ссылка для сброса пароля отправлена на ваш e-mail.');
      // Через 3 секунды редирект на логин
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при отправке письма.');
    }
  };

  return (
    <div className="forgot-password-page">
      <h2>Forgot Password?</h2>
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
        <button type="submit">Отправить ссылку</button>
      </form>
      {message && <div className="success">{message}</div>}
      {error   && <div className="error">{error}</div>}
    </div>
  );
}
