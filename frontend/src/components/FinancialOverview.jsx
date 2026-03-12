import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import { FaDownload } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

const FinancialOverview = ({ expenses }) => {

    const { chartData, totalIncome, totalExpense } = useMemo(() => {
        if (!expenses || expenses.length === 0) {
            return { chartData: null, totalIncome: 0, totalExpense: 0 };
        }

        const income = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
        const expense = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

        // Group expenses by category for the chart
        const expenseItems = expenses.filter(e => e.type === 'expense');
        const categoryTotals = expenseItems.reduce((acc, curr) => {
            const name = curr.category?.name || 'Uncategorized';
            const color = curr.category?.color || '#cbd5e1';
            if (!acc[name]) {
                acc[name] = { total: 0, color };
            }
            acc[name].total += curr.amount;
            return acc;
        }, {});

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals).map(c => c.total);
        const backgroundColor = Object.values(categoryTotals).map(c => c.color);

        const chartData = {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor,
                    borderColor: 'rgba(0,0,0,0)',
                    borderWidth: 1,
                },
            ],
        };

        return { chartData, totalIncome: income, totalExpense: expense };
    }, [expenses]);

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Financial Overview", 20, 20);

        doc.setFontSize(12);
        doc.text(`Total Income: Rs. ${totalIncome.toFixed(2)}`, 20, 40);
        doc.text(`Total Expense: Rs. ${totalExpense.toFixed(2)}`, 20, 50);
        doc.text(`Net Balance: Rs. ${(totalIncome - totalExpense).toFixed(2)}`, 20, 60);

        let y = 80;
        doc.text("Category Breakdown (Expenses):", 20, y);
        y += 10;

        if (chartData) {
            chartData.labels.forEach((label, index) => {
                const value = chartData.datasets[0].data[index];
                doc.text(`${label}: Rs. ${value.toFixed(2)}`, 20, y);
                y += 10;
            });
        }

        doc.save("financial_overview.pdf");
    };

    if (!chartData && totalIncome === 0) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No data for this period</div>;
    }

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Net Balance</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: (totalIncome - totalExpense) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    ₹{(totalIncome - totalExpense).toFixed(2)}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Income</div>
                    <div style={{ color: 'var(--success)', fontWeight: 'bold' }}>+₹{totalIncome.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Expense</div>
                    <div style={{ color: 'var(--danger)', fontWeight: 'bold' }}>-₹{totalExpense.toFixed(2)}</div>
                </div>
            </div>

            {chartData && (
                <div style={{ height: '250px', position: 'relative' }}>
                    <Pie
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: { color: '#fff' }
                                }
                            }
                        }}
                    />
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button className="btn-primary" onClick={downloadPDF} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}>
                    <FaDownload /> Download Report
                </button>
            </div>
        </div>
    );
};

export default FinancialOverview;
