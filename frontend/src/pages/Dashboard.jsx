import { useState, useEffect, useMemo } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FinancialOverview from '../components/FinancialOverview';
import FilterBar from '../components/FilterBar';
import { useFilter } from '../context/FilterContext';
import { getExpenses } from '../services/api';
import { FaPlus, FaWallet, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const { applyFilter } = useFilter();

    const fetchExpenses = async () => {
        try {
            const response = await getExpenses();
            setExpenses(response.data);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [refresh]);

    const handleExpenseAdded = () => {
        setRefresh(!refresh);
        setShowForm(false);
        setEditingExpense(null);
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setShowForm(true);
    };

    const openAddForm = () => {
        setEditingExpense(null);
        setShowForm(true);
    };

    // Filter Logic via global context
    const filteredExpenses = useMemo(() => applyFilter(expenses), [expenses, applyFilter]);

    // Calculate Totals based on filtered data
    const totalIncome = filteredExpenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = filteredExpenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const totalBalance = totalIncome - totalExpense;

    return (
        <div className="container" style={{ maxWidth: '1400px' }}>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}
            >
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <FilterBar />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary"
                        onClick={openAddForm}
                    >
                        <FaPlus style={{ marginRight: '0.5rem' }} /> Add Transaction
                    </motion.button>
                </div>
            </motion.header>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel"
                    style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                >
                    <div style={{ padding: '1rem', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)' }}>
                        <FaCreditCard size={24} />
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Balance</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₹{totalBalance.toLocaleString()}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel"
                    style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                >
                    <div style={{ padding: '1rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
                        <FaWallet size={24} />
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Income</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₹{totalIncome.toLocaleString()}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel"
                    style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                >
                    <div style={{ padding: '1rem', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}>
                        <FaMoneyBillWave size={24} />
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Expense</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₹{totalExpense.toLocaleString()}</div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
                {/* Recent Transactions */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-panel"
                    style={{ padding: '1.5rem', minHeight: '400px' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Recent Transactions</h2>
                        <button style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>See All &gt;</button>
                    </div>
                    <ExpenseList expenses={filteredExpenses.slice(0, 5)} onDelete={handleExpenseAdded} onEdit={handleEdit} compact={true} />
                </motion.div>

                {/* Financial Overview (Chart) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-panel"
                    style={{ padding: '1.5rem', minHeight: '400px' }}
                >
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Financial Overview</h2>
                    <div style={{ height: '300px' }}>
                        <FinancialOverview expenses={filteredExpenses} />
                    </div>
                </motion.div>
            </div>

            {/* Modal Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-panel"
                            style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h2>{editingExpense ? 'Edit Transaction' : 'New Transaction'}</h2>
                                <button onClick={() => setShowForm(false)} style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem' }}>&times;</button>
                            </div>
                            <ExpenseForm onSuccess={handleExpenseAdded} initialData={editingExpense} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
