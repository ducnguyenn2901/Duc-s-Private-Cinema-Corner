import React, { useState, useEffect, useRef } from 'react';
import { Search, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { movieApi } from '../../api/movieApi';
import SearchSuggest from './SearchSuggest';

const SearchBox = ({ placeholder = "Tìm phim...", className = "", onSearchSuccess }) => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestResults, setSuggestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close suggest
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search suggest
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchValue.trim().length >= 2) {
        setIsLoading(true);
        setShowSuggest(true);
        try {
          const response = await movieApi.searchMovies(searchValue, 1);
          if (response.data.status) {
            setSuggestResults(response.data.data.items.slice(0, 5));
          }
        } catch (error) {
          console.error('Search suggest error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestResults([]);
        setShowSuggest(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/tim-kiem?keyword=${searchValue}`);
      setShowSuggest(false);
      if (onSearchSuccess) onSearchSuccess();
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-1.5 md:px-4 md:py-2 pl-9 md:pl-11 focus:outline-none focus:border-primary/50 focus:bg-zinc-900 text-xs md:text-sm transition-all placeholder:text-zinc-600"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => searchValue.trim().length >= 2 && setShowSuggest(true)}
        />
        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={16} />
      </form>

      <SearchSuggest
        results={suggestResults}
        isLoading={isLoading}
        isVisible={showSuggest}
        onClose={() => {
          setShowSuggest(false);
          if (onSearchSuccess) onSearchSuccess();
        }}
      />
    </div>
  );
};

export default SearchBox;
