import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const Spinner = () => <div className="portal-spinner" />;

const StatCard = ({ icon, label, value, color }) => (
    <div className="pstat-card" style={{ borderLeftColor: color }}>
        <div className="pstat-icon" style={{ background: color + '20', color }}>{icon}</div>
        <div><div className="pstat-value">{value}</div><div className="pstat-label">{label}</div></div>
    </div>
);

const Section = ({ id, title, icon, children }) => (
    <div id={id} className="portal-section">
        <h3 className="portal-section__title"><span>{icon}</span>{title}</h3>
        {children}
    </div>
);

const CHILD_PROFILE = {
    name: 'Aarav Sharma',
    class: 'X-A',
    rollNo: '18',
    section: 'A',
    bloodGroup: 'B+',
    attendancePercent: 94,
    conduct: 'Very Good',
};

const MONTHLY_ATTENDANCE = [
    { month: 'Oct', percent: 92 },
    { month: 'Nov', percent: 95 },
    { month: 'Dec', percent: 90 },
    { month: 'Jan', percent: 96 },
    { month: 'Feb', percent: 94 },
];

const HOLIDAYS = [
    { id: 1, date: '2026-02-26', day: 'Thu', title: 'Maha Shivaratri', type: 'National Holiday' },
    { id: 2, date: '2026-03-08', day: 'Sun', title: 'School Foundation Day', type: 'School Event' },
    { id: 3, date: '2026-03-14', day: 'Sat', title: 'Holi', type: 'Festival Holiday' },
    { id: 4, date: '2026-03-30', day: 'Mon', title: 'Ram Navami', type: 'National Holiday' },
];

const BUS_INFO_FALLBACK = {
    route: 'Route 7A - Green Park to LBS',
    busNo: 'DL-1P-2745',
    driver: { name: 'Ramesh Verma', phone: '+91-98XXXXXX21' },
    attendant: { name: 'Sita Devi', phone: '+91-97XXXXXX45' },
    pickup: '07:05 AM',
    drop: '03:35 PM',
    eta: '8 mins away',
    location: 'Near Sector 12 Signal',
    status: 'On Time',
};

const buildMapEmbedUrl = (lat, lng) => {
    const delta = 0.01;
    const left = lng - delta;
    const right = lng + delta;
    const top = lat + delta;
    const bottom = lat - delta;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
};

const TEACHERS = [
    { id: 1, subject: 'Mathematics', name: 'Ms. Priya Nair', phone: '+91-90XXXXXX11', email: 'priya.nair@lbsschool.edu', remarks: 'Strong progress in algebra.' },
    { id: 2, subject: 'Physics', name: 'Mr. Arvind Rao', phone: '+91-90XXXXXX22', email: 'arvind.rao@lbsschool.edu', remarks: 'Needs more practice in numericals.' },
    { id: 3, subject: 'English', name: 'Ms. Kavita Singh', phone: '+91-90XXXXXX33', email: 'kavita.singh@lbsschool.edu', remarks: 'Excellent writing and reading skills.' },
    { id: 4, subject: 'Computer', name: 'Mr. Fahad Khan', phone: '+91-90XXXXXX44', email: 'fahad.khan@lbsschool.edu', remarks: 'Very active in practical sessions.' },
];

const REMARKS = [
    { id: 1, date: '2026-02-10', by: 'Class Teacher', note: 'Shows leadership in group activities and supports peers.', type: 'positive' },
    { id: 2, date: '2026-02-14', by: 'Physics Teacher', note: 'Should revise derivations before weekly test.', type: 'attention' },
    { id: 3, date: '2026-02-18', by: 'Sports Teacher', note: 'Consistent attendance in football practice.', type: 'positive' },
];

const RESULTS = [
    { id: 1, subject: 'Mathematics', unit1: 92, halfYearly: 89, preBoard: 94 },
    { id: 2, subject: 'Science', unit1: 88, halfYearly: 84, preBoard: 90 },
    { id: 3, subject: 'English', unit1: 91, halfYearly: 93, preBoard: 95 },
    { id: 4, subject: 'Social Science', unit1: 86, halfYearly: 88, preBoard: 90 },
    { id: 5, subject: 'Computer', unit1: 95, halfYearly: 96, preBoard: 98 },
];

const FEE_SUMMARY = {
    totalAnnual: 272000,
    paid: 204000,
    due: 68000,
    nextDueDate: '2026-03-10',
    installments: [
        { term: 'Q1', status: 'Paid', amount: 68000 },
        { term: 'Q2', status: 'Paid', amount: 68000 },
        { term: 'Q3', status: 'Paid', amount: 68000 },
        { term: 'Q4', status: 'Pending', amount: 68000 },
    ],
};

const toINR = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function ParentPortal() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [notices, setNotices] = useState([]);
    const [events, setEvents] = useState([]);
    const [admissions, setAdmissions] = useState([]);
    const [transportLive, setTransportLive] = useState(null);
    const [transportEvents, setTransportEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('parent-dashboard');

    useEffect(() => {
        if (!user) { navigate('/login', { replace: true }); }
    }, [user, navigate]);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        Promise.allSettled([
            api.get('/notices?limit=5'),
            api.get('/events?limit=5&status=upcoming'),
            api.get('/admissions?limit=5'),
        ]).then(([n, e, a]) => {
            if (n.status === 'fulfilled') setNotices(n.value.data.notices || []);
            if (e.status === 'fulfilled') setEvents(e.value.data.events || []);
            if (a.status === 'fulfilled') setAdmissions(a.value.data.admissions || []);
            if (a.status === 'rejected' && a.reason?.statusCode === 401) setAdmissions([]);
        }).catch(() => setError('Failed to load some data. Please refresh.'))
            .finally(() => setLoading(false));
    }, [user]);

    useEffect(() => {
        if (!user) return;
        let active = true;

        const fetchTransport = async () => {
            try {
                const [liveRes, eventsRes] = await Promise.all([
                    api.get('/transport/my/live'),
                    api.get('/transport/my/events?limit=10'),
                ]);
                if (!active) return;
                setTransportLive(liveRes.data || null);
                setTransportEvents(eventsRes.data || []);
            } catch {
                if (!active) return;
                setTransportLive(null);
                setTransportEvents([]);
            }
        };

        fetchTransport();
        const timer = setInterval(fetchTransport, 5000);
        return () => {
            active = false;
            clearInterval(timer);
        };
    }, [user]);

    const handleLogout = () => { logout(); navigate('/', { replace: true }); };
    if (!user) return null;

    const goToSection = (sectionId) => {
        setActiveSection(sectionId);
        const sectionNode = document.getElementById(sectionId);
        if (sectionNode) {
            sectionNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const navItems = [
        { icon: 'D', label: 'Dashboard', target: 'parent-dashboard' },
        { icon: 'A', label: 'Attendance', target: 'parent-attendance' },
        { icon: 'B', label: 'Bus Tracking', target: 'parent-bus' },
        { icon: 'T', label: 'Teachers', target: 'parent-teachers' },
        { icon: 'R', label: 'Results', target: 'parent-results' },
        { icon: 'F', label: 'Fees', target: 'parent-fees' },
    ];

    const liveBus = transportLive || null;
    const liveLocation = liveBus?.currentLocation || null;
    const hasMapLocation = liveLocation?.lat !== undefined && liveLocation?.lng !== undefined;
    const mapUrl = hasMapLocation
        ? buildMapEmbedUrl(liveLocation.lat, liveLocation.lng)
        : buildMapEmbedUrl(28.6139, 77.2090);

    const TAG_COLORS = {
        exam: '#7c3aed', admission: '#1a56db', event: '#059669',
        holiday: '#f59e0b', sports: '#ef4444', academic: '#0891b2', general: '#6b7280',
    };

    return (
        <div className="portal-page">
            <aside className="portal-sidebar">
                <div className="portal-sidebar__top">
                    <div className="portal-avatar-lg">{user.fullname?.[0] || 'P'}</div>
                    <div className="portal-name">{user.fullname}</div>
                    <div className="portal-role-badge" style={{ background: '#dbeafe', color: '#1a56db' }}>Parent</div>
                    <div className="portal-email">{user.email}</div>
                </div>

                <nav className="portal-nav">
                    {navItems.map(item => (
                        <button
                            type="button"
                            key={item.label}
                            className={`portal-nav__item${activeSection === item.target ? ' active' : ''}`}
                            onClick={() => goToSection(item.target)}
                        >
                            <span>{item.icon}</span> {item.label}
                        </button>
                    ))}
                </nav>

                <div className="portal-sidebar__bottom">
                    <button className="portal-nav__item" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }} onClick={handleLogout}>
                        <span>O</span> Sign Out
                    </button>
                    <button className="portal-nav__item" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <span>H</span> Back to Website
                    </button>
                </div>
            </aside>

            <main className="portal-main">
                <div className="portal-header">
                    <div>
                        <h1>Welcome back, {user.fullname.split(' ')[0]}!</h1>
                        <p>Complete parent dashboard for attendance, transport, teachers, remarks, results, and fees.</p>
                    </div>
                    <button id="parent-logout-btn" className="portal-logout-btn" onClick={handleLogout}>Sign Out</button>
                </div>

                {error && <div className="portal-error">Warning: {error}</div>}

                <div className="pstat-row">
                    <StatCard icon="A" label="Attendance" value={`${CHILD_PROFILE.attendancePercent}%`} color="#1a56db" />
                    <StatCard icon="B" label="Bus ETA" value={liveLocation?.etaMinutes ? `${liveLocation.etaMinutes} mins` : BUS_INFO_FALLBACK.eta} color="#059669" />
                    <StatCard icon="H" label="Holidays Ahead" value={HOLIDAYS.length} color="#f59e0b" />
                    <StatCard icon="F" label="Fee Due" value={toINR(FEE_SUMMARY.due)} color="#7c3aed" />
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}><Spinner /><p style={{ marginTop: '16px', color: 'var(--gray-500)' }}>Loading your dashboard...</p></div>
                ) : (
                    <>
                        <Section id="parent-dashboard" title="Child Snapshot" icon="C">
                            <div className="portal-grid-3">
                                <div className="portal-kpi"><span>Name</span><strong>{CHILD_PROFILE.name}</strong></div>
                                <div className="portal-kpi"><span>Class / Section</span><strong>{CHILD_PROFILE.class} / {CHILD_PROFILE.section}</strong></div>
                                <div className="portal-kpi"><span>Roll No</span><strong>{CHILD_PROFILE.rollNo}</strong></div>
                                <div className="portal-kpi"><span>Attendance</span><strong>{CHILD_PROFILE.attendancePercent}%</strong></div>
                                <div className="portal-kpi"><span>Conduct</span><strong>{CHILD_PROFILE.conduct}</strong></div>
                                <div className="portal-kpi"><span>Blood Group</span><strong>{CHILD_PROFILE.bloodGroup}</strong></div>
                            </div>
                        </Section>

                        <Section id="parent-attendance" title="Attendance Tracker" icon="A">
                            <div className="portal-grid-2">
                                <div className="portal-card-soft">
                                    <h4 className="portal-card-title">Monthly Trend</h4>
                                    {MONTHLY_ATTENDANCE.map(row => (
                                        <div key={row.month} className="portal-att-row">
                                            <span>{row.month}</span>
                                            <div className="portal-progress">
                                                <div className="portal-progress__bar" style={{ width: `${row.percent}%`, background: '#1a56db' }} />
                                            </div>
                                            <strong>{row.percent}%</strong>
                                        </div>
                                    ))}
                                </div>
                                <div className="portal-card-soft">
                                    <h4 className="portal-card-title">Attendance Status</h4>
                                    <div className="portal-kv"><span>Present Days</span><strong>178</strong></div>
                                    <div className="portal-kv"><span>Absent Days</span><strong>6</strong></div>
                                    <div className="portal-kv"><span>Leave Approved</span><strong>4</strong></div>
                                    <div className="portal-kv"><span>Action</span><strong>Request Leave Online</strong></div>
                                </div>
                            </div>
                        </Section>

                        <Section id="parent-bus" title="Bus Tracking And Transport" icon="B">
                            <div className="portal-grid-2">
                                <div className="portal-card-soft">
                                    <h4 className="portal-card-title">Live Route Info</h4>
                                    <div className="portal-kv"><span>Route</span><strong>{liveBus ? `${liveBus.routeCode} - ${liveBus.routeName}` : BUS_INFO_FALLBACK.route}</strong></div>
                                    <div className="portal-kv"><span>Bus Number</span><strong>{liveBus?.busNumber || BUS_INFO_FALLBACK.busNo}</strong></div>
                                    <div className="portal-kv"><span>Current Location</span><strong>{liveLocation?.address || BUS_INFO_FALLBACK.location}</strong></div>
                                    <div className="portal-kv"><span>Status</span><strong>{liveBus?.status || BUS_INFO_FALLBACK.status}</strong></div>
                                    <div className="portal-kv"><span>ETA</span><strong>{liveLocation?.etaMinutes ? `${liveLocation.etaMinutes} mins` : BUS_INFO_FALLBACK.eta}</strong></div>
                                    <div className="portal-kv"><span>Last Update</span><strong>{liveLocation?.updatedAt ? new Date(liveLocation.updatedAt).toLocaleTimeString('en-IN') : '-'}</strong></div>
                                </div>
                                <div className="portal-card-soft">
                                    <h4 className="portal-card-title">Driver And Attendant</h4>
                                    <div className="portal-kv"><span>Driver</span><strong>{liveBus?.driver?.name || BUS_INFO_FALLBACK.driver.name}</strong></div>
                                    <div className="portal-kv"><span>Driver Phone</span><strong>{liveBus?.driver?.phone || BUS_INFO_FALLBACK.driver.phone}</strong></div>
                                    <div className="portal-kv"><span>Attendant</span><strong>{liveBus?.attendant?.name || BUS_INFO_FALLBACK.attendant.name}</strong></div>
                                    <div className="portal-kv"><span>Attendant Phone</span><strong>{liveBus?.attendant?.phone || BUS_INFO_FALLBACK.attendant.phone}</strong></div>
                                    <div className="portal-kv"><span>Pickup / Drop</span><strong>{liveBus?.pickupTime || BUS_INFO_FALLBACK.pickup} / {liveBus?.dropTime || BUS_INFO_FALLBACK.drop}</strong></div>
                                </div>
                            </div>
                            <div className="portal-card-soft" style={{ marginTop: '12px' }}>
                                <h4 className="portal-card-title">Real-Time Bus Map</h4>
                                <iframe
                                    title="Live Bus Map"
                                    src={mapUrl}
                                    style={{ width: '100%', height: '280px', border: '0', borderRadius: '10px' }}
                                    loading="lazy"
                                />
                                <p className="portal-note">
                                    {hasMapLocation
                                        ? `Live coordinates: ${liveLocation.lat.toFixed(5)}, ${liveLocation.lng.toFixed(5)}`
                                        : 'No live GPS yet. Showing default map center.'}
                                </p>
                            </div>
                            <div className="portal-card-soft" style={{ marginTop: '12px' }}>
                                <h4 className="portal-card-title">Pickup And Drop Timeline</h4>
                                {transportEvents.length === 0 ? (
                                    <div className="portal-empty" style={{ padding: '8px 0' }}>
                                        No pickup/drop events received yet.
                                    </div>
                                ) : (
                                    <div className="portal-list-stack">
                                        {transportEvents.map(ev => (
                                            <div key={ev._id} className="portal-line-item">
                                                <div>
                                                    <div className="portal-notice-title">{ev.student?.fullname || 'Student'} - {ev.eventType.replace('_', ' ')}</div>
                                                    <div className="portal-notice-body">Stop: {ev.stopName}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div className={`portal-chip ${ev.eventType.includes('done') ? 'success' : 'info'}`}>{ev.eventType}</div>
                                                    <div className="portal-mini-date">{new Date(ev.eventAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Section>

                        <Section id="parent-teachers" title="Teacher Directory With Contact" icon="T">
                            <div className="portal-table-wrap">
                                <table className="portal-table">
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Teacher</th>
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {TEACHERS.map(t => (
                                            <tr key={t.id}>
                                                <td>{t.subject}</td>
                                                <td>{t.name}</td>
                                                <td>{t.phone}</td>
                                                <td>{t.email}</td>
                                                <td>{t.remarks}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section title="Teacher Remarks And Behavior Notes" icon="M">
                            <div className="portal-list-stack">
                                {REMARKS.map(item => (
                                    <div key={item.id} className="portal-line-item">
                                        <div>
                                            <div className="portal-notice-title">{item.by}</div>
                                            <div className="portal-notice-body">{item.note}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className={`portal-chip ${item.type === 'positive' ? 'success' : 'warn'}`}>{item.type}</div>
                                            <div className="portal-mini-date">{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section id="parent-results" title="Academic Results" icon="R">
                            <div className="portal-table-wrap">
                                <table className="portal-table">
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Unit Test 1</th>
                                            <th>Half Yearly</th>
                                            <th>Pre-Board</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {RESULTS.map(r => (
                                            <tr key={r.id}>
                                                <td>{r.subject}</td>
                                                <td>{r.unit1}</td>
                                                <td>{r.halfYearly}</td>
                                                <td>{r.preBoard}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section title="Holiday Calendar" icon="H">
                            <div className="portal-list-stack">
                                {HOLIDAYS.map(h => (
                                    <div key={h.id} className="portal-line-item">
                                        <div>
                                            <div className="portal-notice-title">{h.title}</div>
                                            <div className="portal-notice-body">{h.type}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className="portal-chip info">{h.day}</div>
                                            <div className="portal-mini-date">{new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section id="parent-fees" title="Fee Summary" icon="F">
                            <div className="portal-grid-2">
                                <div className="portal-card-soft">
                                    <div className="portal-kv"><span>Total Annual Fee</span><strong>{toINR(FEE_SUMMARY.totalAnnual)}</strong></div>
                                    <div className="portal-kv"><span>Paid So Far</span><strong>{toINR(FEE_SUMMARY.paid)}</strong></div>
                                    <div className="portal-kv"><span>Due Amount</span><strong>{toINR(FEE_SUMMARY.due)}</strong></div>
                                    <div className="portal-kv"><span>Next Due Date</span><strong>{new Date(FEE_SUMMARY.nextDueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
                                </div>
                                <div className="portal-card-soft">
                                    <h4 className="portal-card-title">Installments</h4>
                                    {FEE_SUMMARY.installments.map(item => (
                                        <div key={item.term} className="portal-line-item no-border">
                                            <div className="portal-notice-title">{item.term}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div className={`portal-chip ${item.status === 'Paid' ? 'success' : 'warn'}`}>{item.status}</div>
                                                <div className="portal-mini-date">{toINR(item.amount)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        <Section title="Latest School Notices" icon="N">
                            {notices.length === 0 ? (
                                <div className="portal-empty">No notices at this time.</div>
                            ) : notices.map(n => (
                                <div key={n._id} id={`notice-${n._id}`} className="portal-notice-item">
                                    <span className="portal-notice-tag" style={{ background: (TAG_COLORS[n.category] || '#6b7280') + '20', color: TAG_COLORS[n.category] || '#6b7280' }}>
                                        {n.category}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <div className="portal-notice-title">{n.title}</div>
                                        <div className="portal-notice-body">{n.content}</div>
                                    </div>
                                    <div className="portal-notice-date">{new Date(n.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                                </div>
                            ))}
                        </Section>

                        <Section title="Upcoming Events" icon="E">
                            {events.length === 0 ? (
                                <div className="portal-empty">No upcoming events at this time.</div>
                            ) : events.map(ev => (
                                <div key={ev._id} id={`event-${ev._id}`} className="portal-event-item">
                                    <div className="portal-event-date">
                                        <div>{new Date(ev.startDate).toLocaleDateString('en-IN', { day: '2-digit' })}</div>
                                        <div>{new Date(ev.startDate).toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}</div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className="portal-event-title">{ev.title}</div>
                                        <div className="portal-event-meta">
                                            {ev.time && <span>Time: {ev.time}</span>}
                                            {ev.venue && <span>Venue: {ev.venue}</span>}
                                        </div>
                                    </div>
                                    <span className="portal-event-tag" style={{ background: '#dcfce7', color: '#059669' }}>{ev.category}</span>
                                </div>
                            ))}
                        </Section>

                        <Section title="Admission Applications" icon="A">
                            {admissions.length === 0 ? (
                                <div className="portal-empty">
                                    No admission applications yet.{' '}
                                    <button className="portal-link-btn" onClick={() => navigate('/admissions')}>Apply Now</button>
                                </div>
                            ) : admissions.map(a => (
                                <div key={a._id} id={`adm-${a._id}`} className="portal-adm-item">
                                    <div>
                                        <div className="portal-adm-name">{a.applicantName}</div>
                                        <div className="portal-adm-meta">Class {a.applyingForClass} | {a.academicYear}</div>
                                    </div>
                                    <span className={`portal-status portal-status--${a.status}`}>{a.status}</span>
                                </div>
                            ))}
                        </Section>
                    </>
                )}
            </main>
        </div>
    );
}
