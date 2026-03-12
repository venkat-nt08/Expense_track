import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaSignOutAlt, FaUserCircle, FaWallet, FaMoneyBillWave, FaCog } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ProfileModal from './ProfileModal';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showProfile, setShowProfile] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
            <motion.div
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                className="sidebar glass-panel"
                style={{
                    width: '220px',
                    height: '96vh',
                    position: 'fixed',
                    left: '1rem',
                    top: '2vh',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.5rem',
                    zIndex: 100,
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
            >
                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--primary)',
                        fontSize: '1.5rem',
                        letterSpacing: '-0.02em',
                        textShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
                    }}>
                        Expense<span style={{ color: 'var(--text)' }}>Tracker</span>
                    </h2>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    position: 'relative'
                }}
                    onClick={() => setShowProfile(true)}
                    title="Click to edit profile"
                >
                    <FaUserCircle size={48} color="var(--text-secondary)" style={{ marginBottom: '0.75rem' }} />
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.2rem' }}>
                        {user?.name || user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
                        {user?.email || 'user@example.com'}
                    </div>
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', opacity: 0.6 }}>
                        <FaCog />
                    </div>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.85rem 1rem',
                            borderRadius: '12px',
                            background: isActive('/') ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.15), transparent)' : 'transparent',
                            color: isActive('/') ? 'var(--primary)' : 'var(--text-secondary)',
                            borderLeft: isActive('/') ? '3px solid var(--primary)' : '3px solid transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '0.95rem',
                            fontWeight: isActive('/') ? '600' : '500',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <FaHome size={18} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/income')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.85rem 1rem',
                            borderRadius: '12px',
                            background: isActive('/income') ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.15), transparent)' : 'transparent',
                            color: isActive('/income') ? 'var(--primary)' : 'var(--text-secondary)',
                            borderLeft: isActive('/income') ? '3px solid var(--primary)' : '3px solid transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '0.95rem',
                            fontWeight: isActive('/income') ? '600' : '500',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <FaWallet size={18} />
                        Income
                    </button>
                    <button
                        onClick={() => navigate('/expenses')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.85rem 1rem',
                            borderRadius: '12px',
                            background: isActive('/expenses') ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.15), transparent)' : 'transparent',
                            color: isActive('/expenses') ? 'var(--primary)' : 'var(--text-secondary)',
                            borderLeft: isActive('/expenses') ? '3px solid var(--primary)' : '3px solid transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '0.95rem',
                            fontWeight: isActive('/expenses') ? '600' : '500',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <FaMoneyBillWave size={18} />
                        Expense
                    </button>
                </nav>

                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--danger)',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: 'auto',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <FaSignOutAlt size={18} />
                    Logout
                </button>
            </motion.div>
        </>
    );
};

export default Sidebar;
