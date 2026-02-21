import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const BackIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);

export default function AdmissionForm() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        applicantName: '',
        dateOfBirth: '',
        gender: 'male',
        applyingForClass: 'I',
        fatherName: '',
        motherName: '',
        contactNumber: '',
        email: '',
        address: '',
        previousSchool: '',
        academicYear: '2024-25',
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleNext = () => {
        // Simple validation
        if (step === 1) {
            if (!formData.applicantName || !formData.dateOfBirth || !formData.applyingForClass) {
                setError('Please fill all required student details.');
                return;
            }
        } else if (step === 2) {
            if (!formData.fatherName || !formData.contactNumber || !formData.email) {
                setError('Please fill all required parent details.');
                return;
            }
        }
        setStep(prev => prev + 1);
        setError('');
    };

    const handleBack = () => {
        setError('');
        if (step > 1) setStep(prev => prev - 1);
        else navigate('/admissions');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // In a real app, we'd handle file uploads too. 
            // For now, we send the text data.
            await api.post('/admissions/apply', formData, false);
            setSuccess(true);
            setStep(4);
        } catch (err) {
            setError(err.message || 'Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="portal-page" style={{ alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div className="portal-section" style={{ maxWidth: '400px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                    <h2 style={{ color: 'var(--gray-900)', marginBottom: '12px' }}>Application Submitted!</h2>
                    <p style={{ color: 'var(--gray-600)', fontSize: '14px', marginBottom: '24px' }}>
                        Your admission application for <strong>{formData.applicantName}</strong> has been received successfully.
                        Our team will contact you within 2-3 business days.
                    </p>
                    <button className="login-btn" style={{ background: '#1a56db' }} onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="portal-page" style={{ flexDirection: 'column' }}>
            <header className="top-bar">
                <button className="top-bar__back" onClick={handleBack}><BackIcon /></button>
                <span className="top-bar__title">Online Admission Form</span>
            </header>

            <main className="portal-main" style={{ margin: '0 auto', maxWidth: '600px', padding: '24px 16px' }}>
                <div className="process-inner" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', background: '#e5e7eb', zIndex: 0 }} />
                        <div style={{ position: 'absolute', top: '15px', left: '0', width: `${((step - 1) / 2) * 100}%`, height: '2px', background: '#1a56db', zIndex: 0, transition: 'width .3s' }} />
                        {[1, 2, 3].map(s => (
                            <div key={s} style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%', background: step >= s ? '#1a56db' : '#fff', color: step >= s ? '#fff' : '#9ca3af',
                                    border: `2px solid ${step >= s ? '#1a56db' : '#e5e7eb'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700
                                }}>
                                    {s}
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: 600, color: step >= s ? 'var(--gray-900)' : 'var(--gray-400)' }}>
                                    {s === 1 ? 'Student' : s === 2 ? 'Parents' : 'Review'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="portal-section">
                        {step === 1 && (
                            <div className="form-step">
                                <h3 className="portal-section__title">Student Details</h3>
                                <div className="form-field">
                                    <label>Applicant Full Name *</label>
                                    <input type="text" value={formData.applicantName} onChange={e => updateField('applicantName', e.target.value)} placeholder="Enter student's full name" />
                                </div>
                                <div className="form-field">
                                    <label>Date of Birth *</label>
                                    <input type="date" value={formData.dateOfBirth} onChange={e => updateField('dateOfBirth', e.target.value)} />
                                </div>
                                <div className="form-field">
                                    <label>Gender</label>
                                    <select value={formData.gender} onChange={e => updateField('gender', e.target.value)}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>Applying for Class *</label>
                                    <select value={formData.applyingForClass} onChange={e => updateField('applyingForClass', e.target.value)}>
                                        {['Nursery', 'KG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map(c => (
                                            <option key={c} value={c}>Class {c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="form-step">
                                <h3 className="portal-section__title">Parent / Guardian Details</h3>
                                <div className="form-field">
                                    <label>Father's Name *</label>
                                    <input type="text" value={formData.fatherName} onChange={e => updateField('fatherName', e.target.value)} placeholder="Full name of father" />
                                </div>
                                <div className="form-field">
                                    <label>Mother's Name *</label>
                                    <input type="text" value={formData.motherName} onChange={e => updateField('motherName', e.target.value)} placeholder="Full name of mother" />
                                </div>
                                <div className="form-field">
                                    <label>Contact Number *</label>
                                    <input type="tel" value={formData.contactNumber} onChange={e => updateField('contactNumber', e.target.value)} placeholder="Primary mobile number" />
                                </div>
                                <div className="form-field">
                                    <label>Email Address *</label>
                                    <input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="Enter email address" />
                                </div>
                                <div className="form-field">
                                    <label>Full Address</label>
                                    <textarea
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e5e7eb', outline: 'none', background: '#fff' }}
                                        rows="3" value={formData.address} onChange={e => updateField('address', e.target.value)} placeholder="Permanent residential address"
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="form-step">
                                <h3 className="portal-section__title">Application Summary</h3>
                                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                                    <div><strong>Student:</strong> {formData.applicantName} (Class {formData.applyingForClass})</div>
                                    <div><strong>DOB:</strong> {formData.dateOfBirth}</div>
                                    <div><strong>Parents:</strong> {formData.fatherName} & {formData.motherName}</div>
                                    <div><strong>Contact:</strong> {formData.contactNumber} | {formData.email}</div>
                                    <div><strong>Year:</strong> {formData.academicYear}</div>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '16px' }}>
                                    By submitting, you agree to the school's admission policy. A non-refundable registration fee might be required during the school visit.
                                </p>
                            </div>
                        )}

                        {error && <p className="login-error" style={{ marginTop: '16px' }}>{error}</p>}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            {step > 1 && (
                                <button className="login-btn" style={{ background: '#f3f4f6', color: '#374151' }} onClick={handleBack}>
                                    Back
                                </button>
                            )}
                            {step < 3 ? (
                                <button className="login-btn" style={{ background: '#1a56db' }} onClick={handleNext}>
                                    Next Step
                                </button>
                            ) : (
                                <button className="login-btn" style={{ background: '#059669' }} onClick={handleSubmit} disabled={loading}>
                                    {loading ? <span className="login-spinner" /> : 'Submit Application'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
