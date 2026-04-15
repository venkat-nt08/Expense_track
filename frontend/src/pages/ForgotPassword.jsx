import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { forgotPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            return setError('Email is required');
        }
        if (newPassword.length < 6) {
            return setError('Password must be at least 6 characters');
        }
        if (newPassword.length > 72) {
            return setError('Password must be 72 characters or less');
        }
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await forgotPassword(email, newPassword);
            setSuccess('Password updated successfully. You can now log in.');
            setError('');
            setEmail('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to reset password';
            setError(errorMessage);
            setSuccess('');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Forgot Password</h2>
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {success && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>New Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                        <small style={{ color: newPassword.length > 72 ? 'var(--danger)' : 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>
                            {newPassword.length}/72 characters
                        </small>
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Reset Password</button>
                </form>
                <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Remembered your password? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
