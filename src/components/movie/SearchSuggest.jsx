import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { movieApi } from '../../api/movieApi';

const SearchSuggest = ({ results, isLoading, isVisible, onClose, className = "" }) => {
  if (!isVisible || (!isLoading && results.length === 0)) return null;

  return (
    <div className={`absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[400px] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-[150] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${className}`}>
      <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-4 flex items-center justify-center space-x-2 text-zinc-400">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Đang tìm kiếm...</span>
          </div>
        ) : (
          <div className="py-2">
            <div className="px-4 py-1 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Kết quả tìm kiếm
            </div>
            {results.map((movie) => (
              <Link
                key={movie.slug}
                to={`/phim/${movie.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-800 transition-colors group"
              >
                <div className="relative w-12 h-16 flex-shrink-0">
                  <img
                    src={movieApi.getImageUrl(movie.thumb_url)}
                    alt={movie.name}
                    className="w-full h-full object-cover rounded shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={16} className="text-white fill-white" />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
                    {movie.name}
                  </h4>
                  <p className="text-xs text-zinc-500 truncate">
                    {movie.origin_name} ({movie.year})
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSuggest;
