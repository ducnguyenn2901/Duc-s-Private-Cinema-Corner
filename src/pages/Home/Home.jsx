import React, { useState, useEffect } from 'react';
import { movieApi } from '../../api/movieApi';
import Hero from '../../components/movie/Hero';
import MovieGrid from '../../components/movie/MovieGrid';
import MovieFilter from '../../components/movie/MovieFilter';
import Section from '../../components/common/Section';
import { MovieGridSkeleton } from '../../components/common/LoadingSkeleton';

const Home = () => {
  const [data, setData] = useState({
    heroMovies: [],
    newMovies: [],
    series: [],
    singleMovies: [],
    cartoons: [],
    cdnDomain: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // We can't actually get everything from one /home call if the API is limited
        // But let's assume getHome returns featured movies
        const [homeRes, newRes, seriesRes, singleRes, cartoonsRes] = await Promise.all([
          movieApi.getList('phim-moi-cap-nhat', 1),
          movieApi.getList('phim-moi-cap-nhat', 2),
          movieApi.getList('phim-bo', 1),
          movieApi.getList('phim-le', 1),
          movieApi.getList('hoat-hinh', 1),
        ]);

        // Cập nhật CDN global để các component con sử dụng
        if (homeRes.data?.data?.APP_DOMAIN_CDN_IMAGE) {
          movieApi.cdn = homeRes.data.data.APP_DOMAIN_CDN_IMAGE;
        }

        const filter18Plus = (movies) => {
          return movies?.filter(movie => 
            !movie.category?.some(cat => cat.slug === 'phim-18')
          ) || [];
        };

        setData({
          heroMovies: filter18Plus(homeRes.data?.data?.items)?.slice(0, 5) || [],
          newMovies: filter18Plus(newRes.data?.data?.items)?.slice(0, 12) || [],
          series: filter18Plus(seriesRes.data?.data?.items)?.slice(0, 12) || [],
          singleMovies: filter18Plus(singleRes.data?.data?.items)?.slice(0, 12) || [],
          cartoons: filter18Plus(cartoonsRes.data?.data?.items)?.slice(0, 12) || [],
          cdnDomain: homeRes.data?.data?.APP_DOMAIN_CDN_IMAGE || '',
        });
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Không thể tải dữ liệu trang chủ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-red-500 text-xl font-bold">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-primary px-6 py-2 rounded-md"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <Hero movies={data.heroMovies} />
      
      <div className="container mx-auto px-4 mt-8">
        <MovieFilter />
      </div>
      
      <div className="container mx-auto px-4 mt-4 space-y-12">
        <Section title="Phim mới cập nhật" viewMoreLink="/danh-sach/phim-moi-cap-nhat">
          {loading ? <MovieGridSkeleton count={6} /> : <MovieGrid movies={data.newMovies} />}
        </Section>

        <Section title="Phim bộ mới" viewMoreLink="/danh-sach/phim-bo">
          {loading ? <MovieGridSkeleton count={6} /> : <MovieGrid movies={data.series} />}
        </Section>

        <Section title="Phim lẻ mới" viewMoreLink="/danh-sach/phim-le">
          {loading ? <MovieGridSkeleton count={6} /> : <MovieGrid movies={data.singleMovies} />}
        </Section>

        <Section title="Hoạt hình" viewMoreLink="/danh-sach/hoat-hinh">
          {loading ? <MovieGridSkeleton count={6} /> : <MovieGrid movies={data.cartoons} />}
        </Section>
      </div>
    </div>
  );
};

export default Home;
