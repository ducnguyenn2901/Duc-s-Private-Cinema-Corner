import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { movieApi } from '../api/movieApi';

export const fetchInitialData = createAsyncThunk(
  'movie/fetchInitialData',
  async (_, { rejectWithValue }) => {
    try {
      const [genresRes, countriesRes, yearsRes] = await Promise.allSettled([
        movieApi.getGenres(),
        movieApi.getCountries(),
        movieApi.getYears(),
      ]);

      const genres = genresRes.status === 'fulfilled' ? genresRes.value.data.data.items : [];
      const countries = countriesRes.status === 'fulfilled' ? countriesRes.value.data.data.items : [];
      
      // Handle years (if API fails or empty, generate fallback)
       let years = [];
       if (yearsRes.status === 'fulfilled' && yearsRes.value.data.data.items?.length > 0) {
         years = yearsRes.value.data.data.items.map(item => ({
           name: item.year.toString(),
           slug: item.year.toString()
         }));
       } else {
         // Generate years from 2024 down to 2010
         const currentYear = new Date().getFullYear();
         for (let y = currentYear; y >= 2010; y--) {
           years.push({ name: y.toString(), slug: y.toString() });
         }
       }

      return { genres, countries, years };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    genres: [],
    countries: [],
    years: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.loading = false;
        state.genres = action.payload.genres;
        state.countries = action.payload.countries;
        state.years = action.payload.years;
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const store = configureStore({
  reducer: {
    movie: movieSlice.reducer,
  },
});
