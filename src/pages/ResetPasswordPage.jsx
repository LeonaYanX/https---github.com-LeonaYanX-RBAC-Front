import React, { useState } from 'react';
import { resetPassword } from '../api/auth';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ResetPasswordPage.css';

export default function ResetPasswordPage() {
  const { token } = useParams();                      // читаем :token из URL :contentReference[oaicite:3]{index=3}
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage]                 = useState('');
  const [error, setError]                     = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await resetPassword(token, newPassword, confirmPassword);
      setMessage('Пароль успешно изменён. Перенаправление на вход…');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при смене пароля.');
    }
  };

  return (
    <div className="reset-password-page">
      <h2>Reset Password</h2>
      <p>Your email token: <code>{token}</code></p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Изменить пароль</button>
      </form>
      {message && <div className="success">{message}</div>}
      {error   && <div className="error">{error}</div>}
    </div>
  );
}
