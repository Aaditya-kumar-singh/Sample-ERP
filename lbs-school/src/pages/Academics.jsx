import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BackIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);
const ChevLeft = () => (<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);
const ChevRight = () => (<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>);
const ArrowRight = () => (<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function buildCal(year, month) {
    const first = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const offset = (first + 6) % 7;
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
}

const curricula = [
    { id: 'nursery', title: 'Pre-Primary Wing', desc: 'Play-based learning builds foundational literacy, numeracy, motor skills, and emotional intelligence in a nurturing environment.', bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', emoji: '🌱', grades: 'Nursery – KG' },
    { id: 'primary', title: 'Primary Wing', desc: 'Structured academic learning fosters problem-solving, creativity, and critical thinking through a CBSE-aligned curriculum.', bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', emoji: '✏️', grades: 'Class I – V' },
    { id: 'middle', title: 'Middle Wing', desc: 'Deepening subject knowledge with project-based modules, language enrichment, and early vocational exploration programs.', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', emoji: '📐', grades: 'Class VI – VIII' },
    { id: 'senior', title: 'Senior Secondary', desc: 'Specialised Science, Commerce, and Humanities streams with expert guidance for board exams, entrance tests, and career planning.', bg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', emoji: '🎓', grades: 'Class IX – XII' },
];

const extracurricular = [
    { icon: '⚽', name: 'Football' }, { icon: '🏊', name: 'Swimming' },
    { icon: '🎸', name: 'Music' }, { icon: '🎨', name: 'Fine Arts' },
    { icon: '🤸', name: 'Gymnastics' }, { icon: '♟️', name: 'Chess' },
    { icon: '💻', name: 'Coding' }, { icon: '🎭', name: 'Drama' },
    { icon: '📸', name: 'Photography' }, { icon: '🔬', name: 'Robotics' },
    { icon: '🏏', name: 'Cricket' }, { icon: '🌿', name: 'Eco Club' },
];

const departments = [
    { id: 'science', icon: '🔬', title: 'Science', desc: 'Physics, Chemistry, Biology & Math streams with world-class labs' },
    { id: 'commerce', icon: '🏦', title: 'Commerce', desc: 'Accountancy, BST, Economics, and Math / Informatics Practices' },
    { id: 'humanities', icon: '🎨', title: 'Humanities', desc: 'History, Pol Science, Psychology, Sociology, Fine Arts & more' },
    { id: 'sports', icon: '⚽', title: 'Sports', desc: 'Professional coaching across 10+ disciplines by seasoned coaches' },
    { id: 'stem', icon: '🤖', title: 'STEM Lab', desc: 'Dedicated robotics, coding, and innovation lab open all year round' },
    { id: 'tech', icon: '💻', title: 'Technology', desc: 'Computer Science, IT, and Artificial Intelligence elective streams' },
    { id: 'arts', icon: '🎭', title: 'Performing Arts', desc: 'Drama, dance, music bands, and a 400-seat performing arts hall' },
    { id: 'library', icon: '📚', title: 'Library', desc: '10,000+ titles, digital databases, and quiet study spaces' },
];

const events = [
    { month: 'FEB', day: '24', title: "Science Exhibition", desc: 'Grades IX-XII present capstone projects' },
    { month: 'MAR', day: '10', title: 'Annual Day & Prize-Giving', desc: 'Full-day celebration event for all' },
    { month: 'MAR', day: '25', title: 'Pre-Board Examinations Start', desc: 'Grades X & XII pre-board schedule' },
    { month: 'APR', day: '05', title: 'Summer Camp Registration', desc: 'Online registration opens for 2024' },
];

const topperAcademics = [
    { id: 1, name: 'Aarav Singh', subject: 'Class XII – Science', score: '99.2%', rank: 1, bg: '#f59e0b' },
    { id: 2, name: 'Meera Gupta', subject: 'Class XII – Commerce', score: '98.8%', rank: 2, bg: '#9ca3af' },
    { id: 3, name: 'Rohan Desai', subject: 'Class X – Boards', score: '98.4%', rank: 3, bg: '#b45309' },
];

export default function Academics() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('curriculum');
    const today = new Date();
    const [calDate, setCalDate] = useState({ year: today.getFullYear(), month: today.getMonth() });
    const calDays = buildCal(calDate.year, calDate.month);
    const isToday = d => d === today.getDate() && calDate.month === today.getMonth() && calDate.year === today.getFullYear();
    const eventDays = [24, 10, 25, 5];

    const prevMonth = () => setCalDate(p => p.month === 0 ? { year: p.year - 1, month: 11 } : { year: p.year, month: p.month - 1 });
    const nextMonth = () => setCalDate(p => p.month === 11 ? { year: p.year + 1, month: 0 } : { year: p.year, month: p.month + 1 });

    return (
        <>
            {/* Mobile top bar */}
            <header className="top-bar">
                <button id="academics-back-btn" className="top-bar__back" onClick={() => navigate(-1)} aria-label="Go back"><BackIcon /></button>
                <span className="top-bar__title">Academics</span>
                <div style={{ width: 36 }} />
            </header>

            {/* Tabs */}
            <nav className="tab-bar" role="tablist">
                {[['curriculum', 'Curriculum'], ['calendar', 'Calendar'], ['departments', 'Departments'], ['activities', 'Activities']].map(([id, label]) => (
                    <button key={id} id={`tab-${id}`} role="tab" aria-selected={activeTab === id}
                        className={`tab-btn${activeTab === id ? ' active' : ''}`}
                        onClick={() => setActiveTab(id)}>
                        {label}
                    </button>
                ))}
            </nav>

            {/* ── CURRICULUM ── */}
            {activeTab === 'curriculum' && (
                <>
                    <section className="section" style={{ background: 'white' }}>
                        <div className="section-inner">
                            <div style={{ marginBottom: '28px' }}>
                                <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '6px' }}>LEARNING FRAMEWORK</p>
                                <h2 className="section-title">Our Curriculum</h2>
                                <p style={{ fontSize: '15px', color: 'var(--gray-600)', marginTop: '10px', maxWidth: '640px', lineHeight: '1.7' }}>
                                    CBSE-aligned and globally benchmarked, our curriculum goes beyond textbooks to cultivate curious, well-rounded individuals.
                                </p>
                            </div>
                            <div className="curriculum-cards">
                                {curricula.map(c => (
                                    <div key={c.id} id={`curriculum-${c.id}`} className="curriculum-card">
                                        <div className="curriculum-card__content">
                                            <div style={{ display: 'inline-block', background: 'var(--blue-lighter)', color: 'var(--blue)', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', marginBottom: '8px', letterSpacing: '.05em' }}>{c.grades}</div>
                                            <h3>{c.title}</h3>
                                            <p>{c.desc}</p>
                                            <div className="curriculum-card__link">Explore Syllabus <ArrowRight /></div>
                                        </div>
                                        <div className="curriculum-card__img">
                                            <div style={{ width: '100%', height: '100%', minHeight: '120px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px' }}>{c.emoji}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Board Toppers in Academic Tab */}
                    <section className="section" style={{ background: 'var(--gray-50)' }}>
                        <div className="section-inner">
                            <div className="section-header">
                                <div>
                                    <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '6px' }}>🏆 BOARD RESULTS 2024</p>
                                    <h2 className="section-title">School Toppers</h2>
                                </div>
                            </div>
                            <div className="topper-grid">
                                {topperAcademics.map(t => (
                                    <div key={t.id} className="topper-card">
                                        <div className="topper-rank" style={{ background: t.bg }}>#{t.rank}</div>
                                        <div style={{ flex: 1, marginLeft: '4px' }}>
                                            <div className="topper-card__info"><h4>{t.name}</h4><p>{t.subject}</p></div>
                                        </div>
                                        <div className="topper-score">{t.score}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '20px', background: 'var(--blue)', borderRadius: 'var(--r-xl)', padding: '20px 24px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                                <div>
                                    <div style={{ fontSize: '22px', fontWeight: 800 }}>100% Pass Rate</div>
                                    <div style={{ fontSize: '13px', opacity: .8, marginTop: '2px' }}>For the 10th consecutive year in CBSE Board Examinations</div>
                                </div>
                                <button className="btn-primary btn-primary--white" style={{ flexShrink: 0 }}>View Full Results <ArrowRight /></button>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* ── CALENDAR ── */}
            {activeTab === 'calendar' && (
                <section className="section" style={{ background: 'white' }}>
                    <div className="section-inner">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                            <div style={{ flex: '1', minWidth: '280px' }}>
                                <h2 className="section-title" style={{ marginBottom: '20px' }}>Academic Calendar</h2>
                                <div className="cal-nav">
                                    <button id="cal-prev-btn" className="cal-arrow" onClick={prevMonth} aria-label="Previous month"><ChevLeft /></button>
                                    <div className="cal-month">{MONTHS[calDate.month]} {calDate.year}</div>
                                    <button id="cal-next-btn" className="cal-arrow" onClick={nextMonth} aria-label="Next month"><ChevRight /></button>
                                </div>
                                <div className="cal-grid" role="grid">
                                    {DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}
                                    {calDays.map((d, i) => (
                                        <div key={i} className={['cal-day', !d ? 'cal-day--empty' : '', d && isToday(d) ? 'cal-day--today' : '', d && eventDays.includes(d) ? 'cal-day--event' : ''].join(' ').trim()}>{d || ''}</div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ flex: '1', minWidth: '280px' }}>
                                <h2 className="section-title" style={{ marginBottom: '20px' }}>Upcoming Events</h2>
                                <div className="event-label">• Red dots mark event days</div>
                                {events.map((ev, i) => (
                                    <div key={i} className="event-item">
                                        <div className="event-badge"><div className="event-badge__month">{ev.month}</div><div className="event-badge__day">{ev.day}</div></div>
                                        <div className="event-item__info"><h4>{ev.title}</h4><p>{ev.desc}</p></div>
                                    </div>
                                ))}
                                <div style={{ marginTop: '20px', background: 'var(--blue-lighter)', borderRadius: 'var(--r-lg)', padding: '16px', border: '1px solid var(--blue-light)' }}>
                                    <p style={{ fontSize: '13px', color: 'var(--gray-700)', fontWeight: 600, marginBottom: '8px' }}>📅 Academic Year 2024–25</p>
                                    {[['Academic year opens', 'Apr 1, 2024'], ['Mid-Term Exams', 'Sep 15, 2024'], ['Winter Break', 'Dec 25 – Jan 5'], ['Final Exams (X & XII)', 'Feb 15, 2025'], ['Summer Holidays', 'May 1 – Jun 15']].map(([lbl, dt]) => (
                                        <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray-600)', padding: '5px 0', borderBottom: '1px solid var(--blue-light)' }}>
                                            <span>{lbl}</span><span style={{ fontWeight: 600 }}>{dt}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── DEPARTMENTS ── */}
            {activeTab === 'departments' && (
                <section className="section" style={{ background: 'white' }}>
                    <div className="section-inner">
                        <div style={{ marginBottom: '28px' }}>
                            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '6px' }}>ACADEMIC DIVISIONS</p>
                            <h2 className="section-title">Our Departments</h2>
                            <p style={{ fontSize: '15px', color: 'var(--gray-600)', marginTop: '10px', maxWidth: '600px', lineHeight: '1.7' }}>
                                Each department is led by expert educators and supported by world-class facilities, ensuring students receive the best possible learning experience.
                            </p>
                        </div>
                        <div className="dept-grid">
                            {departments.map(d => (
                                <div key={d.id} id={`dept-${d.id}`} className="dept-card">
                                    <div className="dept-card__icon">{d.icon}</div>
                                    <h3>{d.title}</h3>
                                    <p>{d.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── ACTIVITIES ── */}
            {activeTab === 'activities' && (
                <>
                    <section className="section" style={{ background: 'white' }}>
                        <div className="section-inner">
                            <div style={{ marginBottom: '28px' }}>
                                <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '6px' }}>BEYOND TEXTBOOKS</p>
                                <h2 className="section-title">Extra-Curricular Activities</h2>
                                <p style={{ fontSize: '15px', color: 'var(--gray-600)', marginTop: '10px', maxWidth: '600px', lineHeight: '1.7' }}>
                                    With 40+ clubs and activities, every student finds their passion at LBS. Co-curriculars are integral to our holistic development philosophy.
                                </p>
                            </div>
                            <div className="extra-grid">
                                {extracurricular.map(e => (
                                    <div key={e.name} id={`activity-${e.name.toLowerCase().replace(/\s/g, '-')}`} className="extra-item">
                                        <div className="extra-item__icon">{e.icon}</div>
                                        <div className="extra-item__name">{e.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className="section" style={{ background: 'var(--gray-50)' }}>
                        <div className="section-inner">
                            <h2 className="section-title" style={{ marginBottom: '20px' }}>Achievements in 2024</h2>
                            <div className="achievement-grid">
                                {[['🥇', '12', 'National Level Medals'], ['🏆', '34', 'State Championships'], ['💻', '8', 'National Hackathon Wins'], ['🎭', '5', 'Cultural Competition Trophies']].map(([icon, val, lbl]) => (
                                    <div key={lbl} className="achievement-card">
                                        <div className="achievement-card__icon">{icon}</div>
                                        <div className="achievement-card__val">{val}</div>
                                        <div className="achievement-card__label">{lbl}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    );
}
