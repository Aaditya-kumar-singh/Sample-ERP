import { useNavigate, useLocation } from 'react-router-dom';

const HomeIcon = () => (<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>);
const AboutIcon = () => (<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>);
const AcademicsIcon = () => (<svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>);
const AdmissionsIcon = () => (<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>);
const GalleryIcon = () => (<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>);

const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/about', label: 'About', icon: <AboutIcon /> },
    { path: '/academics', label: 'Academics', icon: <AcademicsIcon /> },
    { path: '/admissions', label: 'Admission', icon: <AdmissionsIcon /> },
    { path: '/gallery', label: 'Gallery', icon: <GalleryIcon /> },
];

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">
            {navItems.map(item => {
                const active = location.pathname === item.path;
                return (
                    <button
                        key={item.path}
                        id={`bottom-nav-${item.label.toLowerCase()}`}
                        className={`bottom-nav__item${active ? ' active' : ''}`}
                        onClick={() => navigate(item.path)}
                        aria-label={item.label}
                        aria-current={active ? 'page' : undefined}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                );
            })}
        </nav>
    );
}
