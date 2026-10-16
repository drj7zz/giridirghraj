'use client';
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BLOG_URL, getBlogPostUrl } from '../../lib/site-links';
import {
  User, Lock, Eye, EyeOff, ArrowRight, LogOut, Bookmark,
  MessageCircle, Sparkles, AlertCircle, CheckCircle2, RefreshCw, Trash2,
  Send, X
} from 'lucide-react';

function UserLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [savedItems, setSavedItems] = useState([]);
  const [googleConfigured, setGoogleConfigured] = useState(false);

  // Chat in account states
  const [dmOpen, setDmOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatDraft, setChatDraft] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const chatBodyRef = React.useRef(null);

  // Read URL query errors/welcome
  useEffect(() => {
    const err = searchParams?.get('error');
    if (err === 'google_not_configured') {
      setError('Google Sign-In is not configured yet. Please use username & password.');
    } else if (err === 'google_token') {
      const detail = searchParams?.get('detail');
      setError(detail === 'invalid_client'
        ? 'Google rejected the OAuth client credentials. Update GOOGLE_CLIENT_SECRET in Vercel and redeploy.'
        : detail === 'invalid_grant'
          ? 'This Google sign-in code expired or was already used. Start sign-in again.'
          : detail === 'redirect_uri_mismatch'
            ? 'Google rejected the callback URL. Check the exact production URI in Google Cloud Console.'
            : 'Google could not verify this callback. Check the OAuth settings and try again.');
    } else if (err?.startsWith('google_')) {
      setError(`Google Sign-In failed (${err.replace('google_', '')}). Please try username/password.`);
    }

    if (searchParams?.get('welcome')) {
      setFeedback('Welcome! Signed in successfully.');
    }

    // Check Google OAuth status
    fetch('/api/user/auth/google?status=1')
      .then((r) => (r.ok ? r.json() : { configured: false }))
      .then((d) => setGoogleConfigured(Boolean(d.configured)))
      .catch(() => setGoogleConfigured(false));
  }, [searchParams]);

  // Load current user session & saved items
  const loadSession = async () => {
    try {
      setChecking(true);
      const res = await fetch('/api/chat/auth');
      const data = await res.json();
      if (data?.user) {
        setUser(data.user);
        loadSavedItems();
      } else {
        setUser(null);
      }
    } catch (_err) {
      setUser(null);
    } finally {
      setChecking(false);
    }
  };

  const loadSavedItems = async () => {
    try {
      const res = await fetch('/api/user/saved');
      if (res.ok) {
        const data = await res.json();
        setSavedItems(data.items || []);
      }
    } catch (_err) {
      setSavedItems([]);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  // Real-time chat polling in user account
  useEffect(() => {
    if (!user || !dmOpen) return;
    const fetchMsgs = async () => {
      try {
        const res = await fetch('/api/chat/messages');
        if (res.ok) {
          const d = await res.json();
          setChatMessages(d.messages || []);
        }
      } catch (_err) { /* ignore */ }
    };
    fetchMsgs();
    const poll = setInterval(fetchMsgs, 1500); // 1.5s real-time
    const handleSync = () => fetchMsgs();
    window.addEventListener('focus', handleSync);
    document.addEventListener('visibilitychange', handleSync);
    return () => {
      clearInterval(poll);
      window.removeEventListener('focus', handleSync);
      document.removeEventListener('visibilitychange', handleSync);
    };
  }, [user, dmOpen]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendChat = async (e) => {
    e.preventDefault();
    const text = chatDraft.trim();
    if (!text || chatSending) return;
    setChatError('');
    setChatSending(true);

    // Optimistic real-time append
    const optimistic = {
      username: user.username,
      from: 'user',
      text,
      at: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, optimistic]);
    setChatDraft('');

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (res.status === 401) {
        setUser(null);
        throw new Error('Your session expired. Please sign in again.');
      }
      if (!res.ok) throw new Error(data.error || 'Failed to send message.');
    } catch (err) {
      setChatError(err.message);
    } finally {
      setChatSending(false);
    }
  };

  const handleClearChat = async () => {
    if (!confirm('Clear all messages in your private thread with DRJ?')) return;
    try {
      const res = await fetch('/api/chat/messages', { method: 'DELETE' });
      if (res.ok) setChatMessages([]);
    } catch (_err) { /* ignore */ }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setFeedback('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mode,
          username,
          password,
          remember
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setUser(data.user);
      setFeedback(mode === 'register' ? 'Account created! You are logged in.' : 'Welcome back!');
      setUsername('');
      setPassword('');
      loadSavedItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/chat/auth', { method: 'DELETE' });
      setUser(null);
      setSavedItems([]);
      setFeedback('Logged out successfully.');
    } catch (_err) {
      // ignore
    }
  };

  const handleRemoveSaved = async (id) => {
    try {
      const res = await fetch(`/api/user/saved?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setSavedItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (_err) {
      // ignore
    }
  };

  if (checking) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--muted)', font: '12px "DM Mono", monospace' }}>
        <RefreshCw size={16} style={{ display: 'inline', marginRight: '8px', animation: 'orbitSpin 1.2s linear infinite' }} />
        Checking your session...
      </div>
    );
  }

  // ─── ALREADY LOGGED IN: PROFILE & SYNC DASHBOARD ───
  if (user) {
    return (
      <section className="section-panel" style={{ maxWidth: '680px', margin: '48px auto', padding: '0 12px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '32px' }}>Welcome, {user.username}</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>
            Your account is active and synced across <strong>Private Chat</strong> and <strong>Saved Notes</strong>.
          </p>
        </div>

        {feedback && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', marginBottom: '20px',
            background: 'rgba(64, 196, 99, 0.1)', border: '1px solid #30a14e', borderRadius: '6px',
            color: 'var(--ink)', fontSize: '12.5px'
          }}>
            <CheckCircle2 size={16} color="#30a14e" />
            <span>{feedback}</span>
          </div>
        )}

        <div style={{ display: 'grid', gap: '20px' }}>
          {/* ─── Direct Messages Chat Section ─── */}
          {!dmOpen ? (
            <div style={{ border: '1px solid var(--line)', borderRadius: '12px', padding: '20px 22px', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', font: '800 10px "DM Mono", monospace', color: 'var(--accent)', textTransform: 'uppercase' }}>
                    Live Connection (Closed)
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '17px', font: '800 17px "Space Grotesk", sans-serif' }}>
                    Messenger Chat Synced
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                    {chatMessages.length > 0 ? `${chatMessages.length} messages in conversation. Click to open DM.` : 'Your private conversation with DRJ is active and synced to your credentials.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDmOpen(true)}
                  className="button"
                  style={{ height: '38px', fontSize: '11px' }}
                >
                  <MessageCircle size={14} /> Open DM
                </button>
              </div>
            </div>
          ) : (
            <div className="chat-panel" style={{ marginTop: 0 }}>
              <div className="chat-head">
                <span className="chat-head-title"><MessageCircle size={15} /> Direct Messages with DRJ</span>
                <span className="chat-status online"><span /> Thread active</span>
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear conversation history"
                  style={{ color: 'rgba(255,255,255,0.75)', fontSize: '10px', marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px' }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setDmOpen(false)}
                  title="Close DM"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    borderRadius: '6px',
                    padding: '4px 9px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginLeft: '8px'
                  }}
                >
                  <X size={12} /> Close DM
                </button>
              </div>

              <div className="chat-body" ref={chatBodyRef}>
                {chatMessages.length === 0 ? (
                  <div className="chat-empty-state">
                    <div className="chat-empty-icon"><MessageCircle size={20} /></div>
                    <strong>Start your conversation</strong>
                    <p>Send a direct message to DRJ. Messages are private and delivered in real-time.</p>
                    <div className="chat-prompts">
                      {['Hi DRJ! I reviewed your projects', 'I have a development opportunity', 'Can we collaborate on open-source?'].map((prompt) => (
                        <button type="button" key={prompt} onClick={() => setChatDraft(prompt)}>{prompt}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  chatMessages.map((m, idx) => (
                    <div className={`chat-bubble ${m.from === 'user' ? 'me' : 'them'}`} key={idx}>
                      {m.text}
                      <span className="chat-time">
                        {m.from === 'admin' ? 'DRJ · ' : ''}
                        {new Date(m.at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <form className="chat-form" onSubmit={handleSendChat}>
                <input
                  type="text"
                  placeholder="Type a message to DRJ…"
                  value={chatDraft}
                  onChange={e => setChatDraft(e.target.value)}
                  maxLength={2000}
                />
                <button type="submit" disabled={chatSending || !chatDraft.trim()}>
                  <Send size={13} /> {chatSending ? 'Sending…' : 'Send'}
                </button>
              </form>
              {chatError && <div className="chat-send-error" role="alert">{chatError}</div>}
              <div className="chat-form-meta">
                <span>Real-time private thread synced to {user.username}</span>
                <span>{chatDraft.length}/2000</span>
              </div>
            </div>
          )}

          {/* Saved items list */}
          <div style={{ border: '1px solid var(--line)', borderRadius: '12px', padding: '22px', background: 'var(--bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', font: '800 16px "Space Grotesk", sans-serif' }}>
                <Bookmark size={16} color="var(--accent)" /> Saved Engineering Notes ({savedItems.length})
              </h3>
              <Link href={BLOG_URL} className="text-link" style={{ margin: 0, fontSize: '11px' }}>
                Explore Blogs →
              </Link>
            </div>

            {savedItems.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '12.5px', margin: '8px 0' }}>
                You have not saved any blogs yet. Visit the <Link href={BLOG_URL} style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Blog page</Link> and explore the latest notes.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      border: '1px solid var(--line)',
                      borderRadius: '8px',
                      gap: '12px'
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <Link href={getBlogPostUrl(item.id)} style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>
                        {item.title}
                      </Link>
                      <span style={{ display: 'block', font: '10px "DM Mono", monospace', color: 'var(--muted)', marginTop: '2px' }}>
                        Saved {new Date(item.at).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSaved(item.id)}
                      title="Remove bookmark"
                      style={{ color: 'var(--muted)', padding: '6px' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logout row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
            <Link href="/" className="text-link" style={{ margin: 0 }}>
              ← Return to portfolio
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="button ghost"
              style={{ minHeight: '38px', fontSize: '11px', color: 'var(--accent)', borderColor: 'var(--accent)' }}
            >
              <LogOut size={13} /> Log out ({user.username})
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ─── LOGIN / REGISTER FORM ───
  return (
    <section className="section-panel" style={{ maxWidth: '440px', margin: '48px auto', padding: '0 12px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>
          {mode === 'login' ? 'Sign in to your account' : 'Create an account'}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
          Access private chat with DRJ and sync your saved blogs &amp; interactions.
        </p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: '8px', padding: '4px', marginBottom: '22px' }}>
        <button
          type="button"
          onClick={() => { setMode('login'); setError(''); setFeedback(''); }}
          style={{
            flex: 1,
            padding: '8px 0',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: '6px',
            background: mode === 'login' ? 'var(--accent)' : 'transparent',
            color: mode === 'login' ? '#fff' : 'var(--muted)',
            transition: 'all 0.2s ease'
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setError(''); setFeedback(''); }}
          style={{
            flex: 1,
            padding: '8px 0',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: '6px',
            background: mode === 'register' ? 'var(--accent)' : 'transparent',
            color: mode === 'register' ? '#fff' : 'var(--muted)',
            transition: 'all 0.2s ease'
          }}
        >
          Register
        </button>
      </div>

      {/* Continue with Google */}
      <a
        href="/api/user/auth/google"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          height: '44px',
          padding: '0 14px',
          border: '1px solid var(--line)',
          borderRadius: '8px',
          background: 'var(--bg)',
          color: 'var(--ink)',
          fontSize: '12.5px',
          fontWeight: 700,
          textDecoration: 'none',
          marginBottom: '18px',
          transition: 'border-color 0.2s ease, transform 0.2s ease'
        }}
        title={googleConfigured ? 'Sign in with Google' : 'Click to sign in with Google (requires GOOGLE_CLIENT_ID)'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Continue with Google</span>
      </a>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0 20px', color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
        <span>or username</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
      </div>

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', marginBottom: '18px',
          background: 'rgba(186, 65, 45, 0.08)', border: '1px solid var(--accent)', borderRadius: '6px',
          color: 'var(--accent)', fontSize: '12px'
        }}>
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {feedback && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', marginBottom: '18px',
          background: 'rgba(64, 196, 99, 0.1)', border: '1px solid #30a14e', borderRadius: '6px',
          color: 'var(--ink)', fontSize: '12px'
        }}>
          <CheckCircle2 size={14} color="#30a14e" style={{ flexShrink: 0 }} />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleAuth} style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Username
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. dev_user (3–20 letters/digits)"
              required
              autoComplete="username"
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
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
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
              onClick={() => setShowPassword((v) => !v)}
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me on this device
          </label>

          <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
            {mode === 'login' ? 'No account yet?' : 'Have an account?'}
            <button
              type="button"
              onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); setFeedback(''); }}
              style={{ color: 'var(--accent)', fontWeight: 800, marginLeft: '6px' }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </span>
        </div>

        <button
          type="submit"
          className="button"
          disabled={loading}
          style={{ justifyContent: 'center', marginTop: '10px', width: '100%', minHeight: '44px' }}
        >
          {loading ? 'Processing...' : (
            mode === 'login' ? (
              <>Sign In <ArrowRight size={14} /></>
            ) : (
              <>Create Account <Sparkles size={14} /></>
            )
          )}
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

export default function UserLoginPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--muted)', font: '12px "DM Mono", monospace' }}>
        Loading account portal...
      </div>
    }>
      <UserLoginPageContent />
    </Suspense>
  );
}
