import { useFilter } from '../context/FilterContext';

const FilterBar = () => {
    const { filterType, setFilterType, selectedDate, setSelectedDate } = useFilter();

    return (
        <div className="glass-panel" style={{ padding: '0.4rem 0.75rem', display: 'inline-flex', gap: '0.5rem', borderRadius: '12px', alignItems: 'center' }}>
            {['all', 'year', 'month'].map((type) => (
                <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    style={{
                        padding: '0.4rem 1rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: filterType === type ? 'var(--primary)' : 'transparent',
                        color: filterType === type ? 'white' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s'
                    }}
                >
                    {type}
                </button>
            ))}

            {filterType === 'year' && (
                <input
                    type="number"
                    value={selectedDate.getFullYear()}
                    onChange={(e) => {
                        const newDate = new Date(selectedDate);
                        newDate.setFullYear(parseInt(e.target.value));
                        setSelectedDate(newDate);
                    }}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: 'white',
                        padding: '0.4rem 0.5rem',
                        borderRadius: '6px',
                        width: '80px',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                    }}
                />
            )}

            {filterType === 'month' && (
                <input
                    type="month"
                    value={selectedDate.toISOString().slice(0, 7)}
                    onChange={(e) => {
                        if (e.target.value) {
                            setSelectedDate(new Date(e.target.value + '-01'));
                        }
                    }}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: 'white',
                        padding: '0.4rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.9rem'
                    }}
                />
            )}
        </div>
    );
};

export default FilterBar;
