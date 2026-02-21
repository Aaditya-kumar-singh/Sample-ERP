import { useNavigate } from 'react-router-dom';
import Newsletter from '../components/Newsletter';

const CalIcon = () => (<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>);
const ArrowRight = () => (<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const CheckIcon = () => (<svg viewBox="0 0 24 24" width="10" height="10" stroke="white" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
const GradCap = () => (<svg viewBox="0 0 24 24" fill="white" style={{ width: '20px', height: '20px' }}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const SearchIcon = () => (<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const MenuIcon = () => (<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>);

const news = [
    { id: 1, date: 'OCT 15, 2024', title: 'Annual Science Innovation Fair 2024', desc: 'Showcasing the brightest minds and innovative projects from our senior students.', bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', emoji: '🔬', tag: 'Science' },
    { id: 2, date: 'NOV 02, 2024', title: 'Inter-School Sports Championship', desc: 'Join us in competing for the state-level sports title this November.', bg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', emoji: '🏆', tag: 'Sports' },
    { id: 3, date: 'NOV 18, 2024', title: 'Cultural Heritage Fest 2024', desc: 'A vibrant celebration of art, music, and culture from around the world.', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', emoji: '🎭', tag: 'Cultural' },
];

const whyItems = [
    { id: 'accredited', icon: '🏅', bg: '#dbeafe', title: 'CBSE Accredited', desc: 'Affiliated school under CBSE with consistent top-tier academic performance.' },
    { id: 'faculty', icon: '👩‍🏫', bg: '#dcfce7', title: 'Expert Faculty', desc: 'Over 150 qualified and experienced educators dedicated to student success.' },
    { id: 'holistic', icon: '🌱', bg: '#fef3c7', title: 'Holistic Development', desc: 'Balanced focus on academics, arts, sports, and character building.' },
    { id: 'infra', icon: '🏛️', bg: '#f3e8ff', title: 'World-class Campus', desc: 'State-of-the-art labs, library, sports complex and smart classrooms.' },
];

const testimonials = [
    { id: 1, initial: 'A', name: 'Anita Sharma', role: 'Parent of Class X Student', stars: 5, text: "LBS has transformed our daughter into a confident, curious young leader. The teachers genuinely care about every child's growth. We couldn't be prouder!" },
    { id: 2, initial: 'R', name: 'Rajesh Mehta', role: 'Parent of Class VII Student', stars: 5, text: "The balance of academics and extra-curriculars at LBS is unmatched. My son discovered his passion for robotics here. Truly a school that nurtures talent." },
    { id: 3, initial: 'P', name: 'Priya Verma', role: 'Parent of Class XII Graduate', stars: 5, text: "My daughter scored 98% in boards and got into IIT, all thanks to the exceptional faculty and structured guidance at LBS. Forever grateful!" },
];

const toppers = [
    { id: 1, rank: 1, initial: 'A', name: 'Aarav Singh', subject: 'Class XII Science', score: '99.2%', bg: '#f59e0b' },
    { id: 2, rank: 2, initial: 'M', name: 'Meera Gupta', subject: 'Class XII Commerce', score: '98.8%', bg: '#9ca3af' },
    { id: 3, rank: 3, initial: 'R', name: 'Rohan Desai', subject: 'Class X Boards', score: '98.4%', bg: '#b45309' },
    { id: 4, rank: 4, initial: 'N', name: 'Nidhi Agarwal', subject: 'Class XII Science', score: '97.9%', bg: '#1a56db' },
    { id: 5, rank: 5, initial: 'K', name: 'Kabir Joshi', subject: 'Class X Boards', score: '97.5%', bg: '#1a56db' },
    { id: 6, rank: 6, initial: 'S', name: 'Sneha Patel', subject: 'Class XII Arts', score: '97.2%', bg: '#1a56db' },
];

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            {/* Mobile top bar */}
            <header className="top-bar">
                <div className="top-bar__logo">
                    <div className="top-bar__icon"><GradCap /></div>
                    <div className="top-bar__brand"><strong>LBS Public</strong><span>School Excellence</span></div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button id="home-search-btn" className="icon-btn" aria-label="Search"><SearchIcon /></button>
                    <button id="home-menu-btn" className="icon-btn" aria-label="Menu"><MenuIcon /></button>
                </div>
            </header>

            {/* ── HERO ── */}
            <section className="hero" aria-label="Welcome banner">
                <div className="hero__inner">
                    <div className="hero__content">
                        <div className="hero__badge">Est. 1990 · CBSE Affiliated</div>
                        <h1 className="hero__title">Welcome to<br />LBS Public School</h1>
                        <p className="hero__subtitle">"Empowering Future Leaders Since 1990"</p>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                            <button id="hero-explore-btn" className="btn-primary" onClick={() => navigate('/academics')}>
                                Explore Programs <ArrowRight />
                            </button>
                            <button id="hero-admissions-btn" className="btn-primary btn-primary--white" onClick={() => navigate('/admissions')}>
                                Apply Now
                            </button>
                        </div>
                    </div>
                    <div className="hero__stats" aria-label="Key school stats">
                        {[['2,500+', 'Students'], ['150+', 'Faculty'], ['100%', 'Board Results'], ['40+', 'Activities']].map(([v, l]) => (
                            <div key={l} className="hero__stat-item"><div className="hero__stat-val">{v}</div><div className="hero__stat-lbl">{l}</div></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── QUICK ACCESS ── */}
            <div className="quick-access-wrap">
                <div className="quick-access-inner">
                    <div id="parent-portal-card" className="quick-card" role="button" tabIndex={0} onClick={() => navigate('/login')} onKeyDown={e => e.key === 'Enter' && navigate('/login')} style={{ cursor: 'pointer' }}>
                        <div className="quick-card__icon">
                            <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                        <div className="quick-card__text"><strong>Parent Portal</strong><span>Track notices &amp; events</span></div>
                    </div>
                    <div id="student-login-card" className="quick-card" role="button" tabIndex={0} onClick={() => navigate('/login')} onKeyDown={e => e.key === 'Enter' && navigate('/login')} style={{ cursor: 'pointer' }}>
                        <div className="quick-card__icon">
                            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                        <div className="quick-card__text"><strong>Student Login</strong><span>View profile &amp; updates</span></div>
                    </div>
                    <div id="fee-payment-card" className="quick-card" role="button" tabIndex={0} onClick={() => navigate('/admissions')} onKeyDown={e => e.key === 'Enter' && navigate('/admissions')} style={{ cursor: 'pointer' }}>
                        <div className="quick-card__icon">
                            <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                        </div>
                        <div className="quick-card__text"><strong>Fee Structure</strong><span>View class-wise fees</span></div>
                    </div>
                </div>
            </div>

            {/* ── WHY CHOOSE LBS ── */}
            <section className="section why-section">
                <div className="section-inner">
                    <div className="section-header">
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '6px' }}>WHY LBS?</p>
                            <h2 className="section-title">A School That Sets Standards</h2>
                        </div>
                    </div>
                    <div className="why-grid">
                        {whyItems.map(w => (
                            <div key={w.id} id={`why-${w.id}`} className="why-card">
                                <div className="why-card__icon" style={{ background: w.bg }}>{w.icon}</div>
                                <h3>{w.title}</h3>
                                <p>{w.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── NEWS & EVENTS ── */}
            <section className="section news-section">
                <div className="section-inner">
                    <div className="section-header">
                        <h2 className="section-title">Latest News &amp; Events</h2>
                        <button id="see-all-news-btn" className="section-link" onClick={() => navigate('/gallery')}>See All <ArrowRight /></button>
                    </div>
                    <div className="news-grid">
                        {news.map(item => (
                            <div key={item.id} id={`news-card-${item.id}`} className="news-card">
                                <div className="news-card__img">
                                    <div style={{ width: '100%', height: '100%', minHeight: '160px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', position: 'relative' }}>
                                        {item.emoji}
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--blue)', color: 'white', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', letterSpacing: '.06em' }}>{item.tag}</span>
                                    </div>
                                </div>
                                <div className="news-card__body">
                                    <div className="news-card__date"><CalIcon /> {item.date}</div>
                                    <h3 className="news-card__title">{item.title}</h3>
                                    <p className="news-card__desc">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TOPPERS ── */}
            <section className="section" style={{ background: 'var(--gray-50)' }}>
                <div className="section-inner">
                    <div className="section-header">
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '6px' }}>🏆 BOARD RESULTS 2024</p>
                            <h2 className="section-title">School Toppers</h2>
                        </div>
                        <button className="section-link" onClick={() => navigate('/academics')}>View All <ArrowRight /></button>
                    </div>
                    <div className="topper-grid">
                        {toppers.map(t => (
                            <div key={t.id} id={`topper-${t.id}`} className="topper-card">
                                <div className="topper-rank" style={{ background: t.bg }}>#{t.rank}</div>
                                <div style={{ flex: 1 }}>
                                    <div className="topper-card__info">
                                        <h4>{t.name}</h4>
                                        <p>{t.subject}</p>
                                    </div>
                                </div>
                                <div className="topper-score">{t.score}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRINCIPAL ── */}
            <div className="principal-wrap">
                <div className="principal-card">
                    <div className="principal-card__left">
                        <div className="principal-avatar">S<div className="principal-badge"><CheckIcon /></div></div>
                        <div className="principal-name">Dr. Sarah Thompson</div>
                        <div className="principal-role">Principal, LBS Public School</div>
                    </div>
                    <div className="principal-card__right">
                        <p className="principal-quote">
                            At LBS, we believe every child has the potential to lead. Our mission is to nurture their unique talents and prepare
                            them for the global challenges of tomorrow through academic excellence, ethical values, and holistic development.
                            Every student who walks through our doors leaves as a confident, compassionate, and capable young adult.
                        </p>
                        <button id="read-full-message-btn" className="btn-outline" onClick={() => navigate('/about')}>
                            Read Full Message <ArrowRight />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── TESTIMONIALS ── */}
            <div className="testi-section">
                <div className="testi-inner">
                    <p className="testi-label">What Parents Say</p>
                    <h2 className="testi-title">Trusted by Thousands of Families</h2>
                    <div className="testi-grid">
                        {testimonials.map(t => (
                            <div key={t.id} id={`testimonial-${t.id}`} className="testi-card">
                                <div className="testi-stars">{Array(t.stars).fill('★').map((s, i) => <span key={i}>{s}</span>)}</div>
                                <p className="testi-text">"{t.text}"</p>
                                <div className="testi-author">
                                    <div className="testi-avatar">{t.initial}</div>
                                    <div><strong>{t.name}</strong><span>{t.role}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── STATS ── */}
            <div className="stats-bar" role="region" aria-label="School statistics">
                <div className="stats-bar__inner">
                    {[['2,500+', 'Students Enrolled'], ['150+', 'Expert Faculty'], ['100%', 'Board Pass Rate'], ['34+', 'Years of Excellence']].map(([v, l]) => (
                        <div key={l} className="stats-bar__item">
                            <span className="stats-bar__value">{v}</span>
                            <span className="stats-bar__label">{l}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── NEWSLETTER ── */}
            <Newsletter />

            {/* ── CTA BANNER ── */}
            <div className="cta-banner">
                <div className="cta-banner__inner">
                    <h2>Admissions Open for 2024–25</h2>
                    <p>Secure your child's future today. Limited seats available. Join a community of excellence, innovation, and holistic growth.</p>
                    <div className="cta-banner__btns">
                        <button id="cta-apply-btn" className="btn-primary btn-primary--white" onClick={() => navigate('/admissions')}>
                            Apply Now <ArrowRight />
                        </button>
                        <button id="cta-tour-btn" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,.5)', color: 'white' }} onClick={() => navigate('/about')}>
                            Take a Tour
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
