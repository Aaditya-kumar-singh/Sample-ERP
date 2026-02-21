import { useNavigate } from 'react-router-dom';

const BackIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);
const ShareIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>);
const ArrowRight = () => (<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const CheckIcon = () => (<svg viewBox="0 0 24 24" width="10" height="10" stroke="white" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);

const faculty = [
    { id: 'principal', initial: 'E', name: 'Dr. Elena Sterling', role: 'Principal', exp: '22 yrs exp.', bg: 'linear-gradient(135deg,#1a56db,#0f2460)' },
    { id: 'vp', initial: 'R', name: 'Prof. Ramesh Nair', role: 'Vice Principal', exp: '18 yrs exp.', bg: 'linear-gradient(135deg,#0891b2,#0e7490)' },
    { id: 'hod-sci', initial: 'S', name: 'Dr. Sunita Krishnan', role: 'HOD – Science', exp: '15 yrs exp.', bg: 'linear-gradient(135deg,#059669,#047857)' },
    { id: 'hod-math', initial: 'A', name: 'Mr. Anil Bhatt', role: 'HOD – Mathematics', exp: '14 yrs exp.', bg: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
    { id: 'hod-eng', initial: 'P', name: 'Ms. Prachi Sharma', role: 'HOD – English', exp: '12 yrs exp.', bg: 'linear-gradient(135deg,#db2777,#be185d)' },
    { id: 'hod-ss', initial: 'V', name: 'Mr. Vijay Kulkarni', role: 'HOD – Social Sci.', exp: '11 yrs exp.', bg: 'linear-gradient(135deg,#d97706,#b45309)' },
    { id: 'sports', initial: 'K', name: 'Ms. Kiran Bose', role: 'Physical Director', exp: '10 yrs exp.', bg: 'linear-gradient(135deg,#ef4444,#dc2626)' },
    { id: 'arts', initial: 'T', name: 'Mr. Tarun Mehta', role: 'HOD – Arts & Music', exp: '9 yrs exp.', bg: 'linear-gradient(135deg,#0ea5e9,#0284c7)' },
];

const milestones = [
    { year: '1990', title: 'School Founded', desc: 'LBS Public School opens its doors to 200 students in a single campus building.' },
    { year: '1998', title: 'CBSE Affiliation', desc: 'Received official CBSE affiliation, enabling board-level examinations.' },
    { year: '2005', title: 'New Campus Expansion', desc: 'Expanded to 12 acres with state-of-the-art science labs and a sports complex.' },
    { year: '2012', title: 'Smart Classrooms', desc: 'Integrated digital smart boards and e-learning tools across all classrooms.' },
    { year: '2018', title: 'International Exchange', desc: 'Launched student exchange programs with partner schools in UK and Canada.' },
    { year: '2024', title: 'Excellence Award', desc: 'Awarded "Top CBSE School" by the State Education Board for the 5th year.' },
];

const awards = [
    { icon: '🏆', title: 'Best CBSE School Award', year: '2024 – State Education Board' },
    { icon: '🎓', title: 'Academic Excellence Trophy', year: '2023 – District Level' },
    { icon: '⚽', title: 'State Sports Champions', year: '2023 – Inter-School Tournament' },
    { icon: '🔬', title: 'Science Innovation Award', year: '2022 – National STEM Olympiad' },
    { icon: '🎨', title: 'Cultural Heritage Prize', year: '2022 – Regional Competition' },
    { icon: '🌿', title: 'Green School Certification', year: '2021 – Ministry of Environment' },
];

export default function About() {
    const navigate = useNavigate();
    return (
        <>
            {/* Mobile top bar */}
            <header className="top-bar">
                <button id="about-back-btn" className="top-bar__back" onClick={() => navigate(-1)} aria-label="Go back"><BackIcon /></button>
                <span className="top-bar__title">About LBS School</span>
                <button id="about-share-btn" className="icon-btn" aria-label="Share"><ShareIcon /></button>
            </header>

            {/* Hero */}
            <div className="about-hero" role="img" aria-label="LBS School building">
                <div className="about-hero__content">
                    <div className="hero__badge" style={{ marginBottom: '10px' }}>Established 1990 · CBSE Affiliated</div>
                    <h1 style={{ fontSize: 'clamp(26px,5vw,52px)', fontWeight: 800, lineHeight: 1.15, color: 'white', textShadow: '0 2px 12px rgba(0,0,0,.3)', marginBottom: '10px' }}>
                        Nurturing Minds,<br />Building Future Leaders
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,.85)', fontSize: '15px', fontStyle: 'italic' }}>
                        Over three decades of academic excellence, innovation, and holistic development.
                    </p>
                </div>
            </div>

            {/* Achievement numbers */}
            <section className="section" style={{ background: 'white', paddingTop: '48px', paddingBottom: '48px' }}>
                <div className="section-inner">
                    <div className="achievement-grid">
                        {[['🎓', '2,500+', 'Students Enrolled'], ['👩‍🏫', '150+', 'Expert Educators'], ['🏆', '150+', 'Awards Won'], ['📚', '34+', 'Years of Legacy']].map(([icon, val, lbl]) => (
                            <div key={lbl} className="achievement-card">
                                <div className="achievement-card__icon">{icon}</div>
                                <div className="achievement-card__val">{val}</div>
                                <div className="achievement-card__label">{lbl}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* Heritage */}
            <section className="section" style={{ background: 'var(--gray-50)' }}>
                <div className="section-inner">
                    <div style={{ maxWidth: '780px' }}>
                        <div className="heritage-label">Our Heritage</div>
                        <h2 className="section-title" style={{ marginBottom: '16px' }}>Three Decades of Shaping the Future</h2>
                        <p className="heritage-text" style={{ marginBottom: '16px' }}>
                            LBS Public School was founded in 1990 with a singular vision — to provide every child access to quality education that shapes character, sparks curiosity, and builds competence.
                            What began as a modest institution with 200 students has grown into a thriving centre of learning with over 2,500 students and 150 dedicated educators.
                        </p>
                        <p className="heritage-text">
                            Accredited by CBSE and recognized by numerous state and national bodies, LBS continues to pioneer innovative pedagogy
                            while remaining rooted in values of integrity, compassion, and academic rigour.
                        </p>
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* Mission & Vision */}
            <section className="section" style={{ background: 'white' }}>
                <div className="section-inner">
                    <h2 className="section-title" style={{ marginBottom: '20px' }}>Mission &amp; Vision</h2>
                    <div className="mv-grid">
                        <div id="mission-card" className="mv-card">
                            <div className="mv-card__icon">
                                <svg viewBox="0 0 24 24" width="30" height="30" stroke="#1a56db" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
                            </div>
                            <h3>Our Mission</h3>
                            <p>To empower every student with knowledge, skills, and values that enable them to lead meaningful, productive, and compassionate lives in a rapidly changing world.</p>
                        </div>
                        <div id="vision-card" className="mv-card">
                            <div className="mv-card__icon">
                                <svg viewBox="0 0 24 24" width="30" height="30" stroke="#f59e0b" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                            </div>
                            <h3>Our Vision</h3>
                            <p>Creating a global community of confident, curious, and compassionate learners who are equipped to build a better, more equitable world through innovation and wisdom.</p>
                        </div>
                    </div>
                    <div className="mv-grid" style={{ marginTop: '16px' }}>
                        <div className="mv-card" style={{ borderTop: '3px solid #10b981' }}>
                            <div className="mv-card__icon">
                                <svg viewBox="0 0 24 24" width="30" height="30" stroke="#10b981" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <h3>Core Values</h3>
                            <p>Integrity, excellence, inclusivity, innovation, and environmental responsibility guide every decision and action we take as a school community.</p>
                        </div>
                        <div className="mv-card" style={{ borderTop: '3px solid #8b5cf6' }}>
                            <div className="mv-card__icon">
                                <svg viewBox="0 0 24 24" width="30" height="30" stroke="#8b5cf6" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                            </div>
                            <h3>Global Outlook</h3>
                            <p>With international exchange programs and a globally benchmarked curriculum, we prepare students for opportunities beyond borders.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* Core Pillars */}
            <section className="section" style={{ background: 'var(--gray-50)' }}>
                <div className="section-inner">
                    <h2 className="section-title" style={{ marginBottom: '20px' }}>Core Pillars</h2>
                    <div className="pillars-grid">
                        {[
                            { icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="#1a56db" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>, title: 'Academic Excellence', desc: 'Rigorous curriculum and dedicated teaching that consistently delivers top board results.' },
                            { icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="#1a56db" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, title: 'Uncompromising Integrity', desc: 'A culture of honesty, transparency, and ethical conduct at every level of the institution.' },
                            { icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="#1a56db" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>, title: 'Student-Centric Approach', desc: 'Every policy, program, and practice is designed with the individual student\'s growth in mind.' },
                            { icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="#1a56db" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>, title: 'Innovation & Technology', desc: 'Smart classrooms, STEM labs, and digital tools bring learning to life in the 21st century.' },
                        ].map((p, i) => (
                            <div key={i} className="pillar-card">
                                <div className="pillar-card__icon">{p.icon}</div>
                                <div><h4>{p.title}</h4><p>{p.desc}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* School Milestones / Timeline */}
            <section className="section" style={{ background: 'white' }}>
                <div className="section-inner">
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '8px' }}>OUR JOURNEY</p>
                        <h2 className="section-title">School Milestones</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
                        {milestones.map((m, i) => (
                            <div key={m.year} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', padding: '20px', background: 'var(--gray-50)', borderRadius: 'var(--r-lg)', border: '1px solid var(--gray-100)', borderLeft: `4px solid ${i % 2 === 0 ? 'var(--blue)' : 'var(--gold)'}` }}>
                                <div style={{ minWidth: '60px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 800, color: i % 2 === 0 ? 'var(--blue)' : 'var(--gold)' }}>{m.year}</div>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>{m.title}</h4>
                                    <p style={{ fontSize: '13px', color: 'var(--gray-600)', lineHeight: '1.6' }}>{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* Faculty */}
            <section className="section" style={{ background: 'var(--gray-50)' }}>
                <div className="section-inner">
                    <div className="section-header">
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '6px' }}>OUR PEOPLE</p>
                            <h2 className="section-title">Leadership & Faculty</h2>
                        </div>
                        <button className="section-link">Meet All <ArrowRight /></button>
                    </div>
                    <div className="faculty-grid">
                        {faculty.map(f => (
                            <div key={f.id} id={`faculty-${f.id}`} className="faculty-card">
                                <div className="faculty-avatar" style={{ background: f.bg }}>{f.initial}</div>
                                <h4>{f.name}</h4>
                                <div className="faculty-card__role">{f.role}</div>
                                <div className="faculty-card__exp">{f.exp}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* Principal Quote */}
            <div className="principal-wrap">
                <div className="principal-card">
                    <div className="principal-card__left">
                        <div className="principal-avatar">E<div className="principal-badge"><CheckIcon /></div></div>
                        <div className="principal-name">Dr. Elena Sterling</div>
                        <div className="principal-role">Principal, LBS Public School</div>
                    </div>
                    <div className="principal-card__right">
                        <p className="principal-quote">
                            At LBS, we don't just teach subjects — we ignite minds. Our curriculum is designed to challenge the status quo
                            and encourage students to become the architects of a better tomorrow. We believe that education is not about
                            filling a bucket, but lighting a fire. Welcome to our family.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', flexWrap: 'wrap', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--gray-500)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>🏅 Educational Leader of the Year 2023</span>
                            <button id="about-read-more-btn" className="section-link">Read More <ArrowRight /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Awards */}
            <section className="section" style={{ background: 'white' }}>
                <div className="section-inner">
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>RECOGNITION</p>
                        <h2 className="section-title">Awards & Accolades</h2>
                    </div>
                    <div className="awards-grid">
                        {awards.map((a, i) => (
                            <div key={i} className="award-card">
                                <div className="award-card__icon">{a.icon}</div>
                                <h4>{a.title}</h4>
                                <p>{a.year}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <div className="stats-bar" role="region" aria-label="School achievements">
                <div className="stats-bar__inner">
                    {[['34+', 'Years'], ['5k+', 'Alumni'], ['150+', 'Awards'], ['100%', 'Results']].map(([v, l]) => (
                        <div key={l} className="stats-bar__item">
                            <span className="stats-bar__value">{v}</span>
                            <span className="stats-bar__label">{l}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
