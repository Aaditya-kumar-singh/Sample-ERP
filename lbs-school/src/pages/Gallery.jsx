import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Newsletter from '../components/Newsletter';

const BackIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);
const ClockIcon = () => (<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
const PinIcon = () => (<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
const UsersIcon = () => (<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>);
const ArrowRight = () => (<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const ChevLIcon = () => (<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);
const ChevRIcon = () => (<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>);

const FILTERS = ['All', 'Sports Day', 'Science Fair', 'Cultural Fest', 'Events', 'Academic'];

const photos = [
    { id: 1, emoji: '🏃', bg: 'linear-gradient(135deg,#fef3c7,#fed7aa)', tall: true, cat: 'Sports Day', label: 'Annual Sports Day 2024' },
    { id: 2, emoji: '📚', bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', tall: false, cat: 'Events', label: 'Library Inauguration' },
    { id: 3, emoji: '🎭', bg: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)', tall: false, cat: 'Cultural Fest', label: 'Cultural Night 2024' },
    { id: 4, emoji: '🔬', bg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', tall: false, cat: 'Science Fair', label: 'Science Exhibition' },
    { id: 5, emoji: '🎨', bg: 'linear-gradient(135deg,#fce7f3,#fbcfe8)', tall: true, cat: 'Cultural Fest', label: 'Inter-Class Art Competition' },
    { id: 6, emoji: '📖', bg: 'linear-gradient(135deg,#ecfdf5,#a7f3d0)', tall: false, cat: 'Academic', label: 'Annual Book Fair 2024' },
    { id: 7, emoji: '🏅', bg: 'linear-gradient(135deg,#fef9c3,#fde68a)', tall: false, cat: 'Sports Day', label: 'Medal & Trophy Ceremony' },
    { id: 8, emoji: '🧪', bg: 'linear-gradient(135deg,#e0f2fe,#bae6fd)', tall: false, cat: 'Science Fair', label: 'Robotics & AI Showcase' },
    { id: 9, emoji: '🎸', bg: 'linear-gradient(135deg,#f3e8ff,#c4b5fd)', tall: true, cat: 'Cultural Fest', label: 'School Music Night' },
    { id: 10, emoji: '🏊', bg: 'linear-gradient(135deg,#ecfdf5,#6ee7b7)', tall: false, cat: 'Sports Day', label: 'Inter-House Swimming Gala' },
    { id: 11, emoji: '🤖', bg: 'linear-gradient(135deg,#e0f2fe,#93c5fd)', tall: false, cat: 'Science Fair', label: 'National AI Hackathon 2024' },
    { id: 12, emoji: '🎓', bg: 'linear-gradient(135deg,#fef9c3,#fbbf24)', tall: false, cat: 'Academic', label: 'Graduation Ceremony 2024' },
];

const upEvents = [
    { id: 1, month: 'FEB', day: '22', title: 'State-Level Science Olympiad', time: '09:00 AM', venue: 'School Auditorium', status: 'open', seats: '60 seats left', tag: 'Academic' },
    { id: 2, month: 'MAR', day: '10', title: 'Annual Day & Prize-Giving Ceremony', time: '04:00 PM', venue: 'Main Ground', status: 'open', seats: 'Open to all', tag: 'Events' },
    { id: 3, month: 'MAR', day: '20', title: 'Senior Secondary Cultural Fest', time: '10:00 AM', venue: 'Amphitheatre', status: 'open', seats: '120 seats left', tag: 'Cultural' },
    { id: 4, month: 'MAR', day: '28', title: 'Inter-School Cricket Tournament', time: '08:00 AM', venue: 'Sports Ground', status: 'full', seats: 'Fully Booked', tag: 'Sports Day' },
    { id: 5, month: 'APR', day: '05', title: 'Parent-Teacher Conference Q4', time: '09:30 AM', venue: 'Block B Hall', status: 'open', seats: 'By invitation', tag: 'Events' },
    { id: 6, month: 'APR', day: '15', title: 'Summer Reading Camp Registrations', time: 'All Day', venue: 'Library', status: 'open', seats: '80 seats left', tag: 'Academic' },
];

const pastHighlights = [
    { emoji: '🏆', title: 'State Sports Champions 2023', desc: 'Our students won 12 gold medals at the State Inter-School Sports Meet.', bg: 'linear-gradient(135deg,#fef3c7,#fed7aa)' },
    { emoji: '🔬', title: 'National Science Award 2023', desc: 'Team LBS won 1st place at the National STEM Olympiad, Bengaluru.', bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)' },
    { emoji: '🎭', title: 'Regional Heritage Prize 2023', desc: 'LBS Cultural Club placed 1st at the Regional Cultural Heritage Festival.', bg: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)' },
];

/* ── Lightbox Component ── */
function Lightbox({ items, startIndex, onClose }) {
    const [idx, setIdx] = useState(startIndex);
    const total = items.length;
    const item = items[idx];

    const prev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total]);
    const next = useCallback(() => setIdx(i => (i + 1) % total), [total]);

    useEffect(() => {
        const handler = e => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, prev, next]);

    return (
        <div className="lightbox" onClick={e => e.target === e.currentTarget && onClose()}>
            {/* Counter */}
            <div className="lightbox__counter">{idx + 1} / {total}</div>

            {/* Close */}
            <button className="lightbox__close" onClick={onClose} aria-label="Close lightbox">✕</button>

            {/* Prev */}
            <button className="lightbox__prev" onClick={prev} aria-label="Previous photo"><ChevLIcon /></button>

            {/* Image */}
            <div className="lightbox__img" style={{ background: item.bg, width: 'min(500px, 90vw)', height: 'min(500px, 85vh)' }}>
                <span style={{ fontSize: 'min(120px, 20vw)' }}>{item.emoji}</span>
            </div>

            {/* Next */}
            <button className="lightbox__next" onClick={next} aria-label="Next photo"><ChevRIcon /></button>

            {/* Caption */}
            <div className="lightbox__caption">📷 {item.label} &nbsp;·&nbsp; {item.cat}</div>
        </div>
    );
}

export default function Gallery() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [lightbox, setLightbox] = useState(null); // { items: [], index: number }

    const filtered = filter === 'All' ? photos : photos.filter(p => p.cat === filter);

    const openLightbox = (item) => {
        const idx = filtered.findIndex(p => p.id === item.id);
        setLightbox({ items: filtered, index: idx });
    };

    return (
        <>
            {/* Mobile top bar */}
            <header className="top-bar">
                <button id="gallery-back-btn" className="top-bar__back" onClick={() => navigate(-1)} aria-label="Go back"><BackIcon /></button>
                <span className="top-bar__title">Gallery &amp; Events</span>
                <div style={{ width: 36 }} />
            </header>

            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg,#0f2460,#1a56db)', padding: '40px 20px 56px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)', marginBottom: '8px' }}>MEMORIES & MOMENTS</p>
                <h1 style={{ color: 'white', fontSize: 'clamp(24px,5vw,42px)', fontWeight: 800, lineHeight: 1.2, marginBottom: '10px' }}>Gallery &amp; Events</h1>
                <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>Celebrating achievements, milestones, and the vibrant life at LBS Public School.</p>
            </div>

            {/* Past Highlights */}
            <section className="section" style={{ background: 'white', paddingBottom: '0' }}>
                <div className="section-inner">
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '6px' }}>🏆 RECENT ACHIEVEMENTS</p>
                        <h2 className="section-title">Past Highlights</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px', marginBottom: '32px' }}>
                        {pastHighlights.map((h, i) => (
                            <div key={i} style={{ background: h.bg, borderRadius: 'var(--r-xl)', padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ fontSize: '36px', flexShrink: 0 }}>{h.emoji}</div>
                                <div>
                                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '6px' }}>{h.title}</h4>
                                    <p style={{ fontSize: '13px', color: 'var(--gray-700)', lineHeight: '1.6' }}>{h.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filters */}
            <nav className="gallery-filter" role="tablist" aria-label="Gallery filters">
                {FILTERS.map(f => (
                    <button key={f}
                        id={`filter-${f.replace(/\s+/g, '-').toLowerCase()}`}
                        role="tab" aria-selected={filter === f}
                        className={`filter-btn${filter === f ? ' active' : ''}`}
                        onClick={() => setFilter(f)}>
                        {f}
                    </button>
                ))}
            </nav>

            {/* Photo count */}
            <div style={{ background: 'white', padding: '0 20px 8px', maxWidth: 'var(--container)', margin: '0 auto' }}>
                <p style={{ fontSize: '12px', color: 'var(--gray-500)', fontWeight: 600 }}>
                    {filtered.length} photo{filtered.length !== 1 ? 's' : ''} {filter !== 'All' ? `in "${filter}"` : ''}
                    &nbsp;·&nbsp; <span style={{ color: 'var(--blue)' }}>Click any photo to expand</span>
                </p>
            </div>

            {/* Masonry Grid */}
            <div className="gallery-section">
                <div className="gallery-inner">
                    <div className="gallery-masonry">
                        {filtered.map(item => (
                            <div key={item.id} id={`gallery-item-${item.id}`}
                                className={`gallery-item${item.tall ? ' tall' : ''}`}
                                role="button" tabIndex={0} aria-label={`Open ${item.label}`}
                                title={`${item.label} — click to expand`}
                                onClick={() => openLightbox(item)}
                                onKeyDown={e => e.key === 'Enter' && openLightbox(item)}>
                                <div className="gallery-img" style={{ background: item.bg, height: item.tall ? '100%' : 'auto', minHeight: item.tall ? '300px' : '150px', position: 'relative' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '64px' }}>{item.emoji}</div>
                                    {/* Hover zoom indicator */}
                                    <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,.4)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', opacity: 0, transition: 'opacity .2s', pointerEvents: 'none' }} className="zoom-icon">⤢</div>
                                </div>
                                <div className="gallery-overlay">
                                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(6px)', borderRadius: '8px', padding: '8px 12px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{item.label}</div>
                                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.7)', marginTop: '2px' }}>{item.cat}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-400)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📷</div>
                            <p style={{ fontWeight: 600 }}>No photos in this category yet.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="divider" />

            {/* Upcoming Events */}
            <div className="events-section">
                <div className="events-inner">
                    <div style={{ marginBottom: '24px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '8px' }}>WHAT'S COMING</p>
                        <div className="section-header" style={{ marginBottom: '0' }}>
                            <h2 className="section-title">Upcoming Events</h2>
                            <button id="see-all-events-btn" className="section-link">Export Calendar <ArrowRight /></button>
                        </div>
                    </div>
                    <div className="events-grid">
                        {upEvents.map(ev => (
                            <div key={ev.id} id={`event-card-${ev.id}`} className="event-card">
                                <div className="event-card__date">
                                    <div className="event-card__date-month">{ev.month}</div>
                                    <div className="event-card__date-day">{ev.day}</div>
                                </div>
                                <div className="event-card__info" style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                                        <h4 style={{ fontSize: '14px', flex: 1 }}>{ev.title}</h4>
                                        <span style={{ fontSize: '10px', fontWeight: 700, background: 'var(--blue-lighter)', color: 'var(--blue)', padding: '2px 8px', borderRadius: '99px', whiteSpace: 'nowrap' }}>{ev.tag}</span>
                                    </div>
                                    <div className="event-card__meta">
                                        <ClockIcon /> {ev.time} &nbsp;·&nbsp; <PinIcon /> {ev.venue}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: ev.status === 'full' ? '#ef4444' : 'var(--gray-500)' }}>
                                            <UsersIcon /> {ev.seats}
                                        </div>
                                        {ev.status === 'open'
                                            ? <button id={`register-event-${ev.id}`} className="btn-register">Register</button>
                                            : <button className="btn-register btn-register--full" disabled>Full</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Newsletter */}
            <Newsletter />

            {/* CTA Banner */}
            <div className="cta-banner" style={{ padding: '48px 20px' }}>
                <div className="cta-banner__inner">
                    <h2>Want to be Part of These Moments?</h2>
                    <p>Join the LBS community and give your child a school life filled with growth, achievement, and unforgettable memories.</p>
                    <div className="cta-banner__btns">
                        <button id="gallery-apply-btn" className="btn-primary btn-primary--white" onClick={() => navigate('/admissions')}>
                            Apply Now <ArrowRight />
                        </button>
                        <button className="btn-outline" style={{ borderColor: 'rgba(255,255,255,.5)', color: 'white' }} onClick={() => navigate('/about')}>
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <Lightbox
                    items={lightbox.items}
                    startIndex={lightbox.index}
                    onClose={() => setLightbox(null)}
                />
            )}
        </>
    );
}
