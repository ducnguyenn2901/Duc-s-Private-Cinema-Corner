import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { movieApi } from '../../api/movieApi';

const Hero = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movieImages, setMovieImages] = useState({});

  useEffect(() => {
    if (movies.length === 0) return;
    
    // Fetch images for movies that don't have them in cache
    const fetchImages = async () => {
      const currentMovie = movies[currentIndex];
      if (currentMovie && !movieImages[currentMovie.slug]) {
        try {
          const response = await movieApi.getMovieImages(currentMovie.slug);
          if (response.data.status) {
            setMovieImages(prev => ({
              ...prev,
              [currentMovie.slug]: response.data.data
            }));
          }
        } catch (error) {
          console.error('Error fetching hero movie images:', error);
        }
      }
    };

    fetchImages();

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [currentIndex, movies]);

  if (movies.length === 0) return <div className="h-[70vh] bg-zinc-900 animate-pulse" />;

  const currentMovie = movies[currentIndex];
  const currentImages = movieImages[currentMovie.slug];
  
  // Ưu tiên ảnh từ API images (thường chất lượng cao hơn), nếu không có thì dùng ảnh từ danh sách phim
  const backdropPath = currentImages?.item?.poster_url || currentImages?.item?.backdrop_url || currentImages?.poster_url || currentImages?.backdrop_url;
  const backdropUrl = backdropPath 
    ? movieApi.getImageUrl(backdropPath, currentImages)
    : movieApi.getImageUrl(currentMovie.poster_url || currentMovie.thumb_url);

  const next = () => setCurrentIndex((prev) => (prev + 1) % movies.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);

  return (
    <div className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden group bg-zinc-950">
      {/* Background Image */}
      <div 
        key={currentMovie.slug}
        className="absolute inset-0 transition-all duration-1000 ease-in-out scale-100 bg-zinc-950 animate-in fade-in zoom-in-105 duration-1000"
      >
        <img 
          key={backdropUrl}
          src={backdropUrl}
          alt={currentMovie.name}
          className="w-full h-full object-cover opacity-60 md:opacity-70 transition-opacity duration-500"
          style={{ objectPosition: 'center 20%' }}
          onError={(e) => {
            console.log('Hero image load error, falling back');
            e.target.src = 'https://placehold.co/1920x1080/09090b/ffffff?text=' + encodeURIComponent(currentMovie.name);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/20 to-transparent hidden md:block" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-tight uppercase drop-shadow-2xl">
                {currentMovie.name}
              </h1>
              <p className="text-primary font-bold text-sm md:text-base uppercase tracking-wider">
                {currentMovie.origin_name}
              </p>
            </div>
            <p className="text-zinc-300 text-sm md:text-lg line-clamp-2 md:line-clamp-4 font-medium max-w-xl drop-shadow-md">
              {currentMovie.content?.replace(/<[^>]*>/g, '') || 'Đang cập nhật nội dung...'}
            </p>
            <div className="flex items-center gap-3 md:gap-4 pt-2">
              <Link 
                to={`/phim/${currentMovie.slug}`}
                className="bg-primary hover:bg-blue-600 text-white px-5 md:px-8 py-2.5 md:py-3 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-primary/25"
              >
                <Play fill="currentColor" size={18} />
                <span>Xem ngay</span>
              </Link>
              <Link 
                to={`/phim/${currentMovie.slug}`}
                className="bg-zinc-800/80 hover:bg-zinc-700 text-white px-5 md:px-8 py-2.5 md:py-3 rounded-lg font-bold flex items-center gap-2 backdrop-blur-md transition-all border border-zinc-700"
              >
                <Info size={18} />
                <span>Chi tiết</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-10 right-4 flex gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-zinc-600'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
