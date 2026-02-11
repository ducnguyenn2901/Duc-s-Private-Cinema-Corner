import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home/Home';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import Category from './pages/Category/Category';
import Search from './pages/Search/Search';
import Watch from './pages/Watch/Watch';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchInitialData } from './store/store';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInitialData());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-white">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/phim/:slug" element={<MovieDetail />} />
          <Route path="/danh-sach/:slug" element={<Category />} />
          <Route path="/the-loai/:slug" element={<Category type="the-loai" />} />
          <Route path="/quoc-gia/:slug" element={<Category type="quoc-gia" />} />
          <Route path="/nam-phat-hanh/:slug" element={<Category type="nam-phat-hanh" />} />
          <Route path="/tim-kiem" element={<Search />} />
          <Route path="/xem/:slug/:tap?" element={<Watch />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
