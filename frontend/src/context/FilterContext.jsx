import { createContext, useState, useContext, useMemo } from 'react';

const FilterContext = createContext();

export const useFilter = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
    const [filterType, setFilterType] = useState('month'); // 'all', 'year', 'month'
    const [selectedDate, setSelectedDate] = useState(new Date());

    const applyFilter = (items) => {
        if (!items) return [];
        return items.filter(item => {
            const itemDate = new Date(item.date);
            if (filterType === 'all') return true;
            if (filterType === 'year') {
                return itemDate.getFullYear() === selectedDate.getFullYear();
            }
            if (filterType === 'month') {
                return itemDate.getFullYear() === selectedDate.getFullYear() &&
                    itemDate.getMonth() === selectedDate.getMonth();
            }
            return true;
        });
    };

    return (
        <FilterContext.Provider value={{ filterType, setFilterType, selectedDate, setSelectedDate, applyFilter }}>
            {children}
        </FilterContext.Provider>
    );
};
