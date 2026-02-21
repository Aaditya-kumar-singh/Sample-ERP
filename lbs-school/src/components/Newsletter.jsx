import { useState } from 'react';
import { api } from '../utils/api';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            await api.post('/newsletter/subscribe', { email }, false);
            setDone(true);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again later.');
        }
    };

    return (
        <section className="newsletter-section">
            <div className="newsletter-inner">
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>📬</span>
                <h2>Stay in the Loop</h2>
                <p>
                    Get school announcements, event reminders, and exam schedules delivered directly to your inbox.
                    Join 2,000+ parents and alumni who stay connected with LBS.
                </p>

                {done ? (
                    <div className="newsletter-success">
                        <span style={{ fontSize: '24px' }}>✅</span>
                        <div>
                            <strong>You're subscribed!</strong>
                            <br />
                            <span style={{ fontSize: '13px', color: 'var(--gray-600)' }}>Check your inbox for a confirmation email.</span>
                        </div>
                    </div>
                ) : (
                    <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
                        <input
                            id="newsletter-email-input"
                            className="newsletter-input"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError(''); }}
                            aria-label="Email address"
                        />
                        <button id="newsletter-subscribe-btn" type="submit" className="newsletter-btn">
                            Subscribe
                        </button>
                    </form>
                )}
                {error && <p style={{ fontSize: '13px', color: '#ef4444', marginTop: '8px', fontWeight: 600 }}>{error}</p>}
                <p style={{ fontSize: '11px', color: 'var(--gray-500)', marginTop: '12px' }}>
                    No spam. Unsubscribe anytime. We respect your privacy.
                </p>
            </div>
        </section>
    );
}
