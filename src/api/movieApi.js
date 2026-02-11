import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://ophim1.com/v1/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let globalCDN = 'https://img.ophim.live';

export const movieApi = {
  // Store global CDN domain
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
  // Helper to get full image URL from relative path and API response data
  getImageUrl: (path, responseData) => {
    if (!path) return '';
    // Nếu path đã là URL tuyệt đối thì trả về luôn
    if (path.startsWith('http')) return path;
    
    // Loại bỏ slash ở đầu nếu có
    let cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Nếu path có dạng /uploads/movies/... thì lấy phần sau
    const fullPrefix = 'uploads/movies/';
    if (cleanPath.startsWith(fullPrefix)) {
      cleanPath = cleanPath.substring(fullPrefix.length);
    }
    
    // 1. Lấy từ responseData nếu có (ưu tiên nhất)
    // 2. Lấy từ global movieApi.cdn nếu đã được cập nhật
    // 3. Mặc định là https://img.ophim.live
    const cdn = responseData?.APP_DOMAIN_CDN_IMAGE || 
                responseData?.data?.APP_DOMAIN_CDN_IMAGE || 
                movieApi.cdn ||
                'https://img.ophim.live';
                
    // Đảm bảo cdn không kết thúc bằng / và prefix không bắt đầu bằng /
    const baseCDN = cdn.endsWith('/') ? cdn.slice(0, -1) : cdn;
    return `${baseCDN}/${fullPrefix}${cleanPath}`;
  }
};

export default apiClient;
