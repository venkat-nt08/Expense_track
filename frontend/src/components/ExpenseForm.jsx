import { useState, useEffect } from 'react';
import { createExpense, updateExpense, getCategories, createCategory } from '../services/api';

const ExpenseForm = ({ onSuccess, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category_id: '',
        description: '',
        type: 'expense'
    });
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        loadCategories();
        if (initialData) {
            setFormData({
                title: initialData.title,
                amount: initialData.amount,
                date: initialData.date,
                category_id: initialData.category_id,
                description: initialData.description || '',
                type: initialData.type || 'expense'
            });
        }
    }, [initialData]);

    const loadCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data);
            if (res.data.length > 0 && !formData.category_id && !initialData) {
                setFormData(prev => ({ ...prev, category_id: res.data[0].id }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let finalCategoryId = formData.category_id;

        try {
            // Auto-create category if user typed one but didn't click Add
            if (newCategory) {
                const res = await createCategory({ name: newCategory, color: '#' + Math.floor(Math.random() * 16777215).toString(16) });
                setCategories([...categories, res.data]);
                finalCategoryId = res.data.id;
            }

            if (!finalCategoryId) {
                alert('Please select or create a category');
                return;
            }

            const payload = { ...formData, category_id: finalCategoryId };

            if (initialData) {
                await updateExpense(initialData.id, payload);
            } else {
                await createExpense(payload);
            }
            onSuccess();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.detail || 'Failed to save transaction';
            alert(msg);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory) return;
        try {
            const res = await createCategory({ name: newCategory, color: '#' + Math.floor(Math.random() * 16777215).toString(16) });
            setCategories([...categories, res.data]);
            setFormData(prev => ({ ...prev, category_id: res.data.id }));
            setNewCategory('');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.detail || 'Failed to create category';
            alert(msg);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '8px',
                        background: formData.type === 'expense' ? 'var(--danger)' : 'rgba(255,255,255,0.05)',
                        color: 'white',
                        border: '1px solid var(--glass-border)',
                        fontWeight: '600',
                        transition: 'all 0.3s'
                    }}
                >
                    Expense
                </button>
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '8px',
                        background: formData.type === 'income' ? 'var(--success)' : 'rgba(255,255,255,0.05)',
                        color: 'white',
                        border: '1px solid var(--glass-border)',
                        fontWeight: '600',
                        transition: 'all 0.3s'
                    }}
                >
                    Income
                </button>
            </div>

            <div className="form-group">
                <label className="form-label">Title</label>
                <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Date</label>
                <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Category</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                        className="form-input"
                        value={formData.category_id}
                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                    >
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="New Category"
                        className="form-input"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                    />
                    <button type="button" className="btn-primary" onClick={handleCreateCategory} style={{ padding: '0.5rem' }}>Add</button>
                </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                {initialData ? 'Update' : 'Save'} {formData.type === 'income' ? 'Income' : 'Expense'}
            </button>
        </form>
    );
};

export default ExpenseForm;
