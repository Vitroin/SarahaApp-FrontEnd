import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="app-bg d-flex flex-column align-items-center justify-content-center text-center p-4">
      <h1 className="display-1 fw-bold text-muted-dark mb-0">404</h1>
      <h4 className="mb-2">Page not found</h4>
      <p className="text-muted-dark mb-4">
        The page you're looking for doesn't exist or was moved.
      </p>
      <Link to="/home" className="btn btn-accent">
        Go Home
      </Link>
    </div>
  );
}