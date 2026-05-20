import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      const { token, user } = res.data.data;
      login(token, user);
      toast.success('Welcome back!');
      navigate('/home');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-bg d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">
            <div className="card-dark p-4">
              <h2 className="fw-bold mb-1 brand-link">Saraha</h2>
              <h4 className="mb-1">Sign in</h4>
              <p className="text-muted-dark small mb-4">
                Welcome back — see what people are saying
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label small">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-dark"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <div className="text-danger small mt-1">{errors.email}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label small">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-dark"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  {errors.password && (
                    <div className="text-danger small mt-1">{errors.password}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-accent w-100"
                  disabled={loading}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm me-2" />
                  )}
                  Sign In
                </button>
              </form>

              <div className="text-center mt-3 small text-muted-dark">
                Don't have an account?{' '}
                <Link to="/signup" className="link-accent">
                  Create one
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}