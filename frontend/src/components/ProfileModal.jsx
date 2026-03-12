import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/api';
import { FaUserCircle, FaSave, FaTimes, FaCamera } from 'react-icons/fa';

const ProfileModal = ({ onClose }) => {
    const [profile, setProfile] = useState({ name: '', email: '', avatar_url: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await getProfile();
            setProfile({
                name: res.data.name || '',
                email: res.data.email || '',
                avatar_url: res.data.avatar_url || '',
            });
        } catch (err) {
            console.error('Failed to load profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await updateProfile({ name: profile.name, avatar_url: profile.avatar_url });
            setMessage('✅ Profile updated successfully!');
        } catch (err) {
            setMessage('❌ Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const avatarColors = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '480px', borderRadius: '20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Profile Settings</h2>
                    <button onClick={onClose} style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '1.4rem', cursor: 'pointer' }}>
                        <FaTimes />
                    </button>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</p>
                ) : (
                    <>
                        {/* Avatar preview */}
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            {profile.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt="avatar"
                                    style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
                                />
                            ) : (
                                <div style={{
                                    width: '90px', height: '90px', borderRadius: '50%', margin: '0 auto',
                                    background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2.5rem', fontWeight: 'bold', color: 'white',
                                    border: '3px solid var(--primary)'
                                }}>
                                    {profile.name ? profile.name[0].toUpperCase() : profile.email[0].toUpperCase()}
                                </div>
                            )}
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                Paste an image URL below to set your photo
                            </p>
                        </div>

                        {/* Form */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="form-label">Display Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your name"
                                    value={profile.name}
                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="form-label">Email (read-only)</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={profile.email}
                                    readOnly
                                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                />
                            </div>

                            <div>
                                <label className="form-label">Profile Photo URL</label>
                                <input
                                    type="url"
                                    className="form-input"
                                    placeholder="https://example.com/photo.jpg"
                                    value={profile.avatar_url}
                                    onChange={e => setProfile({ ...profile, avatar_url: e.target.value })}
                                />
                            </div>

                            {/* Avatar color options */}
                            <div>
                                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Or Pick an Accent Color</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {avatarColors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setProfile({ ...profile, avatar_url: '' })}
                                            style={{
                                                width: '28px', height: '28px', borderRadius: '50%',
                                                background: color, border: '2px solid transparent',
                                                cursor: 'pointer', transition: 'transform 0.2s'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {message && (
                                <div style={{
                                    padding: '0.75rem', borderRadius: '8px',
                                    background: message.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                    color: message.startsWith('✅') ? 'var(--success)' : 'var(--danger)',
                                    fontSize: '0.9rem'
                                }}>
                                    {message}
                                </div>
                            )}

                            <button
                                className="btn-primary"
                                onClick={handleSave}
                                disabled={saving}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem', marginTop: '0.5rem' }}
                            >
                                <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;
