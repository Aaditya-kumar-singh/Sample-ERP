import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GradCap = () => (
    <svg viewBox="0 0 24 24" fill="#1a56db" style={{ width: '32px', height: '32px' }}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PORTALS = [
    {
        key: 'parent',
        label: 'Parent Portal',
        icon: '👨‍👩‍👧',
        desc: 'Track attendance, notices, events & admission status for your child.',
        color: '#1a56db',
        bg: '#dbeafe',
        redirect: '/parent-portal',
    },
    {
        key: 'student',
        label: 'Student Portal',
        icon: '🎓',
        desc: 'View your profile, upcoming events and school announcements.',
        color: '#059669',
        bg: '#dcfce7',
        redirect: '/student-portal',
    },
];

export default function Login() {
    const [portal, setPortal] = useState('parent');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const selected = PORTALS.find(p => p.key === portal);

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        if (!email.trim()) { setError('Email is required.'); return; }
        if (!password.trim()) { setError('Password is required.'); return; }

        setLoading(true);
        try {
            const user = await login(email.trim(), password);
            navigate(selected.redirect, { replace: true });
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Left Panel */}
            <div className="login-left">
                <div className="login-left__inner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <GradCap />
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--gray-900)' }}>LBS Public School</div>
                            <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>School Excellence Since 1990</div>
                        </div>
                    </div>

                    <h1 style={{ fontSize: 'clamp(24px,4vw,32px)', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.2, marginBottom: '8px' }}>
                        Welcome Back 👋
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginBottom: '28px' }}>
                        Sign in to access your portal and stay connected with LBS.
                    </p>

                    {/* Portal Selector */}
                    <div className="portal-tabs">
                        {PORTALS.map(p => (
                            <button
                                key={p.key}
                                id={`portal-tab-${p.key}`}
                                className={`portal-tab${portal === p.key ? ' active' : ''}`}
                                style={portal === p.key ? { borderColor: p.color, color: p.color, background: p.bg } : {}}
                                onClick={() => { setPortal(p.key); setError(''); }}
                            >
                                <span style={{ fontSize: '20px' }}>{p.icon}</span>
                                <span>{p.label}</span>
                            </button>
                        ))}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginBottom: '24px' }}>{selected.desc}</p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-field">
                            <label htmlFor="login-email">Email Address</label>
                            <input
                                id="login-email"
                                type="email"
                                placeholder={`Enter your ${portal} email`}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="login-password">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="login-password"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    style={{ paddingRight: '44px' }}
                                />
                                <button
                                    type="button"
                                    className="show-pass-btn"
                                    onClick={() => setShowPass(v => !v)}
                                    aria-label={showPass ? 'Hide password' : 'Show password'}
                                >
                                    {showPass ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="login-error">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <button
                            id="login-submit-btn"
                            type="submit"
                            className="login-btn"
                            style={{ background: selected.color }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="login-spinner" />
                            ) : (
                                `Sign in to ${selected.label}`
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <button
                            className="login-back-link"
                            onClick={() => navigate('/')}
                        >
                            ← Back to LBS Website
                        </button>
                    </div>

                    <p style={{ fontSize: '11px', color: 'var(--gray-400)', marginTop: '32px', textAlign: 'center' }}>
                        Trouble signing in? Contact the school office at{' '}
                        <a href="mailto:admin@lbsschool.edu" style={{ color: 'var(--blue)' }}>admin@lbsschool.edu</a>
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="login-right">
                <div className="login-right__content">
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>{selected.icon}</div>
                    <h2>{selected.label}</h2>
                    <p>{selected.desc}</p>
                    <div className="login-feature-list">
                        {portal === 'parent' ? [
                            "📋 Track your child's attendance daily",
                            "📢 Receive latest school notices instantly",
                            "📅 View upcoming events & holidays",
                            "📝 Monitor admission application status",
                            "💰 Check fee schedule & payment info",
                        ] : [
                            '👤 View your student profile & details',
                            '📢 Read school notices & updates',
                            '📅 View events, sports & cultural fests',
                            '🏆 Check your academic highlights',
                            '🔔 Get important announcements',
                        ]}
                        {/* no map needed, just display as list */}
                    </div>
                </div>
            </div>
        </div>
    );
}
