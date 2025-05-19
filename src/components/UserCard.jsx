// src/components/UserCard.jsx

import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { assignRole } from '../api/user';
import { deleteUser as deleteUserApi } from '../api/user';
import '../styles/UserCard.css';

export default function UserCard({ user, roles }) {
  const { authData } = useContext(AuthContext);
  const perms = authData?.user?.permissions || [];

  // For assign-role UI
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [assigning, setAssigning]       = useState(false);
  const [assignMsg, setAssignMsg]       = useState('');

  // For delete UI
  const [deleting, setDeleting]         = useState(false);
  const [deleteMsg, setDeleteMsg]       = useState('');

  // Handler to assign a new role
  const handleAssign = async () => {
    if (selectedRole === user.role) return;
    setAssigning(true);
    setAssignMsg('');
    try {
      await assignRole(user.id, selectedRole);
      setAssignMsg('Role updated');
    } catch {
      setAssignMsg('Failed to update');
    } finally {
      setAssigning(false);
    }
  };

  // Handler to delete user
  const handleDelete = async () => {
    if (!window.confirm(`Delete user ${user.username}?`)) return;
    setDeleting(true);
    setDeleteMsg('');
    try {
      await deleteUserApi(user.id);
      setDeleteMsg('Deleted');
    } catch {
      setDeleteMsg('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="user-card">
      <h3>{user.username}</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Status:</strong> {user.status}</p>
      {user.avatar && <img src={user.avatar} alt="Avatar" width={50} />}
      {user.phone  && <p><strong>Phone:</strong> {user.phone}</p>}

      {/* ASSIGN ROLE */}
      {perms.includes('role.assign') && (
        <div className="assign-role">
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            disabled={assigning}
          >
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            onClick={handleAssign}
            disabled={assigning || selectedRole === user.role}
          >
            {assigning ? '…' : 'Assign'}
          </button>
          {assignMsg && <span className="assign-msg">{assignMsg}</span>}
        </div>
      )}

      {/* DELETE USER */}
      {perms.includes('user.delete') && (
        <div className="delete-user">
          <button
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? '…' : 'Delete'}
          </button>
          {deleteMsg && <span className="delete-msg">{deleteMsg}</span>}
        </div>
      )}
    </div>
  );
}
