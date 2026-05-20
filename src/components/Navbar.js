import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { getInitials } from '../utils/helpers';
import { toast } from 'react-toastify';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // proceed anyway
    } finally {
      logout();
      toast.info('Logged out successfully');
      navigate('/login');
    }
  };

  const avatarSrc = user?.profilePic?.secure_url;
  const initials = getInitials(user?.fullName || user?.firstName || '?');

  return (
    <nav className="navbar navbar-dark-custom py-2">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/home" className="brand-link fs-4 fw-bold">
          Saraha
        </Link>

        <div className="d-flex align-items-center gap-3">
          <Link
            to="/profile"
            className="d-flex align-items-center gap-2 text-decoration-none text-soft"
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="avatar"
                className="rounded-circle"
                style={{ width: 32, height: 32, objectFit: 'cover' }}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32, fontSize: '0.75rem' }}
              >
                {initials}
              </div>
            )}
            <span className="d-none d-sm-inline small">
              {user?.fullName || user?.firstName || 'Profile'}
            </span>
          </Link>

          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}