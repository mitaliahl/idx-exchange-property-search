import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ListingsPage from "./components/ListingsPage";
import PropertyDetailPage from "./components/PropertyDetailPage";
import FavoritesPage from "./components/FavoritesPage";
import ErrorBoundary from "./components/ErrorBoundary";
import useFavorites from "./hooks/UseFavorites";
import "./App.css";

function App() {
  const { favoriteIds } = useFavorites();

  return (
    <BrowserRouter>
      <header className="site-header">
        <Link to="/" className="site-logo">IDX Exchange</Link>
        <p className="site-tagline">Property Search</p>
        <Link to="/favorites" className="favorites-nav-link">
          ♥ Favorites ({favoriteIds.length})
        </Link>
      </header>

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<ListingsPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;