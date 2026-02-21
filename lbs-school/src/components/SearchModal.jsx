import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ALL_CONTENT = [
    { icon: '🏠', title: 'Home', desc: 'Welcome page, hero, announcements, toppers', page: 'Home', path: '/' },
    { icon: '📣', title: 'Latest News & Events', desc: 'Science Fair, Sports Championship, Cultural Fest', page: 'Home', path: '/' },
    { icon: '🏆', title: 'School Toppers 2024', desc: 'Board results, merit list, 99%+ achievers', page: 'Home', path: '/' },
    { icon: '🌟', title: 'Why Choose LBS', desc: 'CBSE accredited, expert faculty, holistic development', page: 'Home', path: '/' },
    { icon: '📖', title: 'About LBS School', desc: 'Heritage, mission, vision, 34 years of excellence', page: 'About', path: '/about' },
    { icon: '👩‍🏫', title: 'Leadership & Faculty', desc: 'Principal, vice principal, HODs, academic leaders', page: 'About', path: '/about' },
    { icon: '🏅', title: 'Awards & Accolades', desc: 'State, national, and international recognitions', page: 'About', path: '/about' },
    { icon: '📅', title: 'School Milestones', desc: '1990–2024 history, CBSE affiliation, campus expansion', page: 'About', path: '/about' },
    { icon: '🎓', title: 'Curriculum Overview', desc: 'Pre-Primary, Primary, Middle, Senior Secondary wings', page: 'Academics', path: '/academics' },
    { icon: '📐', title: 'Academic Departments', desc: 'Science, Commerce, Humanities, Sports, STEM, Tech', page: 'Academics', path: '/academics' },
    { icon: '⚽', title: 'Extra-Curricular Activities', desc: '40+ clubs: robotics, football, music, drama, chess', page: 'Academics', path: '/academics' },
    { icon: '📅', title: 'Academic Calendar', desc: 'Exam dates, holidays, events schedule 2024-25', page: 'Academics', path: '/academics' },
    { icon: '📝', title: 'Admissions 2024–25', desc: 'How to apply, steps, seats, requirements', page: 'Admissions', path: '/admissions' },
    { icon: '💰', title: 'Fee Structure', desc: 'Quarterly fees: Pre-Primary to Senior Secondary', page: 'Admissions', path: '/admissions' },
    { icon: '🧮', title: 'Fee Calculator', desc: 'Calculate total fees with siblings discount', page: 'Admissions', path: '/admissions' },
    { icon: '📋', title: 'Document Checklist', desc: 'Birth cert, Aadhar, photos, report card, proof of residence', page: 'Admissions', path: '/admissions' },
    { icon: '❓', title: 'Admission FAQs', desc: 'Age criteria, transport, scholarship, uniform, CBSE', page: 'Admissions', path: '/admissions' },
    { icon: '🖼️', title: 'Photo Gallery', desc: 'Sports day, science fair, cultural fest, events', page: 'Gallery', path: '/gallery' },
    { icon: '📅', title: 'Upcoming Events', desc: 'Annual day, cricket tournament, olympiads, camps', page: 'Gallery', path: '/gallery' },
    { icon: '🚌', title: 'Transport & Routes', desc: 'GPS-tracked buses, 30+ city routes, safe travel', page: 'Admissions', path: '/admissions' },
    { icon: '🎖️', title: 'Scholarships', desc: 'Merit-based and need-based scholarship programs', page: 'Admissions', path: '/admissions' },
];

export default function SearchModal({ onClose }) {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
        const handleKey = e => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const results = query.trim().length < 2
        ? ALL_CONTENT.slice(0, 8)
        : ALL_CONTENT.filter(c =>
            c.title.toLowerCase().includes(query.toLowerCase()) ||
            c.desc.toLowerCase().includes(query.toLowerCase())
        );

    const go = (path) => { navigate(path); onClose(); };

    return (
        <div className="search-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="search-box" role="dialog" aria-modal="true" aria-label="Search">
                <div className="search-box__top">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        ref={inputRef}
                        className="search-input"
                        placeholder="Search pages, topics, departments…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        aria-label="Search"
                    />
                    <button className="search-close" onClick={onClose} aria-label="Close search">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="search-results">
                    {results.length === 0 ? (
                        <div className="search-empty">
                            <div>🔍</div>
                            <p>No results for "{query}"</p>
                        </div>
                    ) : (
                        <>
                            {query.trim().length < 2 && (
                                <div style={{ padding: '10px 20px 0', fontSize: '11px', fontWeight: 700, color: 'var(--gray-500)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                                    Quick Links
                                </div>
                            )}
                            {results.map((r, i) => (
                                <div key={i} id={`search-result-${i}`} className="search-result-item" onClick={() => go(r.path)}>
                                    <div className="search-result-icon">{r.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <h4>{r.title}</h4>
                                        <p>{r.desc}</p>
                                    </div>
                                    <span className="search-result-page">{r.page}</span>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                <div style={{ padding: '10px 20px', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--gray-400)' }}>
                    <span>↵ to open</span><span>Esc to close</span><span>↑↓ to navigate</span>
                </div>
            </div>
        </div>
    );
}
