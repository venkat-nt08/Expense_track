import { useState } from 'react';
import { deleteExpense } from '../services/api';
import { FaEllipsisV, FaEdit, FaTrash, FaUtensils, FaCar, FaHome, FaShoppingBag, FaPlane, FaFilm, FaMedkit, FaGamepad, FaBriefcase, FaMoneyBillWave } from 'react-icons/fa';

const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('food') || name.includes('dining')) return <FaUtensils />;
    if (name.includes('transport') || name.includes('car') || name.includes('fuel')) return <FaCar />;
    if (name.includes('home') || name.includes('rent') || name.includes('house')) return <FaHome />;
    if (name.includes('shop') || name.includes('cloth')) return <FaShoppingBag />;
    if (name.includes('travel') || name.includes('trip')) return <FaPlane />;
    if (name.includes('movie') || name.includes('cinema') || name.includes('entertainment')) return <FaFilm />;
    if (name.includes('health') || name.includes('medical')) return <FaMedkit />;
    if (name.includes('game')) return <FaGamepad />;
    if (name.includes('salary') || name.includes('job')) return <FaBriefcase />;
    return <FaMoneyBillWave />;
};

const ExpenseList = ({ expenses, onDelete, onEdit, compact = false, typeFilter = null }) => {
    const [activeMenu, setActiveMenu] = useState(null);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteExpense(id);
                onDelete();
            } catch (err) {
                console.error(err);
            }
        }
        setActiveMenu(null);
    };

    const toggleMenu = (id) => {
        if (activeMenu === id) {
            setActiveMenu(null);
        } else {
            setActiveMenu(id);
        }
    };

    // Filter expenses if typeFilter is provided
    const filteredExpenses = typeFilter
        ? expenses.filter(e => e.type === typeFilter)
        : expenses;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredExpenses.map(expense => (
                <div
                    key={expense.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: compact ? 'transparent' : 'rgba(255,255,255,0.03)',
                        borderRadius: '16px',
                        borderBottom: compact ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: expense.category?.color ? `${expense.category.color}20` : 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: expense.category?.color || 'var(--text)',
                            fontSize: '1.2rem'
                        }}>
                            {getCategoryIcon(expense.category?.name)}
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>{expense.title}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {new Date(expense.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            color: expense.type === 'income' ? 'var(--success)' : 'var(--danger)',
                            background: expense.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px'
                        }}>
                            {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toFixed(2)}
                        </div>

                        {!compact && (
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => toggleMenu(expense.id)}
                                    style={{ background: 'none', color: 'var(--text-secondary)', padding: '0.5rem', cursor: 'pointer' }}
                                >
                                    <FaEllipsisV />
                                </button>
                                {activeMenu === expense.id && (
                                    <div style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '100%',
                                        background: 'var(--surface)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                        zIndex: 10,
                                        overflow: 'hidden',
                                        minWidth: '120px'
                                    }}>
                                        <button
                                            onClick={() => { onEdit(expense); setActiveMenu(null); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                                                padding: '0.75rem 1rem', background: 'none', color: 'var(--text)', textAlign: 'left',
                                                borderBottom: '1px solid rgba(255,255,255,0.05)'
                                            }}
                                        >
                                            <FaEdit style={{ color: 'var(--primary)' }} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(expense.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                                                padding: '0.75rem 1rem', background: 'none', color: 'var(--danger)', textAlign: 'left'
                                            }}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {filteredExpenses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No transactions found.
                </div>
            )}
        </div>
    );
};

export default ExpenseList;
