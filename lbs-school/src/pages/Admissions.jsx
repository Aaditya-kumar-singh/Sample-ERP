import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Newsletter from '../components/Newsletter';

const BackIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);
const ContactIcon = () => (<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" /></svg>);
const ChevDown = () => (<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>);
const DownloadIcon = () => (<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
const ClipboardIcon = () => (<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>);
const InfoIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>);
const ArrowRight = () => (<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const DocIcon = () => (<svg viewBox="0 0 24 24" width="14" height="14" stroke="white" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>);
const CheckSvg = () => (<svg viewBox="0 0 24 24" width="14" height="14" stroke="white" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
const ShieldSvg = () => (<svg viewBox="0 0 24 24" width="14" height="14" stroke="white" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
const EditSvg = () => (<svg viewBox="0 0 24 24" width="20" height="20" stroke="white" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>);
const MapSvg = () => (<svg viewBox="0 0 24 24" width="20" height="20" stroke="white" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
const UsersSvg = () => (<svg viewBox="0 0 24 24" width="20" height="20" stroke="white" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const CheckCircle = () => (<svg viewBox="0 0 24 24" width="20" height="20" stroke="white" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>);

/* ── Fee Calculator Logic ── */
const BASE_FEES = {
    'nursery-kg': { label: 'Nursery – KG', quarterly: 45000 },
    'i-v': { label: 'Class I – V', quarterly: 55000 },
    'vi-x': { label: 'Class VI – X', quarterly: 68000 },
    'xi-xii': { label: 'Class XI – XII', quarterly: 80000 },
};
const TRANSPORT = { none: 0, near: 3500, mid: 5500, far: 7500 };
const SIBLING_DISC = { 0: 0, 1: 0.05, 2: 0.10, 3: 0.15 };

function FeeCalculator() {
    const [wing, setWing] = useState('vi-x');
    const [transport, setTransport] = useState('none');
    const [siblings, setSiblings] = useState(0);

    const base = BASE_FEES[wing].quarterly;
    const trans = TRANSPORT[transport];
    const disc = Math.round(base * SIBLING_DISC[siblings]);
    const subtotal = base + trans - disc;
    const annual = subtotal * 4;

    const fmt = n => '₹' + n.toLocaleString('en-IN');

    return (
        <div className="fee-calc">
            <h3>🧮 Fee Calculator</h3>
            <p className="fee-calc__sub">Estimate your child's quarterly and annual fees instantly.</p>

            <div className="fee-calc__row">
                <div>
                    <label className="fee-calc__label" htmlFor="calc-wing">Class / Wing</label>
                    <select id="calc-wing" value={wing} onChange={e => setWing(e.target.value)}>
                        {Object.entries(BASE_FEES).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="fee-calc__label" htmlFor="calc-transport">School Transport</label>
                    <select id="calc-transport" value={transport} onChange={e => setTransport(e.target.value)}>
                        <option value="none">No Transport</option>
                        <option value="near">Nearby Zone (₹3,500/qtr)</option>
                        <option value="mid">Mid Zone (₹5,500/qtr)</option>
                        <option value="far">Far Zone (₹7,500/qtr)</option>
                    </select>
                </div>
            </div>

            <label className="fee-calc__label">Siblings at LBS (for discount)</label>
            <div className="fee-calc__siblings">
                {[0, 1, 2, 3].map(n => (
                    <button
                        key={n}
                        id={`sib-btn-${n}`}
                        className={`sib-btn${siblings === n ? ' active' : ''}`}
                        onClick={() => setSiblings(n)}
                    >
                        {n === 0 ? 'None' : `${n} sibling${n > 1 ? 's' : ''} (${SIBLING_DISC[n] * 100}% off)`}
                    </button>
                ))}
            </div>

            <div className="fee-calc__result">
                <div className="fee-calc__result-row">
                    <span className="fee-calc__result-lbl">Tuition ({BASE_FEES[wing].label})</span>
                    <span className="fee-calc__result-val">{fmt(base)}</span>
                </div>
                {trans > 0 && (
                    <div className="fee-calc__result-row">
                        <span className="fee-calc__result-lbl">Transport Fee</span>
                        <span className="fee-calc__result-val">+ {fmt(trans)}</span>
                    </div>
                )}
                {disc > 0 && (
                    <div className="fee-calc__result-row">
                        <span className="fee-calc__result-lbl">Sibling Discount ({SIBLING_DISC[siblings] * 100}%)</span>
                        <span className="fee-calc__result-val" style={{ color: '#86efac' }}>– {fmt(disc)}</span>
                    </div>
                )}
                <div className="fee-calc__total">
                    <span className="fee-calc__total-lbl">Quarterly Total</span>
                    <span className="fee-calc__total-val">{fmt(subtotal)}</span>
                </div>
                <p className="fee-calc__disclaimer">
                    Annual estimate: <strong>{fmt(annual)}</strong> &nbsp;|&nbsp; Registration ₹10,000 + Security Deposit ₹25,000 (one-time)
                </p>
            </div>
        </div>
    );
}

/* ── Data ── */
const steps = [
    { id: 'inquiry', title: 'Online Inquiry', desc: 'Fill the initial interest form to receive our school prospectus and detailed information pack.', icon: <EditSvg />, bg: '#1a56db' },
    { id: 'visit', title: 'School Visit', desc: 'Schedule a guided campus tour and interact personally with faculty members and current students.', icon: <MapSvg />, bg: '#059669' },
    { id: 'interaction', title: 'Interaction & Test', desc: "An age-appropriate assessment and informal interaction to understand the child's learning style.", icon: <UsersSvg />, bg: '#7c3aed' },
    { id: 'enrollment', title: 'Final Enrollment', desc: "Submit required documents and complete the fee payment to confirm and secure your child's seat.", icon: <CheckCircle />, bg: '#f59e0b' },
];

const fees = [
    { id: 'preprimary', level: 'Pre-Primary', classes: 'Nursery – KG', price: '₹45,000', period: 'Per Quarter', features: ['Play-based learning', 'Daily nutrition', 'Transport available'] },
    { id: 'primary', level: 'Primary', classes: 'Class I – V', price: '₹55,000', period: 'Per Quarter', features: ['Smart classrooms', 'Activity kits', 'Transport available'] },
    { id: 'secondary', level: 'Secondary', classes: 'Class VI – X', price: '₹68,000', period: 'Per Quarter', features: ['Science & Math labs', 'Library access', 'Transport available'] },
    { id: 'senior', level: 'Senior Sec.', classes: 'Class XI – XII', price: '₹80,000', period: 'Per Quarter', features: ['Stream labs', 'Career counselling', 'Mock board exams'] },
];

const faqs = [
    { id: 'age', q: 'What is the age criteria for admission?', a: 'For Nursery, the child must be 3+ years as on 31st March. For Class I, 5+ years as on 31st March of the admission year.' },
    { id: 'transport', q: 'Is transport available from all areas?', a: 'Yes, we provide GPS-tracked school buses covering 30+ routes across the city. Route details are shared upon enrollment confirmation.' },
    { id: 'scholarship', q: 'What scholarships are offered?', a: 'We offer merit-based (90%+ in previous board/class) and need-based scholarships. Applications open every April 1st.' },
    { id: 'uniform', q: 'Is there a school uniform?', a: 'Yes, all students follow a prescribed uniform code. Uniform sets are available at the school store and select partner outlets.' },
    { id: 'board', q: 'Is LBS affiliated to CBSE?', a: 'Yes, LBS Public School is fully affiliated to the Central Board of Secondary Education (CBSE) – Delhi, for Classes I through XII.' },
    { id: 'facilities', q: 'What co-curricular facilities are available?', a: 'We offer 40+ clubs including robotics, swimming, drama, music, football, chess, photography, and many more.' },
];

const docs = [
    { icon: <DocIcon />, bg: '#1a56db', title: 'Birth Certificate (Original + 2 copies)', note: 'Must be attested by a gazetted officer' },
    { icon: <CheckSvg />, bg: '#059669', title: 'Previous Year Report Card / Transfer Cert.', note: 'Marks/grades clearly visible and school-stamped' },
    { icon: <DocIcon />, bg: '#7c3aed', title: 'Aadhar Card (Child & Parents)', note: 'Self-attested photocopy of all three' },
    { icon: <ShieldSvg />, bg: '#f59e0b', title: 'Passport-Size Photographs (6 copies)', note: 'Recent, white background, clearly visible face' },
    { icon: <DocIcon />, bg: '#0891b2', title: 'Residence Proof (any one)', note: 'Electricity bill, bank passbook, or rent deed' },
    { icon: <CheckSvg />, bg: '#db2777', title: 'Medical Certificate', note: 'From a registered medical practitioner' },
];

const parentTestimonials = [
    { id: 1, initial: 'A', name: 'Anita Raghunathan', ward: 'Parent — Class IX, Science', stars: 5, text: "The admission process at LBS was smooth and transparent. Every step was clearly communicated and the staff was incredibly supportive. Our son has thrived here beyond our expectations." },
    { id: 2, initial: 'D', name: 'Dr. Deepak Malhotra', ward: 'Parent — Class XII, Commerce', stars: 5, text: "We transferred our daughter from a different city school. LBS made the transition seamless. Within months, she topped her class. The faculty quality here is genuinely exceptional." },
    { id: 3, initial: 'S', name: 'Sunita Iyer', ward: 'Parent — Class V, Primary', stars: 5, text: "As first-time school parents, we were nervous. The principal and admission team walked us through everything patiently. Two years later, our son absolutely loves school!" },
    { id: 4, initial: 'R', name: 'Rahul Choudhry', ward: 'Parent — Class VII, Middle', stars: 4, text: "The fee structure is transparent with no hidden charges. Scholarships are genuinely merit-based. LBS delivers excellent value for the quality of education our children receive." },
];

export default function Admissions() {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState('age');

    return (
        <>
            {/* Mobile top bar */}
            <header className="top-bar">
                <button id="admissions-back-btn" className="top-bar__back" onClick={() => navigate(-1)} aria-label="Go back"><BackIcon /></button>
                <span className="top-bar__title">Admissions 2024–25</span>
                <button id="admissions-contact-btn" className="btn-contact" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', padding: '7px 14px' }}><ContactIcon /> Contact</button>
            </header>

            {/* Hero */}
            <div className="admissions-hero" role="banner">
                <div className="admissions-hero__content">
                    <div className="adm-badge">🎓 Admissions Now Open — 2024–25</div>
                    <h1 className="adm-title">Join the LBS<br />Community</h1>
                    <p className="adm-sub">Excellence in Education since 1990 · Limited Seats Available</p>
                </div>
            </div>

            {/* Stats row */}
            <div className="stats-row" role="region" aria-label="Key stats">
                {[['15:1', 'Student-Teacher Ratio'], ['100%', 'Board Pass Rate'], ['40+', 'Co-Curricular Clubs'], ['5%–15%', 'Sibling Discount']].map(([v, l]) => (
                    <div key={l} className="stats-row__item">
                        <span className="stats-row__value">{v}</span>
                        <span className="stats-row__label">{l}</span>
                    </div>
                ))}
            </div>

            {/* Process */}
            <div className="process-section">
                <div className="process-inner">
                    <div className="process-header">
                        <svg viewBox="0 0 24 24" style={{ width: '26px', height: '26px', stroke: '#1a56db', fill: 'none', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }}><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                        <h2>How to Apply — 4 Easy Steps</h2>
                    </div>
                    <div className="process-grid">
                        {steps.map((s, i) => (
                            <div key={s.id} id={`step-${s.id}`} className="process-step">
                                <div className="process-step__left">
                                    <div className="process-step__circle" style={{ background: s.bg }}>{s.icon}</div>
                                    {i < steps.length - 1 && <div className="process-step__line" />}
                                </div>
                                <div className="process-step__content">
                                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--gray-500)', letterSpacing: '.06em', marginBottom: '4px' }}>STEP {i + 1}</div>
                                    <div className="process-step__title">{s.title}</div>
                                    <div className="process-step__desc">{s.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="divider" />

            {/* ── FEE CALCULATOR ── */}
            <div className="fee-section" style={{ background: 'var(--gray-50)' }}>
                <div className="fee-inner">
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '8px' }}>ESTIMATE YOUR FEES</p>
                        <h2 className="section-title">Interactive Fee Calculator</h2>
                        <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '8px' }}>Select your child's class, transport zone, and sibling count to get an instant estimate.</p>
                    </div>
                    <FeeCalculator />
                </div>
            </div>

            <div className="divider" />

            {/* Fee Table */}
            <div className="fee-section">
                <div className="fee-inner">
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '8px' }}>TUITION FEES</p>
                        <h2 className="section-title">Fee Structure 2024–25</h2>
                        <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '8px' }}>All-inclusive quarterly tuition. No hidden charges.</p>
                    </div>
                    <div className="fee-grid">
                        {fees.map(f => (
                            <div key={f.id} id={`fee-${f.id}`} className="fee-card">
                                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--blue)', letterSpacing: '.06em', marginBottom: '4px' }}>{f.classes}</div>
                                <div className="fee-card__level">{f.level}</div>
                                <div className="fee-card__price">{f.price}</div>
                                <div className="fee-card__period">{f.period}</div>
                                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    {f.features.map(ft => (
                                        <div key={ft} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--gray-600)' }}>
                                            <span style={{ color: 'var(--blue)' }}>✓</span> {ft}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="fee-note"><InfoIcon /><p>One-time registration fee of ₹10,000 and a refundable security deposit of ₹25,000 are payable at enrollment. EMI options available.</p></div>
                </div>
            </div>

            <div className="divider" />

            {/* Document Checklist */}
            <div className="process-section" style={{ background: 'var(--gray-50)' }}>
                <div className="process-inner">
                    <div style={{ marginBottom: '24px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '8px' }}>DOCUMENTS REQUIRED</p>
                        <h2 className="section-title">Admission Checklist</h2>
                        <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '8px' }}>Please bring originals and attested photocopies of all documents on the day of school visit.</p>
                    </div>
                    <div className="checklist">
                        {docs.map((d, i) => (
                            <div key={i} className="checklist__item">
                                <div className="checklist__icon" style={{ background: d.bg }}>{d.icon}</div>
                                <div><h5>{d.title}</h5><p>{d.note}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="divider" />

            {/* FAQs */}
            <div className="faq-section">
                <div className="faq-inner">
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '8px' }}>GOT QUESTIONS?</p>
                        <h2 className="section-title">Frequently Asked Questions</h2>
                    </div>
                    {faqs.map(faq => (
                        <div key={faq.id} id={`faq-${faq.id}`} className="faq-item">
                            <button
                                id={`faq-toggle-${faq.id}`}
                                className={`faq-question${openFaq === faq.id ? ' open' : ''}`}
                                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                aria-expanded={openFaq === faq.id}
                            >
                                {faq.q}<ChevDown />
                            </button>
                            {openFaq === faq.id && <div className="faq-answer">{faq.a}</div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="divider" />

            {/* Parent Testimonials */}
            <div className="process-section" style={{ background: 'var(--gray-50)' }}>
                <div className="process-inner">
                    <div style={{ marginBottom: '24px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '8px' }}>PARENT VOICES</p>
                        <h2 className="section-title">What Parents Say</h2>
                    </div>
                    <div className="parent-testi-grid">
                        {parentTestimonials.map(t => (
                            <div key={t.id} id={`parent-testi-${t.id}`} className="parent-testi-card">
                                <div className="parent-testi-stars">{Array(t.stars).fill('★').join('')}</div>
                                <p className="parent-testi-text">"{t.text}"</p>
                                <div className="parent-testi-author">
                                    <div className="parent-testi-avatar">{t.initial}</div>
                                    <div><strong>{t.name}</strong><span>{t.ward}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Newsletter */}
            <Newsletter />

            {/* CTA */}
            <div className="cta-bar">
                <button id="download-prospectus-btn" className="btn-secondary"><DownloadIcon /> Download Prospectus</button>
                <button id="apply-online-btn" className="btn-primary-full" onClick={() => navigate('/admission-form')}><ClipboardIcon /> Apply Online Now</button>
            </div>
        </>
    );
}
