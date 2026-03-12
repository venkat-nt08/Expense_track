import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getMonthlyReport } from '../services/api';
import { jsPDF } from 'jspdf';
import { FaDownload } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

const MonthlyReport = ({ refresh }) => {
    const [chartData, setChartData] = useState(null);
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);

    useEffect(() => {
        const fetchReport = async () => {
            const now = new Date();
            try {
                const res = await getMonthlyReport(now.getFullYear(), now.getMonth() + 1);
                const data = res.data;

                if (data.length === 0) {
                    setChartData(null);
                    setTotalExpense(0);
                    setTotalIncome(0);
                    return;
                }

                // Filter for expenses only for the chart
                const expenseData = data.filter(item => item.type === 'expense');
                const incomeData = data.filter(item => item.type === 'income');

                const labels = expenseData.map(item => item.category);
                const values = expenseData.map(item => item.total);
                const colors = expenseData.map(item => item.color);

                setTotalExpense(expenseData.reduce((a, b) => a + b.total, 0));
                setTotalIncome(incomeData.reduce((a, b) => a + b.total, 0));

                setChartData({
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: colors,
                            borderColor: 'rgba(0,0,0,0)',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchReport();
    }, [refresh]);

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Monthly Expense Report", 20, 20);

        doc.setFontSize(12);
        doc.text(`Total Income: Rs. ${totalIncome.toFixed(2)}`, 20, 40);
        doc.text(`Total Expense: Rs. ${totalExpense.toFixed(2)}`, 20, 50);
        doc.text(`Net Balance: Rs. ${(totalIncome - totalExpense).toFixed(2)}`, 20, 60);

        // Simple table listing
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

        doc.save("monthly_report.pdf");
    };

    if (!chartData && totalIncome === 0) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No data for this month</div>;
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

export default MonthlyReport;
