import React, { useEffect } from 'react';

const featureModules = [
    {
        id: 'admin',
        title: 'Admin & Super Admin',
        icon: '🔐',
        image: '/features/05_home4.png',
        description: 'Core controls, roles, analytics & reporting.',
        points: ['Role-based access (Admin, Teacher, Student, Parent)', 'School profile & academic year setup', 'Class, section & subject creation', 'Timetable configuration', 'Analytics & Reports (Attendance, Fees, Exams)']
    },
    {
        id: 'teacher',
        title: 'Teacher Management',
        icon: '👩‍🏫',
        image: '/features/teacher-dashboards-img.jpg',
        description: 'Tools for educators to manage classes and performance.',
        points: ['Class & subject allocation', 'Digital attendance marking', 'Homework & assignment upload', 'Exam paper & result entry', 'Student-wise performance tracking']
    },
    {
        id: 'student',
        title: 'Student Management',
        icon: '👨‍🎓',
        image: '/features/student-Screenshot_1.png',
        description: 'Complete student profiles and learning support.',
        points: ['Personal & academic details', 'Attendance record', 'Exam marks & grades', 'Homework & assignments', 'Study materials (PDF, videos)']
    },
    {
        id: 'parent',
        title: 'Parent Portal',
        icon: '👪',
        image: '/features/parent-eye-banner-1.png',
        description: 'Real-time updates and transparency for parents.',
        points: ['Real-time attendance tracking', 'Fee payment & receipts', 'Exam results & report cards', 'Teacher communication', 'School announcements']
    },
    {
        id: 'finance',
        title: 'Fees & Finance',
        icon: '🧾',
        image: '/features/accountent-fees-and-fine-management.jpg',
        description: 'Comprehensive financial tracking and fee collection.',
        points: ['Fee structure setup (monthly/quarterly)', 'Online payments (UPI, cards, net banking)', 'Automatic receipt generation', 'Income & expense tracking', 'Salary management & GST reports']
    },
    {
        id: 'examination',
        title: 'Examination & Results',
        icon: '📝',
        image: '/features/exam-screenshot.webp',
        description: 'End-to-end exam management from schedules to report cards.',
        points: ['Exam timetable creation', 'Online & offline exams', 'Auto-grading for MCQs', 'Grade calculation, rank & percentile', 'Digital report cards']
    },
    {
        id: 'attendance',
        title: 'Attendance Management',
        icon: '📅',
        image: '/features/attendence-Student_Attendance.webp',
        description: 'Smart attendance tracking with instant alerts.',
        points: ['Manual, Biometric, RFID, Mobile app-based', 'Absent notifications to parents', 'Monthly attendance reports', 'Low attendance warnings']
    },
    {
        id: 'communication',
        title: 'Communication System',
        icon: '📢',
        image: '/features/notification-alert-management-system.jpg',
        description: 'Multi-channel communication linking all stakeholders.',
        points: ['SMS, Email, Mobile app notifications', 'Circulars & notices', 'Exam alerts & Holiday announcements', 'Fee reminders & Emergency messages']
    },
    {
        id: 'transport',
        title: 'Transport Management',
        icon: '🚌',
        image: '/features/transport-integration_vehical_tracking.svg',
        description: 'Ensure student safety with live tracking and routing.',
        points: ['Bus & route management', 'Student pickup/drop mapping', 'GPS live tracking', 'Driver & vehicle details', 'Transport fee integration']
    },
    {
        id: 'library',
        title: 'Library Management',
        icon: '📚',
        image: '/features/library-school-erp-modules-blog.jpg',
        description: 'Digital cataloging and issue-return tracking.',
        points: ['Book cataloging', 'Issue & return tracking', 'Fine calculation', 'Student library history', 'Barcode / RFID support']
    },
    {
        id: 'hostel',
        title: 'Hostel & Health',
        icon: '🏥',
        image: '/features/Hostel-Management-System-banner.png',
        description: 'Residential management and health tracking.',
        points: ['Room allocation & Hostel attendance', 'Hostel fee management', 'Visitor logs', 'Medical records & Vaccination details', 'Emergency contacts']
    },
    {
        id: 'security',
        title: 'Security & Data',
        icon: '🔐',
        image: '/features/securty-67ab6226372b182be4e12169_60a23b06b2d3123baf7c305d_RBAC.png',
        description: 'Enterprise-grade security and role-based access.',
        points: ['Role-based access control', 'Encrypted data storage', 'Cloud backups', 'Audit logs', 'GDPR-ready compliance']
    }
];

export default function Features() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="features-container" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header className="features-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-color, #333)' }}>
                    School ERP Features
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-light, #666)', maxWidth: '800px', margin: '0 auto' }}>
                    Our School ERP system automates, manages, and integrates all school operations — academics, administration, finance, communication, and analytics — in one comprehensive platform.
                </p>
            </header>

            <div className="features-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2.5rem'
            }}>
                {featureModules.map(module => (
                    <div key={module.id} className="feature-card" style={{
                        background: 'var(--bg-card, #fff)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}>
                        <div className="feature-image-wrapper" style={{ height: '200px', overflow: 'hidden', background: '#f5f5f5' }}>
                            <img
                                src={module.image}
                                alt={module.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.src = '/features/05_home4.png'; // Fallback
                                }}
                            />
                        </div>

                        <div className="feature-content" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.8rem' }}>{module.icon}</span>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{module.title}</h2>
                            </div>

                            <p style={{ color: 'var(--text-light, #666)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                {module.description}
                            </p>

                            <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--text-color, #444)' }}>
                                {module.points.map((point, idx) => (
                                    <li key={idx} style={{ marginBottom: '0.5rem', lineHeight: '1.4' }}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
