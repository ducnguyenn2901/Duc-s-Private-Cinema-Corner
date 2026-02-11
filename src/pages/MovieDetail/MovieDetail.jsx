import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { movieApi } from '../../api/movieApi';
import { Play, Star, Calendar, Globe, List, User, Video } from 'lucide-react';
import Section from '../../components/common/Section';
import MovieGrid from '../../components/movie/MovieGrid';
import { MovieGridSkeleton } from '../../components/common/LoadingSkeleton';

const MovieDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [detailData, setDetailData] = useState(null);
  const [imagesData, setImagesData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        const [detailRes, imagesRes] = await Promise.allSettled([
          movieApi.getMovieDetail(slug),
          movieApi.getMovieImages(slug)
        ]);
        
        if (detailRes.status === 'fulfilled' && detailRes.value.data.status) {
                // Cập nhật CDN global
                if (detailRes.value.data.data.APP_DOMAIN_CDN_IMAGE) {
                  movieApi.cdn = detailRes.value.data.data.APP_DOMAIN_CDN_IMAGE;
                }
                setDetailData(detailRes.value.data.data);
                const movieData = detailRes.value.data.data.item;
          setMovie(movieData);
          setEpisodes(detailRes.value.data.data.items || []);
          
          if (imagesRes.status === 'fulfilled' && imagesRes.value.data.status) {
            setImagesData(imagesRes.value.data.data);
          }
          
          // Fetch related movies (same category or genre)
          if (movieData.category?.[0]?.slug) {
            const relatedRes = await movieApi.getMoviesByGenre(movieData.category[0].slug, 1);
            setRelatedMovies(relatedRes.data.data.items.filter(m => m.slug !== slug).slice(0, 6));
          }
        } else {
          setError('Không tìm thấy thông tin phim.');
        }
      } catch (err) {
        console.error('Error fetching movie detail:', err);
        setError('Đã có lỗi xảy ra khi tải thông tin phim.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 aspect-[2/3] bg-zinc-800 rounded-lg" />
          <div className="flex-1 space-y-4">
            <div className="h-10 bg-zinc-800 rounded w-3/4" />
            <div className="h-6 bg-zinc-800 rounded w-1/2" />
            <div className="h-32 bg-zinc-800 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-red-500 text-xl font-bold">{error}</p>
        <Link to="/" className="mt-4 inline-block bg-primary px-6 py-2 rounded-md">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  // Ưu tiên ảnh từ API images, nếu không có thì dùng ảnh từ chi tiết phim
  const backdropPath = imagesData?.item?.poster_url || imagesData?.item?.backdrop_url || imagesData?.poster_url || imagesData?.backdrop_url;
  const backdropUrl = backdropPath 
    ? movieApi.getImageUrl(backdropPath, imagesData)
    : movieApi.getImageUrl(movie.poster_url || movie.thumb_url, detailData);

  const posterPath = imagesData?.item?.thumb_url || imagesData?.item?.poster_url || imagesData?.thumb_url || imagesData?.poster_url;
  const posterUrl = posterPath 
    ? movieApi.getImageUrl(posterPath, imagesData)
    : movieApi.getImageUrl(movie.thumb_url || movie.poster_url, detailData);

  return (
    <div className="pb-12">
      {/* Backdrop Section */}
      <div className="relative h-[40vh] md:h-[70vh] w-full">
        <div className="absolute inset-0">
          <img
            key={backdropUrl}
            src={backdropUrl}
            alt={movie.name}
            className="w-full h-full object-cover opacity-40"
            style={{ objectPosition: 'center 20%' }}
            onError={(e) => {
              e.target.src = 'https://placehold.co/1920x1080/09090b/ffffff?text=Backdrop';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-40 md:-mt-80 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-full md:w-[300px] shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900">
              <img 
                src={posterUrl} 
                alt={movie.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/300x450?text=No+Poster';
                }}
              />
            </div>
            <button 
              onClick={() => navigate(`/xem/${movie.slug}`)}
              className="w-full mt-4 bg-primary hover:bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Play fill="currentColor" size={20} />
              XEM PHIM
            </button>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">{movie.name}</h1>
              <h2 className="text-xl text-zinc-400 mt-2">{movie.origin_name} ({movie.year})</h2>
            </div>

            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <div className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1.5 rounded-full">
                <Star className="text-yellow-500 fill-yellow-500" size={16} />
                <span>{movie.tmdb?.vote_average || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1.5 rounded-full">
                <Calendar size={16} className="text-zinc-400" />
                <span>{movie.year}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1.5 rounded-full">
                <Globe size={16} className="text-zinc-400" />
                <span>{movie.country?.[0]?.name}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold border-l-4 border-primary pl-3 uppercase">Nội dung</h3>
              <p className="text-zinc-400 leading-relaxed text-justify">
                {movie.content?.replace(/<[^>]*>/g, '') || 'Đang cập nhật nội dung...'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <List size={18} />
                  <span className="font-bold">Thể loại:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {movie.category?.map(cat => (
                    <Link 
                      key={cat.id} 
                      to={`/the-loai/${cat.slug}`}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {cat.name},
                    </Link>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <User size={18} />
                  <span className="font-bold">Đạo diễn:</span>
                </div>
                <p className="text-sm">{movie.director?.join(', ') || 'Đang cập nhật'}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Video size={18} />
                  <span className="font-bold">Diễn viên:</span>
                </div>
                <p className="text-sm line-clamp-2">{movie.actor?.join(', ') || 'Đang cập nhật'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Episodes */}
        {movie.episodes?.[0]?.server_data?.length > 0 && (
          <div className="mt-12">
             <h3 className="text-xl font-bold mb-6 border-l-4 border-primary pl-3 uppercase">Danh sách tập</h3>
             <div className="flex flex-wrap gap-3">
               {movie.episodes[0].server_data.map((ep, idx) => (
                 <Link
                   key={idx}
                   to={`/xem/${movie.slug}/${ep.slug}`}
                   className="min-w-[50px] h-10 flex items-center justify-center bg-zinc-800 hover:bg-primary rounded font-bold transition-colors"
                 >
                   {ep.name}
                 </Link>
               ))}
             </div>
          </div>
        )}

        {/* Related Movies */}
        <div className="mt-16">
          <Section title="Phim liên quan">
            {loading ? <MovieGridSkeleton count={6} /> : <MovieGrid movies={relatedMovies} />}
          </Section>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
