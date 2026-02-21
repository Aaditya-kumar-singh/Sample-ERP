import { useNavigate, useLocation } from 'react-router-dom';

const GradCap = () => (
    <svg viewBox="0 0 24 24" fill="white" style={{ width: '20px', height: '20px' }}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/academics', label: 'Academics' },
    { path: '/features', label: 'Features' },
    { path: '/admissions', label: 'Admission' },
    { path: '/gallery', label: 'Gallery' },
];

export default function Navbar({ onSearch, onToggleDark, isDark, onNotices }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="navbar__inner">
                {/* Logo */}
                <div className="navbar__logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <div className="navbar__logo-icon"><GradCap /></div>
                    <div className="navbar__brand">
                        <strong>LBS Public</strong>
                        <span>School Excellence</span>
                    </div>
                </div>

                {/* Nav links */}
                <div className="navbar__links">
                    {navLinks.map(link => (
                        <button
                            key={link.path}
                            id={`nav-${link.label.toLowerCase()}`}
                            className={`nav-link${location.pathname === link.path ? ' active' : ''}`}
                            onClick={() => navigate(link.path)}
                            aria-current={location.pathname === link.path ? 'page' : undefined}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="navbar__actions">
                    {/* Notice Board */}
                    <button id="navbar-notice-btn" className="icon-btn" onClick={onNotices} aria-label="Notice board" title="Notice Board">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>

                    {/* Search */}
                    <button id="navbar-search-btn" className="icon-btn" onClick={onSearch} aria-label="Search" title="Search (/)">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>

                    {/* Dark Mode Toggle */}
                    <button id="dark-mode-toggle" className="dark-toggle" onClick={onToggleDark} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} title="Toggle dark mode">
                        {isDark ? (
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>

                    <button id="navbar-contact-btn" className="btn-contact" onClick={() => navigate('/admissions')}>Enquire</button>
                </div>
            </div>
        </nav>
    );
}
