import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let globalCDN = '/img';

export const movieApi = {
  get cdn() { return globalCDN; },
  set cdn(value) { globalCDN = value; },

  getHome: () => apiClient.get('/home'),
  getList: (slug, page = 1) => apiClient.get(`/danh-sach/${slug}?page=${page}`),
  getGenres: () => apiClient.get('/the-loai'),
  getCountries: () => apiClient.get('/quoc-gia'),
  getYears: () => apiClient.get('/nam-phat-hanh'),
  getMoviesByGenre: (slug, page = 1) => apiClient.get(`/the-loai/${slug}?page=${page}`),
  getMoviesByCountry: (slug, page = 1) => apiClient.get(`/quoc-gia/${slug}?page=${page}`),
  getMoviesByYear: (year, page = 1) => apiClient.get(`/nam-phat-hanh/${year}?page=${page}`),
  searchMovies: (keyword, page = 1) => apiClient.get(`/tim-kiem?keyword=${keyword}&page=${page}`),
  getMovieDetail: (slug) => apiClient.get(`/phim/${slug}`),
  getMovieImages: (slug) => apiClient.get(`/phim/${slug}/images`),
  // Helper to get full image URL from relative path or absolute URL
  getImageUrl: (path, _responseData) => {
    if (!path) return '';

    const prefix = 'uploads/movies/';
    let cleanPath = String(path).trim();

    const ophimHost = ['img', 'ophim', 'live'].join('.');
    const idx = cleanPath.indexOf(prefix);
    if (idx !== -1) {
      cleanPath = cleanPath.substring(idx + prefix.length);
    } else {
      if (/^https?:\/\//.test(cleanPath) && !cleanPath.includes(ophimHost)) {
        return cleanPath;
      }
      cleanPath = cleanPath.replace(/^https?:\/\//, '').replace(/^\/+/, '');
    }

    const base = movieApi.cdn || '/img';
    const baseClean = base.endsWith('/') ? base.slice(0, -1) : base;

    return `${baseClean}/${prefix}${cleanPath}`;
  }
};

export default apiClient;
