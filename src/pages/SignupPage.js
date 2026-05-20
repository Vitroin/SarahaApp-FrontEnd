import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { getErrorMessage } from '../utils/helpers';
import { toast } from 'react-toastify';
import OTPModal from '../components/OTPModal';

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    else if (form.fullName.trim().length < 3)
      errs.fullName = 'Name must be at least 3 characters';

    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';

    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!form.password) errs.password = 'Password is required';
    else if (!pwRegex.test(form.password))
      errs.password = 'Min 8 chars, must include letters and numbers';

    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.confirmPassword !== form.password)
      errs.confirmPassword = 'Passwords do not match';

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
      await authAPI.register({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      setRegisteredEmail(form.email.trim().toLowerCase());
      setShowOTP(true);
      toast.success('Account created! Check your email for the OTP.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    navigate('/login');
  };

  return (
    <>
      {showOTP && (
        <OTPModal
          email={registeredEmail}
          onSuccess={handleOTPSuccess}
          onClose={() => setShowOTP(false)}
        />
      )}

      <div className="app-bg d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-7 col-lg-5">
              <div className="card-dark p-4">
                <h2 className="fw-bold mb-1 brand-link">Saraha</h2>
                <h4 className="mb-1">Create account</h4>
                <p className="text-muted-dark small mb-4">
                  Join the conversation — anonymously
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label className="form-label small">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control form-control-dark"
                      placeholder="Your name"
                      value={form.fullName}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                    {errors.fullName && (
                      <div className="text-danger small mt-1">{errors.fullName}</div>
                    )}
                  </div>

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

                  <div className="mb-3">
                    <label className="form-label small">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-dark"
                      placeholder="Min 8 chars, letters + numbers"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {errors.password && (
                      <div className="text-danger small mt-1">{errors.password}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label small">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control form-control-dark"
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                      <div className="text-danger small mt-1">{errors.confirmPassword}</div>
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
                    Create Account
                  </button>
                </form>

                <div className="text-center mt-3 small text-muted-dark">
                  Already have an account?{' '}
                  <Link to="/login" className="link-accent">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}