import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { movieApi } from '../../api/movieApi';

const MovieCard = ({ movie }) => {
  const { name, origin_name, slug, poster_url, thumb_url, year, episode_current } = movie;
  
  const fullPosterUrl = movieApi.getImageUrl(thumb_url || poster_url);

  return (
    <Link 
      to={`/phim/${slug}`}
      state={{ movie }}
      className="group relative bg-zinc-900 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] relative">
        <img
          src={fullPosterUrl}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x450?text=No+Image';
          }}
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
            <Play fill="currentColor" size={24} />
          </div>
        </div>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {episode_current && (
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {episode_current}
            </span>
          )}
        </div>
        <div className="absolute bottom-2 right-2">
           <span className="bg-black/70 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded">
            {year}
          </span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-xs text-zinc-500 line-clamp-1 mt-1">
          {origin_name}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
