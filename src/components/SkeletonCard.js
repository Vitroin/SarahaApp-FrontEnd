import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="card-dark p-3 h-100" aria-hidden="true">
      <p className="placeholder-glow mb-3">
        <span className="placeholder col-9"></span>
        <span className="placeholder col-7"></span>
        <span className="placeholder col-10"></span>
      </p>
      <div className="d-flex justify-content-between pt-2 border-top border-dark-subtle">
        <span className="placeholder col-3"></span>
        <span className="placeholder col-2"></span>
      </div>
    </div>
  );
}