import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import MessageCard from '../components/MessageCard';
import SkeletonCard from '../components/SkeletonCard';

// 20 mock messages — refresh picks a random 6
const MOCK_POOL = [
  'You always manage to make the room brighter just by walking in. Never forget that.',
  'The way you explain things makes everything feel simple. You\'re genuinely gifted.',
  'I noticed you helped someone when you thought no one was watching. That meant a lot.',
  'Your sense of humor is honestly the best thing in any group chat.',
  'Not sure if you know this, but you\'ve inspired me more than once.',
  'The effort you put into everything you do doesn\'t go unnoticed.',
  'You have this calm energy that makes hard days easier for everyone around you.',
  'I still think about that piece of advice you gave me last year. It changed things.',
  'You\'re the friend everyone secretly wishes they had. Don\'t change.',
  'Whatever you\'re working on lately — it shows. Keep going.',
  'You listen in a way most people don\'t. It\'s rare, and it matters.',
  'Honestly, your taste in music is unmatched. Send more recommendations.',
  'I admire how you stand up for what you believe in, even when it\'s uncomfortable.',
  'The world is a little more interesting because you\'re in it.',
  'You\'re way more talented than you give yourself credit for.',
  'Thanks for being patient with me when I was at my worst. I won\'t forget it.',
  'Your laugh is contagious. Genuinely. People around you smile more.',
  'I learned more from watching how you handle things than from any class.',
  'Please don\'t shrink yourself for anyone. You\'re meant to take up space.',
  'You\'re doing better than you think you are. I see it, even if you don\'t.',
];

const buildMockBatch = () => {
  return MOCK_POOL
    .sort(() => Math.random() - 0.5)
    .slice(0, 6)
    .map((content, i) => ({
      _id: `mock-${i}`,
      content,
      createdAt: new Date().toISOString(),
    }));
};

export default function HomePage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    setMessages(buildMockBatch(6));

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const firstName = user?.firstName || user?.fullName?.split(' ')[0] || 'there';

  return (
    <div className="app-bg">
      <Navbar />

      <main className="container py-4 py-md-5">
        {/* Hero */}
        <div className="hero-accent mb-4">
          <h1 className="h3 fw-bold mb-1">Hey {firstName} 👋</h1>
          <p className="text-muted-dark mb-0">
            Anonymous messages from people who wanted you to know something.
          </p>
        </div>

        {/* Toolbar: count + refresh */}
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
          <span className="small text-muted-dark">
            {loading
              ? 'Loading messages…'
              : `${messages.length} ${messages.length === 1 ? 'message' : 'messages'}`}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => fetchMessages(true)}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Refreshing…
              </>
            ) : (
              <>↻ Refresh</>
            )}
          </button>
        </div>

        {/* Grid */}
        <div className="row g-3 pb-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div className="col-12 col-sm-6 col-lg-4" key={i}>
                <SkeletonCard />
              </div>
            ))
          ) : messages.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted-dark">
              <p className="mb-0">No messages yet.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div className="col-12 col-sm-6 col-lg-4" key={msg._id || i}>
                <MessageCard message={msg} />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}