import { useState } from 'react';

const notices = [
    { id: 1, tag: 'Admission', color: '#1a56db', tagBg: '#dbeafe', title: 'Admissions Open 2024-25', desc: 'Online applications accepted for all classes. Limited seats — apply early.', date: 'Feb 20, 2026' },
    { id: 2, tag: 'Exam', color: '#7c3aed', tagBg: '#ede9fe', title: 'Pre-Board Exams: March 25', desc: 'Pre-board schedule for Class X & XII released. Download hall tickets from portal.', date: 'Feb 18, 2026' },
    { id: 3, tag: 'Event', color: '#059669', tagBg: '#dcfce7', title: 'Annual Day – March 10', desc: 'Grand Annual Day celebrations with prize-giving ceremony. All parents invited.', date: 'Feb 15, 2026' },
    { id: 4, tag: 'Holiday', color: '#f59e0b', tagBg: '#fef3c7', title: 'Holi Break: March 14–16', desc: 'School will remain closed for Holi celebrations. Classes resume March 17.', date: 'Feb 14, 2026' },
    { id: 5, tag: 'Sports', color: '#ef4444', tagBg: '#fee2e2', title: 'Cricket Tournament – March 28', desc: 'Inter-school cricket championship at the main ground. Register by March 15.', date: 'Feb 12, 2026' },
    { id: 6, tag: 'Academic', color: '#0891b2', tagBg: '#e0f2fe', title: 'Science Olympiad – Feb 22', desc: 'State-level science olympiad at the school auditorium. Shortlisted students report by 8:30 AM.', date: 'Feb 10, 2026' },
];

const tickerItems = [
    '📣 Admissions Open 2024–25 — Apply Now',
    '🗓️ Pre-Board Exams: Class X & XII from March 25',
    '🎉 Annual Day & Prize-Giving: March 10 — All Parents Invited',
    '🏏 Inter-School Cricket Tournament: March 28 at Main Ground',
    '🔬 Science Olympiad: Feb 22 — Shortlisted Students Report 8:30 AM',
    '🌸 Holi Break: March 14–16 — School Reopens March 17',
];

export default function AnnouncementTicker({ onOpenNotices }) {
    return (
        <div className="ticker-bar" role="marquee" aria-label="Announcements">
            <span className="ticker-label">📢 NOTICE</span>
            <div className="ticker-track">
                {/* duplicate for seamless loop */}
                {[...tickerItems, ...tickerItems].map((item, i) => (
                    <span key={i} className="ticker-item" onClick={onOpenNotices} style={{ cursor: 'pointer' }}>
                        <span className="ticker-dot" />
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}

export function NoticeBoard({ onClose }) {
    return (
        <div className="notice-board" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="notice-box">
                <div className="notice-box__header">
                    <h3>📋 Notice Board</h3>
                    <button id="notice-close-btn" className="notice-close" onClick={onClose} aria-label="Close">✕</button>
                </div>
                <div className="notice-list">
                    {notices.map(n => (
                        <div key={n.id} id={`notice-${n.id}`} className="notice-item">
                            <div className="notice-item__top">
                                <span className="notice-item__tag" style={{ background: n.tagBg, color: n.color }}>{n.tag}</span>
                                <span className="notice-item__date">{n.date}</span>
                            </div>
                            <h4>{n.title}</h4>
                            <p>{n.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
