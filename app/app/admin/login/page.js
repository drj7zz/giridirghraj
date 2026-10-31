'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

const REMEMBERED_USERNAME_KEY = 'kaalyug_admin_username';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberUsername, setRememberUsername] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedUsername = window.localStorage.getItem(REMEMBERED_USERNAME_KEY);
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberUsername(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      if (rememberUsername) {
        window.localStorage.setItem(REMEMBERED_USERNAME_KEY, username.trim());
      } else {
        window.localStorage.removeItem(REMEMBERED_USERNAME_KEY);
      }

      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-panel" style={{ maxWidth: '440px', margin: '60px auto', padding: '0 12px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px' }}>Portfolio CMS</h2>
        <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
          Sign in to manage blogs, projects, links, and portfolio data.
        </p>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 14px',
          marginBottom: '20px',
          background: 'rgba(186, 65, 45, 0.08)',
          border: '1px solid var(--accent)',
          borderRadius: '6px',
          color: 'var(--accent)',
          fontSize: '12px',
          fontFamily: 'DM Mono, monospace'
        }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label htmlFor="admin-username" style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Username
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="admin-username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="username"
              required
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px 0 36px',
                background: 'transparent',
                border: '1px solid var(--line)',
                borderRadius: '6px',
                color: 'var(--ink)',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <User size={15} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--muted)' }} />
          </div>
        </div>

        <div>
          <label htmlFor="admin-password" style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="admin-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                height: '44px',
                padding: '0 42px 0 36px',
                background: 'transparent',
                border: '1px solid var(--line)',
                borderRadius: '6px',
                color: 'var(--ink)',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <Lock size={15} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--muted)' }} />
            <button
              type="button"
              onClick={() => setShowPassword((isVisible) => !isVisible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute', right: '8px', top: '8px', display: 'grid', width: '28px', height: '28px', placeItems: 'center', color: 'var(--muted)'
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '12px', cursor: 'pointer' }}>
          <input
            id="remember-admin-username"
            name="rememberUsername"
            type="checkbox"
            checked={rememberUsername}
            onChange={(e) => setRememberUsername(e.target.checked)}
          />
          Remember username on this device
        </label>

        <button
          type="submit"
          className="button"
          disabled={loading}
          style={{ justifyContent: 'center', marginTop: '10px', width: '100%', minHeight: '44px' }}
        >
          {loading ? 'Authenticating...' : <>Enter Dashboard <ArrowRight size={14} /></>}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '28px' }}>
        <Link href="/" className="text-link" style={{ margin: 0 }}>
          ← Back to portfolio
        </Link>
      </div>
    </section>
  );
}
