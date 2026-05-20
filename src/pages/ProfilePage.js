import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getInitials, getErrorMessage } from '../utils/helpers';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const MAX_SIZE_MB = 5;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const avatarSrc = user?.profilePic?.secure_url;
  const initials = getInitials(user?.fullName || user?.firstName || '?');

  const processFile = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Only PNG, JPG, or JPEG images are allowed.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);
      const res = await userAPI.uploadProfileCloud(formData);
      const { secure_url, public_id } = res.data.data;
      updateUser({ profilePic: { secure_url, public_id } });
      setSelectedFile(null);
      setPreview(null);
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displayAvatar = preview || avatarSrc;

  return (
    <div className="app-bg">
      <Navbar />

      <main className="container py-4">
        <button
          type="button"
          className="btn btn-sm btn-link link-accent p-0 mb-3"
          onClick={() => navigate('/home')}
        >
          ← Back to Home
        </button>

        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card-dark p-4">
              {/* Avatar + name */}
              <div className="text-center mb-4">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt="Profile"
                    className="rounded-circle mb-2"
                    style={{ width: 96, height: 96, objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center mb-2"
                    style={{ width: 96, height: 96, fontSize: '1.5rem' }}
                  >
                    {initials}
                  </div>
                )}
                <h5 className="mb-0">
                  {user?.fullName ||
                    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
                    'Anonymous'}
                </h5>
                <p className="text-muted-dark small mb-0">{user?.email || ''}</p>
              </div>

              <hr className="border-dark-subtle" />

              <h6 className="mb-3">Change Profile Picture</h6>

              {!selectedFile ? (
                <div className="mb-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    className="form-control form-control-dark"
                  />
                  <div className="form-text text-muted-dark small mt-1">
                    PNG or JPG, up to {MAX_SIZE_MB}MB.
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-dark p-2 mb-3 d-flex align-items-center gap-3">
                    <img
                      src={preview}
                      alt="preview"
                      className="rounded"
                      style={{ width: 48, height: 48, objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="text-truncate small">{selectedFile.name}</div>
                      <div className="text-muted-dark small">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary flex-grow-1"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading && (
                        <span className="spinner-border spinner-border-sm me-2" />
                      )}
                      Upload
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-light"
                      onClick={handleCancel}
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {avatarSrc && !selectedFile && (
                <p className="text-muted-dark small mt-2 mb-0">
                  You already have a profile picture. Upload a new one to replace it.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}