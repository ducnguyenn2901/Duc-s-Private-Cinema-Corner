import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Filter, ChevronDown, X, LayoutGrid, Globe, Calendar, Check } from 'lucide-react';

const FilterSelect = ({ label, icon: Icon, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.slug === value || opt.name === value);

  return (
    <div className="relative flex-1 min-w-[140px]" ref={dropdownRef}>
      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1.5 ml-1">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
          isOpen 
            ? 'bg-zinc-800 border-primary shadow-lg shadow-primary/10' 
            : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon size={14} className={isOpen ? 'text-primary' : 'text-zinc-500'} />}
          <span className={`text-sm truncate ${selectedOption ? 'text-white font-medium' : 'text-zinc-400'}`}>
            {selectedOption ? selectedOption.name : placeholder}
          </span>
        </div>
        <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar py-2">
            {options.map((opt) => (
              <button
                key={opt.slug || opt.name}
                onClick={() => {
                  onChange(opt.slug || opt.name);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  (opt.slug === value || opt.name === value)
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span>{opt.name}</span>
                {(opt.slug === value || opt.name === value) && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MovieFilter = ({ currentType, currentSlug, variant = 'default' }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { genres = [], countries = [], years = [] } = useSelector((state) => state.movie);
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter states from URL
  const filters = {
    category: searchParams.get('category') || (currentType === 'danh-sach' ? currentSlug : 'all'),
    genre: searchParams.get('genre') || (currentType === 'the-loai' ? currentSlug : 'all'),
    country: searchParams.get('country') || (currentType === 'quoc-gia' ? currentSlug : 'all'),
    year: searchParams.get('year') || (currentType === 'nam-phat-hanh' ? currentSlug : 'all'),
  };

  const categories = [
    { name: 'Tất cả', slug: 'all' },
    { name: 'Phim bộ', slug: 'phim-bo' },
    { name: 'Phim lẻ', slug: 'phim-le' },
    { name: 'Hoạt hình', slug: 'hoat-hinh' },
    { name: 'TV Shows', slug: 'tv-shows' },
  ];

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    
    // Always reset page to 1 when filter changes
    newParams.set('page', '1');

    // If we are on home page, navigate to a list page to show results
    if (window.location.pathname === '/') {
      navigate(`/danh-sach/phim-moi-cap-nhat?${newParams.toString()}`);
    } else {
      setSearchParams(newParams);
    }
  };

  const handleResetFilters = () => {
    navigate('/');
    setIsExpanded(false);
  };

  const handleApply = () => {
    setIsExpanded(false);
  };

  const filterContent = (isCompact = false) => (
    <div className={`${isCompact ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' : 'flex flex-wrap items-center gap-6'}`}>
      <FilterSelect 
        label="Danh mục"
        icon={LayoutGrid}
        options={categories}
        value={filters.category}
        onChange={(val) => handleFilterChange('category', val)}
        placeholder="Tất cả danh mục"
      />
      <FilterSelect 
        label="Thể loại"
        icon={LayoutGrid}
        options={[{ name: 'Tất cả thể loại', slug: 'all' }, ...genres]}
        value={filters.genre}
        onChange={(val) => handleFilterChange('genre', val)}
        placeholder="Tất cả thể loại"
      />
      <FilterSelect 
        label="Quốc gia"
        icon={Globe}
        options={[{ name: 'Tất cả quốc gia', slug: 'all' }, ...countries]}
        value={filters.country}
        onChange={(val) => handleFilterChange('country', val)}
        placeholder="Tất cả quốc gia"
      />
      <FilterSelect 
        label="Năm"
        icon={Calendar}
        options={[{ name: 'Tất cả các năm', slug: 'all' }, ...years]}
        value={filters.year}
        onChange={(val) => handleFilterChange('year', val)}
        placeholder="Tất cả các năm"
      />
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className="relative">
        <div className="flex items-center gap-2">
          {/* Quick Category Chips */}
          <div className="hidden lg:flex items-center gap-2 mr-2">
            {categories.slice(1, 4).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleFilterChange('category', cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  filters.category === cat.slug 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
              isExpanded 
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Filter size={18} />
            <span className="text-sm font-bold uppercase tracking-wider">Bộ lọc</span>
            <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isExpanded && (
          <div className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] xs:w-[350px] md:w-[600px] lg:w-[800px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl z-[150] p-4 md:p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Filter size={20} className="text-primary" />
                </div>
                {/* <div>
                  <h3 className="font-black text-white uppercase tracking-tight">Bộ lọc nâng cao</h3>
                </div> */}
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {filterContent(true)}
            
            <div className="mt-8 pt-6 border-t border-zinc-900 flex items-center justify-between">
              <button 
                onClick={handleResetFilters}
                className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
              <button 
                onClick={handleApply}
                className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                Áp dụng
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 mb-10">
      {filterContent(false)}
    </div>
  );
};

export default MovieFilter;
