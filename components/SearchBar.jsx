import React, { useState } from 'react';
import { Search, MoveRight } from 'lucide-react'; 

const SearchBar = ({ onSearch, value, onChange, placeholder = "" }) => {
    const [query, setQuery] = useState('');
    
    const currentValue = value !== undefined ? value : query;

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        
        if (value === undefined) {
            setQuery(newValue);
        }
        
        if (onChange) {
            onChange(e);
        } else if (onSearch) {
            onSearch(newValue);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(currentValue);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                minHeight: '100px',
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    background: '#4B5842',
                    borderRadius: '5px',
                    padding: '0 0 0 10px',
                    height: '30px',
                    width: '80%',
                    maxWidth: '90%',
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', color: '#C7D1C0', marginRight: '8px' }}>
                    <Search size={16} color="#C7D1C0" />
                </span>
                <input
                    type="text"
                    value={currentValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    style={{
                        background: 'transparent',
                        fontFamily: 'Jost, sans-serif',
                        fontWeight: '600',
                        color: '#ffffff',
                        border: 'none',
                        outline: 'none',
                        flex: 1,
                        fontSize: '12px',
                        padding: '8px 0',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'transparent',
                        border: 'none',
                        marginRight: '8px',
                        cursor: 'pointer',
                        color: '#C7D1C0',
                        padding: 0,
                    }}
                >
                    <MoveRight size={16} color="#C7D1C0" />
                </button>
            </form>
        </div>
    );
};

export default SearchBar;