import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieApi } from '../../api/movieApi';
import { ChevronLeft, List } from 'lucide-react';

const Watch = () => {
  const { slug, tap } = useParams();
  const [movie, setMovie] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const response = await movieApi.getMovieDetail(slug);
        
        if (response.data.status) {
          const movieData = response.data.data.item;
          setMovie(movieData);
          
          const serverData = movieData.episodes?.[0]?.server_data || [];
          // If tap (episode slug) is provided, find it. Otherwise, default to the first one.
          const episode = tap 
            ? serverData.find(e => e.slug === tap) 
            : serverData[0];
            
          setCurrentEpisode(episode);
        } else {
          setError('Không tìm thấy tập phim.');
        }
      } catch (err) {
        console.error('Error fetching movie detail for watch:', err);
        setError('Đã có lỗi xảy ra.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    window.scrollTo(0, 0);
  }, [slug, tap]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="aspect-video bg-zinc-800 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (error || !movie || !currentEpisode) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-red-500 text-xl font-bold">{error || 'Không tìm thấy tập phim.'}</p>
        <Link to={`/phim/${slug}`} className="mt-4 inline-block bg-primary px-6 py-2 rounded-md">
          Quay lại chi tiết
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Player Section */}
      <div className="bg-black">
        <div className="container mx-auto">
          <div className="aspect-video w-full max-w-5xl mx-auto">
            <iframe
              src={currentEpisode.link_embed}
              title={`${movie.name} - ${currentEpisode.name}`}
              className="w-full h-full"
              allowFullScreen
              frameBorder="0"
            />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {movie.name} - <span className="text-primary">{currentEpisode.name}</span>
            </h1>
            <div className="flex items-center gap-4 mt-2 text-zinc-400 text-sm">
              <span>{movie.origin_name}</span>
              <span>•</span>
              <span>{movie.year}</span>
            </div>
          </div>
          <Link 
            to={`/phim/${movie.slug}`}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-md transition-colors w-fit"
          >
            <ChevronLeft size={20} />
            Quay lại chi tiết
          </Link>
        </div>

        {/* Episode List */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-2 mb-6 text-xl font-bold">
            <List size={24} className="text-primary" />
            <h2>DANH SÁCH TẬP</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {movie.episodes?.[0]?.server_data.map((ep, idx) => (
              <Link
                key={idx}
                to={`/xem/${movie.slug}/${ep.slug}`}
                className={`min-w-[60px] h-10 flex items-center justify-center rounded font-bold transition-all border ${
                  ep.slug === currentEpisode.slug
                    ? 'bg-primary border-primary text-white'
                    : 'bg-zinc-800 border-zinc-700 hover:border-primary text-zinc-300'
                }`}
              >
                {ep.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Content Box */}
        <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
          <h3 className="text-lg font-bold mb-4 uppercase text-zinc-400">Nội dung phim</h3>
          <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
            {movie.content?.replace(/<[^>]*>/g, '') || 'Đang cập nhật nội dung...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Watch;
