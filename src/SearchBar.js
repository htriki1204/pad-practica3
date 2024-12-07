import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    
    const handleSearch = async () => {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
        const response = await axios.get(url);
        onSearch(response.data.items || []);
    };

    return (
        <div>
            <input 
                type="text" 
                placeholder="Buscar libros..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
            />
            <button onClick={handleSearch}>Buscar</button>
        </div>
    );
};

export default SearchBar;
