import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieApi } from '../../api/movieApi';
import MovieGrid from '../../components/movie/MovieGrid';
import MovieFilter from '../../components/movie/MovieFilter';
import { MovieGridSkeleton } from '../../components/common/LoadingSkeleton';
import { Search as SearchIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const page = parseInt(searchParams.get('page') || '1');
  
  // Filter states from URL
  const genreFilter = searchParams.get('genre');
  const countryFilter = searchParams.get('country');
  const yearFilter = searchParams.get('year');
  const categoryFilter = searchParams.get('category');
  
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword) return;
      
      try {
        setLoading(true);
        const response = await movieApi.searchMovies(keyword, page);
        
        if (response.data?.status) {
          // Update global CDN
          if (response.data?.data?.APP_DOMAIN_CDN_IMAGE) {
            movieApi.cdn = response.data.data.APP_DOMAIN_CDN_IMAGE;
          }

          const items = response.data?.data?.items || [];
          setMovies(items);
          setPagination(response.data?.data?.params?.pagination || null);

          // Apply client-side filtering
          let result = items.filter(m => !m.category?.some(c => c.slug === 'phim-18'));
          
          if (genreFilter) {
            result = result.filter(m => m.category?.some(c => c.slug === genreFilter));
          }
          if (countryFilter) {
            result = result.filter(m => m.country?.some(c => c.slug === countryFilter));
          }
          if (yearFilter) {
            result = result.filter(m => m.year?.toString() === yearFilter);
          }
          if (categoryFilter && categoryFilter !== 'all') {
            const typeMap = {
              'phim-bo': 'series',
              'phim-le': 'single',
              'hoat-hinh': 'hoat-hinh',
              'tv-shows': 'tv-shows'
            };
            const targetType = typeMap[categoryFilter];
            if (targetType) {
              result = result.filter(m => m.type === targetType);
            }
          }
          
          setFilteredMovies(result);
        } else {
          setError('Không tìm thấy kết quả.');
        }
      } catch (err) {
        console.error('Error searching movies:', err);
        setError('Đã có lỗi xảy ra.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
    window.scrollTo(0, 0);
  }, [keyword, page, genreFilter, countryFilter, yearFilter, categoryFilter]);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <SearchIcon className="text-primary" size={32} />
            Kết quả tìm kiếm cho: <span className="text-primary">"{keyword}"</span>
          </h1>
          <p className="text-zinc-400 mt-2">
            Tìm thấy {filteredMovies.length} kết quả phù hợp
          </p>
        </div>
        
        <MovieFilter variant="compact" />
      </div>

      {loading ? (
        <MovieGridSkeleton count={12} />
      ) : filteredMovies.length > 0 ? (
        <>
          <MovieGrid movies={filteredMovies} />
          
          {/* Pagination */}
          {pagination && pagination.totalItems > pagination.totalItemsPerPage && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
                {(() => {
                  const totalPages = Math.ceil(pagination.totalItems / pagination.totalItemsPerPage);
                  const pages = [];
                  let startPage = Math.max(1, page - 2);
                  let endPage = Math.min(totalPages, startPage + 4);
                  
                  if (endPage - startPage < 4) {
                    startPage = Math.max(1, endPage - 4);
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`w-10 h-10 rounded font-bold transition-all ${
                          page === i ? 'bg-primary text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pages;
                })()}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page * pagination.totalItemsPerPage >= pagination.totalItems}
                className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50">
          <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 text-zinc-600">
            <X size={40} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy phim nào</h3>
          <p className="text-zinc-500 max-w-md text-center">
            {keyword ? `Chúng tôi không tìm thấy kết quả nào phù hợp với từ khóa "${keyword}" và các bộ lọc hiện tại.` : 'Vui lòng nhập từ khóa tìm kiếm.'}
          </p>
          <button 
            onClick={() => setSearchParams({ keyword })}
            className="mt-8 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
