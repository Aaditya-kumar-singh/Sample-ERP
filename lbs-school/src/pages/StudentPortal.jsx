import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const Spinner = () => <div className="portal-spinner" />;

const Section = ({ id, title, icon, children }) => (
    <div id={id} className="portal-section">
        <h3 className="portal-section__title"><span>{icon}</span>{title}</h3>
        {children}
    </div>
);

const StatCard = ({ icon, label, value, color }) => (
    <div className="pstat-card" style={{ borderLeftColor: color }}>
        <div className="pstat-icon" style={{ background: color + '20', color }}>{icon}</div>
        <div><div className="pstat-value">{value}</div><div className="pstat-label">{label}</div></div>
    </div>
);

const ATTENDANCE_SUMMARY = {
    present: 178,
    absent: 6,
    leave: 4,
    percentage: 94,
    weekly: [
        { day: 'Mon', status: 'P' },
        { day: 'Tue', status: 'P' },
        { day: 'Wed', status: 'P' },
        { day: 'Thu', status: 'L' },
        { day: 'Fri', status: 'P' },
    ],
};

const TODAY_TIMETABLE = [
    { period: '1', time: '08:20 - 09:00', subject: 'Mathematics', teacher: 'Ms. Priya Nair', room: '10-A' },
    { period: '2', time: '09:00 - 09:40', subject: 'Physics', teacher: 'Mr. Arvind Rao', room: 'Lab-2' },
    { period: '3', time: '09:40 - 10:20', subject: 'English', teacher: 'Ms. Kavita Singh', room: '10-A' },
    { period: '4', time: '10:40 - 11:20', subject: 'Chemistry', teacher: 'Ms. Ritu Sharma', room: 'Lab-1' },
    { period: '5', time: '11:20 - 12:00', subject: 'Computer Science', teacher: 'Mr. Fahad Khan', room: 'Comp-3' },
    { period: '6', time: '12:00 - 12:40', subject: 'Physical Education', teacher: 'Mr. Dinesh', room: 'Ground' },
];

const ASSIGNMENTS = [
    { id: 1, subject: 'Mathematics', task: 'Complete Trigonometry worksheet 5A', dueDate: '2026-02-23', status: 'pending' },
    { id: 2, subject: 'English', task: 'Write speech on climate action (500 words)', dueDate: '2026-02-24', status: 'submitted' },
    { id: 3, subject: 'Physics', task: 'Numericals from chapter: Light', dueDate: '2026-02-25', status: 'pending' },
    { id: 4, subject: 'Computer', task: 'Build a simple React counter app', dueDate: '2026-02-27', status: 'in_review' },
];

const EXAMS = [
    { id: 1, subject: 'Mathematics', date: '2026-03-01', syllabus: 'Ch 6 to 8', mode: 'Written' },
    { id: 2, subject: 'Science', date: '2026-03-04', syllabus: 'Physics + Chemistry units', mode: 'Written' },
    { id: 3, subject: 'English', date: '2026-03-08', syllabus: 'Grammar + Literature', mode: 'Written' },
];

const TEACHER_SUPPORT = [
    { id: 1, name: 'Ms. Priya Nair', subject: 'Mathematics', slot: 'Mon, Wed 1:30 PM - 2:00 PM' },
    { id: 2, name: 'Mr. Arvind Rao', subject: 'Physics', slot: 'Tue, Thu 1:15 PM - 1:45 PM' },
    { id: 3, name: 'Ms. Kavita Singh', subject: 'English', slot: 'Fri 1:00 PM - 1:40 PM' },
];

const ACHIEVEMENTS = [
    { icon: 'T', title: 'State Sports Champions', year: '2025', desc: '12 medals at Inter-School Sports Meet' },
    { icon: 'S', title: 'National Science Award', year: '2025', desc: '1st place at National STEM Olympiad' },
    { icon: 'B', title: '100% Board Pass Rate', year: '2025', desc: 'Class X and XII all students passed' },
];

export default function StudentPortal() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [notices, setNotices] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('student-dashboard');

    useEffect(() => {
        if (!user) { navigate('/login', { replace: true }); }
    }, [user, navigate]);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        Promise.allSettled([
            api.get('/notices?limit=6'),
            api.get('/events?limit=6&status=upcoming'),
        ]).then(([n, e]) => {
            if (n.status === 'fulfilled') setNotices(n.value.data.notices || []);
            if (e.status === 'fulfilled') setEvents(e.value.data.events || []);
        }).catch(() => setError('Could not load data. Please refresh.'))
            .finally(() => setLoading(false));
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
        { icon: 'D', label: 'Dashboard', target: 'student-dashboard' },
        { icon: 'A', label: 'Attendance', target: 'student-attendance' },
        { icon: 'T', label: 'Timetable', target: 'student-timetable' },
        { icon: 'H', label: 'Homework', target: 'student-homework' },
        { icon: 'E', label: 'Exams', target: 'student-exams' },
    ];

    const pendingAssignments = ASSIGNMENTS.filter(a => a.status === 'pending').length;
    const nextExam = EXAMS[0];

    const TAG_COLORS = {
        exam: '#7c3aed', admission: '#1a56db', event: '#059669',
        holiday: '#f59e0b', sports: '#ef4444', academic: '#0891b2', general: '#6b7280',
    };

    return (
        <div className="portal-page">
            <aside className="portal-sidebar" style={{ background: 'linear-gradient(180deg,#064e3b,#065f46)' }}>
                <div className="portal-sidebar__top">
                    <div className="portal-avatar-lg" style={{ background: '#059669' }}>{user.fullname?.[0] || 'S'}</div>
                    <div className="portal-name">{user.fullname}</div>
                    <div className="portal-role-badge" style={{ background: '#dcfce7', color: '#059669' }}>Student</div>
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
                    <button className="portal-nav__item" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: '#fca5a5' }} onClick={handleLogout}>
                        <span>O</span> Sign Out
                    </button>
                    <button className="portal-nav__item" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <span>H</span> Back to Website
                    </button>
                </div>
            </aside>

            <main className="portal-main">
                <div className="portal-header" style={{ borderBottomColor: '#dcfce7' }}>
                    <div>
                        <h1>Hello, {user.fullname.split(' ')[0]}!</h1>
                        <p>Your student dashboard with attendance, classes, homework, and exams.</p>
                    </div>
                    <button id="student-logout-btn" className="portal-logout-btn" style={{ background: '#059669' }} onClick={handleLogout}>Sign Out</button>
                </div>

                {error && <div className="portal-error">Warning: {error}</div>}

                <div className="pstat-row">
                    <StatCard icon="A" label="Attendance" value={`${ATTENDANCE_SUMMARY.percentage}%`} color="#059669" />
                    <StatCard icon="H" label="Pending Homework" value={pendingAssignments} color="#1a56db" />
                    <StatCard icon="E" label="Next Exam" value={nextExam ? new Date(nextExam.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '-'} color="#7c3aed" />
                    <StatCard icon="C" label="Upcoming Events" value={loading ? '...' : events.length} color="#f59e0b" />
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}><Spinner /><p style={{ marginTop: '16px', color: 'var(--gray-500)' }}>Loading your portal...</p></div>
                ) : (
                    <>
                        <Section id="student-dashboard" title="My Profile" icon="P">
                            <div className="student-profile-card">
                                <div className="student-profile-avatar">{user.fullname?.[0] || 'S'}</div>
                                <div className="student-profile-info">
                                    <div className="student-profile-name">{user.fullname}</div>
                                    <div className="student-profile-detail">Email: {user.email}</div>
                                    <div className="student-profile-detail">Username: @{user.username}</div>
                                    <div className="student-profile-detail">Class: X-A | Roll No: 18</div>
                                </div>
                                <div className="student-profile-role" style={{ background: '#dcfce7', color: '#059669' }}>Student</div>
                            </div>
                        </Section>

                        <Section id="student-attendance" title="Attendance Overview" icon="A">
                            <div className="portal-grid-2">
                                <div className="portal-card-soft">
                                    <div className="portal-kv"><span>Total Present</span><strong>{ATTENDANCE_SUMMARY.present}</strong></div>
                                    <div className="portal-kv"><span>Total Absent</span><strong>{ATTENDANCE_SUMMARY.absent}</strong></div>
                                    <div className="portal-kv"><span>Approved Leave</span><strong>{ATTENDANCE_SUMMARY.leave}</strong></div>
                                    <div className="portal-progress">
                                        <div className="portal-progress__bar" style={{ width: `${ATTENDANCE_SUMMARY.percentage}%`, background: '#059669' }} />
                                    </div>
                                    <p className="portal-note">Target: Maintain 90%+ attendance.</p>
                                </div>
                                <div className="portal-card-soft">
                                    <h4 className="portal-card-title">This Week</h4>
                                    <div className="portal-week-grid">
                                        {ATTENDANCE_SUMMARY.weekly.map(d => (
                                            <div key={d.day} className={`portal-day-chip ${d.status === 'P' ? 'ok' : d.status === 'L' ? 'warn' : 'bad'}`}>
                                                <span>{d.day}</span>
                                                <strong>{d.status}</strong>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="portal-note">P: Present, A: Absent, L: Leave</p>
                                </div>
                            </div>
                        </Section>

                        <Section id="student-timetable" title="Today's Timetable" icon="T">
                            <div className="portal-table-wrap">
                                <table className="portal-table">
                                    <thead>
                                        <tr>
                                            <th>Period</th>
                                            <th>Time</th>
                                            <th>Subject</th>
                                            <th>Teacher</th>
                                            <th>Room</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {TODAY_TIMETABLE.map(item => (
                                            <tr key={item.period}>
                                                <td>{item.period}</td>
                                                <td>{item.time}</td>
                                                <td>{item.subject}</td>
                                                <td>{item.teacher}</td>
                                                <td>{item.room}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section id="student-homework" title="Assignments And Homework" icon="H">
                            <div className="portal-list-stack">
                                {ASSIGNMENTS.map(task => (
                                    <div key={task.id} className="portal-line-item">
                                        <div>
                                            <div className="portal-notice-title">{task.subject}</div>
                                            <div className="portal-notice-body">{task.task}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className={`portal-chip ${task.status === 'submitted' ? 'success' : task.status === 'in_review' ? 'info' : 'warn'}`}>
                                                {task.status.replace('_', ' ')}
                                            </div>
                                            <div className="portal-mini-date">Due: {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section id="student-exams" title="Exam Planner" icon="E">
                            <div className="portal-grid-2">
                                <div className="portal-card-soft">
                                    <h4 className="portal-card-title">Upcoming Exams</h4>
                                    {EXAMS.map(exam => (
                                        <div key={exam.id} className="portal-line-item no-border">
                                            <div>
                                                <div className="portal-notice-title">{exam.subject}</div>
                                                <div className="portal-notice-body">{exam.syllabus}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div className="portal-chip info">{new Date(exam.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                                                <div className="portal-mini-date">{exam.mode}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="portal-card-soft">
                                    <h4 className="portal-card-title">Teacher Support Slots</h4>
                                    {TEACHER_SUPPORT.map(t => (
                                        <div key={t.id} className="portal-line-item no-border">
                                            <div>
                                                <div className="portal-notice-title">{t.name}</div>
                                                <div className="portal-notice-body">{t.subject}</div>
                                            </div>
                                            <div className="portal-mini-date">{t.slot}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        <Section title="School Notices" icon="N">
                            {notices.length === 0 ? (
                                <div className="portal-empty">No notices at this time. Check back later.</div>
                            ) : notices.map(n => (
                                <div key={n._id} id={`s-notice-${n._id}`} className="portal-notice-item">
                                    <span className="portal-notice-tag" style={{ background: (TAG_COLORS[n.category] || '#6b7280') + '20', color: TAG_COLORS[n.category] || '#6b7280' }}>
                                        {n.category}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <div className="portal-notice-title">{n.title}</div>
                                        <div className="portal-notice-body">{n.content}</div>
                                    </div>
                                    <div className="portal-notice-date">
                                        {new Date(n.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </div>
                                </div>
                            ))}
                        </Section>

                        <Section title="Upcoming Events" icon="C">
                            {events.length === 0 ? (
                                <div className="portal-empty">No upcoming events right now.</div>
                            ) : events.map(ev => (
                                <div key={ev._id} id={`s-event-${ev._id}`} className="portal-event-item">
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
                                    <span className="portal-event-tag" style={{ background: '#dbeafe', color: '#1a56db' }}>{ev.category}</span>
                                </div>
                            ))}
                        </Section>

                        <Section title="School Achievements" icon="W">
                            {ACHIEVEMENTS.map((a, i) => (
                                <div key={i} className="portal-achievement-item">
                                    <div className="portal-achievement-icon">{a.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div className="portal-notice-title">{a.title}</div>
                                        <div className="portal-notice-body">{a.desc}</div>
                                    </div>
                                    <div className="portal-notice-date" style={{ color: '#059669', fontWeight: 700 }}>{a.year}</div>
                                </div>
                            ))}
                        </Section>
                    </>
                )}
            </main>
        </div>
    );
}
