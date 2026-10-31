'use client';
import React, { useEffect, useState } from 'react';
import { socialLinks as seedLinks } from '../../lib/data';
import Icon from '../../components/Icon';
import { Radio, Mail, Copy, Check, MessageCircle, Send, LogOut, Eye, EyeOff, X } from 'lucide-react';

export default function ConnectPage() {
  const [emailCopied, setEmailCopied] = useState(false);
  const [links, setLinks] = useState(seedLinks);

  // Chat state
  const [chatUser, setChatUser] = useState(null);
  const [chatChecking, setChatChecking] = useState(true);
  const [dmOpen, setDmOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '', remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [googleConfigured, setGoogleConfigured] = useState(false);
  const [authChoice, setAuthChoice] = useState('password');
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [authNotice, setAuthNotice] = useState('');
  const chatBodyRef = React.useRef(null);

  useEffect(() => {
    async function loadLinks() {
      try {
        const res = await fetch('/api/site-info');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data?.data?.socialLinks) && data.data.socialLinks.length > 0) {
          setLinks(data.data.socialLinks);
        }
      } catch (_err) {
        // fall back to seed links
      }
    }
    loadLinks();
    fetch('/api/user/auth/google?status=1')
      .then((res) => (res.ok ? res.json() : { configured: false }))
      .then((data) => setGoogleConfigured(Boolean(data.configured)))
      .catch(() => setGoogleConfigured(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('welcome')) setAuthNotice('Google account connected. Your private thread is ready.');
    if (params.get('error') === 'google_token') {
      const detail = params.get('detail');
      const message = detail === 'invalid_client'
        ? 'Google rejected the OAuth client credentials. Update GOOGLE_CLIENT_SECRET in Vercel and redeploy.'
        : detail === 'invalid_grant'
          ? 'This Google sign-in code expired or was already used. Start sign-in again.'
          : detail === 'redirect_uri_mismatch'
            ? 'Google rejected the callback URL. Check the exact production URI in Google Cloud Console.'
            : 'Google could not verify this callback. Check the OAuth settings and try again.';
      setAuthError(message);
    } else if (params.get('error')?.startsWith('google_')) {
      setAuthError('Google sign-in could not be completed. Please try again or use username and password.');
    }
  }, []);

  // Chat: check session
  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/chat/auth');
        const data = await res.json();
        setChatUser(data.user || null);
      } catch (_err) {
        setChatUser(null);
      } finally {
        setChatChecking(false);
      }
    }
    check();
  }, []);

  // Real-time polling when user is signed in and DM is open
  useEffect(() => {
    if (!chatUser || !dmOpen) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/chat/messages');
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (_err) { /* ignore */ }
    };

    fetchMessages();
    const poll = setInterval(fetchMessages, 1500); // 1.5s real-time interval
    const handleSync = () => fetchMessages();
    window.addEventListener('focus', handleSync);
    document.addEventListener('visibilitychange', handleSync);

    return () => {
      clearInterval(poll);
      window.removeEventListener('focus', handleSync);
      document.removeEventListener('visibilitychange', handleSync);
    };
  }, [chatUser, dmOpen]);

  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages]);

  const handleChatAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/chat/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: authMode,
          username: authForm.username,
          password: authForm.password,
          remember: authForm.remember
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setChatUser(data.user);
      setAuthForm({ username: '', password: '', remember: true });
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/chat/auth', { method: 'DELETE' });
    setChatUser(null);
    setMessages([]);
  };

  const handleClearChat = async () => {
    if (!confirm('Clear all messages in your private thread?')) return;
    try {
      const res = await fetch('/api/chat/messages', { method: 'DELETE' });
      if (res.ok) setMessages([]);
    } catch (_err) { /* ignore */ }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setAuthError('');
    setSending(true);

    // Optimistic real-time append
    const optimistic = {
      username: chatUser?.username || 'user',
      from: 'user',
      text,
      at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimistic]);
    setDraft('');

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (res.status === 401) {
        setChatUser(null);
        throw new Error('Your chat session expired. Please sign in again.');
      }
      if (!res.ok) throw new Error(data.error || 'Failed to send.');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setSending(false);
    }
  };

  const usePrompt = (prompt) => setDraft(prompt);

  const copyEmail = async () => {
    const emailLink = links.find((l) => l.url && l.url.startsWith('mailto:'))?.url || '';
    const email = emailLink.replace('mailto:', '');
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2200);
    } catch (_err) {
      if (emailLink) window.location.href = emailLink;
    }
  };

  return (
    <div className="connect-wrapper">
      <header className="connect-header">
        <h1 id="connect-title">Connect</h1>
        <p className="connect-lede">
          I’m Dirghraj, a developer from Nepal and founder of KAALYUG. For project enquiries,
          development opportunities, or a good idea, choose the channel that works for you.
        </p>
      </header>

      {/* ─── Direct Messages Chatbox (Placed Above) ─── */}
      {!dmOpen ? (
        <div className="chat-panel chat-panel-closed">
          <div>
            <span className="chat-closed-label">Direct Channel (Closed)</span>
            <h3 className="chat-closed-title">Direct Messages with DRJ</h3>
            <p className="chat-closed-sub">
              {chatUser ? `Your private thread is ready, ${chatUser.username}. Open it whenever you want to chat.` : 'For a private conversation, open the message panel when you are ready.'}
            </p>
          </div>
          <button type="button" className="button" onClick={() => setDmOpen(true)}>
            <MessageCircle size={14} /> Open DM
          </button>
        </div>
      ) : (
      <div className="chat-panel">
        <div className="chat-head">
          <span className="chat-head-title"><MessageCircle size={16} /> Direct Messages with DRJ</span>
          <span className={`chat-status ${chatUser ? 'online' : ''}`}><span /> {chatUser ? 'Thread active' : 'Private channel'}</span>
          {chatUser && (
            <>
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear conversation history"
                style={{ color: 'rgba(255,255,255,0.75)', fontSize: '10px', marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px' }}
              >
                Clear
              </button>
              <button type="button" onClick={handleLogout} style={{ marginLeft: '8px' }}>
                <LogOut size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />{chatUser.username} · Log out
              </button>
            </>
          )}
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
              marginLeft: chatUser ? '10px' : 'auto'
            }}
          >
            <X size={12} /> Close DM
          </button>
        </div>

        {chatChecking ? (
          <div className="chat-auth"><p className="chat-hint">Checking session status…</p></div>
        ) : !chatUser ? (
          <form className="chat-auth" onSubmit={handleChatAuth}>
            {authNotice && <div className="chat-success"><Check size={14} /> {authNotice}</div>}
            <p className="chat-hint">
              <strong>Start a private conversation.</strong> Sign in or create an account to message me. Your messages stay in your personal chat thread.
            </p>
            {authError && <div className="chat-error">{authError}</div>}
            <div className="chat-auth-choice" role="tablist" aria-label="Choose a chat sign-in method">
              <button type="button" className={authChoice === 'password' ? 'active' : ''} onClick={() => setAuthChoice('password')}>Username &amp; password</button>
              <button type="button" className={authChoice === 'google' ? 'active' : ''} onClick={() => setAuthChoice('google')}>Google</button>
            </div>
            {authChoice === 'google' ? (
              <div className="chat-google-choice">
                <p className="chat-hint">Use your Google account to create or reopen your chat thread.</p>
                <a className="chat-google-button" href="/api/user/auth/google?next=%2Fconnect">
                  <span className="google-glyph">G</span> Continue with Google
                </a>
                {!googleConfigured && <p className="chat-hint">Google sign-in is not configured on this deployment yet.</p>}
              </div>
            ) : <>
            <label className="visually-hidden" htmlFor="chat-username">Username</label>
            <input
              id="chat-username"
              name="username"
              type="text"
              placeholder="Username"
              value={authForm.username}
              onChange={e => setAuthForm({ ...authForm, username: e.target.value })}
              required
              autoComplete="username"
            />
            <div style={{ position: 'relative' }}>
              <label className="visually-hidden" htmlFor="chat-password">Password</label>
              <input
                id="chat-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={authForm.password}
                onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                required
                autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(s => !s)}
                style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', padding: '6px' }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className="chat-auth-row">
              <label>
                <input
                  id="chat-remember"
                  name="remember"
                  type="checkbox"
                  checked={authForm.remember}
                  onChange={e => setAuthForm({ ...authForm, remember: e.target.checked })}
                />
                Remember me for 30 days
              </label>
              <span className="chat-hint" style={{ font: '600 11px "Space Grotesk", sans-serif' }}>
                {authMode === 'login' ? 'New here?' : 'Already have an account?'}
                <button
                  type="button"
                  onClick={() => { setAuthMode(m => m === 'login' ? 'register' : 'login'); setAuthError(''); }}
                  style={{ color: 'var(--accent)', fontWeight: 800, marginLeft: '6px' }}
                >
                  {authMode === 'login' ? 'Create one' : 'Log in'}
                </button>
              </span>
            </div>
            <div className="chat-auth-actions">
              <button type="submit" className="button">
                {authMode === 'login' ? <><MessageCircle size={13} /> Log in to chat</> : <><MessageCircle size={13} /> Create account &amp; chat</>}
              </button>
            </div>
            </>}
          </form>
        ) : (
          <>
            <div className="chat-body" ref={chatBodyRef}>
              {messages.length === 0 && (
                <div className="chat-empty-state">
                  <div className="chat-empty-icon"><MessageCircle size={20} /></div>
                  <strong>Start the conversation</strong>
                  <p>Ask about a project, collaboration, or anything you found interesting here.</p>
                  <div className="chat-prompts">
                    {['Tell me about your latest project', 'I have a collaboration idea', 'Can we talk about a development idea?'].map((prompt) => (
                      <button type="button" key={prompt} onClick={() => usePrompt(prompt)}>{prompt}</button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, idx) => (
                <div className={`chat-bubble ${m.from === 'user' ? 'me' : 'them'}`} key={idx}>
                  {m.text}
                  <span className="chat-time">
                    {m.from === 'admin' ? 'DRJ · ' : ''}
                    {new Date(m.at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
            <form className="chat-form" onSubmit={handleSend}>
              <label className="visually-hidden" htmlFor="chat-message">Message</label>
              <input
                id="chat-message"
                name="message"
                type="text"
                placeholder="Type a message…"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                maxLength={2000}
              />
              <button type="submit" disabled={sending || !draft.trim()}>
                <Send size={13} /> {sending ? 'Sending…' : 'Send'}
              </button>
            </form>
            {authError && <div className="chat-send-error" role="alert">{authError}</div>}
            <div className="chat-form-meta"><span>Messages are private and saved to your thread.</span><span>{draft.length}/2000</span></div>
          </>
        )}
      </div>
      )}

      {/* ─── Direct Contact — redesigned, login-style ─── */}
      <section className="connect-direct" aria-labelledby="connect-subhead">
        <div className="connect-direct-head">
          <span className="connect-direct-icon"><Radio size={18} /></span>
          <div>
            <h3 id="connect-subhead">Choose how to reach me</h3>
            <p>Email is best for opportunities and project details. Social links are there for a quick hello.</p>
          </div>
        </div>

        <div className="connect-direct-grid">
          <a
            className="connect-direct-card"
            href={(() => links.find((l) => l.url && l.url.startsWith('mailto:'))?.url || '#')()}
            aria-label="Send an email"
          >
            <Mail size={16} />
            <span className="connect-direct-card-title">Send an email</span>
            <span className="connect-direct-card-sub">Opens your mail client</span>
          </a>
          <button className="connect-direct-card" type="button" onClick={copyEmail}>
            {emailCopied ? <Check size={16} /> : <Copy size={16} />}
            <span className="connect-direct-card-title">{emailCopied ? 'Email copied' : 'Copy email'}</span>
            <span className="connect-direct-card-sub">Paste it anywhere</span>
          </button>
        </div>

        <div className="connect-socials-grid" aria-label="Social links">
          {links.filter(({ url }) => url && !url.startsWith('mailto:')).map(({ name, url, icon }) => {
            const descriptions = {
              GitHub: 'See my code and open-source work.',
              LinkedIn: 'Connect about professional opportunities.',
              Linkedin: 'Connect about professional opportunities.',
              'X / Twitter': 'Follow along and send a quick note.',
              Instagram: 'A more casual way to say hello.',
              Reddit: 'Find me in the community.'
            };
            return (
              <a
                className="connect-social-card"
                href={url}
                aria-label={name}
                title={name}
                key={name || url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="connect-social-card-icon"><Icon name={icon} size={16} /></span>
                <span className="connect-social-card-copy">
                  <strong>{name}</strong>
                  <span>{descriptions[name] || 'Connect and follow my updates.'}</span>
                </span>
                <span className="connect-social-card-arrow" aria-hidden="true">↗</span>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
