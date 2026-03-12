import { useState, useEffect, useMemo } from 'react';
import { getExpenses } from '../services/api';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import FilterBar from '../components/FilterBar';
import { useFilter } from '../context/FilterContext';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Expenses = () => {
    const [allExpenses, setAllExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const { applyFilter } = useFilter();

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await getExpenses(0, 1000);
            const expenseData = response.data.filter(item => item.type === 'expense');
            setAllExpenses(expenseData);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setShowForm(true);
    };

    const handleSuccess = () => {
        setShowForm(false);
        setEditingExpense(null);
        fetchExpenses();
    };

    // Apply global filter
    const expenses = useMemo(() => applyFilter(allExpenses), [allExpenses, applyFilter]);

    // Category Totals
    const categoryTotals = expenses.reduce((acc, curr) => {
        const catName = curr.category?.name || 'Uncategorized';
        if (!acc[catName]) acc[catName] = 0;
        acc[catName] += curr.amount;
        return acc;
    }, {});

    const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = {
        labels: sortedExpenses.map(i => new Date(i.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })),
        datasets: [{
            label: 'Expense',
            data: sortedExpenses.map(i => i.amount),
            borderColor: 'rgba(239, 68, 68, 1)',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            tension: 0.4,
            fill: true,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#cbd5e1' } },
            x: { grid: { display: false }, ticks: { color: '#cbd5e1' } }
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Expense Overview</h2>
                <FilterBar />
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', height: '300px' }}>
                <Line data={chartData} options={chartOptions} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Category Breakdown</h3>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        {Object.entries(categoryTotals).length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>No data for this period</p>
                        ) : (
                            Object.entries(categoryTotals).map(([name, amount]) => (
                                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                    <span>{name}</span>
                                    <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>₹{amount.toFixed(2)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: '1rem' }}>All Expenses</h3>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <ExpenseList
                            expenses={expenses}
                            onDelete={fetchExpenses}
                            onEdit={handleEdit}
                            typeFilter="expense"
                            compact={true}
                        />
                    </div>
                </div>
            </div>

            {showForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h2>Edit Transaction</h2>
                            <button onClick={() => setShowForm(false)} style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <ExpenseForm onSuccess={handleSuccess} initialData={editingExpense} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
