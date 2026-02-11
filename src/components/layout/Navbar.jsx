import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, ChevronDown, Home, Film, Tv, Globe, LayoutGrid, Search } from 'lucide-react';
import SearchBox from '../movie/SearchBox';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const mobileMenuRef = useRef(null);
  
  const { genres, countries } = useSelector((state) => state.movie);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Handle click outside for mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.menu-toggle')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Lock scroll when menu open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const toggleMobileDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="bg-zinc-950/80 backdrop-blur-md sticky top-0 z-[100] border-b border-zinc-800/50">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition-colors menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group shrink-0 sm:shrink">
            <div className="w-6 h-6 sm:w-8 md:w-10 md:h-10 bg-primary rounded flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-primary/20">
              <Film className="text-white" size={14} sm:size={18} md:size={20} />
            </div>
            <span className="text-white text-[13px] sm:text-base md:text-2xl font-black tracking-tighter uppercase italic">
              My<span className="text-primary">Film</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 ml-4">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
            >
              Trang chủ
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all">
                <span>Thể loại</span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-[480px] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all grid grid-cols-3 p-4 z-50">
                {genres.map((genre) => (
                  <Link
                    key={genre.slug}
                    to={`/the-loai/${genre.slug}`}
                    className="px-3 py-2 text-sm text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all">
                <span>Quốc gia</span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all grid grid-cols-2 p-4 z-50">
                {countries.map((country) => (
                  <Link
                    key={country.slug}
                    to={`/quoc-gia/${country.slug}`}
                    className="px-3 py-2 text-sm text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    {country.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              to="/danh-sach/phim-bo" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/danh-sach/phim-bo' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
            >
              Phim bộ
            </Link>
            <Link 
              to="/danh-sach/phim-le" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/danh-sach/phim-le' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
            >
              Phim lẻ
            </Link>
          </div>
        </div>

        {/* Search Bar - Desktop & Mobile */}
        <div className="flex-grow max-w-[200px] sm:max-w-xs md:max-w-md">
          <SearchBox />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div 
        ref={mobileMenuRef}
        className={`fixed inset-y-0 left-0 w-full h-screen bg-zinc-950 z-[200] transition-transform duration-300 transform lg:hidden flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-lg shadow-primary/20">
              <Film className="text-white" size={18} />
            </div>
            <span className="text-white text-lg font-black tracking-tighter uppercase italic">
              My<span className="text-primary">Film</span>
            </span>
          </Link>
          {/* <button 
            onClick={() => setIsMenuOpen(false)} 
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900 rounded-full transition-colors"
          >
            <X size={24} />
          </button> */}
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-6 bg-zinc-950">
          {/* Main Quick Links */}
          <div className="grid grid-cols-4 gap-2">
            <Link to="/" className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95">
              <Home size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Home</span>
            </Link>
            <Link to="/danh-sach/phim-bo" className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95">
              <Tv size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Phim bộ</span>
            </Link>
            <Link to="/danh-sach/phim-le" className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95">
              <Film size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Phim lẻ</span>
            </Link>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all active:scale-95"
            >
              <X size={20} />
            </button>
          </div>

          {/* Genres Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1 h-4 bg-primary rounded-full"></div>
              <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Thể loại</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {genres && genres.length > 0 ? genres.map((genre) => (
                <Link
                  key={genre.slug}
                  to={`/the-loai/${genre.slug}`}
                  className="py-3.5 px-2 text-[12px] font-bold text-zinc-300 hover:text-primary transition-all text-center border border-zinc-800 rounded-xl bg-zinc-900/50 active:bg-zinc-800"
                >
                  {genre.name}
                </Link>
              )) : (
                <div className="col-span-3 py-4 text-center text-zinc-600 text-xs italic">Đang tải thể loại...</div>
              )}
            </div>
          </div>

          {/* Countries Section */}
          <div className="space-y-3 pb-10">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1 h-4 bg-primary rounded-full"></div>
              <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Quốc gia</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {countries && countries.length > 0 ? countries.map((country) => (
                <Link
                  key={country.slug}
                  to={`/quoc-gia/${country.slug}`}
                  className="py-3.5 px-2 text-[12px] font-bold text-zinc-300 hover:text-primary transition-all text-center border border-zinc-800 rounded-xl bg-zinc-900/50 active:bg-zinc-800"
                >
                  {country.name}
                </Link>
              )) : (
                <div className="col-span-3 py-4 text-center text-zinc-600 text-xs italic">Đang tải quốc gia...</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
      </div>
    </nav>
  );
};

export default Navbar;
