import React from 'react';
import { timeAgo } from '../utils/helpers';

export default function MessageCard({ message }) {
  const text = message?.content || message?.message || message?.text || '';
  const createdAt = message?.createdAt || message?.date || null;

  return (
    <div className="card-message p-3 h-100 d-flex flex-column">
      <p className="mb-3 flex-grow-1">{text}</p>
      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-dark-subtle">
        <span className="tag-anon">Anonymous</span>
        {createdAt && (
          <span className="small text-muted-dark">{timeAgo(createdAt)}</span>
        )}
      </div>
    </div>
  );
}