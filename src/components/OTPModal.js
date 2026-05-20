import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { getErrorMessage } from '../utils/helpers';
import { toast } from 'react-toastify';

export default function OTPModal({ email, onSuccess, onClose }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 5) return;
    setLoading(true);
    try {
      await authAPI.verifyAccount({ email, otp });
      toast.success('Account verified! Please log in.');
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authAPI.resendOTP({ email });
      toast.success('New OTP sent to your email.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: 'rgba(0,0,0,0.7)', zIndex: 9000 }}
    >
      <div className="card-dark p-4" style={{ maxWidth: 380, width: '100%' }}>
        <h5 className="mb-1">Check your email</h5>
        <p className="text-muted-dark small mb-3">
          We sent a 5-digit code to <span className="text-soft">{email}</span>
        </p>

        <form onSubmit={handleVerify}>
          <div className="mb-3">
            <label className="form-label small">Verification Code</label>
            <input
              type="text"
              className="form-control form-control-dark text-center"
              maxLength={5}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="12345"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn btn-accent w-100"
            disabled={loading || otp.length !== 5}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm me-2" />
            )}
            Verify Account
          </button>
        </form>

        <div className="d-flex justify-content-between align-items-center mt-3 small">
          <button
            type="button"
            className="btn link-accent p-0 small border-0 bg-transparent"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? 'Sending…' : 'Resend OTP'}
          </button>
          <button
            type="button"
            className="btn p-0 small border-0 bg-transparent text-muted-dark"
            onClick={onClose}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}