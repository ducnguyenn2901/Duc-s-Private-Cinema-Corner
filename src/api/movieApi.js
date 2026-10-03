import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    const resData = response.data;
    if (resData && typeof resData === 'object' && resData.status) {
      // Is it a movie detail response? (has movie and episodes at root)
      if (resData.movie && resData.episodes !== undefined) {
        return {
          ...response,
          data: {
            status: true,
            data: {
              item: {
                ...resData.movie,
                episodes: resData.episodes
              },
              items: resData.episodes
            }
          }
        };
      }
      
      // Is it a list response? (has items at root)
      if (resData.items !== undefined) {
        return {
          ...response,
          data: {
            status: true,
            data: {
              items: resData.items,
              params: {
                pagination: resData.pagination || {}
              },
              APP_DOMAIN_CDN_IMAGE: resData.pathImage || ''
            }
          }
        };
      }
    }
    return response;
  },
  (error) => Promise.reject(error)
);

let globalCDN = 'https://vsmov.com';

export const movieApi = {
  get cdn() { return globalCDN; },
  set cdn(value) { globalCDN = value; },

  getHome: () => apiClient.get('/danh-sach/phim-moi-cap-nhat?page=1'),
  getList: (slug, page = 1) => apiClient.get(`/danh-sach/${slug}?page=${page}`),
  getGenres: () => apiClient.get('/the-loai'),
  getCountries: () => apiClient.get('/quoc-gia'),
  getYears: () => apiClient.get('/nam-phat-hanh'),
  
  getMoviesByGenre: (slug, page = 1) => apiClient.get(`/the-loai/${slug}?page=${page}`),
  getMoviesByCountry: (slug, page = 1) => apiClient.get(`/quoc-gia/${slug}?page=${page}`),
  getMoviesByYear: (year, page = 1) => apiClient.get(`/nam-phat-hanh/${year}?page=${page}`),
  
  // Added based on VSMOV API docs
  getCodes: () => apiClient.get('/code'),
  getMoviesByCode: (code, page = 1) => apiClient.get(`/code/${code}?page=${page}`),
  getActors: () => apiClient.get('/dien-vien'),
  
  // Search
  searchMovies: (keyword, page = 1, limit = 12) => apiClient.get(`/tim-kiem?keyword=${keyword}&limit=${limit}&page=${page}`),
  
  // Movie Detail
  getMovieDetail: (slug) => apiClient.get(`/phim/${slug}`),
  
  // VSMOV doesn't have an images endpoint, mock it to prevent crashes
  getMovieImages: (slug) => Promise.resolve({ data: { status: false, data: null } }),
  // Helper to get full image URL from relative path or absolute URL
  getImageUrl: (path, _responseData) => {
    if (!path) return '';
    
    let cleanPath = String(path).trim();
    if (/^https?:\/\//.test(cleanPath)) {
      return cleanPath;
    }
    
    const base = _responseData?.APP_DOMAIN_CDN_IMAGE || movieApi.cdn || 'https://vsmov.com';
    const baseClean = base.endsWith('/') ? base.slice(0, -1) : base;
    cleanPath = cleanPath.replace(/^\/+/, '');
    return `${baseClean}/${cleanPath}`;
  }
};

export default apiClient;
