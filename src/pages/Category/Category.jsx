import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { movieApi } from '../../api/movieApi';
import MovieGrid from '../../components/movie/MovieGrid';
import MovieFilter from '../../components/movie/MovieFilter';
import { MovieGridSkeleton } from '../../components/common/LoadingSkeleton';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Category = ({ type = 'danh-sach' }) => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { genres = [], countries = [] } = useSelector((state) => state.movie);
  const page = parseInt(searchParams.get('page') || '1');
  
  const categories = [
    { name: 'Phim bộ', slug: 'phim-bo' },
    { name: 'Phim lẻ', slug: 'phim-le' },
    { name: 'Hoạt hình', slug: 'hoat-hinh' },
    { name: 'TV Shows', slug: 'tv-shows' },
  ];
  
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get other filter params from URL
  const genreFilter = searchParams.get('genre');
  const countryFilter = searchParams.get('country');
  const yearFilter = searchParams.get('year');
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        // Determine the primary endpoint to fetch from
        // Priority: Search params filters (if any), then URL path params
        let fetchPromise;
        let primaryFilter = null;

        if (genreFilter) {
          fetchPromise = movieApi.getMoviesByGenre(genreFilter, page);
          primaryFilter = 'genre';
        } else if (countryFilter) {
          fetchPromise = movieApi.getMoviesByCountry(countryFilter, page);
          primaryFilter = 'country';
        } else if (yearFilter) {
          fetchPromise = movieApi.getMoviesByYear(yearFilter, page);
          primaryFilter = 'year';
        } else if (categoryFilter && categoryFilter !== 'all') {
          fetchPromise = movieApi.getList(categoryFilter, page);
          primaryFilter = 'category';
        } else if (type === 'the-loai') {
          fetchPromise = movieApi.getMoviesByGenre(slug, page);
          primaryFilter = 'genre';
        } else if (type === 'quoc-gia') {
          fetchPromise = movieApi.getMoviesByCountry(slug, page);
          primaryFilter = 'country';
        } else if (type === 'nam-phat-hanh') {
          fetchPromise = movieApi.getMoviesByYear(slug, page);
          primaryFilter = 'year';
        } else if (type === 'danh-sach') {
          fetchPromise = movieApi.getList(slug, page);
          primaryFilter = 'category';
        } else {
          fetchPromise = movieApi.getList('phim-moi-cap-nhat', page);
        }

        const response = await fetchPromise;

        if (response.data?.status) {
          // Cập nhật CDN global
          if (response.data?.data?.APP_DOMAIN_CDN_IMAGE) {
            movieApi.cdn = response.data.data.APP_DOMAIN_CDN_IMAGE;
          }
          
          const items = response.data?.data?.items || [];
          setMovies(items);
          setPagination(response.data?.data?.params?.pagination || null);
          // Build a descriptive title if filters are active
          let pageTitle = response.data?.data?.titlePage || 'Danh sách phim';
          
          if (genreFilter || countryFilter || yearFilter || (categoryFilter && categoryFilter !== 'all')) {
            const parts = [];
            if (categoryFilter && categoryFilter !== 'all') {
              const cat = categories.find(c => c.slug === categoryFilter);
              if (cat) parts.push(cat.name);
            }
            if (genreFilter) {
              const gen = genres.find(g => g.slug === genreFilter);
              if (gen) parts.push(gen.name);
            }
            if (countryFilter) {
              const cou = countries.find(c => c.slug === countryFilter);
              if (cou) parts.push(cou.name);
            }
            if (yearFilter) parts.push(`Năm ${yearFilter}`);
            
            if (parts.length > 0) {
              pageTitle = parts.join(' - ');
            }
          }
          
          setTitle(pageTitle);

          // Apply client-side filtering for other parameters
          let result = items.filter(m => !m.category?.some(c => c.slug === 'phim-18'));
          
          // Only filter client-side if the field was NOT used as the primary fetch key
          if (genreFilter && primaryFilter !== 'genre') {
            result = result.filter(m => m.category?.some(c => c.slug === genreFilter));
          }
          if (countryFilter && primaryFilter !== 'country') {
            result = result.filter(m => m.country?.some(c => c.slug === countryFilter));
          }
          if (yearFilter && primaryFilter !== 'year') {
            result = result.filter(m => m.year?.toString() === yearFilter);
          }
          
          // For category/type filtering
          const currentCategory = categoryFilter || (type === 'danh-sach' ? slug : null);
          if (currentCategory && currentCategory !== 'all' && primaryFilter !== 'category') {
            const typeMap = {
              'phim-bo': 'series',
              'phim-le': 'single',
              'hoat-hinh': 'hoat-hinh',
              'tv-shows': 'tv-shows'
            };
            const targetType = typeMap[currentCategory];
            if (targetType) {
              result = result.filter(m => m.type === targetType);
            }
          }
          
          setFilteredMovies(result);
        } else {
          setError('Không thể tải danh sách phim.');
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Đã có lỗi xảy ra.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    window.scrollTo(0, 0);
  }, [slug, type, page, genreFilter, countryFilter, yearFilter, categoryFilter]);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-red-500 text-xl font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold border-l-4 border-primary pl-4 uppercase tracking-wider">
          {title}
        </h1>
        <MovieFilter currentType={type} currentSlug={slug} variant="compact" />
      </div>

      {loading ? (
        <MovieGridSkeleton count={12} />
      ) : (
        <>
          {filteredMovies.length > 0 ? (
            <MovieGrid movies={filteredMovies} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50">
              <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 text-zinc-600">
                <X size={40} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy phim nào</h3>
              <p className="text-zinc-500 max-w-md text-center">
                Chúng tôi không tìm thấy kết quả nào phù hợp với các tiêu chí lọc của bạn. Vui lòng thử thay đổi bộ lọc.
              </p>
              <button 
                onClick={() => setSearchParams({})}
                className="mt-8 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
          
          {/* Pagination */}
          {pagination && pagination.totalItems > pagination.totalItemsPerPage && filteredMovies.length > 0 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
                {/* Advanced pagination logic */}
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
      )}
    </div>
  );
};

export default Category;
